// Đăng ký mua tool Sa Muse Ai: lưu đăng ký → báo thầy (Telegram có nút + thông báo web) →
// thầy xác nhận đã nhận tiền → tự cấp key 30 ngày + gửi mail key & link tải cho khách.
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const MuseRegistration = require('../models/MuseRegistration');
const PushSubscription = require('../models/PushSubscription');
const museLicense = require('./museLicenseService');
const telegram = require('./telegramService');
const Setting = require('../models/Setting');

const GIA = 500000; // đ / 1 tháng
const NGAY = 30;
const ZALO = '0977317988';
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
const linkTrangTai = () => `${siteUrl()}/dang-ky-tool-muse/tai-tool`;

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
  // Thư giao dịch (không phải quảng cáo): văn bản đơn giản, nêu rõ mã đơn + lý do nhận thư, KHÔNG nút/đồ hoạ,
  // KHÔNG link tải .exe trực tiếp (bộ lọc spam rất ghét) mà trỏ về trang tải trên chính web 3dvietpro.com.
  const trang = linkTrangTai();
  const text = [
    `Chào ${reg.name},`,
    '',
    `Đây là thư tự động xác nhận đơn mua tool Sa Muse Ai (mã đơn ${reg.code}) bạn đã đăng ký trên 3dvietpro.com. Chúng tôi đã nhận được thanh toán của bạn, cảm ơn bạn.`,
    '',
    `Mã kích hoạt (key) của bạn: ${key}`,
    `Key dùng ${NGAY} ngày, gắn với 1 máy tính.`,
    '',
    `Trang tải và hướng dẫn cài: ${trang}`,
    '',
    'Cách dùng: tải và cài tool trên máy Windows, mở lên, dán key vào màn hình nhập key.',
    'Để tool tự chạy ngày đêm, bạn cần có Claude gói 20 USD/tháng và tài khoản Muse.',
    `Hết hạn, nhắn Zalo ${ZALO} để gia hạn ${vnd(GIA)}/${NGAY} ngày. Cần hỗ trợ cài đặt cũng nhắn Zalo ${ZALO}.`,
    '',
    'Nếu thư này nằm trong mục Spam hoặc Quảng cáo, bạn bấm "Không phải thư rác" / kéo sang Hộp thư chính, và trả lời thư này một chữ "OK" để lần sau (thông báo gia hạn) vào thẳng hộp thư chính.',
  ].join('\n');
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#111">` +
    `<p>Chào ${esc(reg.name)},</p>` +
    `<p>Đây là thư tự động xác nhận đơn mua tool Sa Muse Ai (mã đơn <b>${esc(reg.code)}</b>) bạn đã đăng ký trên 3dvietpro.com. Chúng tôi đã nhận được thanh toán của bạn, cảm ơn bạn.</p>` +
    `<p>Mã kích hoạt (key) của bạn: <b style="font-family:monospace;font-size:17px">${esc(key)}</b><br>Key dùng ${NGAY} ngày, gắn với 1 máy tính.</p>` +
    `<p>Trang tải và hướng dẫn cài: <a href="${esc(trang)}">${esc(trang)}</a></p>` +
    `<p>Cách dùng: tải và cài tool trên máy Windows, mở lên, dán key vào màn hình nhập key.<br>` +
    `Để tool tự chạy ngày đêm, bạn cần có Claude gói 20 USD/tháng và tài khoản Muse.</p>` +
    `<p>Hết hạn, nhắn Zalo ${ZALO} để gia hạn ${vnd(GIA)}/${NGAY} ngày. Cần hỗ trợ cài đặt cũng nhắn Zalo ${ZALO}.</p>` +
    `<p style="color:#555;font-size:13px">Nếu thư này nằm trong mục Spam hoặc Quảng cáo, bạn bấm "Không phải thư rác" / kéo sang Hộp thư chính, và trả lời thư này một chữ "OK" để lần sau (thông báo gia hạn) vào thẳng hộp thư chính.</p>` +
    `</div>`;
  await m.t.sendMail({
    from: `"Sa Muse Ai" <${m.from}>`,
    replyTo: m.from,
    to: reg.email,
    subject: `Xác nhận đơn ${reg.code} – key Sa Muse Ai của ${reg.name}`,
    text,
    html,
    priority: 'high', // nodemailer gắn X-Priority/Importance: Outlook và vài app mail hiển thị "quan trọng"; Gmail thì tự quyết
  });
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

