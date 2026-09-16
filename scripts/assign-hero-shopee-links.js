/**
 * Gan link Shopee (data/heroShopeeLinks.js) cho TAT CA bai viet da dang tren
 * web tu truoc den gio - hook beforeCreate trong models/BlogPost.js chi ap
 * dung cho bai MOI tao sau nay, nen bai cu can chay backfill 1 lan.
 *
 * Idempotent: bo qua bai da co marker "hero-shopee" hoac "shopee-picks-ai-16-9"
 * roi (7 bai AI & Cong nghe ngay 16/9 da co link rieng, khong ghi de).
 *
 * Chay 1 lan tren may chu:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/assign-hero-shopee-links.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');
const HERO_SHOPEE_LINKS = require('../data/heroShopeeLinks');

async function run() {
  await connectDB();

  const posts = await BlogPost.findAll({ order: [['id', 'ASC']] });

  let updated = 0;
  let skipped = 0;
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (
      post.content.includes('<!-- hero-shopee:') ||
      post.content.includes('<!-- shopee-picks-ai-16-9 -->')
    ) {
      skipped += 1;
      continue;
    }
    const link = HERO_SHOPEE_LINKS[i % HERO_SHOPEE_LINKS.length];
    // Dung update() de tranh chay lai hook beforeCreate (chi ap dung khi
    // tao moi) - noi dung duoc ghi truc tiep, khong qua validate slug lai.
    await post.update({ content: `${post.content}\n<!-- hero-shopee:${link} -->` });
    updated += 1;
  }

  console.log(`Xong — da gan link cho ${updated} bai, bo qua ${skipped} bai da co san.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('loi:', err.message);
  process.exit(1);
});
