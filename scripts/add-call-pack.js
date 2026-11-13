/**
 * Thêm cột cho GÓI GỌI NHÂN VẬT + mở rộng ENUM plan của pro_orders.
 * Chạy trên máy chủ, MỘT LẦN trước khi bật code mới (chạy lại cũng không hỏng):
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-call-pack.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();
  const canCo = [
    ['callUntil', 'DATETIME NULL'],
    ['callMonth', "VARCHAR(7) NOT NULL DEFAULT ''"],
    ['callUsed', 'INT NOT NULL DEFAULT 0'],
    ['callTrialUsed', 'INT NOT NULL DEFAULT 0'],
  ];
  for (const [ten, kieu] of canCo) {
    const [co] = await sequelize.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = '${ten}'`
    );
    if (co.length) console.log('cột', ten, 'đã có');
    else { await sequelize.query(`ALTER TABLE \`users\` ADD COLUMN \`${ten}\` ${kieu}`); console.log('đã thêm cột', ten); }
  }
  const [[col]] = await sequelize.query(
    `SELECT COLUMN_TYPE AS t FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pro_orders' AND COLUMN_NAME = 'plan'`
  );
  if (col && col.t.includes('call_year')) console.log('ENUM plan đã có call_year');
  else if (col) {
    await sequelize.query("ALTER TABLE `pro_orders` MODIFY `plan` ENUM('month','half','year','family','call_year') NOT NULL");
    console.log('đã thêm call_year vào ENUM plan');
  } else console.log('chưa có bảng pro_orders — khởi động app để tự tạo rồi chạy lại');
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
