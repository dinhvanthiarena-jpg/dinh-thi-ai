// API ví tiền DÀNH RIÊNG cho tool desktop SA-AI BOT — trả JSON thuần, dùng
// LẠI toàn bộ walletService.js đã có sẵn cho web (cùng 1 ví, cùng 1 bảng
// WalletTransaction, cùng trang admin/wallet để thầy duyệt nạp tiền — không
// tạo ví riêng cho tool, tool chỉ là 1 cách nạp/xem ví khác của đúng tài
// khoản đó).
const express = require('express');
const router = express.Router();
const { WalletTransaction } = require('../models');
const wallet = require('../services/walletService');
const exchangeRate = require('../services/exchangeRateService');
const fbaiLicense = require('../services/fbaiLicenseService');
const fbaiKeyPricing = require('../services/fbaiKeyPricing');
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
    websiteBuildCredits: user.websiteBuildCredits || 0,
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

// Xem trước phí tạo web (không trừ tiền) — để tool hiện giá cho khách TRƯỚC
// khi họ bấm nút tạo web thật.
router.get('/website-build-fee', an(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findByPk(req.authUser.id);
  if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
  const r = await wallet.xemPhiTaoWeb(user, req.query.domain, String(req.query.key || '').slice(0, 40));
  res.json({ ok: true, ...r });
}));

// Xem trước giá GÓI nhiều web (tỷ giá CỐ ĐỊNH, đã gồm thuế, giảm theo số
// lượng) — không trừ tiền, chỉ để tool hiện bảng giá cho khách chọn số
// lượng trước khi quyết định mua.
router.get('/website-build-package-price', an(async (req, res) => {
  const qty = Math.max(1, Math.min(50, parseInt(req.query.qty, 10) || 1));
  const donGiaUsd = wallet.donGiaTaoWebTheoSoLuong(qty);
  const tongUsd = donGiaUsd * qty;
  const tongVnd = Math.round(tongUsd * wallet.TY_GIA_CO_DINH_GOI_WEB);
  const phanTramGiam = Math.round((1 - donGiaUsd / wallet.PHI_TAO_WEB_USD) * 100);
  res.json({ ok: true, qty, donGiaUsd, tongUsd, tongVnd, phanTramGiam, usdRate: wallet.TY_GIA_CO_DINH_GOI_WEB });
}));

