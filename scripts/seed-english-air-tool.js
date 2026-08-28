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
  title: 'Mon.L — Học ngoại ngữ',
  category: 'Ứng dụng',
  shortDescription:
    'App học ngoại ngữ theo lối dạy trước, luyện sau: 60 bài từ A1 đến B1, và một linh vật nói chuyện được cả tiếng Việt, tiếng Anh lẫn tiếng Trung.',
  description:
    'Mon.L dạy ngoại ngữ theo cách của một người thầy chứ không phải một trò chơi: mỗi bài đều đi qua các slide dạy — từ mới có phiên âm, ghi chú và ví dụ, bảng ngữ pháp, góc văn hoá, hội thoại mẫu — rồi mới tới phần câu hỏi.\n\n' +
    'Nội dung gồm 60 bài của ba trình độ A1, A2 và B1, chia thành 12 chương, mỗi chương 5 bài kèm một bài ôn tập. Tổng cộng 361 từ và cụm từ, không từ nào lặp lại, đủ các điểm ngữ pháp từ động từ to be tới câu điều kiện loại 2 và cách thuật lại lời người khác.\n\n' +
    'Chín dạng câu hỏi được sinh tự động từ dữ liệu nên mỗi lần học lại một bài sẽ ra đề khác: chọn nghĩa, dịch ngược, nghe và chọn, chọn hình, đúng hay sai, điền vào chỗ trống, nối cặp, gõ đáp án và thẻ ghi nhớ.\n\n' +
    'Đặc biệt có màn gọi video với MON.L — linh vật đứng trong phòng học, cử động và mấp máy miệng theo lời nói. Nói chuyện tự do với nó bằng tiếng Việt, tiếng Anh hay tiếng Trung đều được: bạn nói tiếng nào, nó tự nhận ra và đáp lại đúng tiếng đó, không phải chọn trước.\n\n' +
    'App ghi nhớ tiến độ theo phương pháp lặp lại ngắt quãng (6 hộp Leitner, giãn cách 1–35 ngày) và có chuỗi ngày học, mục tiêu XP hằng ngày, giải đấu tuần. Toàn bộ tiến độ chỉ lưu trên máy người học.\n\n' +
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
