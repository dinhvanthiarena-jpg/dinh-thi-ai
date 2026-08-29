/**
 * Tài khoản cho app Mon.L: đăng ký và đăng nhập bằng số điện thoại.
 *
 * App nằm cùng tên miền với web nên dùng chung đúng một phiên đăng nhập —
 * cùng cookie `token`, cùng bảng `users`. Ai đăng ký trong app thì hiện luôn
 * ở trang quản trị, không phải đồng bộ gì thêm.
 */
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const NGAY = 24 * 60 * 60 * 1000;

/**
 * Đưa số điện thoại về một dạng duy nhất trước khi lưu hay tra.
 * Không chuẩn hoá thì "0912 345 678", "+84912345678" và "0912345678" thành ba
 * tài khoản khác nhau của cùng một người.
 */
function chuanSdt(raw) {
  let s = String(raw || '').replace(/[\s.\-()]/g, '');
  if (s.startsWith('+84')) s = '0' + s.slice(3);
  else if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2);
  return s;
}

/** Số di động Việt Nam: 10 chữ số, mở đầu 03/05/07/08/09. */
function sdtHopLe(s) {
  return /^0(3|5|7|8|9)[0-9]{8}$/.test(s);
}

function loiSdt(s) {
  if (!s) return 'Vui lòng nhập số điện thoại.';
  if (!/^[0-9]+$/.test(s)) return 'Số điện thoại chỉ gồm chữ số.';
  if (!sdtHopLe(s)) return 'Số điện thoại chưa đúng. Ví dụ: 0912345678';
  return null;
}

function loiMatKhau(mk) {
  if (!mk || mk.length < 6) return 'Mật khẩu cần ít nhất 6 ký tự.';
  if (mk.length > 72) return 'Mật khẩu dài quá, tối đa 72 ký tự.';
  return null;
}

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/** Đặt đúng cookie mà middleware auth của web vẫn đọc, để hai bên dùng chung phiên. */
function datCookie(res, user) {
  res.cookie('token', signToken(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * NGAY,
  });
}

function goiVe(user) {
  return {
    id: user.id,
    ten: user.name,
    sdt: user.phone || '',
    email: user.email || '',
    vaiTro: user.role,
    thamGia: user.createdAt,
  };
}

async function dangKySdt({ ten, sdt, matKhau }) {
  const so = chuanSdt(sdt);
  const l1 = loiSdt(so);
  if (l1) return { loi: l1 };
  const l2 = loiMatKhau(matKhau);
  if (l2) return { loi: l2 };

  const name = String(ten || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  if (!name) return { loi: 'Vui lòng nhập tên của bạn.' };

  const daCo = await User.findOne({ where: { phone: so } });
  if (daCo) return { loi: 'Số này đã có tài khoản. Bạn hãy đăng nhập nhé.' };

  // email để NULL chứ không phải '' — nhiều chuỗi rỗng sẽ đụng chỉ mục duy nhất.
  const user = await User.create({ name, phone: so, email: null, password: matKhau });
  return { user };
}

async function dangNhapSdt({ sdt, matKhau }) {
  const so = chuanSdt(sdt);
  if (!so) return { loi: 'Vui lòng nhập số điện thoại.' };

  const user = await User.findOne({ where: { phone: so } });
  const dung = user && (await user.comparePassword(String(matKhau || '')));
  // Không nói rõ sai số hay sai mật khẩu, để người ngoài không dò được số nào có tài khoản.
  if (!dung) return { loi: 'Số điện thoại hoặc mật khẩu không đúng.' };
  if (!user.isActive) return { loi: 'Tài khoản này đang bị khoá.' };
  return { user };
}

/** Đổi mật khẩu khi người dùng còn nhớ mật khẩu cũ. */
async function doiMatKhau(user, { cu, moi }) {
  const dung = await user.comparePassword(String(cu || ''));
  if (!dung) return { loi: 'Mật khẩu hiện tại không đúng.' };
  const l = loiMatKhau(moi);
  if (l) return { loi: l };
  user.password = moi;
  await user.save();
  return { ok: true };
}

/** Người đăng ký bằng số điện thoại có thể bổ sung email sau. */
async function themEmail(user, email) {
  const e = String(email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { loi: 'Email chưa đúng.' };
  const daCo = await User.findOne({ where: { email: e, id: { [Op.ne]: user.id } } });
  if (daCo) return { loi: 'Email này đã có người dùng.' };
  user.email = e;
  await user.save();
  return { ok: true };
}

/* ═══════════════ ĐĂNG NHẬP BẰNG GMAIL ═══════════════
   Dùng Google Identity Services: trình duyệt lấy về một tấm vé (ID token), máy
   chủ hỏi thẳng Google xem vé đó có thật và có đúng là cấp cho app này không.
   Hỏi thẳng Google nên không cần thêm thư viện, và cũng không bao giờ tin lời
   trình duyệt nói — người ta có thể tự bịa ra email bất kỳ. */
const GOOGLE_KIEM = 'https://oauth2.googleapis.com/tokeninfo?id_token=';

function coGoogle() {
  return Boolean(process.env.GOOGLE_CLIENT_ID);
}

async function kiemVeGoogle(token) {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) return { loi: 'Máy chủ chưa bật đăng nhập Google.' };
  if (!token || typeof token !== 'string') return { loi: 'Thiếu thông tin đăng nhập.' };

  let d;
  try {
    const r = await fetch(GOOGLE_KIEM + encodeURIComponent(token), { signal: AbortSignal.timeout(10000) });
    d = await r.json();
    if (!r.ok) return { loi: 'Google không nhận đăng nhập này.' };
  } catch {
    return { loi: 'Không hỏi được Google, bạn thử lại nhé.' };
  }

  // Vé phải cấp cho ĐÚNG app này, không thì ai đó lấy vé của app khác đem sang.
  if (d.aud !== id) return { loi: 'Đăng nhập không hợp lệ.' };
  if (d.email_verified !== 'true' && d.email_verified !== true) {
    return { loi: 'Email này chưa được Google xác minh.' };
  }
  const email = String(d.email || '').toLowerCase();
  if (!email) return { loi: 'Không lấy được email từ Google.' };
  return { email, ten: d.name || d.given_name || email.split('@')[0], anh: d.picture || '' };
}

/** Có tài khoản thì vào luôn, chưa có thì tạo mới — khỏi phải đăng ký riêng. */
async function vaoBangGoogle(token) {
  const v = await kiemVeGoogle(token);
  if (v.loi) return { loi: v.loi };

  let user = await User.findOne({ where: { email: v.email } });
  if (user) {
    if (!user.isActive) return { loi: 'Tài khoản này đang bị khoá.' };
    // Ai đăng ký bằng số điện thoại trước rồi mới nối Gmail thì giữ nguyên tên họ đã đặt.
    if (!user.avatarUrl && v.anh) { user.avatarUrl = v.anh; await user.save(); }
    return { user, moi: false };
  }

  // Mật khẩu ngẫu nhiên: tài khoản này vào bằng Google nên không ai cần biết nó.
  const matKhau = require('crypto').randomBytes(24).toString('hex');
  user = await User.create({
    name: String(v.ten).slice(0, 60),
    email: v.email,
    phone: null,
    avatarUrl: v.anh || '',
    password: matKhau,
  });
  return { user, moi: true };
}

module.exports = {
  coGoogle, vaoBangGoogle,
  chuanSdt, sdtHopLe, datCookie, goiVe,
  dangKySdt, dangNhapSdt, doiMatKhau, themEmail,
};
