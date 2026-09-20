/**
 * Thêm cột cho hệ thống ví: users.walletBalance (số dư) và tools.price (giá
 * bán, 0 = miễn phí). sequelize.sync() chỉ tạo BẢNG còn thiếu chứ không thêm
 * CỘT vào bảng đã có, nên phải thêm tay 1 lần. Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-wallet-columns.js
 * Chạy lại lần nữa cũng không sao, nó tự nhận ra cột đã có rồi.
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
  await themCotConThieu('users', [['walletBalance', 'INT NOT NULL DEFAULT 0']]);
  await themCotConThieu('tools', [['price', 'INT NOT NULL DEFAULT 0']]);
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
