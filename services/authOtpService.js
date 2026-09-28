/**
 * Đăng ký tài khoản web chính (không phải app Mon.L/English Air) 2 bước, có
 * xác nhận email bằng mã OTP — cùng cách làm với services/otpDangKyService.js
 * nhưng tách riêng vì luồng đăng ký ở đây khác: không bắt buộc số điện thoại,
 * có thêm mã giới thiệu (refCode/cookie) và tuỳ chọn đăng ký làm đại lý
 * (wantAgent) cần giữ tạm qua bước xác nhận.
 *
 * Bước 1 (yeuCauDangKy): kiểm tra dữ liệu, TẠM giữ trong bộ nhớ (chưa tạo
 * tài khoản thật), gửi mã 6 số qua email.
 * Bước 2 (xacNhanDangKy): đúng mã mới thật sự tạo tài khoản trong bảng users.
 */
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

const PHUT = 60 * 1000;
const OTP_HET_HAN_MS = 10 * PHUT;
const GUI_LAI_CACH_MS = 60 * 1000;
const SO_LAN_SAI_TOI_DA = 5;

// token (gửi cho client) -> { code, name, email, password, parentId,
//   wantAgent, expiresAt, attempts, lastSentAt }
const cho = new Map();

function taoMa() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function taoToken() {
  return crypto.randomBytes(16).toString('hex');
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
    from: `"Đinh Thi Ai" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Mã xác nhận đăng ký: ${ma}`,
    text: `Mã xác nhận đăng ký tài khoản của bạn là: ${ma}\nMã có hiệu lực trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.`,
    html: `<p>Mã xác nhận đăng ký tài khoản của bạn là:</p><p style="font-size:28px;font-weight:800;letter-spacing:6px;">${ma}</p><p>Mã có hiệu lực trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>`,
  });
}

/** Bước 1: kiểm tra dữ liệu, gửi mã, chưa tạo tài khoản thật. */
async function yeuCauDangKy({ name, email, password, phone, parentId, wantAgent }) {
  const e = String(email || '').trim().toLowerCase();
  const coEmail = await User.findOne({ where: { email: e } });
  if (coEmail) return { loi: 'Email này đã được sử dụng.' };

  const ma = taoMa();
  const token = taoToken();
  cho.set(token, {
    code: ma, name, email: e, password: String(password), phone: phone ? String(phone).trim() : null, parentId: parentId || null, wantAgent: !!wantAgent,
    expiresAt: Date.now() + OTP_HET_HAN_MS, attempts: 0, lastSentAt: Date.now(),
  });

  try {
    await guiEmailOtp(e, ma);
  } catch (err) {
    cho.delete(token);
    if (err.code === 'NO_SMTP') return { loi: 'Máy chủ chưa bật gửi email, báo admin giúp nhé.' };
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
  const trung = await User.findOne({ where: { email: rec.email } });
  if (trung) { cho.delete(token); return { loi: 'Email này đã được sử dụng.' }; }

  const user = await User.create({
    name: rec.name,
    email: rec.email,
    password: rec.password,
    phone: rec.phone || null,
    parentId: rec.parentId,
    agentStatus: rec.wantAgent ? 'pending' : 'none',
  });
  cho.delete(token);
  return { user, wantAgent: rec.wantAgent };
}

// ---------------- Quên mật khẩu — cùng cơ chế OTP 6 số qua email ----------------
const choQuenMatKhau = new Map(); // token -> { code, email, expiresAt, attempts, lastSentAt }

async function guiEmailResetOtp(email, ma) {
  const t = layTransporter();
  if (!t) throw Object.assign(new Error('Chưa cấu hình gửi email'), { code: 'NO_SMTP' });
  await t.sendMail({
    from: `"Đinh Thi Ai" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Mã đặt lại mật khẩu: ${ma}`,
    text: `Mã xác nhận đặt lại mật khẩu của bạn là: ${ma}\nMã có hiệu lực trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.`,
    html: `<p>Mã xác nhận đặt lại mật khẩu của bạn là:</p><p style="font-size:28px;font-weight:800;letter-spacing:6px;">${ma}</p><p>Mã có hiệu lực trong 10 phút. Nếu không phải bạn yêu cầu, hãy bỏ qua email này.</p>`,
  });
}

/** Bước 1: gửi mã đặt lại mật khẩu — KHÔNG báo lộ email có tồn tại hay không (chống dò email). */
async function yeuCauQuenMatKhau({ email }) {
  const e = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ where: { email: e } });
  const ma = taoMa();
  const token = taoToken();
  if (user) {
    choQuenMatKhau.set(token, { code: ma, email: e, expiresAt: Date.now() + OTP_HET_HAN_MS, attempts: 0, lastSentAt: Date.now() });
    try {
      await guiEmailResetOtp(e, ma);
    } catch (err) {
      choQuenMatKhau.delete(token);
      if (err.code === 'NO_SMTP') return { loi: 'Máy chủ chưa bật gửi email, báo admin giúp nhé.' };
      return { loi: 'Không gửi được email, bạn kiểm tra lại email rồi thử lại nhé.' };
    }
  }
  // Luôn trả về token/ok giống nhau dù email có tồn tại hay không, để không lộ
  // thông tin "email này có tài khoản hay không" cho người dò quét.
  return { token, email: e };
}

