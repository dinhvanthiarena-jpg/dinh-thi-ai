require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Đăng "Sa Muse Ai" vào Kho tài nguyên (/kho-tai-nguyen) — thầy Đinh Thi Ai yêu cầu 2026-11-05.
// File cài: upload lên public/downloads/Sa_Muse_Ai_Setup.exe (URL ổn định, mỗi bản mới ghi đè file này
// rồi khai báo phiên bản ở /admin/key-muse để máy khách tự cập nhật).
// Ảnh: public/images/tools/sa-muse-ai-cover.png, sa-muse-ai-1.jpg, sa-muse-ai-2.jpg
// Chạy: cd ~/dinh-thi-ai && source ~/nodevenv/dinh-thi-ai/20/bin/activate && node scripts/create-sa-muse-ai-tool.js
// (chỉ thay đổi dữ liệu, không cần restart app). Chạy lại sẽ cập nhật mục đã có thay vì tạo trùng.
const TITLE = 'Sa Muse Ai — tool tạo video AI hàng loạt';

const DESCRIPTION = `Sa Muse Ai là phần mềm tạo video AI HÀNG LOẠT trên nền Muse: bạn dán cả danh sách ý tưởng vào, mỗi dòng là một video, bấm chạy rồi để tool tự làm từ đầu đến cuối — tự gửi prompt, tự chờ render, tự tải video MP4 về máy.

LÀM VIDEO HÀNG LOẠT, KHÔNG NGỒI CANH
Soạn 10, 20, 50 dòng ý tưởng là có 10, 20, 50 video. Tool chạy cuốn chiếu nhiều luồng trên nhiều tài khoản Muse cùng lúc, video xong đến đâu hiện trong danh sách đến đó (lưới 6 video mỗi hàng, khung đúng tỷ lệ), bấm Tải MP4 là có file trong máy.

GIỮ NGUYÊN NHÂN VẬT QUA TỪNG TẬP
Kho ảnh tham chiếu với @tag: tải ảnh nhân vật lên một lần, gõ @tên-nhân-vật trong prompt là Muse giữ đúng khuôn mặt, kiểu tóc, trang phục qua mọi video — làm phim bộ, series TikTok/YouTube nhiều tập cực hợp.

NỐI DÀI VIDEO TỚI 3 PHÚT
Chọn 1 phút, 2 phút hoặc 3 phút: tool tự chia video thành các phần, phần sau mở đầu đúng bằng khung hình cuối phần trước để cảnh và nhân vật liền mạch, xong tự ghép thành MỘT file duy nhất.

CHỌN KHUNG HÌNH THEO NỀN TẢNG
9:16 dọc cho TikTok/Reels/Shorts, 16:9 ngang cho YouTube, 1:1 vuông cho Facebook. Thời lượng từ 5 giây tới 3 phút.

TỰ ĐỘNG CẬP NHẬT
Có bản mới là tool tự tải về và tự cài lại khi máy có mạng — bạn không phải làm gì.

BẢN QUYỀN & MUA KEY
Mỗi key dùng cho đúng 1 máy tính, thời hạn 30 ngày (gia hạn qua admin). Nhập key vào tool là chạy, key tự gắn vào máy của bạn khi kích hoạt.
Mua key / hỗ trợ: email dinhvanthi.arena@gmail.com hoặc nhắn Fanpage https://www.facebook.com/dinhthi.daotao

HƯỚNG DẪN CÀI ĐẶT
Bước 1. Bấm nút Tải về trên trang này để tải file Sa_Muse_Ai_Setup.exe (khoảng 150 MB, dành cho Windows 10/11).
Bước 2. Mở file vừa tải. Nếu Windows hiện cảnh báo "Windows protected your PC" (SmartScreen), bấm "More info" rồi "Run anyway".
Bước 3. Cài xong, mở Sa Muse Ai từ biểu tượng ngoài màn hình. Lần đầu mở, tool tự chuẩn bị môi trường (cần mạng, mất vài phút).
Bước 4. Nhập key bản quyền vào màn hình kích hoạt (liên hệ email/fanpage ở trên để được cấp key) — key tự gắn vào máy bạn.
Bước 5. Vào "Tài khoản Muse" thêm tài khoản Muse của bạn, dán danh sách ý tưởng rồi bấm "Bắt đầu tạo video".

YÊU CẦU
Windows 10 hoặc 11, có cài Google Chrome, có tài khoản Muse và kết nối mạng.`;

async function run() {
  await connectDB();
  const data = {
    title: TITLE,
    category: 'Ứng dụng',
    shortDescription: 'Tạo video AI hàng loạt trên Muse: mỗi dòng ý tưởng là một video, giữ nguyên nhân vật bằng ảnh tham chiếu @tag, nối dài video tới 3 phút, chạy nhiều tài khoản nhiều luồng, tự tải MP4 về máy.',
    description: DESCRIPTION,
    coverImageUrl: '/images/tools/sa-muse-ai-cover.png',
    galleryImages: ['/images/tools/sa-muse-ai-1.jpg', '/images/tools/sa-muse-ai-2.jpg'],
    driveUrl: 'https://3dvietpro.com/downloads/Sa_Muse_Ai_Setup.exe',
    price: 0, // tải miễn phí, thu phí key bản quyền (key 30 ngày / 1 máy, cấp ở /admin/key-muse)
    isPublished: true,
  };
  const existing = await Tool.findOne({ where: { title: TITLE } });
  if (existing) {
    existing.set(data);
    await existing.save();
    console.log('Đã cập nhật:', existing.id, existing.slug);
  } else {
    const t = await Tool.create(data);
    console.log('Đã tạo:', t.id, t.slug);
  }
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
