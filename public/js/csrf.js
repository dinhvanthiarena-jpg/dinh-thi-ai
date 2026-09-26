(function () {
  var meta = document.querySelector('meta[name="csrf-token"]');
  if (!meta) return;
  var token = meta.content;

  var originalFetch = window.fetch;
  window.fetch = function (input, init) {
    init = init || {};
    var method = (init.method || 'GET').toUpperCase();
    var url = typeof input === 'string' ? input : input.url;
    var isRelative = !/^https?:\/\//i.test(url);
    var isSameOrigin = isRelative || url.indexOf(window.location.origin) === 0;
    if (isSameOrigin && method !== 'GET' && method !== 'HEAD') {
      var headers = new Headers(init.headers || {});
      if (!headers.has('X-CSRF-Token')) headers.set('X-CSRF-Token', token);
      init.headers = headers;
    }
    return originalFetch(input, init);
  };

  function ensureCsrfField(form) {
    if (!form || !form.method || form.method.toUpperCase() !== 'POST') return;
    if (form.querySelector('input[name="_csrf"]')) return;
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_csrf';
    input.value = token;
    form.appendChild(input);
  }

  document.querySelectorAll('form').forEach(ensureCsrfField);
  document.addEventListener('submit', function (e) {
    ensureCsrfField(e.target);
  }, true);
})();
