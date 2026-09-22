/**
 * Thêm cột cho hệ thống "Giới thiệu bạn bè" (affiliate nội bộ 2 cấp):
 *   - users.refCode, users.parentId
 *   - wallet_transactions.type: mở rộng ENUM thêm commission_l1/commission_l2/withdraw
 * sequelize.sync() chỉ tạo BẢNG còn thiếu (withdraw_requests, settings đã tự
 * tạo) chứ không ALTER bảng đã có, nên phải thêm tay 1 lần. Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-referral-columns.js
 * Chạy lại lần nữa cũng không sao, nó tự nhận ra cột đã có rồi.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');
const User = require('../models/User');
const { generateUniqueRefCode } = User;

async function themCotConThieu(bang, canCo) {
  for (const [ten, kieu] of canCo) {
    const [co] = await sequelize.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${bang}' AND COLUMN_NAME = '${ten}'`
    );
    if (co.length) {
      console.log(`cột ${bang}.${ten} đã có sẵn`);
    } else {
      await sequelize.query(`ALTER TABLE \`${bang}\` ADD COLUMN \`${ten}\` ${kieu}`);
      console.log(`đã thêm cột ${bang}.${ten}`);
    }
  }
}

async function run() {
  await connectDB();

  await themCotConThieu('users', [
    ['refCode', 'VARCHAR(255) NULL UNIQUE'],
    ['parentId', 'INT NULL'],
  ]);

  await sequelize.query(
    `ALTER TABLE \`wallet_transactions\`
       MODIFY COLUMN \`type\` ENUM('topup','purchase','refund','adjustment','commission_l1','commission_l2','withdraw') NOT NULL`
  );
  console.log('đã mở rộng wallet_transactions.type ENUM');

  // Backfill: mọi user cũ (tạo trước khi có tính năng này) chưa có refCode.
  const users = await User.findAll({ where: { refCode: null }, attributes: ['id'] });
  let dem = 0;
  for (const u of users) {
    const code = await generateUniqueRefCode();
    await User.update({ refCode: code }, { where: { id: u.id } });
    dem += 1;
  }
  console.log(`đã sinh refCode cho ${dem} user cũ`);

  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
