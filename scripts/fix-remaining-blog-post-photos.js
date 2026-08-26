require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

// Site-wide follow-up to fix-claude-capability-post-photos.js: every other
// blog post still had an SVG coverImageUrl, which Facebook's link-scraper
// can't read (see memory / commit history for the root-cause writeup), so
// every one of them was showing a generic/wrong image on Facebook shares.
// Switches all remaining posts to distinct real JPG photos, matched by slug
// so it's unambiguous even where titles are similar.
const updates = [
  { slug: 'ung-dung-ai-trong-marketing-cach-xay-dung-noi-dung-tu-djong-ma-van-giu-ban-sac-thuong-hieu-mt31umbz', coverImageUrl: '/images/blog/ai-marketing-photo.jpg' },
  { slug: 'ai-agent-la-gi-xu-huong-ai-tu-hanh-djang-thay-djoi-cong-viec-nam-2026-mt31umbr', coverImageUrl: '/images/blog/ai-agent-2-photo.jpg' },
  { slug: 'chatgpt-gemini-hay-claude-nen-chon-cong-cu-ai-nao-cho-cong-viec-mt31blwo', coverImageUrl: '/images/blog/compare-ai-photo.jpg' },
  { slug: 'lo-trinh-hoc-ai-ung-dung-tu-so-0-cho-nguoi-khong-biet-lap-trinh-mt31blwl', coverImageUrl: '/images/blog/roadmap-2-photo.jpg' },
  { slug: '5-xu-huong-ai-dang-chu-y-nam-2026-mt2v1gbv', coverImageUrl: '/images/blog/trend-2026-2-photo.jpg' },
  { slug: 'huong-dan-viet-prompt-hieu-qua-cho-nguoi-moi-bat-dau-mt2v1gbx', coverImageUrl: '/images/blog/prompt-guide-photo.jpg' },
  { slug: 'ai-co-the-thay-the-cong-viec-cua-ban-khong-mt2v1gby', coverImageUrl: '/images/blog/ai-jobs-photo.jpg' },
  { slug: 'hoc-ai-o-djau-tot-cho-nguoi-dji-lam-tai-viet-nam-mt31blwa', coverImageUrl: '/images/blog/where-to-learn-2-photo.jpg' },
  { slug: 'ai-overview-la-gi-cach-toi-uu-noi-dung-dje-xuat-hien-tren-ket-qua-tim-kiem-ai-mt31blwf', coverImageUrl: '/images/blog/ai-overview-seo-photo.jpg' },
  { slug: '10-cong-cu-ai-mien-phi-giup-tang-nang-suat-cong-viec-van-phong-mt31blwj', coverImageUrl: '/images/blog/free-ai-tools-photo.jpg' },
  { slug: 'tu-djong-hoa-cong-viec-van-phong-claude-giup-ban-tiet-kiem-hang-gio-moi-ngay-mt6nro2t', coverImageUrl: '/images/blog/blog-placeholder-photo.jpg' },
];

async function run() {
  await connectDB();

  for (const u of updates) {
    const post = await BlogPost.findOne({ where: { slug: u.slug } });
    if (!post) {
      console.log('not found:', u.slug);
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
