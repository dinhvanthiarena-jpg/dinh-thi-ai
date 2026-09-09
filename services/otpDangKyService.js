/**
 * Đăng ký tài khoản 2 bước, có xác nhận email bằng mã OTP.
 *
 * Bước 1 (yeuCauDangKy): kiểm tra dữ liệu, TẠM giữ trong bộ nhớ (chưa tạo
 * tài khoản thật), gửi mã 6 số qua email.
 * Bước 2 (xacNhanDangKy): đúng mã mới thật sự tạo tài khoản trong bảng users.
 *
 * Dùng chung cho cả Mon-Maths (/api/game) và English Air (/api/english-air) —
 * cùng bảng users, cùng services/taiKhoanAppService.js cho phần kiểm tra số
 * điện thoại/mật khẩu và tạo cookie đăng nhập.
 */
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');
const tk = require('./taiKhoanAppService');

const PHUT = 60 * 1000;
const OTP_HET_HAN_MS = 10 * PHUT;
const GUI_LAI_CACH_MS = 60 * 1000;
const SO_LAN_SAI_TOI_DA = 5;

// token (gửi cho client) -> { code, ten, sdt, matKhau, email, expiresAt, attempts, lastSentAt }
const cho = new Map();

function taoMa() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function taoToken() {
  return crypto.randomBytes(16).toString('hex');
}

function emailHopLe(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(e || '').trim());
}

