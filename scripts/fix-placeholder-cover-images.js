/**
 * Bài đăng qua /api/auto-post (tool A-AI Ads) không kèm ảnh trước đây rơi về
 * 1 ảnh placeholder TĨNH duy nhất (coverImageUrl default của model) — nhiều
 * bài liền nhau hiện y hệt 1 ảnh. Đã vá routes/autopost.js để dùng ảnh SVG
 * theo chuyên mục cho bài MỚI; script này gán lại ảnh cho các bài CŨ đã lỡ
 * dính placeholder, mỗi bài 1 ảnh SVG ngẫu nhiên khác ảnh bài liền trước.
 *
 * Chạy 1 lần trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/fix-placeholder-cover-images.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');
const { pickCategoryCover } = require('../services/newsFactoryService');

const PLACEHOLDER = '/images/blog/blog-placeholder-photo.jpg';

async function run() {
  await connectDB();

  const posts = await BlogPost.findAll({
    where: { coverImageUrl: PLACEHOLDER, isPublished: true },
    order: [['createdAt', 'ASC']],
  });

  if (!posts.length) {
    console.log('Không có bài nào đang dùng ảnh placeholder tĩnh.');
    process.exit(0);
  }

  let lastFile = null;
  for (const post of posts) {
    const newCover = pickCategoryCover(post.category, lastFile);
    await post.update({ coverImageUrl: newCover });
    lastFile = newCover;
    console.log(`đã gán ảnh ${newCover} cho: ${post.title}`);
  }

  console.log(`Xong — đã sửa ${posts.length} bài.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
