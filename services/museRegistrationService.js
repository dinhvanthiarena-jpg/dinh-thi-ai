// Đăng ký mua tool Sa Muse Ai: lưu đăng ký → báo thầy (Telegram có nút + thông báo web) →
// thầy xác nhận đã nhận tiền → tự cấp key 30 ngày + gửi mail key & link tải cho khách.
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const MuseRegistration = require('../models/MuseRegistration');
const PushSubscription = require('../models/PushSubscription');
const museLicense = require('./museLicenseService');
const telegram = require('./telegramService');
const wallet = require('./walletService');
const Setting = require('../models/Setting');

const GIA = 500000; // đ / 1 tháng
const NGAY = 30;
const ZALO = '0965896588';
const PUSH_APP_ID = 'admin-muse';

// Chat Telegram của thầy: ưu tiên biến môi trường; nếu chưa có thì dùng chat đã liên kết bằng mã /lienket.
async function layAdminChat() {
  if (process.env.TELEGRAM_ADMIN_CHAT) return String(process.env.TELEGRAM_ADMIN_CHAT);
  try {
    const row = await Setting.findByPk('museTelegramChat');
    return row && row.value ? String(row.value) : '';
  } catch (e) { return ''; }
}

/** Mã liên kết hiện tại (tạo nếu chưa có). Thầy gửi `/lienket MÃ` cho bot để gắn chat của mình. */
async function layMaLienKet() {
  let row = await Setting.findByPk('museLinkCode');
  if (!row || !row.value) {
    const ma = crypto.randomBytes(4).toString('hex').toUpperCase();
    await Setting.upsert({ key: 'museLinkCode', value: ma });
    return ma;
  }
  return row.value;
}

/** Trả true nếu mã đúng: lưu chat, xoá mã (dùng 1 lần). */
async function lienKetTelegram(chatId, ma) {
  const row = await Setting.findByPk('museLinkCode');
  if (!row || !row.value || String(ma).trim().toUpperCase() !== row.value) return false;
  await Setting.upsert({ key: 'museTelegramChat', value: String(chatId) });
  await Setting.upsert({ key: 'museLinkCode', value: '' });
  return true;
}

const siteUrl = () => (process.env.APP_URL || 'https://3dvietpro.com').replace(/\/$/, '');
const linkTai = () => `${siteUrl()}/downloads/Sa_Muse_Ai_Setup.exe`;

const esc = (s) =>
  String(s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function taoMa() {
  const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = 'MUSE';
  for (let i = 0; i < 6; i += 1) s += CHU[crypto.randomInt(CHU.length)];
  return s;
}

function kiemTra({ name, phone, email }) {
  const loi = [];
  if (!name || String(name).trim().length < 2) loi.push('Vui lòng nhập họ tên.');
  if (!/^(\+?84|0)\d{9}$/.test(String(phone || '').replace(/[\s.\-]/g, ''))) loi.push('Số điện thoại chưa đúng.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim())) loi.push('Gmail/email chưa đúng.');
  return loi;
}

// ---- Mail: gửi từ dinhnam0103@gmail.com nếu có MUSE_MAIL_PASS, không thì dùng SMTP chung của web ----
let transporter;
function layTransporter() {
  if (transporter !== undefined) return transporter;
  if (process.env.MUSE_MAIL_PASS) {
    const user = process.env.MUSE_MAIL_USER || 'dinhnam0103@gmail.com';
    transporter = {
      from: user,
      t: nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass: process.env.MUSE_MAIL_PASS } }),
    };
  } else if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = {
      from: process.env.SMTP_USER,
      t: nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      }),
    };
  } else transporter = null;
  return transporter;
}

async function guiMailKey(reg) {
  const m = layTransporter();
  if (!m) throw new Error('Chưa cấu hình gửi mail (thiếu MUSE_MAIL_PASS hoặc SMTP_*)');
  const key = reg.licenseKey;
  const text = [
    `Chào ${reg.name},`,
    '',
    'Cảm ơn bạn đã mua tool Sa Muse Ai. Đã nhận được thanh toán của bạn.',
    '',
    `KEY của bạn: ${key}  (dùng 30 ngày, gắn với 1 máy tính)`,
    `Link tải tool: ${linkTai()}`,
    '',
    'Cách dùng: tải và cài tool trên máy Windows, mở lên, dán key vào màn hình nhập key.',
    'Để tool tự chạy ngày đêm, bạn cần có Claude gói 20 USD/tháng và tài khoản Muse.',
    '',
    `Cần hỗ trợ cài đặt: nhắn Zalo admin ${ZALO}.`,
  ].join('\n');
  const html =
    `<p>Chào <b>${esc(reg.name)}</b>,</p><p>Cảm ơn bạn đã mua tool <b>Sa Muse Ai</b>. Đã nhận được thanh toán của bạn.</p>` +
    `<p>KEY của bạn:<br><span style="font-size:22px;font-weight:800;letter-spacing:1px;font-family:monospace">${esc(key)}</span>` +
    `<br><small>(dùng 30 ngày, gắn với 1 máy tính)</small></p>` +
    `<p><a href="${esc(linkTai())}" style="background:#0ea5e9;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:700">Tải tool Sa Muse Ai</a></p>` +
    `<p>Cách dùng: tải và cài tool trên máy Windows, mở lên, dán key vào màn hình nhập key.<br>` +
    `Để tool tự chạy ngày đêm, bạn cần có Claude gói 20 USD/tháng và tài khoản Muse.</p>` +
    `<p>Cần hỗ trợ cài đặt: nhắn Zalo admin <b>${ZALO}</b>.</p>`;
  await m.t.sendMail({ from: `"Sa Muse Ai" <${m.from}>`, to: reg.email, subject: 'Key và link tải tool Sa Muse Ai của bạn', text, html });
}