async function guiLaiQuenMatKhau(token) {
  const rec = choQuenMatKhau.get(token);
  if (!rec) return { ok: true }; // im lặng, không lộ trạng thái
  if (Date.now() - rec.lastSentAt < GUI_LAI_CACH_MS) return { loi: 'Bạn vừa gửi mã rồi, chờ một chút rồi gửi lại nhé.' };
  rec.code = taoMa();
  rec.expiresAt = Date.now() + OTP_HET_HAN_MS;
  rec.lastSentAt = Date.now();
  rec.attempts = 0;
  try {
    await guiEmailResetOtp(rec.email, rec.code);
  } catch {
    return { loi: 'Không gửi được email, bạn thử lại sau nhé.' };
  }
  return { ok: true };
}

/** Bước 2: đúng mã thì mới thật sự đổi mật khẩu. */
async function xacNhanQuenMatKhau({ token, code, newPassword }) {
  const rec = choQuenMatKhau.get(token);
  if (!rec) return { loi: 'Phiên đặt lại mật khẩu đã hết hạn, bạn yêu cầu lại từ đầu nhé.' };
  if (Date.now() > rec.expiresAt) { choQuenMatKhau.delete(token); return { loi: 'Mã đã hết hạn, bạn bấm gửi lại mã nhé.' }; }
  if (rec.attempts >= SO_LAN_SAI_TOI_DA) { choQuenMatKhau.delete(token); return { loi: 'Bạn nhập sai quá nhiều lần, yêu cầu lại từ đầu nhé.' }; }
  if (String(code || '').trim() !== rec.code) {
    rec.attempts += 1;
    return { loi: 'Mã không đúng, bạn kiểm tra lại nhé.' };
  }
  if (!newPassword || String(newPassword).length < 6) {
    return { loi: 'Mật khẩu mới cần ít nhất 6 ký tự.' };
  }
  const user = await User.findOne({ where: { email: rec.email } });
  if (!user) { choQuenMatKhau.delete(token); return { loi: 'Tài khoản không còn tồn tại.' }; }
  user.password = String(newPassword); // model hook tự hash lại (xem models/User.js beforeUpdate)
  await user.save();
  choQuenMatKhau.delete(token);
  return { user };
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of choQuenMatKhau) if (now > v.expiresAt) choQuenMatKhau.delete(k);
}, 5 * PHUT).unref?.();

// Dọn các phiên đăng ký hết hạn, không bị treo trong bộ nhớ mãi.
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cho) if (now > v.expiresAt) cho.delete(k);
}, 5 * PHUT).unref?.();

module.exports = { yeuCauDangKy, guiLai, xacNhanDangKy };