let transporter;
/** undefined = chưa thử tạo; null = đã thử nhưng thiếu cấu hình. */
function layTransporter() {
  if (transporter !== undefined) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    transporter = null;
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// Dùng chung 1 dịch vụ cho 2 app khác tên — email phải xưng đúng tên app
// người dùng đang thấy trên màn hình, không phải lúc nào cũng "Mon-Maths".
const TEN_APP = { 'mon-maths': 'Mon-Maths', 'english-air': 'ON-Language' };

async function guiEmailOtp(email, ma, app) {
  const t = layTransporter();
  if (!t) throw Object.assign(new Error('Chưa cấu hình gửi email'), { code: 'NO_SMTP' });
  const ten = TEN_APP[app] || 'Mon-Maths';
  await t.sendMail({
    from: `"${ten}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Mã xác nhận đăng ký: ${ma}`,
    text: `Mã xác nhận đăng ký tài khoản của con là: ${ma}\nMã có hiệu lực trong 10 phút. Nếu không phải con yêu cầu, hãy bỏ qua email này.`,
    html: `<p>Mã xác nhận đăng ký tài khoản của con là:</p><p style="font-size:28px;font-weight:800;letter-spacing:6px;">${ma}</p><p>Mã có hiệu lực trong 10 phút. Nếu không phải con yêu cầu, hãy bỏ qua email này.</p>`,
  });
}

/** Bước 1: kiểm tra dữ liệu, gửi mã, chưa tạo tài khoản thật. */
async function yeuCauDangKy({ ten, sdt, matKhau, email, app }) {
  const so = tk.chuanSdt(sdt);
  if (!tk.sdtHopLe(so)) return { loi: 'Số điện thoại chưa đúng. Ví dụ: 0912345678' };
  if (!matKhau || String(matKhau).length < 6) return { loi: 'Mật khẩu cần ít nhất 6 ký tự.' };
  const name = String(ten || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!name) return { loi: 'Vui lòng nhập tên của bạn.' };
  const e = String(email || '').trim().toLowerCase();
  if (!emailHopLe(e)) return { loi: 'Email chưa đúng.' };

  const [coSdt, coEmail] = await Promise.all([
    User.findOne({ where: { phone: so } }),
    User.findOne({ where: { email: e } }),
  ]);
  if (coSdt) return { loi: 'Số này đã có tài khoản. Bạn hãy đăng nhập nhé.' };
  if (coEmail) return { loi: 'Email này đã có người dùng.' };

  const ma = taoMa();
  const token = taoToken();
  const appAn = TEN_APP[app] ? app : 'mon-maths';
  cho.set(token, {
    code: ma, ten: name, sdt: so, matKhau: String(matKhau), email: e, app: appAn,
    expiresAt: Date.now() + OTP_HET_HAN_MS, attempts: 0, lastSentAt: Date.now(),
  });

  try {
    await guiEmailOtp(e, ma, appAn);
  } catch (err) {
    cho.delete(token);
    if (err.code === 'NO_SMTP') return { loi: 'Máy chủ chưa bật gửi email, báo thầy/cô giúp em nhé.' };
    return { loi: 'Không gửi được email, bạn kiểm tra lại email rồi thử lại nhé.' };
  }
  return { token, email: e };
}

/** Gửi lại mã (cùng phiên đăng ký, chưa hết hạn). */
async function guiLai(token) {
  const rec = cho.get(token);
  if (!rec) return { loi: 'Phiên đăng ký đã hết hạn, bạn đăng ký lại từ đầu nhé.' };
  if (Date.now() - rec.lastSentAt < GUI_LAI_CACH_MS) {
    return { loi: 'Bạn vừa gửi mã rồi, chờ một chút rồi gửi lại nhé.' };
  }
  rec.code = taoMa();
  rec.expiresAt = Date.now() + OTP_HET_HAN_MS;
  rec.lastSentAt = Date.now();
  rec.attempts = 0;
  try {
    await guiEmailOtp(rec.email, rec.code, rec.app);
  } catch {
    return { loi: 'Không gửi được email, bạn thử lại sau nhé.' };
  }
  return { ok: true };
}

/** Bước 2: đúng mã thì mới thật sự tạo tài khoản. */
async function xacNhanDangKy({ token, code }) {
  const rec = cho.get(token);
  if (!rec) return { loi: 'Phiên đăng ký đã hết hạn, bạn đăng ký lại từ đầu nhé.' };
  if (Date.now() > rec.expiresAt) { cho.delete(token); return { loi: 'Mã đã hết hạn, bạn bấm gửi lại mã nhé.' }; }
  if (rec.attempts >= SO_LAN_SAI_TOI_DA) { cho.delete(token); return { loi: 'Bạn nhập sai quá nhiều lần, đăng ký lại từ đầu nhé.' }; }
  if (String(code || '').trim() !== rec.code) {
    rec.attempts += 1;
    return { loi: 'Mã không đúng, bạn kiểm tra lại nhé.' };
  }

  // Phòng khi mở 2 tab đăng ký cùng lúc — kiểm tra lại lần cuối trước khi tạo.
  const trung = await User.findOne({ where: { phone: rec.sdt } });
  if (trung) { cho.delete(token); return { loi: 'Số này đã có tài khoản. Bạn hãy đăng nhập nhé.' }; }

  const user = await User.create({ name: rec.ten, phone: rec.sdt, email: rec.email, password: rec.matKhau });
  cho.delete(token);
  return { user };
}

/* ═══════════════ QUÊN MẬT KHẨU ═══════════════
   Cùng cách làm với đăng ký: gửi mã 6 số về email đã gắn với tài khoản, đúng
   mã mới cho đặt lại mật khẩu. Cố ý KHÔNG nói "số này chưa có tài khoản" —
   nói ra là người lạ dò được ai đã đăng ký; cứ báo đã gửi mã như nhau. */

// token -> { userId, code, expiresAt, attempts, lastSentAt }
const quen = new Map();

/** Che bớt email khi hiện lên màn hình: ngoc***@gmail.com */
function cheEmail(e) {
  const [ten, mien] = String(e || '').split('@');
  if (!mien) return '';
  const dau = ten.slice(0, Math.min(3, ten.length));
  return dau + '***@' + mien;
}

async function guiEmailQuenMk(email, ma) {
  const t = layTransporter();
  if (!t) throw Object.assign(new Error('Chưa cấu hình gửi email'), { code: 'NO_SMTP' });
  await t.sendMail({
    from: `"ON-Language" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Mã đặt lại mật khẩu: ${ma}`,
    text: `Mã đặt lại mật khẩu của bạn là: ${ma}\nMã có hiệu lực trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này — mật khẩu cũ vẫn giữ nguyên.`,
    html: `<p>Mã đặt lại mật khẩu của bạn là:</p><p style="font-size:28px;font-weight:800;letter-spacing:6px;">${ma}</p><p>Mã có hiệu lực trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này — mật khẩu cũ vẫn giữ nguyên.</p>`,
  });
}

/** Bước 1: nhận số điện thoại (hoặc email), gửi mã về email của tài khoản. */
async function yeuCauQuenMk({ sdt, email }) {
  const so = tk.chuanSdt(sdt);
  const mail = String(email || '').trim().toLowerCase();
  if (!so && !mail) return { loi: 'Nhập số điện thoại hoặc email của tài khoản nhé.' };

  const user = so
    ? await User.findOne({ where: { phone: so } })
    : await User.findOne({ where: { email: mail } });

  // Không có tài khoản, hoặc có mà chưa gắn email: vẫn trả về như đã gửi, chỉ
  // là không gửi gì cả. Người thật sẽ không nhận được mã và tự hiểu.
  if (!user || !user.email) {
    return { ok: true, token: taoToken(), email: mail ? cheEmail(mail) : '', trong: true };
  }

  const ma = taoMa();
  const token = taoToken();
  quen.set(token, {
    userId: user.id, code: ma,
    expiresAt: Date.now() + OTP_HET_HAN_MS, attempts: 0, lastSentAt: Date.now(),
  });
  try {
    await guiEmailQuenMk(user.email, ma);
  } catch (e) {
    quen.delete(token);
    if (e.code === 'NO_SMTP') return { loi: 'Máy chủ chưa gửi được email. Bạn nhắn cho thầy nhé.' };
    return { loi: 'Không gửi được email lúc này, bạn thử lại sau ít phút.' };
  }
  return { ok: true, token, email: cheEmail(user.email) };
}

async function guiLaiQuenMk(token) {
  const rec = quen.get(token);
  if (!rec) return { loi: 'Phiên đã hết hạn, bạn làm lại từ đầu nhé.' };
  if (Date.now() - rec.lastSentAt < GUI_LAI_CACH_MS) {
    const con = Math.ceil((GUI_LAI_CACH_MS - (Date.now() - rec.lastSentAt)) / 1000);
    return { loi: `Chờ ${con} giây nữa rồi gửi lại nhé.` };
  }
  const user = await User.findByPk(rec.userId);
  if (!user || !user.email) return { loi: 'Không tìm thấy tài khoản.' };
  rec.code = taoMa();
  rec.expiresAt = Date.now() + OTP_HET_HAN_MS;
  rec.attempts = 0;
  rec.lastSentAt = Date.now();
  try { await guiEmailQuenMk(user.email, rec.code); }
  catch { return { loi: 'Không gửi được email lúc này, bạn thử lại sau ít phút.' }; }
  return { ok: true };
}

/** Bước 2: đúng mã thì đặt mật khẩu mới. */
async function datLaiMatKhau({ token, code, matKhau }) {
  const rec = quen.get(token);
  if (!rec) return { loi: 'Phiên đã hết hạn, bạn làm lại từ đầu nhé.' };
  if (Date.now() > rec.expiresAt) { quen.delete(token); return { loi: 'Mã đã hết hạn, bạn bấm gửi lại mã nhé.' }; }
  if (rec.attempts >= SO_LAN_SAI_TOI_DA) { quen.delete(token); return { loi: 'Bạn nhập sai quá nhiều lần, làm lại từ đầu nhé.' }; }
  if (String(code || '').trim() !== rec.code) {
    rec.attempts += 1;
    return { loi: 'Mã không đúng, bạn kiểm tra lại nhé.' };
  }
  const l = tk.loiMatKhau(matKhau);
  if (l) return { loi: l };
  const user = await User.findByPk(rec.userId);
  if (!user) { quen.delete(token); return { loi: 'Không tìm thấy tài khoản.' }; }
  user.password = matKhau;
  await user.save();
  quen.delete(token);
  return { user };
}

// Dọn các phiên đăng ký hết hạn, không bị treo trong bộ nhớ mãi.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cho) if (now > v.expiresAt) cho.delete(k);
  for (const [k, v] of quen) if (now > v.expiresAt) quen.delete(k);
}, 5 * PHUT).unref?.();

module.exports = {
  yeuCauDangKy, guiLai, xacNhanDangKy, emailHopLe,
  yeuCauQuenMk, guiLaiQuenMk, datLaiMatKhau,
};
