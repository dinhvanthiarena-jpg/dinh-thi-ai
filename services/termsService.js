// Điều khoản dịch vụ SA-BOTAI: số PHIÊN BẢN hiện hành + nhật ký ĐỒNG Ý (IP, thời điểm, phiên bản) làm bằng
// chứng khi có tranh chấp (thầy yêu cầu 2026-10-05, theo hướng dẫn "Hộp kiểm / Checkbox" an toàn pháp lý).
// Đổi nội dung điều khoản thì ĐỔI VERSION ở đây -> mọi khách phải tích đồng ý lại ở lần mở tool kế tiếp.
const { TermsAcceptance } = require('../models');

const VERSION = '2026-10-05';
const TERMS_URL = 'https://3dvietpro.com/phap-ly-sa-botai/dieu-khoan';
const PRIVACY_URL = 'https://3dvietpro.com/phap-ly-sa-botai/bao-mat';

function layIp(req) {
  const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return (xff || req.ip || (req.socket && req.socket.remoteAddress) || '').replace(/^::ffff:/, '').slice(0, 64);
}

async function ghiDongY(userId, req, source, over = {}) {
  const info = {
    ip: over.ip !== undefined ? over.ip : layIp(req),
    userAgent: String(over.ua !== undefined ? over.ua : (req.headers['user-agent'] || '')).slice(0, 300),
    source: source || 'register',
    acceptedAt: over.at || new Date(),
  };
  const acc = await TermsAcceptance.create({ UserId: userId, version: VERSION, ...info });
  // Tự lập HỢP ĐỒNG điện tử cá nhân hoá (thông tin người đăng ký + giá + IP/giờ) và lưu bất biến (thầy yêu cầu 2026-10-09).
  try {
    const contract = await require('./contractService').taoHopDong(userId, { version: VERSION, ...info });
    acc.contract = contract;
  } catch (e) {
    console.error('[terms] không lập được hợp đồng cho user', userId, e.message);
  }
  return acc;
}

async function daDongY(userId) {
  return !!(await TermsAcceptance.findOne({ where: { UserId: userId, version: VERSION } }));
}

module.exports = { VERSION, TERMS_URL, PRIVACY_URL, layIp, ghiDongY, daDongY };