// Tài khoản nhận tiền RIÊNG cho tool Sa Muse Ai (thầy chốt 2026-11-16): MB Bank (BIN 970422).
// Không dùng BANK_* chung của web để không ảnh hưởng các trang khác.
const NHAN_TIEN = { bin: '970422', nganHang: 'MB Bank', soTaiKhoan: '0468263414999', chuTaiKhoan: 'TRINH THI CANH' };

function thongTinThanhToan(reg) {
  const q = new URLSearchParams({ amount: String(reg.amount), addInfo: reg.code, accountName: NHAN_TIEN.chuTaiKhoan });
  return {
    anh: `https://img.vietqr.io/image/${NHAN_TIEN.bin}-${NHAN_TIEN.soTaiKhoan}-compact2.png?${q.toString()}`,
    nganHang: NHAN_TIEN.nganHang,
    soTaiKhoan: NHAN_TIEN.soTaiKhoan,
    chuTaiKhoan: NHAN_TIEN.chuTaiKhoan,
    soTien: reg.amount,
    noiDung: reg.code,
  };
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

const DAY_MS = 24 * 60 * 60 * 1000;
const dmy = (ms) => new Date(ms).toLocaleDateString('vi-VN');

/** Gia hạn thêm 30 ngày (cộng vào hạn còn lại), nhắn thầy xác nhận. */
async function giaHan(id) {
  const reg = await MuseRegistration.findByPk(id);
  if (!reg || !reg.licenseKey) return { loi: 'Đăng ký này chưa có key để gia hạn.' };
  const entry = museLicense.extendKey(reg.licenseKey, NGAY);
  if (!entry) return { loi: 'Không tìm thấy key.' };
  const chat = await layAdminChat();
  if (chat) telegram.sendMessage(chat, `🔁 Đã gia hạn +${NGAY} ngày cho ${reg.name} (${reg.phone}). Hạn mới: ${dmy(entry.expiresAt)}.`).catch(() => {});
  return { reg, het: entry.expiresAt };
}

/** Quét key đã bán: nhắn thầy khi còn ≤3 ngày và khi đã hết hạn (mỗi mốc nhắn 1 lần). */
async function nhacHetHan() {
  const chat = await layAdminChat();
  if (!chat) return;
  const regs = await MuseRegistration.findAll({ where: { status: 'da-thanh-toan' } });
  const keys = new Map(museLicense.listKeys().map((k) => [k.key, k]));
  for (const reg of regs) {
    const k = keys.get(reg.licenseKey);
    if (!k || !k.expiresAt || k.active === false) continue;
    const conLai = k.expiresAt - Date.now();
    let moc = '';
    if (conLai <= 0) moc = 'het';
    else if (conLai <= 3 * DAY_MS) moc = 'sap';
    if (!moc) continue;
    const dau = `museNhacHan:${reg.id}:${k.expiresAt}:${moc}`;
    if (await Setting.findByPk(dau)) continue;
    await Setting.upsert({ key: dau, value: '1' });
    const ngayCon = Math.max(0, Math.ceil(conLai / DAY_MS));
    await telegram.sendMessage(chat, moc === 'het'
      ? `⛔ Key của ${reg.name} (${reg.phone}) ĐÃ HẾT HẠN ${dmy(k.expiresAt)}. Liên hệ khách (Zalo ${reg.phone}) để gia hạn ${vnd(GIA)}/${NGAY} ngày, rồi vào /admin/dang-ky-muse bấm "Gia hạn +${NGAY} ngày".`
      : `⏰ Key của ${reg.name} (${reg.phone}) còn ${ngayCon} ngày (hết ${dmy(k.expiresAt)}). Nhắc khách gia hạn ${vnd(GIA)}/${NGAY} ngày qua Zalo ${reg.phone}.`);
  }
}

function batDauNhacHetHan() {
  const chay = () => nhacHetHan().catch((e) => console.error('[museReg/nhacHetHan]', e.message));
  setTimeout(chay, 60 * 1000);
  setInterval(chay, 6 * 60 * 60 * 1000);
}

module.exports = { giaHan, nhacHetHan, batDauNhacHetHan, layAdminChat, layMaLienKet, lienKetTelegram, GIA, NGAY, ZALO, PUSH_APP_ID, dangKy, thongTinThanhToan, xacNhanDaNhanTien, guiLaiMail, linkTai, linkTrangTai };
