// Tự kiểm tra luồng THANH TOÁN SA-BOTAI trên máy chủ thật: gói gia hạn tháng, gói khởi đầu 3 tháng, key lần đầu 90 ngày,
// hoa hồng, phí tạo web THEO TÊN MIỀN (web đầu tiên miễn phí, sửa lại cùng tên miền miễn phí, tên miền thứ 2 thu phí),
// cấp/gia hạn key theo số tháng, nhật ký đồng ý điều khoản. Tự tạo user thử → chạy → DỌN SẠCH (user, giao dịch, tên miền,
// key, nhật ký) và khôi phục cấu hình giá cũ. Chạy: node scripts/selftest-mua-key.js
require('dotenv').config();
const { Op } = require('sequelize');
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

async function purge() {
  const cu = await User.findAll({ where: { email: { [Op.like]: 'selftest-%@invalid.test' } } });
  for (const u of cu) {
    await WalletTransaction.destroy({ where: { UserId: u.id } });
    await WebsiteDomain.destroy({ where: { UserId: u.id } }).catch(() => {});
    await TermsAcceptance.destroy({ where: { UserId: u.id } }).catch(() => {});
    await u.destroy();
  }
}

(async () => {
  const priceBackup = fs.existsSync(PRICE_FILE) ? fs.readFileSync(PRICE_FILE, 'utf8') : null;
  try {
    await purge();
    // Bảng giá thầy chốt (poster): 199$/3 tháng khởi đầu, 55$/tháng, web mới 35$, tỷ giá 26.100
    const plans = (khoiDauBat) => [
      { id: 'khoi-dau', months: 3, usd: 199, kind: 'first', enabled: khoiDauBat },
      { id: '1-thang', months: 1, usd: 55, enabled: true },
      { id: '2-thang', months: 2, usd: 49, enabled: false },
      { id: '3-thang', months: 3, usd: 149, enabled: false },
      { id: '5-thang', months: 5, usd: 129, enabled: false },
    ];
    pricing.saveConfig({ usdRate: 26100, webFeeUsd: 35, plans: plans(false) });
    const P1 = pricing.getPlan(1).vnd;
    const WEB = pricing.getWebFee().vnd;
    check('quy đổi tỷ giá 26.100: 199$ = 5.193.900đ', pricing.toVnd(199) === 5193900 && pricing.getFirstOffer().vnd === 5193900);
    check('gói tháng 55$ = 1.435.500đ', P1 === 1435500);
    check('phí tạo web 35$ = 913.500đ', WEB === 913500);
    check('gói khởi đầu mặc định KHÔNG tự bán (qua admin/Zalo)', pricing.getPlanById('khoi-dau') === null && pricing.getFirstOffer().autoSell === false);
    check('gói 2/3/5 tháng tắt', pricing.getPlan(2) === null && pricing.getPlan(5) === null);

    const referrer = await User.create({ name: 'Selftest Referrer', email: `selftest-ref-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student' });
    const buyer = await User.create({ name: 'Selftest Buyer', email: `selftest-buy-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student', parentId: referrer.id, walletBalance: 100000 });
    const other = await User.create({ name: 'Selftest Other', email: `selftest-oth-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student', walletBalance: 5000000 });

    // ---- Key do admin cấp theo SỐ THÁNG ----
    const k3 = fbai.issueKey('selftest cap 3 thang', null, 90);
    check('admin cấp key 3 tháng = 90 ngày', Math.abs(k3.expiresAt - Date.now() - 90 * DAY) < 60000);
    const k6 = fbai.issueKey('selftest cap 6 thang', null, 180);
    check('admin cấp key 6 tháng = 180 ngày', Math.abs(k6.expiresAt - Date.now() - 180 * DAY) < 60000);
    const kd = fbai.issueKey('selftest mac dinh');
    check('cấp key mặc định (lần đầu) = 90 ngày', Math.abs(kd.expiresAt - Date.now() - 90 * DAY) < 60000);
    fbai.extendKey(k3.key, null, 60);
    check('gia hạn +2 tháng cộng vào hạn còn lại (90+60)', Math.abs(fbai.listKeys().find((k) => k.key === k3.key).expiresAt - Date.now() - 150 * DAY) < 60000);

    // ---- Key của khách ----
    const k0 = fbai.issueKey('selftest key khach', { userId: buyer.id, email: buyer.email });
    try { await wallet.muaKeyFbai(buyer, { months: 2 }); check('gói chưa bật (2 tháng) bị từ chối', false); } catch (e) { check('gói chưa bật (2 tháng) bị từ chối', /chưa mở bán/i.test(e.message)); }
    try { await wallet.muaKeyFbai(buyer, { planId: 'khoi-dau' }); check('gói khởi đầu chưa bật tự bán thì từ chối', false); } catch (e) { check('gói khởi đầu chưa bật tự bán thì từ chối', /chưa mở bán/i.test(e.message)); }
    try { await wallet.muaKeyFbai(buyer, { months: 1 }); check('thiếu tiền thì từ chối', false); } catch (e) { check('thiếu tiền thì từ chối', /không đủ/i.test(e.message) && e.thieu === P1 - 100000, `thiếu ${e.thieu}`); }
    await buyer.reload();
    check('thiếu tiền: ví không bị trừ', buyer.walletBalance === 100000);

    await buyer.update({ walletBalance: 6000000 });
    const r1 = await wallet.muaKeyFbai(buyer, { months: 1, currentKey: k0.key });
    await buyer.reload();
    check('gia hạn 1 tháng: giữ key, +30 ngày vào hạn còn lại (90+30)', r1.key === k0.key && r1.giaHan && Math.abs(r1.expiresAt - Date.now() - 120 * DAY) < 60000);
    check('gia hạn 1 tháng: ví trừ đúng giá gói', buyer.walletBalance === 6000000 - P1, String(buyer.walletBalance));

    // Bật bán tự động gói khởi đầu: key MỚI 90 ngày
    pricing.saveConfig({ plans: plans(true) });
    const rk = await wallet.muaKeyFbai(buyer, { planId: 'khoi-dau' });
    check('gói khởi đầu (đã bật): cấp key MỚI 90 ngày, trừ 5.193.900đ', !rk.giaHan && rk.key !== k0.key && Math.abs(rk.expiresAt - Date.now() - 90 * DAY) < 60000 && rk.gia === 5193900, String(rk.gia));
    pricing.saveConfig({ plans: plans(false) });

    const commTx = await WalletTransaction.findAll({ where: { UserId: referrer.id } });
    check('người giới thiệu được ghi hoa hồng', commTx.length >= 2, commTx.map((t) => `${t.type}:${t.amount}`).join(','));
    check('key kích hoạt được + khoá đúng 1 thiết bị', fbai.checkAndBindDevice(k0.key, 'dev-a', 'a').valid === true && fbai.checkAndBindDevice(k0.key, 'dev-b').reason === 'device_mismatch');
    check('verify trả về hạn dùng (expiresAt)', typeof fbai.checkAndBindDevice(k0.key, 'dev-a').expiresAt === 'number');

    // ---- Phí tạo web theo TÊN MIỀN ----
    const mf1 = await wallet.xemPhiTaoWeb(buyer, 'https://www.Abc.com/trang', k0.key);
    check('xem trước: tên miền đầu tiên + có key → miễn phí', mf1.mienPhi && mf1.lyDo === 'web_dau_tien' && mf1.domain === 'abc.com');
    const a1 = await wallet.thuPhiTaoWeb(buyer, 'abc.com', { licenseKey: k0.key });
    check('tạo web #1 (tên miền đầu tiên): miễn phí', a1.mienPhi && a1.lyDo === 'web_dau_tien' && a1.amountVnd === 0);
    const bal0 = (await User.findByPk(buyer.id)).walletBalance;
    const a2 = await wallet.thuPhiTaoWeb(buyer, 'WWW.abc.com', { licenseKey: k0.key });
    check('đưa lại CÙNG tên miền: miễn phí, đếm lần đưa lên', a2.mienPhi && a2.lyDo === 'cung_ten_mien' && (await WebsiteDomain.findOne({ where: { UserId: buyer.id, domain: 'abc.com' } })).deployCount === 2);
    const a3 = await wallet.thuPhiTaoWeb(buyer, 'xyz.vn', { licenseKey: k0.key });
    const bal1 = (await User.findByPk(buyer.id)).walletBalance;
    check('tên miền THỨ 2: thu 913.500đ', !a3.mienPhi && a3.amountVnd === WEB && bal0 - bal1 === WEB, `thu ${a3.amountVnd}`);
    const a4 = await wallet.thuPhiTaoWeb(buyer, 'xyz.vn', { licenseKey: k0.key });
    check('sửa lại tên miền thứ 2 đã trả phí: miễn phí', a4.mienPhi && a4.lyDo === 'cung_ten_mien');
    await buyer.update({ walletBalance: 100000 });
    try { await wallet.thuPhiTaoWeb(buyer, 'moi.com', { licenseKey: k0.key }); check('tên miền mới khi thiếu tiền bị chặn', false); } catch (e) { check('tên miền mới khi thiếu tiền bị chặn + báo số cần nạp', e.thieu === WEB - 100000, `thiếu ${e.thieu}`); }
    check('thiếu tiền thì KHÔNG ghi nhận tên miền', !(await WebsiteDomain.findOne({ where: { UserId: buyer.id, domain: 'moi.com' } })));
    await wallet.thuPhiTaoWeb(other, 'khongkey.com', { licenseKey: '' });
    const otherDom = await WebsiteDomain.findOne({ where: { UserId: other.id, domain: 'khongkey.com' } });
    check('không có key: web đầu tiên cũng thu phí', otherDom && otherDom.feeVnd === WEB);
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
      await purge();
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
