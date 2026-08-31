require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Boom Geog (địa lý) và BiBi History (lịch sử) — hai app web/PWA thuần, không có
// bản cài đặt desktop, nên chỉ set webAppUrl và không set driveUrl dạng Drive
// (driveFileId sẽ ở lại null -> trang chi tiết tự hiện đúng 1 thẻ "mở trên
// trình duyệt" thay vì cặp desktop/điện thoại, xem views/tools/show.ejs).
const tools = [
  {
    title: 'Boom Geog — Học Địa Lý',
    category: 'Ứng dụng',
    shortDescription:
      'Học địa lý Việt Nam và thế giới qua bài học ngắn, bản đồ tương tác và câu hỏi vui cùng linh vật Boom — miễn phí, chơi ngay trên trình duyệt.',
    description:
      'Boom Geog dạy trước, luyện sau: mỗi bài có phần dạy (vị trí, địa hình, khí hậu, dân cư, kinh tế, văn hoá) rồi mới tới câu hỏi ôn tập, trong đó có cả dạng bấm-vào-bản-đồ. Việt Nam dùng đúng số liệu 34 tỉnh, thành sau sáp nhập 2025; Thế giới có 6 châu lục và các quốc gia tiêu biểu. Dành cho học sinh lớp 4–12 (nội dung Lớp 4–5 có sẵn, các lớp khác đang bổ sung).',
    driveUrl: 'https://3dvietpro.com/game/dia-ly/',
    webAppUrl: 'https://3dvietpro.com/game/dia-ly/',
    coverImageUrl: '/game/dia-ly/icons/icon-512.png',
    isPublished: true,
  },
  {
    title: 'BiBi History — Học Lịch Sử',
    category: 'Ứng dụng',
    shortDescription:
      'Học lịch sử Việt Nam và thế giới song song theo dòng thời gian cùng người bạn dẫn đường BiBi — miễn phí, chơi ngay trên trình duyệt.',
    description:
      'BiBi History đưa học sinh xuyên thời gian cùng BiBi, học lịch sử Việt Nam và thế giới đan xen theo mốc thời gian thay vì tách rời. Có bài học, câu hỏi ôn tập, streak và điểm XP để giữ động lực học mỗi ngày. Hiện có nội dung Lớp 6, các lớp khác đang được bổ sung.',
    driveUrl: 'https://3dvietpro.com/game/lich-su/',
    webAppUrl: 'https://3dvietpro.com/game/lich-su/',
    coverImageUrl: '/game/lich-su/icons/icon-512.png',
    isPublished: true,
  },
];

async function run() {
  await connectDB();

  for (const t of tools) {
    const existing = await Tool.findOne({ where: { webAppUrl: t.webAppUrl } });
    if (existing) {
      console.log('skipped (already exists):', t.title);
      continue;
    }
    const tool = await Tool.create(t);
    console.log('created:', tool.title, '->', tool.slug);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
