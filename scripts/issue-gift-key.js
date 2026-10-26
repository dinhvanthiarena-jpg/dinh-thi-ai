// Cấp mã SA-BOTAI TẶNG đối tác, gắn đúng tài khoản của họ để dùng được AI viết bài miễn phí dùng chung (máy chủ chỉ cho
// tài khoản có mã còn hạn GẮN VỚI TÀI KHOẢN đó). Đối tác phải ĐĂNG KÝ tài khoản trong tool (cùng email) trước khi cấp.
// Chạy trên máy chủ:  node scripts/issue-gift-key.js <email> [số ngày, mặc định 365] [ghi chú]
//   thêm --dry-run để chỉ kiểm tra tài khoản, không cấp mã.
require('dotenv').config();
const { sequelize } = require('../config/db');
const { User } = require('../models');
const fbai = require('../services/fbaiLicenseService');

(async () => {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const dry = process.argv.includes('--dry-run');
  const email = String(args[0] || '').trim().toLowerCase();
  const days = Number(args[1]) > 0 ? Number(args[1]) : 365;
  const note = args.slice(2).join(' ') || 'Tặng đối tác';
  if (!email) {
    console.log('Thiếu email. Dùng: node scripts/issue-gift-key.js <email> [số ngày] [ghi chú]');
    process.exit(1);
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.log('CHƯA CÓ TÀI KHOẢN ' + email + ' — nhờ đối tác mở tool, bấm Đăng ký bằng đúng email này rồi chạy lại.');
    process.exit(2);
  }
  const existing = fbai.listKeysByOwner(user.id).find((k) => k.active !== false && (!k.expiresAt || k.expiresAt > Date.now()));
  console.log('Tài khoản:', user.email, '(id ' + user.id + ')');
  if (existing) console.log('Đã có mã còn hạn:', existing.key, '— hết hạn', new Date(existing.expiresAt).toLocaleDateString('vi-VN'));
  if (dry) { console.log('(dry-run, không cấp mã)'); process.exit(0); }
  const entry = fbai.issueKey('Tặng: ' + note + ' — ' + email, { userId: user.id, email: user.email }, days);
  console.log('MÃ KÍCH HOẠT:', entry.key);
  console.log('Hết hạn:', new Date(entry.expiresAt).toLocaleDateString('vi-VN'), '(' + days + ' ngày)');
  await sequelize.close().catch(() => {});
  process.exit(0);
})().catch((e) => { console.error('Lỗi:', e.message); process.exit(1); });
