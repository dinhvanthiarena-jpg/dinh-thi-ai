const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Files are kept in memory just long enough to be resized/compressed by
// processImage() below, then written to disk as .webp — so raw phone
// photos (often 5-10MB) never hit disk at full size.
const storage = multer.memoryStorage();

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
  limits: { fileSize: 15 * 1024 * 1024 },
});

async function compressToDisk(file, { maxWidth, quality }) {
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const buffer = await sharp(file.buffer)
    .rotate() // auto-orient using the photo's EXIF data before stripping it
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
  await fs.promises.writeFile(path.join(uploadDir, filename), buffer);
  file.filename = filename;
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
        await Promise.all(req.files.map((f) => compressToDisk(f, { maxWidth, quality })));
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = upload;
module.exports.processImage = processImage;
