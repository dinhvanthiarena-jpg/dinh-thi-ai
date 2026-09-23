/**
 * Nâng cấp hệ thống "Giới thiệu bạn bè" lên 3 cấp (WEB -> A -> B -> C) theo
 * đặc tả 23/09/2026:
 *   - wallet_transactions.type: mở rộng ENUM thêm 'commission_l3'
 *   - audit_logs: bảng mới (sequelize.sync() tự tạo, không cần ALTER)
 * Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-aff-3cap-columns.js
 * Chạy lại lần nữa cũng không sao.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();

  await sequelize.query(
    `ALTER TABLE \`wallet_transactions\`
       MODIFY COLUMN \`type\` ENUM('topup','purchase','refund','adjustment','commission_l1','commission_l2','commission_l3','withdraw') NOT NULL`
  );
  console.log('đã mở rộng wallet_transactions.type ENUM thêm commission_l3');

  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
