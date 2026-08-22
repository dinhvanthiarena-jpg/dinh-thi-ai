// Compresses images in the browser (canvas resize + re-encode) before upload,
// so large phone photos never leave the browser at full size. This hosting
// plan has a hard ~1MB request-body ceiling enforced at the web-server layer
// (outside the Node app entirely) that crashes the backend process instead
// of returning a clean "too large" error — client-side compression avoids
// ever hitting it, for any file the user picks.
(function () {
  const MAX_DIMENSION = 1920;
  const QUALITY = 0.8;
  const SKIP_ABOVE_BYTES = 900 * 1024; // leave small files untouched

  function compressFile(file) {
    if (!file.type.startsWith('image/') || file.size <= SKIP_ABOVE_BYTES) {
      return Promise.resolve(file);
    }

    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width >= height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }
            const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            resolve(new File([blob], newName, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          QUALITY
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  }

  // Wires up every <input type="file" data-compress> on the page: on form
  // submit, compresses the selected files in place before letting the
  // native submit continue.
  function setupCompressingInputs() {
    document.querySelectorAll('input[type="file"][data-compress]').forEach((input) => {
      const form = input.closest('form');
      if (!form || form.dataset.compressWired) return;
      form.dataset.compressWired = '1';

      form.addEventListener('submit', function (e) {
        if (form.dataset.compressDone) return; // already compressed, let it go
        if (!input.files || !input.files.length) return;

        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Đang xử lý ảnh...';
        }

        Promise.all(Array.from(input.files).map(compressFile)).then((compressed) => {
          const dt = new DataTransfer();
          compressed.forEach((f) => dt.items.add(f));
          input.files = dt.files;
          form.dataset.compressDone = '1';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          form.requestSubmit ? form.requestSubmit(submitBtn) : form.submit();
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', setupCompressingInputs);
})();
