const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Shared hosting keeps a tight per-account memory ceiling; libvips' own
// cache and worker threads add overhead on top of the image data itself,
// so both are disabled to keep each conversion's footprint as small and
// predictable as possible.
sharp.cache(false);
sharp.concurrency(1);

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const tmpDir = path.join(__dirname, '..', 'tmp-uploads');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

// Land the raw upload on disk first (not in a memory Buffer) so multer never
// holds the whole file in RAM; sharp then streams from that temp file
// instead of a buffer, which keeps libvips' peak memory close to the
// decoded-image size rather than image size + a duplicate buffer copy.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tmpDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const allowedTypes = ['.jpg', '.jpeg', '.png', '.webp'];

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(ext)) {
    return cb(new Error('Chỉ cho phép ảnh JPG, PNG hoặc WEBP.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 12 * 1024 * 1024 },
});

async function compressToDisk(file, { maxWidth, quality }) {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  try {
    await sharp(file.path, { sequentialRead: true, limitInputPixels: 60_000_000 })
      .rotate() // auto-orient using the photo's EXIF data before stripping it
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 2 })
      .toFile(path.join(uploadDir, filename));
    file.filename = filename;
  } finally {
    fs.promises.unlink(file.path).catch(() => {});
  }
}

// Resizes/compresses whatever multer put on req.file / req.files, in place,
// so downstream controllers keep working unchanged (they only read
// `file.filename` / `req.file.filename`, same as with the old disk storage).
function processImage({ maxWidth = 1600, quality = 78 } = {}) {
  return async (req, res, next) => {
    try {
      if (req.file) {
        await compressToDisk(req.file, { maxWidth, quality });
      }
      if (req.files && req.files.length) {
        // Sequential, not Promise.all: converting several images at once in
        // parallel is what multiplies memory use on a constrained host.
        for (const f of req.files) {
          await compressToDisk(f, { maxWidth, quality });
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = upload;
module.exports.processImage = processImage;
