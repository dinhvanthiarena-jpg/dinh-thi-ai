// Đăng ký mua tool Sa Muse Ai: lưu đăng ký → báo thầy (Telegram có nút + thông báo web) →
// thầy xác nhận đã nhận tiền → tự cấp key 1 năm (365 ngày) + gửi mail key & link tải cho khách.
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const webpush = require('web-push');
const MuseRegistration = require('../models/MuseRegistration');
const PushSubscription = require('../models/PushSubscription');
const museLicense = require('./museLicenseService');
const telegram = require('./telegramService');
const Setting = require('../models/Setting');
const User = require('../models/User');
const promo = require('./musePromoService');

// Từ 21/11/2026: 989.000đ / 1 năm (365 ngày). Trước đó là 500.000đ / 30 ngày — đơn cũ giữ nguyên
// (số tiền lưu theo từng đơn, key cũ không đụng tới).
const GIA = 989000; // đ / 1 năm
const NGAY = 365;
const HAN_TEXT = '1 năm (365 ngày)';
const GIA_CU = 500000; // gói tháng cũ — chỉ để nhận ra đơn cũ
const NGAY_CU = 30;
const MONL_PATH = '/kho-tai-nguyen/english-air-hoc-tieng-anh-mtcafzju';
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
const linkMonL = () => `${siteUrl()}${MONL_PATH}`;

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

/**
 * Quà tặng kèm: app học ngoại ngữ Mon.L (nói đúng sự thật, không hứa "vĩnh viễn/trọn đời").
 * - PRO_MODE tắt (mặc định): Mon.L đang miễn phí → chỉ kèm link + lời tặng, KHÔNG ghi thời hạn.
 * - PRO_MODE bật (có thu phí): cộng 30 ngày Pro (User.proUntil) cho tài khoản Mon.L trùng Gmail khách;
 *   mỗi đơn chỉ cộng 1 lần (gửi lại mail không cộng thêm). Chưa có tài khoản thì dặn khách nhắn Zalo.
 */
async function quaMonL(reg) {
  const link = linkMonL();
  const lk = `<a href="${esc(link)}">${esc(link)}</a>`;
  const proBat = String(process.env.PRO_MODE || 'off').toLowerCase() === 'on';
  if (!proBat) {
    return { text: `Quà tặng kèm: app học ngoại ngữ Mon.L. Mở tại: ${link}`, html: `Quà tặng kèm: app học ngoại ngữ Mon.L. Mở tại: ${lk}` };
  }
  try {
    const email = String(reg.email || '').trim().toLowerCase();
    const u = await User.findOne({ where: { email } });
    if (u) {
      const dau = `museQuaMonL:${reg.id}`;
      const daCap = await Setting.findByPk(dau);
      let het;
      if (daCap && daCap.value) het = new Date(daCap.value);
      else {
        const nen = u.proUntil && new Date(u.proUntil).getTime() > Date.now() ? new Date(u.proUntil) : new Date();
        het = new Date(nen.getTime() + 30 * 24 * 60 * 60 * 1000);
        await u.update({ proUntil: het });
        await Setting.upsert({ key: dau, value: het.toISOString() });
      }
      const t = `Quà tặng kèm: app học ngoại ngữ Mon.L, đã cộng 30 ngày dùng cho tài khoản ${email}, đến hết ngày ${dmy(het)}. Mở tại: `;
      return { text: t + link, html: esc(t) + lk };
    }
  } catch (e) {
    console.error('[museReg/quaMonL]', e.message);
  }
  const t = `Quà tặng kèm: app học ngoại ngữ Mon.L. Bạn đăng ký tài khoản Mon.L bằng đúng Gmail này rồi nhắn Zalo ${ZALO} để được cộng 30 ngày dùng. Mở tại: `;
  return { text: t + link, html: esc(t) + lk };
}

