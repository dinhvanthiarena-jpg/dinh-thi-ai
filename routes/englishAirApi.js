const express = require('express');
const tutor = require('../services/englishAirTutorService');
const pro = require('../services/proService');
const tk = require('../services/taiKhoanAppService');
const tienDo = require('../services/tienDoMonlService');

const router = express.Router();

// Chặn lạm dụng: mỗi IP tối đa 40 lượt nói trong 10 phút. Đủ cho một buổi
// luyện nói bình thường, nhưng không để ai đó quay vòng đốt token của thầy.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 40;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > WINDOW_MS) {
    hits.set(ip, { start: now, n: 1 });
    return false;
  }
  rec.n += 1;
  return rec.n > MAX_HITS;
}
// Dọn bộ nhớ định kỳ để Map không phình mãi.
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of hits) if (now - rec.start > WINDOW_MS) hits.delete(ip);
}, WINDOW_MS).unref?.();

router.post('/chat', async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Bạn nói hơi nhanh rồi, nghỉ một lát rồi gọi lại nhé.' });
  }
  // Cửa gói Pro. Khi PRO_MODE còn tắt thì duocDung() luôn trả về true —
  // mọi người vẫn gọi thoải mái, đúng như đang để miễn phí.
  if (!pro.duocDung(res.locals.currentUser)) {
    return res.status(402).json({
      error: 'Phần gọi tự do nằm trong gói Pro. Nâng cấp để nói chuyện thoải mái với MON.L nhé.',
      nangCap: '/pro',
    });
  }
  try {
    const { history, level, words, mode, style } = req.body || {};
    const out = await tutor.reply({ history, level, words, mode, style });
    res.json(out);
  } catch (err) {
    const noKey = err.code === 'NO_KEY';
    console.error('[english-air/chat]', err.message);
    res.status(noKey ? 503 : 502).json({
      error: noKey
        ? 'Chế độ nói chuyện tự do chưa bật trên máy chủ.'
        : 'MON.L đang bận, bạn thử lại sau một chút nhé.',
    });
  }
});

/* ═══════════════ TÀI KHOẢN TRONG APP ═══════════════
   App và web cùng tên miền nên dùng chung cookie đăng nhập — gọi kèm
   credentials:"same-origin" là cookie tự đi theo, không cần token riêng. */

// Đăng nhập sai thì chậm dần lại, để không ai ngồi dò mật khẩu của người khác.
const DO_MS = 15 * 60 * 1000;
const DO_TOI_DA = 8;
const doSai = new Map();
function dangBiChan(khoa) {
  const r = doSai.get(khoa);
  if (!r || Date.now() - r.tu > DO_MS) return false;
  return r.n >= DO_TOI_DA;
}
function ghiSai(khoa) {
  const r = doSai.get(khoa);
  if (!r || Date.now() - r.tu > DO_MS) doSai.set(khoa, { tu: Date.now(), n: 1 });
  else r.n += 1;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, r] of doSai) if (now - r.tu > DO_MS) doSai.delete(k);
}, DO_MS).unref?.();

const ipCua = req => req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || 'unknown';

/** Bọc handler bất đồng bộ: lỗi nào cũng phải ra một câu trả lời, đừng treo. */
function an(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(err => {
    console.error('[english-air/tai-khoan]', req.originalUrl, err);
    if (!res.headersSent) res.status(500).json({ error: 'Có lỗi ở máy chủ, bạn thử lại nhé.' });
  });
}

router.get('/toi', an(async (req, res) => {
  if (!req.user) return res.json({ dangNhap: false });
  res.json({ dangNhap: true, ...tk.goiVe(req.user) });
}));

/** App hỏi máy chủ xem có bật đăng nhập Google không, và bật thì Client ID nào. */
router.get('/google-info', an(async (req, res) => {
  res.json({ bat: tk.coGoogle(), clientId: process.env.GOOGLE_CLIENT_ID || '' });
}));

router.post('/google', express.json(), an(async (req, res) => {
  const kq = await tk.vaoBangGoogle((req.body || {}).token);
  if (kq.loi) return res.status(400).json({ error: kq.loi });
  tk.datCookie(res, kq.user);
  res.json({ dangNhap: true, moi: kq.moi, ...tk.goiVe(kq.user) });
}));

router.post('/dang-ky', express.json(), an(async (req, res) => {
  if (req.user) return res.json({ dangNhap: true, ...tk.goiVe(req.user) });
  const { ten, sdt, matKhau } = req.body || {};
  const kq = await tk.dangKySdt({ ten, sdt, matKhau });
  if (kq.loi) return res.status(400).json({ error: kq.loi });
  tk.datCookie(res, kq.user);
  res.json({ dangNhap: true, ...tk.goiVe(kq.user) });
}));

router.post('/dang-nhap', express.json(), an(async (req, res) => {
  const khoa = ipCua(req);
  if (dangBiChan(khoa)) {
    return res.status(429).json({ error: 'Sai nhiều lần quá. Bạn chờ ít phút rồi thử lại nhé.' });
  }
  const kq = await tk.dangNhapSdt(req.body || {});
  if (kq.loi) { ghiSai(khoa); return res.status(400).json({ error: kq.loi }); }
  doSai.delete(khoa);
  tk.datCookie(res, kq.user);
  res.json({ dangNhap: true, ...tk.goiVe(kq.user) });
}));

router.post('/thoat', an(async (req, res) => {
  res.clearCookie('token');
  res.json({ dangNhap: false });
}));

router.post('/doi-mat-khau', express.json(), an(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  const kq = await tk.doiMatKhau(req.user, req.body || {});
  if (kq.loi) return res.status(400).json({ error: kq.loi });
  res.json({ ok: true });
}));

router.post('/them-email', express.json(), an(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  const kq = await tk.themEmail(req.user, (req.body || {}).email);
  if (kq.loi) return res.status(400).json({ error: kq.loi });
  res.json({ ok: true, email: req.user.email });
}));

/* ═══════════════ TIẾN ĐỘ HỌC ═══════════════
   Giữ theo tài khoản để đổi máy hay cài lại app vẫn còn. Máy gửi bản của nó
   lên, máy chủ GỘP với bản đang giữ rồi trả lại bản đã gộp — không bên nào đè
   bên nào, vì người ta có thể học lúc mất mạng rồi mới đồng bộ. */

router.get('/tien-do', an(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  const goi = await tienDo.doc(req.user.id);
  res.json({ co: !!goi, tienDo: goi || null });
}));

router.put('/tien-do', express.json({ limit: '600kb' }), an(async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  const cuaMay = (req.body || {}).tienDo;
  if (!cuaMay || typeof cuaMay !== 'object') {
    return res.status(400).json({ error: 'Thiếu gói tiến độ.' });
  }
  const daGop = await tienDo.dongBo(req.user.id, cuaMay);
  res.json({ ok: true, tienDo: daGop });
}));

module.exports = router;
