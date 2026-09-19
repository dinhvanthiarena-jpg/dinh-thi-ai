/**
 * Sửa các bài đăng qua /api/auto-post (tool A-AI Ads) đang KHÔNG có ảnh thật
 * — hoặc đang dùng icon SVG vẽ theo chuyên mục (bản vá trước đó dùng, thầy
 * nhắc rõ tuyệt đối không được dùng ảnh vẽ), hoặc vẫn đang dùng ảnh JPG
 * placeholder mặc định dùng chung cho mọi bài (trùng/thiếu ảnh riêng).
 * Thay tất cả bằng ảnh thật lấy từ Wikimedia/Openverse/Pixabay qua đúng
 * pipeline "Nhà máy tin tức AI" đang dùng. Không tìm được ảnh thật nào thì
 * rơi về ảnh JPG mặc định (vẫn là ảnh thật, không phải SVG vẽ).
 *
 * Chạy 1 lần trên máy chủ:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/fix-svg-covers-to-real-photos.js
 */
require('dotenv').config();
const { Op } = require('sequelize');
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');
const { fetchStockImage } = require('../services/newsFactoryService');

const PLACEHOLDER = '/images/blog/blog-placeholder-photo.jpg';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  await connectDB();

  const posts = await BlogPost.findAll({
    where: {
      [Op.or]: [{ coverImageUrl: { [Op.like]: '/images/blog/cat-%.svg' } }, { coverImageUrl: PLACEHOLDER }],
    },
    order: [['createdAt', 'ASC']],
  });

  if (!posts.length) {
    console.log('Không có bài nào đang dùng ảnh SVG minh hoạ.');
    process.exit(0);
  }

  const usedImages = await BlogPost.findAll({
    where: { coverImageSourceId: { [Op.ne]: null } },
    attributes: ['coverImageSourceId'],
  });
  const usedPageIds = new Set(usedImages.map((p) => p.coverImageSourceId));

  let fixed = 0;
  let leftEmpty = 0;
  for (const post of posts) {
    const stockImage = await fetchStockImage(post.category, usedPageIds, null, post.title);
    if (stockImage) {
      await post.update({ coverImageUrl: stockImage.url, coverImageSourceId: stockImage.sourceId });
      usedPageIds.add(stockImage.sourceId);
      fixed += 1;
      console.log(`đã gán ảnh thật cho: ${post.title}`);
    } else {
      // Không SET null trực tiếp (cột NOT có default áp dụng khi update rõ
      // ràng) — set về đúng ảnh JPG mặc định của model để chắc chắn không
      // còn ảnh SVG nào sót lại.
      await post.update({ coverImageUrl: '/images/blog/blog-placeholder-photo.jpg', coverImageSourceId: null });
      leftEmpty += 1;
      console.log(`không tìm được ảnh thật, rơi về ảnh JPG mặc định: ${post.title}`);
    }
    await sleep(1200);
  }

  console.log(`Xong — đã gán ảnh thật cho ${fixed} bài, ${leftEmpty} bài rơi về ảnh mặc định (không tìm được ảnh phù hợp).`);
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
