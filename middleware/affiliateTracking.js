const User = require('../models/User');

const COOKIE_NAME = 'aff_ref';
const COOKIE_DAYS = Number(process.env.AFFILIATE_COOKIE_DAYS || 30);

// Gắn ở server.js CHO MỌI request. Bất kỳ URL nào kèm ?ref=MA_GIOI_THIEU
// (link đăng ký, link 1 khóa học/tool cụ thể...) đều được ghi nhận —
// "Last Click": mỗi lần bắt gặp ?ref= hợp lệ mới, GHI ĐÈ cookie cũ, không
// cộng dồn người giới thiệu trước đó. Chỉ đọc parentId lúc ĐĂNG KÝ tài
// khoản mới (xem controllers/authController.js#register); người đã có tài
// khoản bấm link giới thiệu không bị đổi người giới thiệu của mình.
async function affiliateTracking(req, res, next) {
  const ref = req.query.ref;
  if (!ref) return next();

  try {
    const nguoiGioiThieu = await User.findOne({ where: { refCode: String(ref).toUpperCase() } });
    if (nguoiGioiThieu) {
      res.cookie(COOKIE_NAME, nguoiGioiThieu.refCode, {
        maxAge: COOKIE_DAYS * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
      });
    }
  } catch (err) {
    console.error('[affiliateTracking] lỗi:', err.message);
  }

  next();
}

async function getReferrerId(req) {
  const refCode = req.cookies && req.cookies[COOKIE_NAME];
  if (!refCode) return null;
  const nguoiGioiThieu = await User.findOne({ where: { refCode } });
  return nguoiGioiThieu ? nguoiGioiThieu.id : null;
}

module.exports = { affiliateTracking, getReferrerId, COOKIE_NAME };
