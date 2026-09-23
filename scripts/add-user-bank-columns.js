/**
 * Thêm cột lưu thông tin nhận tiền mặc định cho user (users.bankName,
 * bankAccount, bankAccountName) — xem models/User.js. sequelize.sync()
 * không ALTER bảng đã có nên phải thêm tay.
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-user-bank-columns.js
 * Chạy lại nhiều lần vẫn an toàn.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

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
    ['bankName', "VARCHAR(255) NOT NULL DEFAULT ''"],
    ['bankAccount', "VARCHAR(255) NOT NULL DEFAULT ''"],
    ['bankAccountName', "VARCHAR(255) NOT NULL DEFAULT ''"],
  ]);
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
