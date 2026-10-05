// Tự kiểm tra luồng THANH TOÁN SA-BOTAI trên máy chủ thật: gói gia hạn theo tháng, key lần đầu 90 ngày, hoa hồng,
// phí tạo web THEO TÊN MIỀN (web đầu tiên miễn phí, sửa lại cùng tên miền miễn phí, tên miền thứ 2 thu 910.000đ),
// nhật ký đồng ý điều khoản. Tự tạo user thử → chạy → DỌN SẠCH (user, giao dịch, tên miền, key, nhật ký) và khôi phục
// cấu hình giá cũ. Chạy: node scripts/selftest-mua-key.js
require('dotenv').config();
const { sequelize } = require('../config/db');
const { User, WalletTransaction, WebsiteDomain, TermsAcceptance } = require('../models');
const wallet = require('../services/walletService');
const fbai = require('../services/fbaiLicenseService');
const pricing = require('../services/fbaiKeyPricing');
const terms = require('../services/termsService');
const fs = require('fs');
const path = require('path');

const PRICE_FILE = path.join(__dirname, '..', 'data', 'fbai-pricing.json');
const KEYS_FILE = path.join(__dirname, '..', 'data', 'fbai-desktop-licenses.json');
const stamp = Date.now();
const DAY = 864e5;
let pass = 0;
let fail = 0;
const check = (name, ok, extra) => { (ok ? pass++ : fail++); console.log(`${ok ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`); };

