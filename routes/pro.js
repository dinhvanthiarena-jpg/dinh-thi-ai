const express = require('express');
const { ProOrder, User } = require('../models');
const { requireAuth } = require('../middleware/auth');
const pro = require('../services/proService');

const router = express.Router();

/**
 * Dự án này không có lớp bắt lỗi cho route bất đồng bộ: một lỗi ném ra trong
 * handler async sẽ thành unhandledRejection, request KHÔNG BAO GIỜ được trả lời,
 * và trình duyệt cứ quay mãi. Bọc mọi handler ở đây lại để lỗi nào cũng ra một
 * câu trả lời — thà báo hỏng còn hơn treo.
 */
function an(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('[pro]', req.method, req.originalUrl, err);
      if (res.headersSent) return;
      const admin = res.locals.currentUser && res.locals.currentUser.role === 'admin';
      const chiTiet = admin ? ' — ' + err.message : '';
      if (req.path.startsWith('/api/') || req.xhr) {
        return res.status(500).json({ error: 'Có lỗi ở máy chủ' + chiTiet });
      }
      res.status(500).send(
        '<p style="font:16px system-ui;padding:2rem">Có lỗi ở máy chủ' + chiTiet +
        '. <a href="/pro">Thử lại</a></p>'
      );
    });
  };
}

/* ---------- Trang bán gói ---------- */
async function veTrangPro(req, res, loiNhom) {
  const u = res.locals.currentUser;
  const maNhom = u && u.familyCode ? u.familyCode : '';
  res.render('pro/index', {
    title: 'Mon.L Pro',
    plans: pro.PLANS,
    giaThang: {
      month: pro.giaMoiThang('month'),
      year: pro.giaMoiThang('year'),
      family: pro.giaMoiThang('family'),
    },
    trialDays: pro.NGAY_DUNG_THU,
    toiDaNhom: pro.TOI_DA_GIA_DINH,
    dangThuPhi: pro.dangThuPhi(),
    sanSang: pro.sanSangNhanTien(),
    conHan: pro.conHanPro(u),
    duocDungThu: Boolean(u) && !u.trialUsed && !pro.conHanPro(u),
    maNhom,
    soThanhVien: maNhom ? (await pro.nguoiTrongNhom(maNhom)).length : 0,
    loiNhom: loiNhom || '',
  });
}

router.get('/', an((req, res) => veTrangPro(req, res)));

/* ---------- Dùng thử 7 ngày, không giữ thẻ, không tự trừ tiền ---------- */
router.post('/dung-thu', requireAuth, an(async (req, res) => {
  await pro.batDungThu(res.locals.currentUser);
  res.redirect('/pro');
}));

/* ---------- Vào nhóm gia đình bằng mã người nhà gửi ---------- */
router.post('/vao-nhom', requireAuth, an(async (req, res) => {
  const kq = await pro.vaoNhom(res.locals.currentUser, req.body.ma);
  if (kq.loi) return veTrangPro(req, res, kq.loi);
  res.redirect('/pro');
}));

/* ---------- Tạo đơn rồi hiện mã QR ---------- */
router.post('/mua', requireAuth, an(async (req, res) => {
  const plan = String(req.body.plan || '');
  if (!pro.PLANS[plan]) return res.redirect('/pro');
  if (!pro.sanSangNhanTien()) {
    req.flash?.('error', 'Chưa cấu hình tài khoản nhận tiền.');
    return res.redirect('/pro');
  }
  const order = await pro.taoDon(res.locals.currentUser.id, plan);
  res.redirect(`/pro/don/${order.code}`);
}));

router.get('/don/:code', requireAuth, an(async (req, res) => {
  const order = await ProOrder.findOne({ where: { code: req.params.code } });
  if (!order || order.UserId !== res.locals.currentUser.id) return res.redirect('/pro');
  res.render('pro/don', {
    title: 'Thanh toán Mon.L Pro',
    order,
    qr: pro.anhQR(order),
    ck: pro.thongTinChuyenKhoan(order),
    ten: pro.PLANS[order.plan].ten,
  });
}));

/** Trang đơn hỏi lại mỗi vài giây xem tiền về chưa. */
router.get('/don/:code/trang-thai', requireAuth, an(async (req, res) => {
  const order = await ProOrder.findOne({ where: { code: req.params.code } });
  if (!order || order.UserId !== res.locals.currentUser.id) return res.status(404).json({});
  res.json({ status: order.status, proUntil: res.locals.currentUser.proUntil });
}));

/* ---------- App Mon.L hỏi xem người này được dùng gì ---------- */
router.get('/api/quyen', an((req, res) => {
  const u = res.locals.currentUser;
  res.json({
    thuPhi: pro.dangThuPhi(),
    pro: pro.conHanPro(u),
    duocGoi: pro.duocDung(u),
    proUntil: u ? u.proUntil : null,
  });
}));

/* ══════════════════════════════════════════════════════════════
   API cho app Mon.L — bán gói ngay trong app, không phải nhảy ra web.
   App và web cùng một tên miền nên dùng chung phiên đăng nhập, chỉ cần
   gọi kèm credentials: "same-origin".
   ══════════════════════════════════════════════════════════════ */

