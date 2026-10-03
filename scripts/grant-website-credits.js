// Tặng lượt "tạo web" (websiteBuildCredits) cho tài khoản — dùng để thầy test tính
// năng "24h ra web" của SA-AI BOT mà không bị thu $50 từ ví (thuPhiTaoWeb dùng lượt
// này TRƯỚC, hết lượt mới trừ ví). Chạy: node scripts/grant-website-credits.js <số lượt> <email> [email...]
require('dotenv').config();
const { sequelize } = require('../config/db');
const User = require('../models/User');

(async () => {
  const [qtyArg, ...emails] = process.argv.slice(2);
  const qty = parseInt(qtyArg, 10);
  if (!qty || !emails.length) {
    console.error('Cách dùng: node scripts/grant-website-credits.js <số lượt> <email> [email...]');
    process.exit(1);
  }
  try {
    for (const email of emails) {
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user) { console.log(`✗ Không tìm thấy tài khoản ${email}`); continue; }
      user.websiteBuildCredits = (user.websiteBuildCredits || 0) + qty;
      await user.save();
      console.log(`✓ ${email}: +${qty} lượt, hiện có ${user.websiteBuildCredits} lượt tạo web`);
    }
  } catch (err) {
    console.error('Lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
