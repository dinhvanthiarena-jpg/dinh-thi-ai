// Sinh + lưu + truy xuất HỢP ĐỒNG ĐIỆN TỬ SA-BOTAI (xem models/Contract.js). Được gọi từ termsService.ghiDongY ngay
// sau khi khách tích đồng ý điều khoản (lúc đăng ký trong tool, hoặc ở màn điều khoản sau đăng nhập).
const ejs = require('ejs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Contract, User } = require('../models');
const pricing = require('./fbaiKeyPricing');

const BASE_URL = 'https://3dvietpro.com';
const VIEWS = path.join(__dirname, '..', 'views', 'legal');

const fmtVN = (d) => new Date(d).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false });
const SOURCE_TEXT = { register: 'Đồng ý khi đăng ký tài khoản trong phần mềm SA-BOTAI', 'login-gate': 'Đồng ý tại màn hình điều khoản sau khi đăng nhập phần mềm SA-BOTAI', web: 'Đồng ý trên website 3dvietpro.com' };

function token(contractNo, userId) {
  return crypto.createHmac('sha256', process.env.JWT_SECRET || 'sabotai-contract').update(`${contractNo}:${userId}`).digest('hex').slice(0, 32);
}
function urlHopDong(c) {
  return `${BASE_URL}/phap-ly-sa-botai/hop-dong/${encodeURIComponent(c.contractNo)}?t=${token(c.contractNo, c.UserId)}`;
}
function tokenHopLe(c, t) {
  const dung = token(c.contractNo, c.UserId);
  return typeof t === 'string' && t.length === dung.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(dung));
}

async function soThuTu() {
  const n = await Contract.count();
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `HD-SABOTAI-${d}-${String(n + 1).padStart(6, '0')}`;
}

/** Render hợp đồng với bảng giá HIỆN HÀNH (mọi số tiền quy ra VNĐ). Dùng cho hợp đồng thật và bản mẫu trong admin. */
function renderHopDong({ version, partyB, contract }) {
  const terms = require('./termsService');
  return ejs.renderFile(path.join(VIEWS, 'hop-dong-khung.ejs'), {
    version,
    legal: pricing.getLegal(),
    privacyUrl: terms.PRIVACY_URL,
    termsUrl: terms.TERMS_URL,
    plans: pricing.getPlans().filter((p) => p.kind !== 'first'),
    firstOffer: pricing.getFirstOffer(),
    webFee: pricing.getWebFee(),
    usdRate: pricing.USD_RATE,
    firstKeyDays: pricing.FIRST_KEY_DAYS,
    partyB,
    contract,
  });
}

/** Sinh hợp đồng cá nhân hoá cho khách `userId`; lưu nguyên văn + mã băm. Trả về bản ghi Contract. */
async function taoHopDong(userId, { version, ip, userAgent, source, acceptedAt }) {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Không tìm thấy tài khoản để lập hợp đồng.');
  const at = acceptedAt || new Date();
  let contractNo = await soThuTu();
  for (let i = 0; i < 5 && (await Contract.findOne({ where: { contractNo } })); i += 1) contractNo += 'x';

  const html = await renderHopDong({
    version,
    partyB: { name: user.name, email: user.email || '', phone: user.phone || '', registeredAt: fmtVN(user.createdAt) },
    contract: { contractNo, version, acceptedAtText: fmtVN(at), ip: ip || '', sourceText: SOURCE_TEXT[source] || SOURCE_TEXT.register },
  });
  const contentHash = crypto.createHash('sha256').update(html, 'utf8').digest('hex');
  const rec = await Contract.create({
    contractNo, UserId: user.id, version, customerName: user.name, customerEmail: user.email || null, customerPhone: user.phone || null,
    ip: ip || null, userAgent: userAgent || null, source: source || 'register', acceptedAt: at, html, contentHash,
  });
  // Gửi bản sao cho khách qua email (nếu máy chủ đã cấu hình SMTP) — lỗi gửi mail không ảnh hưởng việc lưu hợp đồng.
  guiEmail(rec, user).catch((e) => console.error('[contract] gửi email hợp đồng lỗi:', e.message));
  return rec;
}

function layTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
}

function thuHopDong(c, ten) {
  const url = urlHopDong(c);
  const donVi = pricing.getLegal().ten;
  const lienHe = pricing.getLegal().dienThoai || pricing.getLegal().email || '';
  return {
    subject: `Hợp đồng dịch vụ phần mềm SA-BOTAI số ${c.contractNo}`,
    text: `Chào ${ten},\n\nBạn vừa đồng ý Điều khoản dịch vụ SA-BOTAI. ${donVi} đã lập hợp đồng điện tử số ${c.contractNo} (bản đầy đủ đính kèm email này) và lưu trữ trên hệ thống.\nXem / in / lưu PDF: ${url}\n\nBạn nên lưu lại email này làm bằng chứng giao kết.${lienHe ? '\nHỗ trợ: ' + lienHe : ''}`,
    html: `<p>Chào <strong>${ten}</strong>,</p><p>Bạn vừa đồng ý Điều khoản dịch vụ phần mềm <strong>SA-BOTAI</strong>. <strong>${donVi}</strong> đã lập <strong>hợp đồng điện tử số ${c.contractNo}</strong> (bản đầy đủ đính kèm email này) và lưu trữ trên hệ thống.</p><p>Xem / in / lưu PDF hợp đồng tại: <a href="${url}">${url}</a></p><p style="color:#52525b;font-size:13px">Bạn nên lưu lại email này làm bằng chứng giao kết.${lienHe ? ' Hỗ trợ: ' + lienHe + '.' : ''}</p>`,
  };
}

async function guiEmail(c, user) {
  const t = layTransporter();
  if (!user.email || !t) { console.error('[contract] bỏ qua gửi email (thiếu email khách hoặc chưa cấu hình SMTP)'); return; }
  const noi = thuHopDong(c, user.name);
  await t.sendMail({
    from: `"${pricing.getLegal().ten.replace(/"/g, '')}" <${process.env.SMTP_USER}>`,
    to: user.email,
    bcc: process.env.ADMIN_EMAIL || undefined, // bản lưu cho Bên A
    ...noi,
    attachments: [{ filename: `${c.contractNo}.html`, content: c.html, contentType: 'text/html; charset=utf-8' }],
  });
  await c.update({ emailedAt: new Date() });
}

/** Gửi thử email hợp đồng MẪU (không tạo hợp đồng thật) để kiểm tra SMTP + giao diện thư. */
async function guiThuMau(email) {
  const t = layTransporter();
  if (!t) throw new Error('Chưa cấu hình SMTP');
  const terms = require('./termsService');
  const html = await renderHopDong({
    version: terms.VERSION,
    partyB: { name: 'Khách hàng mẫu', email, phone: '', registeredAt: fmtVN(new Date()) },
    contract: { contractNo: 'HD-SABOTAI-MẪU', version: terms.VERSION, acceptedAtText: fmtVN(new Date()), ip: '0.0.0.0', sourceText: 'Email gửi thử — không có giá trị giao kết' },
  });
  const fake = { contractNo: 'HD-SABOTAI-MẪU', UserId: 0 };
  const noi = thuHopDong(fake, 'Khách hàng mẫu');
  await t.sendMail({ from: `"${pricing.getLegal().ten.replace(/"/g, '')}" <${process.env.SMTP_USER}>`, to: email, subject: '[GỬI THỬ] ' + noi.subject, text: noi.text, html: noi.html, attachments: [{ filename: 'HD-SABOTAI-MAU.html', content: html, contentType: 'text/html; charset=utf-8' }] });
}

async function hopDongMoiNhat(userId) {
  return Contract.findOne({ where: { UserId: userId }, order: [['acceptedAt', 'DESC']] });
}
async function theoSo(contractNo) {
  return Contract.findOne({ where: { contractNo } });
}
function kiemTraToanVen(c) {
  return crypto.createHash('sha256').update(c.html, 'utf8').digest('hex') === c.contentHash;
}

module.exports = { guiThuMau, renderHopDong, fmtVN, taoHopDong, urlHopDong, tokenHopLe, hopDongMoiNhat, theoSo, kiemTraToanVen };