(async () => {
  const priceBackup = fs.existsSync(PRICE_FILE) ? fs.readFileSync(PRICE_FILE, 'utf8') : null;
  const users = [];
  try {
    // Bảng giá thầy chốt
    pricing.saveConfig({ webFeeUsd: 35, plans: [{ months: 1, usd: 55, enabled: true }, { months: 2, usd: 49, enabled: false }, { months: 3, usd: 149, enabled: true }, { months: 5, usd: 129, enabled: false }] });
    check('đổi USD→VNĐ cố định 26.000: 55$ = 1.430.000đ', pricing.toVnd(55) === 1430000);
    check('3 tháng 149$ = 3.874.000đ', pricing.getPlan(3).vnd === 3874000 && pricing.getPlan(3).days === 90);
    check('phí tạo web 35$ = 910.000đ', pricing.getWebFee().vnd === 910000);
    check('gói 2 và 5 tháng đang tắt (chưa bán)', pricing.getPlan(2) === null && pricing.getPlan(5) === null);

    const referrer = await User.create({ name: 'Selftest Referrer', email: `selftest-ref-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student' });
    const buyer = await User.create({ name: 'Selftest Buyer', email: `selftest-buy-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student', parentId: referrer.id, walletBalance: 100000 });
    const other = await User.create({ name: 'Selftest Other', email: `selftest-oth-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student', walletBalance: 5000000 });
    users.push(referrer, buyer, other);

    // ---- Key lần đầu = 90 ngày ----
    const k0 = fbai.issueKey('selftest key lan dau', { userId: buyer.id, email: buyer.email });
    check('key cấp lần đầu chạy 90 ngày', Math.abs(k0.expiresAt - Date.now() - 90 * DAY) < 60000);

    // ---- Gói gia hạn ----
    try { await wallet.muaKeyFbai(buyer, { months: 2 }); check('gói chưa bật (2 tháng) bị từ chối', false); } catch (e) { check('gói chưa bật (2 tháng) bị từ chối', /chưa mở bán/i.test(e.message)); }
    try { await wallet.muaKeyFbai(buyer, { months: 1 }); check('thiếu tiền thì từ chối', false); } catch (e) { check('thiếu tiền thì từ chối', /không đủ/i.test(e.message) && e.thieu === 1330000, `thiếu ${e.thieu}`); }
    await buyer.reload();
    check('thiếu tiền: ví không bị trừ', buyer.walletBalance === 100000);

    await buyer.update({ walletBalance: 5000000 });
    const r1 = await wallet.muaKeyFbai(buyer, { months: 1, currentKey: k0.key });
    await buyer.reload();
    check('gia hạn 1 tháng: giữ key, +30 ngày vào hạn còn lại (90+30)', r1.key === k0.key && r1.giaHan && Math.abs(r1.expiresAt - Date.now() - 120 * DAY) < 60000);
    check('gia hạn 1 tháng: ví trừ 1.430.000đ', buyer.walletBalance === 5000000 - 1430000, String(buyer.walletBalance));
    const r3 = await wallet.muaKeyFbai(buyer, { months: 3 });
    check('mua 3 tháng khi chưa gửi key: cấp key MỚI 90 ngày', !r3.giaHan && r3.key !== k0.key && Math.abs(r3.expiresAt - Date.now() - 90 * DAY) < 60000);
    const commTx = await WalletTransaction.findAll({ where: { UserId: referrer.id } });
    check('người giới thiệu được ghi hoa hồng', commTx.length >= 2, commTx.map((t) => `${t.type}:${t.amount}`).join(','));
    check('key kích hoạt được + khoá đúng 1 thiết bị', fbai.checkAndBindDevice(k0.key, 'dev-a', 'a').valid === true && fbai.checkAndBindDevice(k0.key, 'dev-b').reason === 'device_mismatch');
    check('verify trả về hạn dùng (expiresAt) để tool báo trước khi tạm ngừng', typeof fbai.checkAndBindDevice(k0.key, 'dev-a').expiresAt === 'number');

    // ---- Phí tạo web theo TÊN MIỀN ----
    const mf1 = await wallet.xemPhiTaoWeb(buyer, 'https://www.Abc.com/trang', k0.key);
    check('xem trước: tên miền đầu tiên + có key → miễn phí', mf1.mienPhi && mf1.lyDo === 'web_dau_tien' && mf1.domain === 'abc.com');
    const a1 = await wallet.thuPhiTaoWeb(buyer, 'abc.com', { licenseKey: k0.key });
    check('tạo web #1 (tên miền đầu tiên): miễn phí', a1.mienPhi && a1.lyDo === 'web_dau_tien' && a1.amountVnd === 0);
    const bal0 = (await User.findByPk(buyer.id)).walletBalance;
    const a2 = await wallet.thuPhiTaoWeb(buyer, 'WWW.abc.com', { licenseKey: k0.key });
    check('đưa lại CÙNG tên miền (sửa tới khi hài lòng): miễn phí, đếm lần đưa lên', a2.mienPhi && a2.lyDo === 'cung_ten_mien' && (await WebsiteDomain.findOne({ where: { UserId: buyer.id, domain: 'abc.com' } })).deployCount === 2);
    const a3 = await wallet.thuPhiTaoWeb(buyer, 'xyz.vn', { licenseKey: k0.key });
    const bal1 = (await User.findByPk(buyer.id)).walletBalance;
    check('tên miền THỨ 2: thu 910.000đ', !a3.mienPhi && a3.amountVnd === 910000 && bal0 - bal1 === 910000, `thu ${a3.amountVnd}`);
    const a4 = await wallet.thuPhiTaoWeb(buyer, 'xyz.vn', { licenseKey: k0.key });
    check('sửa lại tên miền thứ 2 đã trả phí: miễn phí', a4.mienPhi && a4.lyDo === 'cung_ten_mien');
    await buyer.update({ walletBalance: 100000 });
    try { await wallet.thuPhiTaoWeb(buyer, 'moi.com', { licenseKey: k0.key }); check('tên miền mới khi thiếu tiền bị chặn', false); } catch (e) { check('tên miền mới khi thiếu tiền bị chặn + báo số cần nạp', e.thieu === 810000, `thiếu ${e.thieu}`); }
    check('thiếu tiền thì KHÔNG ghi nhận tên miền', !(await WebsiteDomain.findOne({ where: { UserId: buyer.id, domain: 'moi.com' } })));
    try { await wallet.thuPhiTaoWeb(other, 'khongkey.com', { licenseKey: '' }); check('không có key: web đầu tiên KHÔNG miễn phí (có tiền thì thu phí)', true); } catch (e) { check('không có key thì web đầu tiên thu phí', false, e.message); }
    const otherDom = await WebsiteDomain.findOne({ where: { UserId: other.id, domain: 'khongkey.com' } });
    check('không key: đã thu 910.000đ chứ không miễn phí', otherDom && otherDom.feeVnd === 910000);
    try { await wallet.thuPhiTaoWeb(buyer, 'khong hop le', { licenseKey: k0.key }); check('tên miền sai định dạng bị từ chối', false); } catch (e) { check('tên miền sai định dạng bị từ chối', /tên miền hợp lệ/i.test(e.message)); }

    // ---- Nhật ký đồng ý điều khoản ----
    const fakeReq = { headers: { 'x-forwarded-for': '203.0.113.9, 10.0.0.1', 'user-agent': 'selftest-agent' }, ip: '127.0.0.1' };
    await terms.ghiDongY(buyer.id, fakeReq, 'login-gate');
    check('đồng ý điều khoản: ghi IP thật + phiên bản', (await terms.daDongY(buyer.id)) && (await TermsAcceptance.findOne({ where: { UserId: buyer.id } })).ip === '203.0.113.9');
    check('chưa đồng ý thì daDongY = false', (await terms.daDongY(other.id)) === false);
  } catch (e) {
    fail++;
    console.log('✗ LỖI BẤT NGỜ:', e.stack || e.message);
  } finally {
    try {
      const ids = users.map((u) => u.id);
      if (ids.length) {
        await WalletTransaction.destroy({ where: { UserId: ids } });
        await WebsiteDomain.destroy({ where: { UserId: ids } });
        await TermsAcceptance.destroy({ where: { UserId: ids } });
        await User.destroy({ where: { id: ids } });
      }
      const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8')).filter((k) => !((k.ownerEmail || '').startsWith('selftest-') || (k.note || '').startsWith('selftest')));
      fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
      if (priceBackup === null) { try { fs.unlinkSync(PRICE_FILE); } catch (e) {} } else fs.writeFileSync(PRICE_FILE, priceBackup);
      console.log('(đã dọn user/giao dịch/tên miền/key thử và khôi phục cấu hình giá cũ)');
    } catch (e) {
      console.log('⚠️ Dọn dẹp lỗi:', e.message);
    }
    console.log(`KẾT QUẢ: ${pass} đạt, ${fail} lỗi`);
    await sequelize.close();
    process.exit(fail ? 1 : 0);
  }
})();
