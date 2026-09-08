/**
 * Thêm cột "coverImageSourceId" vào bảng blog_posts — dùng để tránh 2 bài tự
 * động dùng trùng đúng 1 ảnh Wikimedia Commons.
 * Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-blog-cover-image-source-id-column.js
 * Chạy lại lần nữa cũng không sao, nó tự nhận ra cột đã có rồi.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();
  const bang = 'blog_posts';
  const ten = 'coverImageSourceId';

  const [co] = await sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = '${bang}' AND COLUMN_NAME = '${ten}'`
  );
  if (co.length) {
    console.log('cột', ten, 'đã có sẵn');
  } else {
    await sequelize.query(`ALTER TABLE \`${bang}\` ADD COLUMN \`${ten}\` VARCHAR(255) NULL`);
    console.log('đã thêm cột', ten);
  }
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
