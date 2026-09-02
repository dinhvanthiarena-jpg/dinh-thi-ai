/**
 * Đăng ký tài khoản 2 bước, có xác nhận email bằng mã OTP.
 *
 * Bước 1 (yeuCauDangKy): kiểm tra dữ liệu, TẠM giữ trong bộ nhớ (chưa tạo
 * tài khoản thật), gửi mã 6 số qua email.
 * Bước 2 (xacNhanDangKy): đúng mã mới thật sự tạo tài khoản trong bảng users.
 *
 * Hiện chỉ dùng cho Mon-Maths (/api/game). Dùng chung services/taiKhoanAppService.js
 * cho phần kiểm tra số điện thoại/mật khẩu và tạo cookie đăng nhập.
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

async function guiEmailOtp(email, ma) {
  const t = layTransporter();
  if (!t) throw Object.assign(new Error('Chưa cấu hình gửi email'), { code: 'NO_SMTP' });
  await t.sendMail({
    from: `"Mon.L" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Mã xác nhận đăng ký: ${ma}`,
    text: `Mã xác nhận đăng ký tài khoản của con là: ${ma}\nMã có hiệu lực trong 10 phút. Nếu không phải con yêu cầu, hãy bỏ qua email này.`,
    html: `<p>Mã xác nhận đăng ký tài khoản của con là:</p><p style="font-size:28px;font-weight:800;letter-spacing:6px;">${ma}</p><p>Mã có hiệu lực trong 10 phút. Nếu không phải con yêu cầu, hãy bỏ qua email này.</p>`,
  });
}

/** Bước 1: kiểm tra dữ liệu, gửi mã, chưa tạo tài khoản thật. */
async function yeuCauDangKy({ ten, sdt, matKhau, email }) {
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
  cho.set(token, {
    code: ma, ten: name, sdt: so, matKhau: String(matKhau), email: e,
    expiresAt: Date.now() + OTP_HET_HAN_MS, attempts: 0, lastSentAt: Date.now(),
  });

  try {
    await guiEmailOtp(e, ma);
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
    await guiEmailOtp(rec.email, rec.code);
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

// Dọn các phiên đăng ký hết hạn, không bị treo trong bộ nhớ mãi.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cho) if (now > v.expiresAt) cho.delete(k);
}, 5 * PHUT).unref?.();

module.exports = { yeuCauDangKy, guiLai, xacNhanDangKy, emailHopLe };
