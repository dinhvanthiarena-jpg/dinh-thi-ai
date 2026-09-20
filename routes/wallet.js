const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { WalletTransaction, ToolLicense, Tool } = require('../models');
const wallet = require('../services/walletService');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const [transactions, licenses] = await Promise.all([
    WalletTransaction.findAll({ where: { UserId: req.user.id }, order: [['createdAt', 'DESC']], limit: 30 }),
    ToolLicense.findAll({ where: { UserId: req.user.id }, include: [{ model: Tool, as: 'tool' }], order: [['createdAt', 'DESC']] }),
  ]);
  res.render('wallet/index', {
    title: 'Ví của tôi',
    soDu: wallet.soDu(req.user),
    transactions,
    licenses,
    sanSang: wallet.sanSangNhanTien(),
  });
});

router.post('/nap', async (req, res) => {
  const amount = Number(req.body.amount);
  if (!wallet.sanSangNhanTien()) {
    req.flash('error', 'Chưa cấu hình tài khoản nhận tiền.');
    return res.redirect('/vi');
  }
  try {
    const tx = await wallet.taoDonNapVi(req.user.id, amount);
    res.redirect(`/vi/nap/${tx.code}`);
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/vi');
  }
});

router.get('/nap/:code', async (req, res) => {
  const tx = await WalletTransaction.findOne({ where: { code: req.params.code, UserId: req.user.id } });
  if (!tx) return res.redirect('/vi');
  res.render('wallet/nap', {
    title: 'Nạp tiền vào ví',
    tx,
    qr: wallet.anhQR(tx),
    ck: wallet.thongTinChuyenKhoan(tx),
  });
});

router.get('/nap/:code/trang-thai', async (req, res) => {
  const tx = await WalletTransaction.findOne({ where: { code: req.params.code, UserId: req.user.id } });
  if (!tx) return res.status(404).json({});
  res.json({ status: tx.status, soDu: wallet.soDu(req.user) });
});

module.exports = router;
