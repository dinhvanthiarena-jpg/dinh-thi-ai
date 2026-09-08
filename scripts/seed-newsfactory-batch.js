/**
 * Tạo hàng loạt bài viết tự động cho TỪNG chuyên mục — dùng khi thầy muốn
 * xem trước nhiều bài cùng lúc thay vì chờ lịch 10 bài/ngày chạy dần.
 *
 * Chạy trên máy chủ (nên chạy nền vì mất vài phút):
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   nohup node scripts/seed-newsfactory-batch.js 10 > /tmp/newsfactory-batch.log 2>&1 &
 * Tham số đầu tiên là số bài/chuyên mục (mặc định 10 nếu không truyền).
 * Nếu 1 chuyên mục hết tin RSS mới thì tự chuyển sang chuyên mục khác (đúng
 * hành vi có sẵn của pickTopic), nên tổng số bài tạo ra có thể ít hơn dự
 * kiến một chút, không phải lỗi.
 */
require('dotenv').config();
const connectDB = require('../config/db');
const { createTrendingPost } = require('../services/newsFactoryService');
const { BLOG_CATEGORIES } = require('../utils/blogCategories');

const countPerCategory = parseInt(process.argv[2], 10) || 10;

async function run() {
  await connectDB();

  let ok = 0;
  let skip = 0;
  for (const cat of BLOG_CATEGORIES) {
    for (let i = 0; i < countPerCategory; i++) {
      try {
        const post = await createTrendingPost(cat.slug);
        if (post) {
          ok += 1;
          console.log(`[${cat.slug}] (${i + 1}/${countPerCategory}) OK: ${post.title}`);
        } else {
          skip += 1;
          console.log(`[${cat.slug}] (${i + 1}/${countPerCategory}) bỏ qua (hết tin mới hoặc lỗi tạo bài).`);
        }
      } catch (err) {
        skip += 1;
        console.error(`[${cat.slug}] (${i + 1}/${countPerCategory}) lỗi:`, err.message);
      }
      // Nghỉ ngắn giữa các lần gọi để không dồn dập gọi API cùng lúc.
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log(`Xong — đã đăng ${ok} bài, bỏ qua ${skip} lượt.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
