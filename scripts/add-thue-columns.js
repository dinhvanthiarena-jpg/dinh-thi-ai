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
 * 3. THÊM CỘT familyCode nếu còn thiếu. Không liên quan thuế, nhưng phát hiện
 *    ra khi kiểm thử trên máy chủ 2026-09-26: model đã có cột này từ trước
 *    (cho gói gia đình) nhưng chưa ai ALTER lên bảng thật — mọi đơn xác nhận
 *    thanh toán, không riêng gì đơn có tính thuế, đều lỗi "Unknown column
 *    familyCode in field list". Thêm luôn ở đây cho gọn một chỗ chạy.
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
  // Khong lien quan thue, nhung phat hien ra khi kiem thu: model co san cot
  // familyCode tu truoc (cho goi gia dinh) ma chua bao gio duoc ALTER len
  // may chu that — moi don xac nhan thanh toan (khong rieng gi don thue) deu
  // loi "Unknown column familyCode". Them luon o day cho gon mot cho.
  ['familyCode', "VARCHAR(255) NOT NULL DEFAULT ('')"],
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
