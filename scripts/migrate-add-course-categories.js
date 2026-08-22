require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();

  await sequelize.query(
    `ALTER TABLE courses MODIFY COLUMN category ENUM(
      'AI cơ bản',
      'Machine Learning',
      'Deep Learning',
      'Generative AI',
      'AI cho doanh nghiệp',
      'Prompt Engineering',
      'Đồ họa & Dựng hình',
      'Làm phim hoạt hình',
      'Sáng tạo nội dung & Kênh video'
    ) NOT NULL`
  );

  console.log('category enum updated');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
