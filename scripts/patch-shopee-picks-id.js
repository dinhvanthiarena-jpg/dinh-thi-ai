/**
 * Vá thêm id="goi-y-mua-sam" vào khoi "Goi y mua sam hom nay" da chen truoc
 * do (scripts/insert-shopee-picks-ai-posts.js) - can id nay de nut "Uu dai
 * hom nay" de tren anh bia cuon toi dung vi tri.
 *
 * Chay 1 lan tren may chu:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/patch-shopee-picks-id.js
 */
require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

const OLD = '<div class="mt-6 rounded-2xl border border-orange-200 bg-orange-50/60 p-6 sm:p-8 not-prose">';
const NEW = '<div id="goi-y-mua-sam" class="mt-6 rounded-2xl border border-orange-200 bg-orange-50/60 p-6 sm:p-8 not-prose">';

async function run() {
  await connectDB();
  const posts = await BlogPost.findAll({ where: {} });

  let patched = 0;
  for (const post of posts) {
    if (post.content.includes('<!-- shopee-picks-ai-16-9 -->') && post.content.includes(OLD)) {
      await post.update({ content: post.content.replace(OLD, NEW) });
      patched += 1;
      console.log('da va:', post.title);
    }
  }

  console.log(`Xong — da va ${patched} bai.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('loi:', err.message);
  process.exit(1);
});