async function guiMailKey(reg) {
  const m = layTransporter();
  if (!m) throw new Error('Chưa cấu hình gửi mail (thiếu MUSE_MAIL_PASS hoặc SMTP_*)');
  const key = reg.licenseKey;
  // Thư giao dịch (không phải quảng cáo): văn bản đơn giản, nêu rõ mã đơn + lý do nhận thư, KHÔNG nút/đồ hoạ,
  // KHÔNG link tải .exe trực tiếp (bộ lọc spam rất ghét) mà trỏ về trang tải trên chính web 3dvietpro.com.
  const trang = linkTrangTai();
  const qua = await quaMonL(reg); // quà tặng kèm: app học ngoại ngữ Mon.L (nói đúng sự thật theo PRO_MODE)
  const text = [
    `Chào ${reg.name},`,
    '',
    `Đây là thư tự động xác nhận đơn mua tool Sa Muse Ai (mã đơn ${reg.code}) bạn đã đăng ký trên 3dvietpro.com. Chúng tôi đã nhận được thanh toán của bạn, cảm ơn bạn.`,
    '',
    `Mã kích hoạt (key) của bạn: ${key}`,
    `Key dùng ${HAN_TEXT}, gắn với 1 máy tính. Số tiền của đơn: ${vnd(reg.amount)}.`,
    '',
    `Trang tải và hướng dẫn cài: ${trang}`,
    '',
    'Cách dùng: tải và cài tool trên máy Windows, mở lên, dán key vào màn hình nhập key.',
    'Để tool tự chạy ngày đêm, bạn cần có Claude gói 20 USD/tháng và tài khoản Muse.',
    `Hết hạn, nhắn Zalo ${ZALO} để gia hạn ${vnd(GIA)}/năm. Cần hỗ trợ cài đặt cũng nhắn Zalo ${ZALO}.`,
    '',
    qua.text,
    '',
    'Nếu thư này nằm trong mục Spam hoặc Quảng cáo, bạn bấm "Không phải thư rác" / kéo sang Hộp thư chính, và trả lời thư này một chữ "OK" để lần sau (thông báo gia hạn) vào thẳng hộp thư chính.',
  ].join('\n');
  const html =
    `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#111">` +
    `<p>Chào ${esc(reg.name)},</p>` +
    `<p>Đây là thư tự động xác nhận đơn mua tool Sa Muse Ai (mã đơn <b>${esc(reg.code)}</b>) bạn đã đăng ký trên 3dvietpro.com. Chúng tôi đã nhận được thanh toán của bạn, cảm ơn bạn.</p>` +
    `<p>Mã kích hoạt (key) của bạn: <b style="font-family:monospace;font-size:17px">${esc(key)}</b><br>Key dùng ${HAN_TEXT}, gắn với 1 máy tính. Số tiền của đơn: ${vnd(reg.amount)}.</p>` +
    `<p>Trang tải và hướng dẫn cài: <a href="${esc(trang)}">${esc(trang)}</a></p>` +
    `<p>Cách dùng: tải và cài tool trên máy Windows, mở lên, dán key vào màn hình nhập key.<br>` +
    `Để tool tự chạy ngày đêm, bạn cần có Claude gói 20 USD/tháng và tài khoản Muse.</p>` +
    `<p>Hết hạn, nhắn Zalo ${ZALO} để gia hạn ${vnd(GIA)}/năm. Cần hỗ trợ cài đặt cũng nhắn Zalo ${ZALO}.</p>` +
    `<p>${qua.html}</p>` +
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
  const maDung = promo.timTheoDon(reg.code);
  const text =
    `🔔 Có người đăng ký mua tool Sa Muse Ai\n${reg.name} · ${reg.phone}\n${reg.email}\n` +
    `Claude Pro: ${reg.hasClaude || '-'} · Muse: ${reg.hasMuse || '-'}\n` +
    `Mã chuyển khoản: ${reg.code} (${vnd(reg.amount)})\n` +
    (maDung ? `🏷️ Dùng mã ưu đãi ${maDung.ma} (giá ${vnd(maDung.gia)}, giá niêm yết ${vnd(GIA)})\n` : '') +
    `\nKhi thấy tiền về, bấm nút dưới để tự gửi key.`;
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
  // Mã ưu đãi (không bắt buộc): mã đúng thì giá đơn = giá của mã; mã sai thì báo lỗi, KHÔNG tự đổi sang giá niêm yết.
  let giaDon = GIA;
  let maUuDai = '';
  const nhap = String(data.promo || '').trim();
  if (nhap) {
    const kt = promo.kiemTra(nhap);
    if (!kt.ok) return { loi: [kt.loi] };
    giaDon = kt.gia;
    maUuDai = kt.ma;
  }
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
        amount: giaDon,
      });
    } catch (e) {
      if (e.name !== 'SequelizeUniqueConstraintError') throw e;
    }
  }
  if (!reg) throw new Error('Không tạo được mã đăng ký');
  if (maUuDai) {
    // Giữ lượt ngay (đồng bộ). Nếu giữa chừng có người khác dùng hết lượt thì huỷ đơn này và báo lỗi.
    const dat = promo.datCho(maUuDai, reg.code);
    if (!dat.ok) {
      await reg.destroy();
      return { loi: [dat.loi] };
    }
  }
  baoThay(reg).catch((e) => console.error('[museReg/baoThay]', e.message));
  return { reg, maUuDai };
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

