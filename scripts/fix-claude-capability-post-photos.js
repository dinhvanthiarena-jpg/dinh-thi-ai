require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

// Facebook's link-scraper does not render SVG og:image files, so the 5 posts
// fixed in fix-claude-capability-post-images.js (which pointed coverImageUrl
// at local SVG illustrations) were still showing a generic fallback photo on
// Facebook auto-shares. Switch them to real, distinct JPG photos instead —
// both fixes the duplicate-image complaint and makes Facebook previews work.
const updates = [
  {
    title: 'Giao việc cho AI: Cách dùng Claude như một trợ lý đắc lực mỗi ngày',
    coverImageUrl: '/images/blog/ai-agent-photo.jpg',
  },
  {
    title: 'AI làm nhân viên: Khi Claude gánh vác công việc như một nhân sự thực thụ',
    coverImageUrl: '/images/blog/sme-ai-photo.jpg',
  },
  {
    title: 'Lập trình web với Claude: Từ ý tưởng đến sản phẩm hoàn chỉnh',
    coverImageUrl: '/images/blog/roadmap-photo.jpg',
  },
  {
    title: 'Xây dựng ứng dụng với AI: Cơ hội cho người không chuyên công nghệ',
    coverImageUrl: '/images/blog/trend-2026-photo.jpg',
  },
  {
    title: 'Claude cho người mới bắt đầu: Không cần biết code vẫn dùng được AI ở trình độ cao',
    coverImageUrl: '/images/blog/where-to-learn-photo.jpg',
  },
];

async function run() {
  await connectDB();

  for (const u of updates) {
    const post = await BlogPost.findOne({ where: { title: u.title } });
    if (!post) {
      console.log('not found:', u.title);
      continue;
    }
    await post.update({ coverImageUrl: u.coverImageUrl });
    console.log('updated:', post.title, '->', u.coverImageUrl);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
