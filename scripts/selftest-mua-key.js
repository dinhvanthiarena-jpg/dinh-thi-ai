// Tự kiểm tra luồng KHÁCH TỰ MUA KEY bằng ví (walletService.muaKeyFbai) trên máy chủ thật:
// tạo 2 user thử (người giới thiệu + người mua) → chạy các tình huống → DỌN SẠCH mọi thứ đã tạo
// (user, giao dịch ví, key thử) và khôi phục giá cũ. Chạy: node scripts/selftest-mua-key.js
require('dotenv').config();
const { sequelize } = require('../config/db');
const { User, WalletTransaction } = require('../models');
const wallet = require('../services/walletService');
const fbai = require('../services/fbaiLicenseService');
const pricing = require('../services/fbaiKeyPricing');
const fs = require('fs');
const path = require('path');

const PRICE_FILE = path.join(__dirname, '..', 'data', 'fbai-key-pricing.json');
const KEYS_FILE = path.join(__dirname, '..', 'data', 'fbai-desktop-licenses.json');
const stamp = Date.now();
let pass = 0;
let fail = 0;
const check = (name, ok, extra) => { (ok ? pass++ : fail++); console.log(`${ok ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`); };

(async () => {
  const priceBackup = fs.existsSync(PRICE_FILE) ? fs.readFileSync(PRICE_FILE, 'utf8') : null;
  const users = [];
  try {
    const referrer = await User.create({ name: 'Selftest Referrer', email: `selftest-ref-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student' });
    const buyer = await User.create({ name: 'Selftest Buyer', email: `selftest-buy-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student', parentId: referrer.id, walletBalance: 50000 });
    const other = await User.create({ name: 'Selftest Other', email: `selftest-oth-${stamp}@invalid.test`, password: 'Selftest#12345', role: 'student', walletBalance: 500000 });
    users.push(referrer, buyer, other);

    // 1. Chưa đặt giá -> không bán
    pricing.setPriceVnd(null);
    try { await wallet.muaKeyFbai(buyer); check('chưa đặt giá thì từ chối', false); } catch (e) { check('chưa đặt giá thì từ chối', /chưa mở bán/i.test(e.message)); }

    pricing.setPriceVnd(100000);
    check('đọc lại giá = 100000', pricing.getPriceVnd() === 100000);

    // 2. Thiếu tiền
    try { await wallet.muaKeyFbai(buyer); check('thiếu tiền thì từ chối', false); } catch (e) { check('thiếu tiền thì từ chối', /không đủ/i.test(e.message), e.message); }
    await buyer.reload();
    check('thiếu tiền: ví không bị trừ', buyer.walletBalance === 50000);

    // 3. Đủ tiền -> cấp key mới + hoa hồng
    await buyer.update({ walletBalance: 250000 });
    const r1 = await wallet.muaKeyFbai(buyer);
    await buyer.reload();
    check('mua key: trả về key hợp lệ', fbai.isWellFormed(r1.key) && !r1.giaHan, r1.key);
    check('mua key: ví trừ đúng 100.000đ', buyer.walletBalance === 150000, String(buyer.walletBalance));
    const entry1 = fbai.listKeysByOwner(buyer.id)[0];
    check('key gắn đúng tài khoản + hạn ~30 ngày', entry1 && entry1.ownerUserId === buyer.id && Math.abs(entry1.expiresAt - Date.now() - 30 * 864e5) < 60000);
    check('key kích hoạt được qua checkAndBindDevice', fbai.checkAndBindDevice(r1.key, 'selftest-device', 'selftest').valid === true);
    const txs = await WalletTransaction.findAll({ where: { UserId: buyer.id, relatedType: 'FbaiKey' } });
    check('có 1 giao dịch ví loại FbaiKey', txs.length === 1 && txs[0].amount === -100000);
    const commTx = await WalletTransaction.findAll({ where: { UserId: referrer.id } });
    check('người giới thiệu được ghi hoa hồng', commTx.length >= 1, commTx.map((t) => `${t.type}:${t.amount}`).join(','));

    // 4. Mua tiếp với key đang dùng -> gia hạn (+30 ngày vào hạn còn lại), cùng key
    const r2 = await wallet.muaKeyFbai(buyer, { currentKey: r1.key });
    await buyer.reload();
    check('gia hạn: giữ nguyên key', r2.key === r1.key && r2.giaHan === true);
    check('gia hạn: hạn ~60 ngày', Math.abs(r2.expiresAt - Date.now() - 60 * 864e5) < 60000);
    check('gia hạn: ví còn 50.000đ', buyer.walletBalance === 50000);
    check('gia hạn: vẫn khoá đúng thiết bị cũ', fbai.checkAndBindDevice(r1.key, 'selftest-device').valid === true && fbai.checkAndBindDevice(r1.key, 'device-khac').reason === 'device_mismatch');

    // 5. Người KHÁC cố gia hạn key của buyer -> không được, cấp key MỚI cho người đó
    const r3 = await wallet.muaKeyFbai(other, { currentKey: r1.key });
    check('key người khác: không gia hạn hộ, cấp key mới', r3.key !== r1.key && r3.giaHan === false, r3.key);

    // 6. Key đã bị thu hồi -> không gia hạn, cấp key mới
    fbai.revokeKey(r3.key);
    await other.update({ walletBalance: 200000 });
    const r4 = await wallet.muaKeyFbai(other, { currentKey: r3.key });
    check('key bị thu hồi: cấp key mới', r4.key !== r3.key && r4.giaHan === false);
  } catch (e) {
    fail++;
    console.log('✗ LỖI BẤT NGỜ:', e.stack || e.message);
  } finally {
    // Dọn sạch
    try {
      const ids = users.map((u) => u.id);
      if (ids.length) {
        await WalletTransaction.destroy({ where: { UserId: ids } });
        await User.destroy({ where: { id: ids } });
      }
      const keys = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf8')).filter((k) => !(k.ownerEmail || '').startsWith(`selftest-`));
      fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
      if (priceBackup === null) { try { fs.unlinkSync(PRICE_FILE); } catch (e) {} } else fs.writeFileSync(PRICE_FILE, priceBackup);
      console.log('(đã dọn user/giao dịch/key thử và khôi phục giá cũ)');
    } catch (e) {
      console.log('⚠️ Dọn dẹp lỗi:', e.message);
    }
    console.log(`KẾT QUẢ: ${pass} đạt, ${fail} lỗi`);
    await sequelize.close();
    process.exit(fail ? 1 : 0);
  }
})();