/** Gia hạn thêm `ngay` ngày (mặc định 365 = gói năm; đơn cũ gói tháng có thể +30), cộng vào hạn còn lại, nhắn thầy xác nhận. */
async function giaHan(id, ngay = NGAY) {
  const reg = await MuseRegistration.findByPk(id);
  if (!reg || !reg.licenseKey) return { loi: 'Đăng ký này chưa có key để gia hạn.' };
  const entry = museLicense.extendKey(reg.licenseKey, ngay);
  if (!entry) return { loi: 'Không tìm thấy key.' };
  const chat = await layAdminChat();
  if (chat) telegram.sendMessage(chat, `🔁 Đã gia hạn +${ngay} ngày cho ${reg.name} (${reg.phone}). Hạn mới: ${dmy(entry.expiresAt)}.`).catch(() => {});
  return { reg, het: entry.expiresAt, ngay };
}

/** Quét key đã bán: nhắn thầy khi còn ≤7 ngày (gói năm cần nhắc sớm hơn) và khi đã hết hạn (mỗi mốc nhắn 1 lần). */
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
    else if (conLai <= 7 * DAY_MS) moc = 'sap';
    if (!moc) continue;
    const dau = `museNhacHan:${reg.id}:${k.expiresAt}:${moc}`;
    if (await Setting.findByPk(dau)) continue;
    await Setting.upsert({ key: dau, value: '1' });
    const ngayCon = Math.max(0, Math.ceil(conLai / DAY_MS));
    await telegram.sendMessage(chat, moc === 'het'
      ? `⛔ Key của ${reg.name} (${reg.phone}) ĐÃ HẾT HẠN ${dmy(k.expiresAt)}. Liên hệ khách (Zalo ${reg.phone}) để gia hạn ${vnd(GIA)}/năm, rồi vào /admin/dang-ky-muse bấm "Gia hạn +${NGAY} ngày".`
      : `⏰ Key của ${reg.name} (${reg.phone}) còn ${ngayCon} ngày (hết ${dmy(k.expiresAt)}). Nhắc khách gia hạn ${vnd(GIA)}/năm qua Zalo ${reg.phone}.`);
  }
}

function batDauNhacHetHan() {
  const chay = () => nhacHetHan().catch((e) => console.error('[museReg/nhacHetHan]', e.message));
  setTimeout(chay, 60 * 1000);
  setInterval(chay, 6 * 60 * 60 * 1000);
}

module.exports = { giaHan, nhacHetHan, batDauNhacHetHan, layAdminChat, layMaLienKet, lienKetTelegram, GIA, NGAY, HAN_TEXT, GIA_CU, NGAY_CU, ZALO, PUSH_APP_ID, dangKy, thongTinThanhToan, xacNhanDaNhanTien, guiLaiMail, linkTai, linkTrangTai };
