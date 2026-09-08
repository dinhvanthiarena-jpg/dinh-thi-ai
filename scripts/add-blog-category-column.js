/**
 * Thêm cột "category" vào bảng blog_posts.
 *
 * sequelize.sync() chỉ tạo BẢNG còn thiếu chứ không thêm CỘT vào bảng đã có,
 * nên cột này phải thêm tay một lần. Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-blog-category-column.js
 * Chạy lại lần nữa cũng không sao, nó tự nhận ra cột đã có rồi.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();
  const bang = 'blog_posts';
  const ten = 'category';

  const [co] = await sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${bang}' AND COLUMN_NAME = '${ten}'`
  );
  if (co.length) {
    console.log('cột', ten, 'đã có sẵn');
  } else {
    await sequelize.query(
      `ALTER TABLE \`${bang}\` ADD COLUMN \`${ten}\` VARCHAR(255) NOT NULL DEFAULT 'ai-cong-nghe'`
    );
    console.log('đã thêm cột', ten);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
