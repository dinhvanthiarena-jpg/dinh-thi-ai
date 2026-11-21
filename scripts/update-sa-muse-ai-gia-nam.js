require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// 21/11/2026: Sa Muse Ai đổi giá 500.000đ/30 ngày → 989.000đ/1 năm (365 ngày).
// Chỉ thay ĐÚNG mấy câu trong mô tả của mục Kho tài nguyên (không ghi đè phần thầy đã sửa tay ở chỗ khác).
// Chạy: cd ~/dinh-thi-ai && source ~/nodevenv/dinh-thi-ai/20/bin/activate && node scripts/update-sa-muse-ai-gia-nam.js
// Chạy lại nhiều lần vẫn an toàn (câu đã thay thì bỏ qua). Không cần restart app.
const TITLE = 'Sa Muse Ai — tool tạo video AI hàng loạt';
const THAY = [
  ['thời hạn 30 ngày (gia hạn qua admin)', 'thời hạn 1 năm (365 ngày), giá 989.000đ/năm (gia hạn qua admin)'],
  [
    'Mua key / hỗ trợ: email dinhvanthi.arena@gmail.com hoặc nhắn Fanpage https://www.facebook.com/dinhthi.daotao',
    'Mua key và xem cách liên hệ hỗ trợ tại https://3dvietpro.com/dang-ky-tool-muse (989.000đ/1 năm).',
  ],
  ['(liên hệ email/fanpage để mua key)', '(đăng ký mua key tại https://3dvietpro.com/dang-ky-tool-muse)'],
];

async function run() {
  await connectDB();
  const tool = await Tool.findOne({ where: { title: TITLE } });
  if (!tool) { console.log('Không thấy mục Sa Muse Ai trong Kho tài nguyên.'); process.exit(1); }
  let desc = tool.description || '';
  THAY.forEach(([cu, moi]) => {
    if (desc.includes(cu)) { desc = desc.replace(cu, moi); console.log('ĐÃ THAY:', cu.slice(0, 50)); }
    else console.log('bỏ qua (không thấy câu cũ):', cu.slice(0, 50));
  });
  if (desc !== tool.description) { tool.description = desc; await tool.save(); console.log('Đã lưu mô tả mới cho', tool.slug); }
  else console.log('Không có gì để đổi.');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
