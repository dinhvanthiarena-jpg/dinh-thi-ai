require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// English Air is a web-only PWA served straight from this site at
// /english-air/ — there is no Windows installer, so driveUrl points at the
// same web address. The model only parses driveFileId out of real Google
// Drive links, so it stays null here, and views/tools/show.ejs uses exactly
// that (webAppUrl set + driveFileId null) to render the single
// "open in browser" card instead of the download + phone pair.
const WEB_URL = 'https://3dvietpro.com/english-air/';

const tool = {
  title: 'English Air — Học tiếng Anh',
  category: 'Ứng dụng',
  shortDescription:
    'App học tiếng Anh theo khung CEFR A1–A2: dạy trước, luyện sau. Mở là học được ngay trên điện thoại, iPad hay máy tính.',
  description:
    'English Air dạy tiếng Anh theo cách của một người thầy chứ không phải một trò chơi: mỗi bài đều đi qua các slide dạy — từ mới có phiên âm và ví dụ, bảng ngữ pháp, góc văn hoá, hội thoại mẫu — rồi mới tới phần câu hỏi.\n\n' +
    'Nội dung gồm 22 bài của hai trình độ A1 (Sơ cấp) và A2 (Tiền trung cấp), 152 slide dạy, 98 từ và cụm từ, 12 điểm ngữ pháp: động từ to be, tính từ sở hữu, a/an, danh từ số nhiều, danh từ đếm được, like/don\'t like, hiện tại đơn, giới từ at/in/on, can, was/were, quá khứ đơn và be going to.\n\n' +
    'Chín dạng câu hỏi được sinh tự động từ dữ liệu nên mỗi lần học lại một bài sẽ ra đề khác: chọn nghĩa, dịch ngược, nghe và chọn, chọn hình, đúng hay sai, điền vào chỗ trống, nối cặp, gõ đáp án và thẻ ghi nhớ.\n\n' +
    'App ghi nhớ tiến độ theo phương pháp lặp lại ngắt quãng (6 hộp Leitner, giãn cách 1–35 ngày) và có chuỗi ngày học, mục tiêu XP hằng ngày, giải đấu tuần. Toàn bộ dữ liệu chỉ lưu trên máy người học.\n\n' +
    'Mở bằng Safari trên iPhone/iPad hoặc Chrome trên Android rồi chọn "Thêm vào màn hình chính" là dùng được như một app thật, kể cả khi không có mạng.',
  coverImageUrl: '/english-air/icons/icon-512.png',
  driveUrl: WEB_URL,
  webAppUrl: WEB_URL,
  isPublished: true,
};

async function run() {
  await connectDB();

  const existing = await Tool.findOne({ where: { webAppUrl: WEB_URL } });
  if (existing) {
    await existing.update(tool);
    console.log('updated:', existing.title, '->', existing.slug);
  } else {
    const created = await Tool.create(tool);
    console.log('created:', created.title, '->', created.slug);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
