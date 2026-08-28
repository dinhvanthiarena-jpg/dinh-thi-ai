const express = require('express');
const { ProOrder, User } = require('../models');
const { requireAuth } = require('../middleware/auth');
const pro = require('../services/proService');

const router = express.Router();

/* ---------- Trang bán gói ---------- */
router.get('/', async (req, res) => {
  res.render('pro/index', {
    title: 'Mon.L Pro',
    plans: pro.PLANS,
    dangThuPhi: pro.dangThuPhi(),
    sanSang: pro.sanSangNhanTien(),
    conHan: pro.conHanPro(res.locals.currentUser),
  });
});

/* ---------- Tạo đơn rồi hiện mã QR ---------- */
router.post('/mua', requireAuth, async (req, res) => {
  const plan = String(req.body.plan || '');
  if (!pro.PLANS[plan]) return res.redirect('/pro');
  if (!pro.sanSangNhanTien()) {
    req.flash?.('error', 'Chưa cấu hình tài khoản nhận tiền.');
    return res.redirect('/pro');
  }
  const order = await pro.taoDon(res.locals.currentUser.id, plan);
  res.redirect(`/pro/don/${order.code}`);
});

router.get('/don/:code', requireAuth, async (req, res) => {
  const order = await ProOrder.findOne({ where: { code: req.params.code } });
  if (!order || order.UserId !== res.locals.currentUser.id) return res.redirect('/pro');
  res.render('pro/don', {
    title: 'Thanh toán Mon.L Pro',
    order,
    qr: pro.anhQR(order),
    ck: pro.thongTinChuyenKhoan(order),
    ten: pro.PLANS[order.plan].ten,
  });
});

/** Trang đơn hỏi lại mỗi vài giây xem tiền về chưa. */
router.get('/don/:code/trang-thai', requireAuth, async (req, res) => {
  const order = await ProOrder.findOne({ where: { code: req.params.code } });
  if (!order || order.UserId !== res.locals.currentUser.id) return res.status(404).json({});
  res.json({ status: order.status, proUntil: res.locals.currentUser.proUntil });
});

/* ---------- App Mon.L hỏi xem người này được dùng gì ---------- */
router.get('/api/quyen', (req, res) => {
  const u = res.locals.currentUser;
  res.json({
    thuPhi: pro.dangThuPhi(),
    pro: pro.conHanPro(u),
    duocGoi: pro.duocDung(u),
    proUntil: u ? u.proUntil : null,
  });
});

/* ---------- Ngân hàng báo tiền về ---------- */
/**
 * SePay gọi vào đây mỗi khi tài khoản có tiền vào. Nó gửi kèm
 * `Authorization: Apikey <khoá>` — không khớp khoá thì bỏ qua ngay.
 * Khớp đơn bằng mã nằm trong nội dung chuyển khoản.
 */
router.post('/webhook/sepay', express.json(), async (req, res) => {
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
});

module.exports = router;
