/**
 * Thêm cột hạn dùng Pro vào bảng người dùng.
 *
 * sequelize.sync() chỉ tạo BẢNG còn thiếu chứ không thêm CỘT vào bảng đã có,
 * nên cột này phải thêm tay một lần. Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-pro-column.js
 * Chạy lại lần nữa cũng không sao, nó tự nhận ra cột đã có rồi.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();
  const bang = 'users';
  const canCo = [
    ['proUntil', 'DATETIME NULL'],
    ['familyCode', "VARCHAR(255) NOT NULL DEFAULT ''"],
    ['familyOwner', 'TINYINT(1) NOT NULL DEFAULT 0'],
    ['trialUsed', 'TINYINT(1) NOT NULL DEFAULT 0'],
  ];
  for (const [ten, kieu] of canCo) {
    const [co] = await sequelize.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${bang}' AND COLUMN_NAME = '${ten}'`
    );
    if (co.length) {
      console.log('cột', ten, 'đã có sẵn');
    } else {
      await sequelize.query(`ALTER TABLE \`${bang}\` ADD COLUMN \`${ten}\` ${kieu}`);
      console.log('đã thêm cột', ten);
    }
  }

  const [bangPro] = await sequelize.query(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pro_orders'`
  );
  console.log(bangPro.length ? 'bảng pro_orders đã có' : 'bảng pro_orders chưa có — khởi động lại app là sequelize tự tạo');
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
