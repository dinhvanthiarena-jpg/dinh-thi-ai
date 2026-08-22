const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
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
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Automatic server-side image compression (via sharp/libvips) was tried and
// reliably crashed the live Passenger process on this host on every upload —
// even after fixing the specific decode error, the native addon still took
// the whole site down in-process in a way JS try/catch cannot guard against.
// That risk isn't worth it, so uploads are stored as-is; processImage stays
// as a no-op pass-through so routes don't need to change if this is
// revisited later (e.g. with an out-of-process image worker instead).
function processImage() {
  return (req, res, next) => next();
}

module.exports = upload;
module.exports.processImage = processImage;
