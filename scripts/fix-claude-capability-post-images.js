require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

// The 5 posts from scripts/seed-claude-capability-posts.js were all created
// without a coverImageUrl, so every one of them fell back to the model's
// shared default (/images/blog-placeholder.svg) — meaning every day's
// auto-share to the Facebook Page showed the same generic image. Give each
// one a distinct existing illustration from public/images/blog/ instead.
const updates = [
  {
    title: 'Giao việc cho AI: Cách dùng Claude như một trợ lý đắc lực mỗi ngày',
    coverImageUrl: '/images/blog/ai-agent.svg',
  },
  {
    title: 'AI làm nhân viên: Khi Claude gánh vác công việc như một nhân sự thực thụ',
    coverImageUrl: '/images/blog/sme-ai.svg',
  },
  {
    title: 'Lập trình web với Claude: Từ ý tưởng đến sản phẩm hoàn chỉnh',
    coverImageUrl: '/images/blog/roadmap.svg',
  },
  {
    title: 'Xây dựng ứng dụng với AI: Cơ hội cho người không chuyên công nghệ',
    coverImageUrl: '/images/blog/trend-2026.svg',
  },
  {
    title: 'Claude cho người mới bắt đầu: Không cần biết code vẫn dùng được AI ở trình độ cao',
    coverImageUrl: '/images/blog/where-to-learn.svg',
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
