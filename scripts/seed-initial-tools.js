require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Thầy's first two entries for the new Tool & Game showcase page.
// "Toán Học Vui Nhộn" already has an established name/description from the
// Facebook auto-reply campaign (FB_TOOL_REPLY_MESSAGE in webhookController.js);
// the second link was shared without a name, so it's seeded with a clearly
// generic placeholder title thầy can rename via /admin/tools whenever he adds
// the real title, description and screenshots.
const tools = [
  {
    title: 'Toán Học Vui Nhộn',
    category: 'Game',
    shortDescription: 'Bộ công cụ luyện toán vui nhộn cho học sinh tiểu học — cài đặt và dùng ngay trên máy tính.',
    description:
      'Toán Học Vui Nhộn là bộ công cụ hỗ trợ thầy cô và phụ huynh dạy toán cho học sinh tiểu học một cách sinh động, dễ hiểu. Chỉ cần tải về, giải nén và bấm vào file exe là dùng được ngay trên máy tính để dạy học.',
    driveUrl: 'https://drive.google.com/file/d/1aO3QMHCJpcoVkNhnVSht4GamanBjD2k8/view?usp=drive_link',
    isPublished: true,
  },
  {
    title: 'Ứng dụng mới của Đinh Thi Ai',
    category: 'Ứng dụng',
    shortDescription: 'Sản phẩm mới nhất do Đinh Thi Ai xây dựng — tải về và dùng thử ngay.',
    description:
      'Thầy vào /admin/tools để đổi tên, viết mô tả chi tiết và thêm ảnh cho sản phẩm này nhé.',
    driveUrl: 'https://drive.google.com/file/d/1KbpZw2UUzN5q_qqs_ooQXzNRAk5qOeaS/view?usp=drive_link',
    isPublished: true,
  },
];

async function run() {
  await connectDB();

  for (const t of tools) {
    const existing = await Tool.findOne({ where: { driveUrl: t.driveUrl } });
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
