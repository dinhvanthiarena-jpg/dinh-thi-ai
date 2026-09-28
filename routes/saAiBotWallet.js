// API ví tiền DÀNH RIÊNG cho tool desktop SA-AI BOT — trả JSON thuần, dùng
// LẠI toàn bộ walletService.js đã có sẵn cho web (cùng 1 ví, cùng 1 bảng
// WalletTransaction, cùng trang admin/wallet để thầy duyệt nạp tiền — không
// tạo ví riêng cho tool, tool chỉ là 1 cách nạp/xem ví khác của đúng tài
// khoản đó).
const express = require('express');
const router = express.Router();
const { WalletTransaction } = require('../models');
const wallet = require('../services/walletService');
const { requireBearerAuth } = require('./saAiBotAuth');

function an(fn) {
  return function (req, res) {
    Promise.resolve(fn(req, res)).catch((err) => {
      console.error('[sa-ai-bot-wallet]', req.path, err);
      res.status(500).json({ error: 'Có lỗi ở máy chủ, thử lại sau.' });
    });
  };
}

router.use(requireBearerAuth);

router.get('/', an(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findByPk(req.authUser.id);
  if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
  const transactions = await WalletTransaction.findAll({
    where: { UserId: user.id },
    order: [['createdAt', 'DESC']],
    limit: 20,
  });
  res.json({
    ok: true,
    soDu: wallet.soDu(user),
    sanSang: wallet.sanSangNhanTien(),
    transactions: transactions.map((t) => ({
      code: t.code,
      type: t.type,
      amount: t.amount,
      status: t.status,
      description: t.description,
      createdAt: t.createdAt,
    })),
  });
}));

router.post('/nap', express.json(), an(async (req, res) => {
  if (!wallet.sanSangNhanTien()) {
    return res.status(400).json({ error: 'Chưa cấu hình tài khoản nhận tiền, liên hệ thầy Đinh Thi Ai.' });
  }
  const amount = Number((req.body || {}).amount);
  try {
    const tx = await wallet.taoDonNapVi(req.authUser.id, amount);
    res.json({
      ok: true,
      code: tx.code,
      amount: tx.amount,
      status: tx.status,
      qr: wallet.anhQR(tx),
      ck: wallet.thongTinChuyenKhoan(tx),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}));

router.get('/nap/:code', an(async (req, res) => {
  const tx = await WalletTransaction.findOne({ where: { code: req.params.code, UserId: req.authUser.id } });
  if (!tx) return res.status(404).json({ error: 'Không tìm thấy giao dịch.' });
  res.json({
    ok: true,
    code: tx.code,
    amount: tx.amount,
    status: tx.status,
    qr: wallet.anhQR(tx),
    ck: wallet.thongTinChuyenKhoan(tx),
  });
}));

router.get('/nap/:code/trang-thai', an(async (req, res) => {
  const User = require('../models/User');
  const tx = await WalletTransaction.findOne({ where: { code: req.params.code, UserId: req.authUser.id } });
  if (!tx) return res.status(404).json({ error: 'Không tìm thấy giao dịch.' });
  const user = await User.findByPk(req.authUser.id);
  res.json({ ok: true, status: tx.status, soDu: wallet.soDu(user) });
}));

module.exports = router;
