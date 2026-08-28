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
  const [cot] = await sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${bang}' AND COLUMN_NAME = 'proUntil'`
  );
  if (cot.length) {
    console.log('cột proUntil đã có sẵn, không cần làm gì');
  } else {
    await sequelize.query(`ALTER TABLE \`${bang}\` ADD COLUMN \`proUntil\` DATETIME NULL`);
    console.log('đã thêm cột proUntil vào bảng', bang);
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