// Tạo đơn mua gói — trả về QR giống hệt nạp ví, chỉ khác nội dung mô tả.
router.post('/buy-website-build-package', express.json(), an(async (req, res) => {
  if (!wallet.sanSangNhanTien()) {
    return res.status(400).json({ error: 'Chưa cấu hình tài khoản nhận tiền, liên hệ thầy Đinh Thi Ai.' });
  }
  const qty = parseInt((req.body || {}).qty, 10);
  try {
    const { tx, donGiaUsd, tongUsd, tongVnd } = await wallet.taoDonMuaGoiTaoWeb(req.authUser.id, qty);
    res.json({
      ok: true,
      code: tx.code,
      qty,
      donGiaUsd,
      tongUsd,
      amount: tongVnd,
      status: tx.status,
      qr: wallet.anhQR(tx),
      ck: wallet.thongTinChuyenKhoan(tx),
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}));

// "24h ra web" — thu phí $50 (quy đổi VNĐ theo tỷ giá thị trường lúc gọi)
// trực tiếp từ ví, TRƯỚC KHI tool thật sự chạy SSH deploy — tool chỉ được
// tiến hành deploy khi endpoint này trả ok:true.
router.post('/charge-website-build', express.json(), an(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findByPk(req.authUser.id);
  if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
  const { domain, licenseKey } = req.body || {};
  try {
    const result = await wallet.thuPhiTaoWeb(user, domain, { licenseKey: String(licenseKey || '').slice(0, 40) });
    res.json({
      ok: true,
      amountVnd: result.amountVnd,
      usdRate: result.usdRate,
      soDuConLai: result.balanceAfter,
      dungCredit: !!result.dungCredit,
      creditsConLai: result.creditsConLai,
      mienPhi: !!result.mienPhi,
      lyDo: result.lyDo,
      domain: result.domain,
    });
  } catch (err) {
    res.status(400).json({ error: err.message, thieu: err.thieu || 0 });
  }
}));

// Bảng giá SA-BOTAI (gia hạn theo gói tháng + phí tạo web mới) + số dư ví + key của tài khoản này.
// Giá USD đổi VNĐ theo tỷ giá CỐ ĐỊNH 26.000đ/$. plans rỗng = thầy chưa bật gói nào -> tool chỉ hiện "nhắn Zalo".
router.get('/key-info', an(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findByPk(req.authUser.id);
  if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
  res.json({
    ok: true,
    plans: fbaiKeyPricing.getPlans(),
    firstOffer: fbaiKeyPricing.getFirstOffer(),
    webFee: fbaiKeyPricing.getWebFee(),
    firstKeyDays: fbaiKeyPricing.FIRST_KEY_DAYS,
    soDu: wallet.soDu(user),
    sanSang: wallet.sanSangNhanTien(),
    refCode: user.refCode || '',
    keys: fbaiLicense.listKeysByOwner(user.id).map((k) => ({ key: k.key, expiresAt: k.expiresAt, active: k.active !== false })),
  });
}));

// Khách TỰ MUA/GIA HẠN bằng số dư ví: trừ tiền -> tự cấp (hoặc cộng ngày vào key đang dùng) -> tool tự kích hoạt.
router.post('/mua-key', express.json(), an(async (req, res) => {
  const User = require('../models/User');
  const user = await User.findByPk(req.authUser.id);
  if (!user) return res.status(401).json({ error: 'Tài khoản không còn tồn tại.' });
  const currentKey = String((req.body || {}).currentKey || '').slice(0, 40);
  const months = parseInt((req.body || {}).months, 10) || 1;
  const planId = String((req.body || {}).planId || '').slice(0, 20);
  try {
    const r = await wallet.muaKeyFbai(user, { currentKey, months, planId: planId || undefined });
    res.json({ ok: true, key: r.key, expiresAt: r.expiresAt, giaHan: r.giaHan, soDuConLai: r.soDuConLai, gia: r.gia, months: r.months });
  } catch (err) {
    res.status(400).json({ error: err.message, thieu: err.thieu || 0 });
  }
}));

// Chưa có tiền trong ví: tạo đơn QR mua thẳng gói tháng — tiền về là hệ thống TỰ mua/gia hạn (xem ghiNhanNapVi).
router.post('/mua-key-qr', express.json(), an(async (req, res) => {
  if (!wallet.sanSangNhanTien()) {
    return res.status(400).json({ error: 'Chưa cấu hình tài khoản nhận tiền, liên hệ thầy Đinh Thi Ai.' });
  }
  const months = parseInt((req.body || {}).months, 10) || 1;
  const currentKey = String((req.body || {}).currentKey || '').slice(0, 24);
  const planId = String((req.body || {}).planId || '').slice(0, 20);
  try {
    const { tx, goi } = await wallet.taoDonMuaGoiKey(req.authUser.id, months, currentKey, planId || undefined);
    res.json({ ok: true, code: tx.code, months: goi.months, amount: tx.amount, status: tx.status, qr: wallet.anhQR(tx), ck: wallet.thongTinChuyenKhoan(tx) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}));

router.get('/nap/:code/trang-thai', an(async (req, res) => {
  const User = require('../models/User');
  const tx = await WalletTransaction.findOne({ where: { code: req.params.code, UserId: req.authUser.id } });
  if (!tx) return res.status(404).json({ error: 'Không tìm thấy giao dịch.' });
  const user = await User.findByPk(req.authUser.id);
  res.json({
    ok: true,
    status: tx.status,
    soDu: wallet.soDu(user),
    websiteBuildCredits: user.websiteBuildCredits || 0,
    keys: fbaiLicense.listKeysByOwner(user.id).map((k) => ({ key: k.key, expiresAt: k.expiresAt, active: k.active !== false })),
  });
}));

module.exports = router;
