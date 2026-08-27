require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

// Two problems found via scripts/list-blog-posts.js:
// 1. The 6 newest posts (Claude capability series) used "Title Case With
//    Spaces" tags ("Claude AI", "Ung dung AI") while all 17 earlier posts
//    use lowercase-kebab-ascii tags ("hoc-ai", "khoa-hoc-ai") — and tags
//    render as public "#tag" badges on the post page (views/blog/show.ejs),
//    so this inconsistency is visible to real readers, not just internal.
// 2. Thầy asked to make sure "đào tạo AI" / "đào tạo ứng dụng AI" keyword
//    coverage extends into the blog content, not just static pages — added
//    a "dao-tao-ai" and/or "dao-tao-ung-dung-ai" tag to the posts that are
//    actually about learning/training AI or applying AI to real work,
//    matching the existing kebab-slug tag style everywhere else.
const TAG_UPDATES = {
  4: ['hoc-ai', 'khoa-hoc-ai', 'nguoi-di-lam', 'dao-tao-ai'],
  6: ['cong-cu-ai', 'nang-suat', 'dao-tao-ung-dung-ai'],
  7: ['lo-trinh-hoc-ai', 'nguoi-moi-bat-dau', 'dao-tao-ai', 'dao-tao-ung-dung-ai'],
  9: ['ai-doanh-nghiep', 'sme', 'dao-tao-ung-dung-ai'],
  12: ['ai-marketing', 'noi-dung', 'dao-tao-ung-dung-ai'],
  14: ['hoc-ai', 'phat-trien-ban-than', 'dao-tao-ai'],
  15: ['khoa-hoc-ai', 'canh-bao', 'dao-tao-ai', 'dao-tao-ung-dung-ai'],
  17: ['hoc-ai', 'sai-lam-thuong-gap', 'dao-tao-ai'],
  18: ['claude-ai', 'ung-dung-ai', 'nang-suat', 'dao-tao-ung-dung-ai'],
  19: ['claude-ai', 'nhan-vien-ao', 'doanh-nghiep', 'dao-tao-ung-dung-ai'],
  20: ['claude-ai', 'lap-trinh-web', 'cong-nghe', 'dao-tao-ung-dung-ai'],
  21: ['claude-ai', 'phat-trien-ung-dung', 'khoi-nghiep', 'dao-tao-ung-dung-ai'],
  22: ['claude-ai', 'tu-dong-hoa', 'nang-suat', 'dao-tao-ung-dung-ai'],
  23: ['claude-ai', 'hoc-ai-co-ban', 'nguoi-moi-bat-dau', 'dao-tao-ai', 'dao-tao-ung-dung-ai'],
};

async function run() {
  await connectDB();

  for (const [id, tags] of Object.entries(TAG_UPDATES)) {
    const post = await BlogPost.findByPk(id);
    if (!post) {
      console.log('not found:', id);
      continue;
    }
    await post.update({ tags });
    console.log('updated:', post.title, '->', JSON.stringify(tags));
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