/** Một lần gọi là app đủ dữ liệu vẽ cả màn hình bán gói. */
router.get('/api/goi', an(async (req, res) => {
  const u = res.locals.currentUser;
  const maNhom = u && u.familyCode ? u.familyCode : '';
  const ds = Object.entries(pro.PLANS).map(([ma, g]) => ({
    ma,
    ten: g.ten,
    tien: g.amount,
    thang: g.months,
    nguoi: g.nguoi,
    moiThang: pro.giaMoiThang(ma),
  }));
  res.json({
    dangNhap: Boolean(u),
    ten: u ? u.name : '',
    thuPhi: pro.dangThuPhi(),
    sanSang: pro.sanSangNhanTien(),
    pro: pro.conHanPro(u),
    proUntil: u ? u.proUntil : null,
    duocDungThu: Boolean(u) && !u.trialUsed && !pro.conHanPro(u),
    ngayDungThu: pro.NGAY_DUNG_THU,
    toiDaNhom: pro.TOI_DA_GIA_DINH,
    maNhom,
    soThanhVien: maNhom ? (await pro.nguoiTrongNhom(maNhom)).length : 0,
    goi: ds,
  });
}));

/** Chưa đăng nhập thì trả 401 kèm đường dẫn, app tự mở trang đăng nhập. */
function canDangNhap(req, res) {
  if (res.locals.currentUser) return false;
  res.status(401).json({ error: 'Cần đăng nhập', dangNhap: '/auth/login?next=/english-air/' });
  return true;
}

router.post('/api/mua', express.json(), an(async (req, res) => {
  if (canDangNhap(req, res)) return;
  const plan = String((req.body || {}).plan || '');
  if (!pro.PLANS[plan]) return res.status(400).json({ error: 'Gói không hợp lệ' });
  if (!pro.sanSangNhanTien()) {
    return res.status(503).json({ error: 'Chưa cấu hình tài khoản nhận tiền.' });
  }
  const order = await pro.taoDon(res.locals.currentUser.id, plan);
  res.json({
    code: order.code,
    tien: order.amount,
    ten: pro.PLANS[plan].ten,
    qr: pro.anhQR(order),
    ck: pro.thongTinChuyenKhoan(order),
    tuDong: pro.tuDongDoiSoat(),
  });
}));

router.get('/api/don/:code', an(async (req, res) => {
  if (canDangNhap(req, res)) return;
  const order = await ProOrder.findOne({ where: { code: req.params.code } });
  if (!order || order.UserId !== res.locals.currentUser.id) {
    return res.status(404).json({ error: 'Không tìm thấy đơn' });
  }
  res.json({ status: order.status, proUntil: res.locals.currentUser.proUntil });
}));

router.post('/api/dung-thu', express.json(), an(async (req, res) => {
  if (canDangNhap(req, res)) return;
  const kq = await pro.batDungThu(res.locals.currentUser);
  if (kq.loi) return res.status(400).json({ error: kq.loi });
  res.json({ ok: true, hetHan: kq.hetHan });
}));

router.post('/api/vao-nhom', express.json(), an(async (req, res) => {
  if (canDangNhap(req, res)) return;
  const kq = await pro.vaoNhom(res.locals.currentUser, (req.body || {}).ma);
  if (kq.loi) return res.status(400).json({ error: kq.loi });
  res.json({ ok: true, hetHan: kq.hetHan });
}));

/* ---------- Ngân hàng báo tiền về ---------- */
/**
 * SePay gọi vào đây mỗi khi tài khoản có tiền vào. Nó gửi kèm
 * `Authorization: Apikey <khoá>` — không khớp khoá thì bỏ qua ngay.
 * Khớp đơn bằng mã nằm trong nội dung chuyển khoản.
 */
router.post('/webhook/sepay', express.json(), an(async (req, res) => {
  const key = process.env.SEPAY_WEBHOOK_KEY;
  const gui = String(req.headers.authorization || '').replace(/^Apikey\s+/i, '').trim();
  if (!key || gui !== key) return res.status(401).json({ success: false });

  try {
    const b = req.body || {};
    const noiDung = String(b.content || b.description || '').toUpperCase();
    const vao = Number(b.transferAmount || b.amount || 0);
    const chieu = String(b.transferType || 'in').toLowerCase();
    if (chieu !== 'in' || vao <= 0) return res.json({ success: true, bo_qua: 'không phải tiền vào' });

    const ma = (noiDung.match(/MONL[A-Z0-9]{6}/) || [])[0];
    if (!ma) return res.json({ success: true, bo_qua: 'nội dung không có mã đơn' });

    const order = await ProOrder.findOne({ where: { code: ma } });
    if (!order) return res.json({ success: true, bo_qua: 'không có đơn nào mang mã này' });
    if (order.status === 'paid') return res.json({ success: true, bo_qua: 'đơn đã ghi nhận rồi' });

    // Chuyển thiếu tiền thì để đó cho thầy xem, đừng tự mở gói.
    if (vao < order.amount) {
      await order.update({
        bankAmount: vao,
        bankRef: String(b.referenceCode || b.id || ''),
        rawPayload: JSON.stringify(b).slice(0, 4000),
      });
      return res.json({ success: true, bo_qua: 'chuyển thiếu tiền' });
    }

    await pro.ghiNhanDaTra(order, {
      bankRef: String(b.referenceCode || b.id || ''),
      bankAmount: vao,
      raw: b,
      boi: 'sepay',
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('[pro/webhook]', err.message);
    return res.status(500).json({ success: false });
  }
}));

module.exports = router;
