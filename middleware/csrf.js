const crypto = require('crypto');

const COOKIE_NAME = '__csrf_secret';
const HEADER_NAME = 'x-csrf-token';
const FIELD_NAME = '_csrf';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// Đường dẫn nhận request từ bên ngoài (webhook Facebook/Telegram/SePay, API
// key riêng, hoặc gọi từ app desktop) — không đi qua cookie/form của trình
// duyệt nên không thể (và không cần) kèm CSRF token.
const SKIP_PREFIXES = [
  '/fb-events',
  '/tg-events',
  '/pro/webhook',
  '/pro/api',
  '/api/',
];

function shouldSkip(path) {
  return SKIP_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function deriveToken(secret) {
  return crypto.createHmac('sha256', secret).update('csrf').digest('hex');
}

function getSecret(req, res) {
  let secret = req.cookies[COOKIE_NAME];
  if (!secret) {
    secret = crypto.randomBytes(32).toString('hex');
    res.cookie(COOKIE_NAME, secret, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }
  return secret;
}

// Chạy toàn site, sớm (ngay sau cookieParser): chỉ cấp token, không kiểm
// tra gì — luôn phải chạy trước để res.locals.csrfToken có sẵn cho MỌI trang
// render ra, kể cả trang chứa form multipart (ảnh/tệp) mà multer chưa kịp
// đọc req.body ở giai đoạn này.
function issueToken(req, res, next) {
  const secret = getSecret(req, res);
  res.locals.csrfToken = deriveToken(secret);
  next();
}

// Kiểm tra thật sự: so khớp token gửi lên (field _csrf trong body, hoặc
// header X-CSRF-Token với các lời gọi fetch) với token suy ra từ cookie bí
// mật. Dùng làm middleware toàn site cho request thường (đã có req.body từ
// express.urlencoded), và dùng lại lần 2 ngay sau multer cho 4 form tải ảnh
// (multipart/form-data) — vì multer là middleware CHỈ gắn riêng ở từng route
// nên body của các form đó chưa tồn tại lúc middleware toàn site này chạy.
function verifyToken(req, res, next) {
  if (SAFE_METHODS.has(req.method) || shouldSkip(req.path)) return next();

  const secret = getSecret(req, res);
  const submitted = (req.body && req.body[FIELD_NAME]) || req.get(HEADER_NAME);
  if (!submitted || submitted !== deriveToken(secret)) {
    return res.status(403).send('Phiên làm việc đã hết hạn hoặc yêu cầu không hợp lệ. Vui lòng tải lại trang và thử lại.');
  }
  next();
}

// Request multipart/form-data thì req.body chưa được multer đọc ở tầng
// middleware toàn site — verifyToken toàn site bỏ qua các request này, để
// route tương ứng tự gọi lại verifyToken() lần nữa NGAY SAU multer.
function verifyTokenSkippingMultipart(req, res, next) {
  if (req.is('multipart/form-data')) return next();
  return verifyToken(req, res, next);
}

module.exports = { issueToken, verifyToken, verifyTokenSkippingMultipart };
