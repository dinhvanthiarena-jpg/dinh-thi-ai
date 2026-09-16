/**
 * Chen 1 khoi "Goi y mua sam hom nay" (4 san pham Shopee thay dua) vao cuoi
 * noi dung cac bai viet chuyen muc AI & Cong nghe dang ngay 16/9/2026 - rieng
 * cho nhung bai nay, khong dung chung voi widget shopee-picks toan site
 * (data/shopeePicks.js) vi thay muon dung dung 4 link nay cho dot bai hom nay.
 *
 * Idempotent: bo qua bai da co khoi nay roi (danh dau bang comment HTML).
 *
 * Chay 1 lan tren may chu:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/insert-shopee-picks-ai-posts.js
 */
require('dotenv').config();
const { Op } = require('sequelize');
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

const MARKER = '<!-- shopee-picks-ai-16-9 -->';

const PRODUCTS = [
  {
    name: 'Áo Phao nam nữ lót lông cừu VOGU - Áo khoác nam nữ unisex dày dặn siêu ấm siêu đẹp dành cho mùa đông',
    price: '379.000₫',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mstmqenv7ksm8a',
    url: 'https://s.shopee.vn/6VNun6togH',
  },
  {
    name: '[Peinn] Áo Hoodie thời trang nam nữ hình in Van Gogh cách điệu, chất nỉ bông cao cấp 2 lớp dày dặn ấm áp',
    price: '184.275₫',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mn2n5ip2ps03e7',
    url: 'https://s.shopee.vn/60ReCBvihC',
  },
  {
    name: 'Áo len lông thỏ phong cách Hàn Quốc đơn giản basic, dễ phối đồ phù hợp với mùa thu đông',
    price: '99.000₫ - 169.000₫',
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-msgwbx2jckxydc',
    url: 'https://s.shopee.vn/6Al4OUv5MF',
  },
  {
    name: 'Áo khoác nữ form rộng hoodie zip 4 túi, khoác ngoài nỉ bông mùa đông Hàn Quốc unisex',
    price: '155.820₫ - 179.000₫',
    image: 'https://down-vn.img.susercontent.com/file/vn-11110105-7ras8-m15ge3d4aumzbd',
    url: 'https://s.shopee.vn/9fKwYvhlFw',
  },
];

function buildBlock() {
  const cards = PRODUCTS.map(
    (p) => `
    <a href="/go/shopee?url=${encodeURIComponent(p.url)}&name=${encodeURIComponent(p.name)}" target="_blank" rel="noopener sponsored" class="group block no-underline">
      <div class="aspect-square rounded-xl overflow-hidden bg-white border border-orange-100 shadow-sm">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" referrerpolicy="no-referrer" />
      </div>
      <p class="mt-2 text-xs text-ink line-clamp-2 leading-snug">${p.name}</p>
      <p class="mt-1 text-sm font-bold text-orange-600">${p.price}</p>
    </a>`
  ).join('');

  return `${MARKER}
<div id="goi-y-mua-sam" class="mt-6 rounded-2xl border border-orange-200 bg-orange-50/60 p-6 sm:p-8 not-prose">
  <div class="flex items-center gap-2 mb-5">
    <svg class="h-6 w-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4a1 1 0 0 0-1 1v1H4.5a1 1 0 0 0-.98 1.196l1.8 9A2 2 0 0 0 7.28 18H16.7a2 2 0 0 0 1.96-1.6l1.8-9.2A1 1 0 0 0 19.48 6H18V5a1 1 0 1 0-2 0v1H8V5a1 1 0 0 0-1-1Zm1 5a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V9Zm5-1a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V9a1 1 0 0 0-1-1Z"/></svg>
    <h3 class="text-lg font-bold text-ink m-0">Gợi ý mua sắm hôm nay</h3>
    <span class="badge bg-orange-500 text-white ml-auto">Shopee</span>
  </div>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">${cards}
  </div>
  <p class="mt-4 text-[11px] text-muted">Đây là liên kết tiếp thị liên kết (affiliate) — Đinh Thi Ai có thể nhận hoa hồng nhỏ từ đơn hàng hợp lệ, không phát sinh thêm chi phí cho bạn.</p>
</div>`;
}

async function run() {
  await connectDB();

  const posts = await BlogPost.findAll({
    where: {
      category: 'ai-cong-nghe',
      publishedAt: { [Op.gte]: new Date('2026-09-16T00:00:00+07:00'), [Op.lt]: new Date('2026-09-17T00:00:00+07:00') },
    },
  });

  if (!posts.length) {
    console.log('Khong tim thay bai nao ngay 16/9 trong chuyen muc ai-cong-nghe.');
    process.exit(0);
  }

  const block = buildBlock();
  let updated = 0;
  for (const post of posts) {
    if (post.content.includes(MARKER)) {
      console.log('bo qua (da co san pham):', post.title);
      continue;
    }
    await post.update({ content: post.content + '\n' + block });
    updated += 1;
    console.log('da chen san pham vao:', post.title);
  }

  console.log(`Xong — da chen vao ${updated}/${posts.length} bai.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('loi:', err.message);
  process.exit(1);
});
