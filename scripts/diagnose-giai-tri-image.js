/**
 * Chan doan chi tiet vi sao chuyen muc Giai tri van khong nang cap duoc anh
 * du da them Openverse (xem services/newsFactoryService.js) — chay
 * fetchStockImage cho vai tieu de Giai tri thuc te, bat NEWSFACTORY_DEBUG de
 * in ra so candidate tung nguon va ket qua tung buoc (tai anh / Vision).
 *
 * Chay 1 lan tren may chu:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   NEWSFACTORY_DEBUG=1 node scripts/diagnose-giai-tri-image.js
 */
require('dotenv').config();
const { fetchStockImage, suggestImageQuery } = require('../services/newsFactoryService');

const TITLES = [
  'Tin giải trí nổi bật: Diệp Lâm Anh và bạn trai khoe gu mặc đồng điệu, tìm lại hạnh phúc sau ly hôn',
  'Tin giải trí nổi bật: Hồ Ngọc Hà và Lưu Diệc Phi toả sáng với style thời trang gợi cảm',
];

async function run() {
  for (const title of TITLES) {
    console.log('\n########## bài:', title);
    const q = await suggestImageQuery(title);
    console.log('imageQuery do Claude sinh ra:', q);
    const result = await fetchStockImage('giai-tri', new Set(), q, title);
    console.log('KẾT QUẢ:', result ? `TÌM ĐƯỢC (${result.sourceId})` : 'KHÔNG TÌM ĐƯỢC');
  }
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
