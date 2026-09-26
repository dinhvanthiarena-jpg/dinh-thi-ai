/**
 * Hai việc, chạy một lượt:
 *
 * 1. MỞ RỘNG pro_orders.plan THÊM 'half' (gói 6 tháng).
 *    Bảng giá đã bán gói 6 tháng rồi, nhưng cột plan là ENUM chỉ nhận
 *    month/year/family — ai bấm mua gói 6 tháng là đơn đổ lỗi ngay ở khâu ghi
 *    cơ sở dữ liệu. sequelize.sync() không sửa bảng cũ nên phải ALTER tay.
 *
 * 2. THÊM BỐN CỘT THUẾ vào pro_orders, để mỗi đơn giữ luôn số thuế của chính
 *    thời điểm bán. Không tính lại về sau: thuế suất đổi theo năm, đơn cũ phải
 *    giữ đúng con số cũ.
 *
 * Chạy trên máy chủ:
 *   cd ~/dinh-thi-ai
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-thue-columns.js
 *
 * Chạy lại lần nữa cũng không sao — cột nào có rồi thì bỏ qua.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

const COT = [
  ['thueGtgt', 'INT NOT NULL DEFAULT 0'],
  ['thueTncn', 'INT NOT NULL DEFAULT 0'],
  ['thueTyLe', 'INT NOT NULL DEFAULT 0'],
  ['thueDaTinh', 'TINYINT(1) NOT NULL DEFAULT 0'],
];

async function coCot(bang, cot) {
  const [ds] = await sequelize.query(`SHOW COLUMNS FROM \`${bang}\` LIKE '${cot}'`);
  return ds.length > 0;
}

async function run() {
  await connectDB();

  // 1. Nới ENUM cho gói 6 tháng
  await sequelize.query(
    "ALTER TABLE `pro_orders` MODIFY COLUMN `plan` " +
    "ENUM('month','half','year','family') NOT NULL"
  );
  console.log("đã nới pro_orders.plan thêm 'half' (gói 6 tháng)");

  // 2. Thêm các cột thuế còn thiếu
  for (const [ten, kieu] of COT) {
    if (await coCot('pro_orders', ten)) {
      console.log(`  ${ten}: đã có, bỏ qua`);
      continue;
    }
    await sequelize.query(`ALTER TABLE \`pro_orders\` ADD COLUMN \`${ten}\` ${kieu}`);
    console.log(`  ${ten}: đã thêm`);
  }

  console.log('xong.');
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