// ---- Báo thầy ----
const vnd = (n) => `${Number(n).toLocaleString('vi-VN')}đ`;

async function baoThayTelegram(reg) {
  const chat = await layAdminChat();
  if (!chat) return;
  const text =
    `🔔 Có người đăng ký mua tool Sa Muse Ai\n${reg.name} · ${reg.phone}\n${reg.email}\n` +
    `Claude Pro: ${reg.hasClaude || '-'} · Muse: ${reg.hasMuse || '-'}\n` +
    `Mã chuyển khoản: ${reg.code} (${vnd(reg.amount)})\n\nKhi thấy tiền về, bấm nút dưới để tự gửi key.`;
  await telegram.sendMessageWithButtons(chat, text, [[{ text: '✅ Đã nhận tiền – gửi key', callback_data: `muse_paid:${reg.id}` }]]);
}

async function baoThayWeb(reg) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:dinhvanthi.arena@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  const subs = await PushSubscription.findAll({ where: { appId: PUSH_APP_ID } });
  const payload = JSON.stringify({
    title: '🔔 Có người đăng ký tool Sa Muse Ai',
    body: `${reg.name} · ${reg.phone}`,
    url: '/admin/dang-ky-muse',
  });
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) await s.destroy();
      }
    })
  );
}

async function baoThay(reg) {
  await Promise.allSettled([baoThayTelegram(reg), baoThayWeb(reg)]);
}

// ---- Nghiệp vụ ----
async function dangKy(data) {
  const loi = kiemTra(data);
  if (loi.length) return { loi };
  let reg;
  for (let i = 0; i < 5 && !reg; i += 1) {
    try {
      reg = await MuseRegistration.create({
        code: taoMa(),
        name: String(data.name).trim().slice(0, 120),
        phone: String(data.phone).replace(/[\s.\-]/g, '').slice(0, 20),
        email: String(data.email).trim().toLowerCase().slice(0, 160),
        hasClaude: String(data.hasClaude || '').slice(0, 40),
        hasMuse: String(data.hasMuse || '').slice(0, 40),
        note: String(data.note || '').slice(0, 1000),
        amount: GIA,
      });
    } catch (e) {
      if (e.name !== 'SequelizeUniqueConstraintError') throw e;
    }
  }
  if (!reg) throw new Error('Không tạo được mã đăng ký');
  baoThay(reg).catch((e) => console.error('[museReg/baoThay]', e.message));
  return { reg };
}

function thongTinThanhToan(reg) {
  if (!wallet.sanSangNhanTien()) return null;
  const tx = { amount: reg.amount, code: reg.code };
  return { anh: wallet.anhQR(tx), ...wallet.thongTinChuyenKhoan(tx) };
}

async function guiLaiMail(reg) {
  try {
    await guiMailKey(reg);
    reg.emailSentAt = new Date();
    reg.emailError = '';
    await reg.save();
    return { daGuiMail: true };
  } catch (e) {
    reg.emailError = String(e.message || e).slice(0, 250);
    await reg.save();
    return { daGuiMail: false, loiMail: reg.emailError };
  }
}

/** Thầy xác nhận đã nhận tiền: chỉ cấp key MỘT lần (chặn bấm trùng), rồi gửi mail. */
const dangXuLy = new Set();
async function xacNhanDaNhanTien(id) {
  if (dangXuLy.has(String(id))) return { loi: 'Đang xử lý, vui lòng đợi vài giây.' };
  dangXuLy.add(String(id));
  try {
    return await xuLyXacNhan(id);
  } finally {
    dangXuLy.delete(String(id));
  }
}

async function xuLyXacNhan(id) {
  const reg = await MuseRegistration.findByPk(id);
  if (!reg) return { loi: 'Không tìm thấy đăng ký.' };
  if (reg.status === 'da-thanh-toan' && reg.licenseKey) return { reg, daXuLyTruoc: true };

  await MuseRegistration.update(
    { status: 'da-thanh-toan', paidAt: new Date() },
    { where: { id, status: 'cho-chuyen-khoan' } }
  );
  const fresh = await MuseRegistration.findByPk(id);
  if (!fresh.licenseKey) {
    const entry = museLicense.issueKey({ note: `${fresh.name} ${fresh.phone} (${fresh.code})`, plan: 'active', days: NGAY });
    fresh.licenseKey = entry.key;
    await fresh.save();
  }
  const kq = await guiLaiMail(fresh);
  // Luôn nhắn key cho thầy để thầy chuyển tiếp cho khách nếu mail chưa đi được.
  layAdminChat().then((chat) => chat && telegram.sendMessage(chat,
    `🔑 Key của ${fresh.name} (${fresh.phone}): ${fresh.licenseKey}
Link tải: ${linkTai()}
` +
    (kq.daGuiMail ? `Mail đã gửi tới ${fresh.email}.` : `⚠️ Mail CHƯA gửi được (${kq.loiMail}). Thầy gửi key này cho khách qua Zalo ${fresh.phone}.`)
  )).catch((e) => console.error('[museReg/tgKey]', e.message));
  return { reg: fresh, ...kq };
}

module.exports = { layAdminChat, layMaLienKet, lienKetTelegram, GIA, NGAY, ZALO, PUSH_APP_ID, dangKy, thongTinThanhToan, xacNhanDaNhanTien, guiLaiMail, linkTai };
