/**
 * In ra danh sách bài viết nhiều lượt xem nhất — cả toàn thời gian lẫn 30
 * ngày gần nhất, để trả lời nhanh câu hỏi "bài nào đang nhiều view nhất"
 * mà không cần mở trang quản trị. Chạy trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/top-viewed-posts.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');
const BlogPost = require('../models/BlogPost');

async function topPages(days, limit) {
  const whereTime = days ? `AND createdAt >= (NOW() - INTERVAL ${days} DAY)` : '';
  const [rows] = await sequelize.query(
    `SELECT postSlug, COUNT(*) AS total
     FROM page_views
     WHERE postSlug IS NOT NULL ${whereTime}
     GROUP BY postSlug
     ORDER BY total DESC
     LIMIT ${limit}`
  );
  if (!rows.length) return [];
  const { Op } = require('sequelize');
  const posts = await BlogPost.findAll({
    where: { slug: { [Op.in]: rows.map((r) => r.postSlug) } },
    attributes: ['slug', 'title', 'category'],
  });
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  return rows.map((r) => {
    const p = bySlug.get(r.postSlug);
    return { title: p ? p.title : r.postSlug, category: p ? p.category : '?', total: Number(r.total) };
  });
}

async function run() {
  await connectDB();

  console.log('\n=== TOÀN THỜI GIAN (top 15) ===');
  const allTime = await topPages(null, 15);
  allTime.forEach((r, i) => console.log(`${i + 1}. [${r.category}] ${r.title} — ${r.total} lượt`));

  console.log('\n=== 30 NGÀY GẦN NHẤT (top 15) ===');
  const last30 = await topPages(30, 15);
  last30.forEach((r, i) => console.log(`${i + 1}. [${r.category}] ${r.title} — ${r.total} lượt`));

  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
