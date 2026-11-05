// Endpoint công khai để tool desktop SA MUSE-AI xác thực key — xem ghi chú ở
// services/museLicenseService.js. Mount ở server.js: /api/muse-license
const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const router = express.Router();
const svc = require('../services/museLicenseService');

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60, // tool chỉ hỏi khi kích hoạt + mỗi 6h; 60 lần / 15 phút / IP là dư, chặn dò key hàng loạt
  standardHeaders: true,
  legacyHeaders: false,
  message: { valid: false, reason: 'too_many_requests' },
});

router.get('/verify', verifyLimiter, (req, res) => {
  const key = String(req.query.key || '').slice(0, 64);
  const machineId = String(req.query.machineId || '').slice(0, 40);
  const label = String(req.query.label || '').slice(0, 80);
  const version = String(req.query.v || '').slice(0, 20);
  res.json(svc.verify(key, machineId, { label, version }));
});

// Máy khách hỏi mỗi 6h: có bản tool mới thì tự tải url về cài lại êm.
router.get('/app-version', verifyLimiter, (req, res) => {
  res.json(svc.getAppVersion());
});

// ---------------------------------------------------------------------------
// TỰ ĐỘNG ĐẨY BẢN CÀI MỚI (thay cho việc upload tay qua File Manager).
// Chỉ máy có token bí mật (header X-Upload-Token) mới gọi được. Đích ghi là tên
// CỐ ĐỊNH trong whitelist (không nhận đường dẫn từ client) nên không thể ghi đè file khác.
// Có thể kèm field `version` + `notes` để khai báo bản mới cho máy khách tự cập nhật ngay trong một lần.
//   curl -sS -H "X-Upload-Token: <token>" -F file=@Sa_Muse_Ai_Setup.exe \
//        -F version=2.1.3 -F notes="..." https://3dvietpro.com/api/muse-license/upload-app
const DOWNLOADS_DIR = path.join(__dirname, '..', 'public', 'downloads');
const TMP_DIR = path.join(__dirname, '..', 'data', 'tmp-upload');
const PUBLIC_URL = 'https://3dvietpro.com/downloads/Sa_Muse_Ai_Setup.exe';
// Chỉ cho ghi vào các tên này (test để kiểm thử cơ chế mà không đụng file bán thật).
const ALLOWED_DEST = { stable: 'Sa_Muse_Ai_Setup.exe', test: 'Sa_Muse_Ai_Setup.test.exe' };

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, reason: 'too_many_requests' },
});

const uploadApp = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try { fs.mkdirSync(TMP_DIR, { recursive: true }); cb(null, TMP_DIR); }
      catch (e) { cb(e); }
    },
    filename: (req, file, cb) => cb(null, `app-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.part`),
  }),
  limits: { fileSize: 400 * 1024 * 1024 }, // tối đa 400MB
}).single('file');

function tokenOk(req) {
  const expected = svc.getUploadToken();
  if (!expected) return false; // chưa cấu hình token -> khoá cổng
  const given = String(req.get('X-Upload-Token') || '');
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function md5OfFile(p) {
  return new Promise((resolve, reject) => {
    const h = crypto.createHash('md5');
    const s = fs.createReadStream(p);
    s.on('data', (d) => h.update(d));
    s.on('end', () => resolve(h.digest('hex')));
    s.on('error', reject);
  });
}

router.post('/upload-app', uploadLimiter, (req, res) => {
  // Kiểm token TRƯỚC khi nhận body lớn.
  if (!tokenOk(req)) return res.status(401).json({ ok: false, reason: 'unauthorized' });
  uploadApp(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ ok: false, reason: 'upload_error', detail: String(err.message || err) });
      if (!req.file) return res.status(400).json({ ok: false, reason: 'no_file' });
      const destKey = String(req.body.dest || 'stable');
      const name = ALLOWED_DEST[destKey];
      if (!name) { fs.unlink(req.file.path, () => {}); return res.status(400).json({ ok: false, reason: 'bad_dest' }); }

      fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
      const finalPath = path.join(DOWNLOADS_DIR, name);
      try {
        fs.renameSync(req.file.path, finalPath);
      } catch (e) {
        // rename khác filesystem -> copy rồi xoá tạm
        fs.copyFileSync(req.file.path, finalPath);
        fs.unlinkSync(req.file.path);
      }

      const bytes = fs.statSync(finalPath).size;
      const md5 = await md5OfFile(finalPath);
      let version = null;
      if (destKey === 'stable' && String(req.body.version || '').trim()) {
        version = svc.setAppVersion({
          version: String(req.body.version),
          url: PUBLIC_URL,
          notes: String(req.body.notes || ''),
        });
      }
      res.json({ ok: true, dest: name, bytes, md5, version });
    } catch (e) {
      if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
      res.status(500).json({ ok: false, reason: 'server_error', detail: String(e.message || e) });
    }
  });
});

module.exports = router;
