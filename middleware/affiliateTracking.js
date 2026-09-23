const User = require('../models/User');
const AffiliateLink = require('../models/AffiliateLink');

const COOKIE_NAME = 'aff_ref';
const COOKIE_DAYS = Number(process.env.AFFILIATE_COOKIE_DAYS || 30);

// Gắn ở server.js CHO MỌI request. Bất kỳ URL nào kèm ?ref=... đều được ghi
// nhận — "Last Click": mỗi lần bắt gặp ?ref= hợp lệ mới, GHI ĐÈ cookie cũ,
// không cộng dồn người giới thiệu trước đó. Chỉ đọc parentId lúc ĐĂNG KÝ
// tài khoản mới (xem controllers/authController.js#register); người đã có
// tài khoản bấm link giới thiệu không bị đổi người giới thiệu của mình.
//
// ?ref= chấp nhận 2 dạng — cùng 1 cookie, cùng 1 cơ chế ghi nhận phía sau:
//   1. Mã giới thiệu GỐC của 1 User (refCode) — link chung, không đếm click
//      riêng (dùng cho link đăng ký mặc định trên dashboard).
//   2. Mã 1 AffiliateLink TỰ TẠO — đại lý tạo trên dashboard cho từng
//      trang/chiến dịch cụ thể (kèm utm_source/utm_campaign riêng), có đếm
//      clicksCount để đo hiệu quả từng link.
async function affiliateTracking(req, res, next) {
  const ref = req.query.ref;
  if (!ref) return next();
  const ma = String(ref).toUpperCase();

  try {
    let refCodeDeLuu = null;

    const link = await AffiliateLink.findOne({ where: { affiliateCode: ma } });
    if (link) {
      await link.increment('clicksCount');
      const chuLink = await User.findByPk(link.UserId);
      if (chuLink) refCodeDeLuu = chuLink.refCode;
    } else {
      const nguoiGioiThieu = await User.findOne({ where: { refCode: ma } });
      if (nguoiGioiThieu) refCodeDeLuu = nguoiGioiThieu.refCode;
    }

    if (refCodeDeLuu) {
      res.cookie(COOKIE_NAME, refCodeDeLuu, {
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
