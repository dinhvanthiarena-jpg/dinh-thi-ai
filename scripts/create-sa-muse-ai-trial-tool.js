require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Đăng "Sa Muse Ai — BẢN DÙNG THỬ 5 NGÀY" vào Kho tài nguyên (/kho-tai-nguyen) — thầy Đinh Thi Ai yêu cầu 2026-11-05.
// Đây là MỤC RIÊNG, nằm cạnh bản thật, để khách xem rồi mới tải (không phải link tải thẳng).
// File cài RIÊNG: public/downloads/Sa_Muse_Ai_Dung_Thu.exe (bản có cờ dùng thử 5 ngày, auto-update TẮT).
// Ảnh dùng chung avatar mới: public/images/tools/sa-muse-ai-cover.png, sa-muse-ai-1.jpg, sa-muse-ai-2.jpg
// Chạy: cd ~/dinh-thi-ai && source ~/nodevenv/dinh-thi-ai/20/bin/activate && node scripts/create-sa-muse-ai-trial-tool.js
// (chỉ thay đổi dữ liệu, không cần restart app). Chạy lại sẽ cập nhật mục đã có thay vì tạo trùng.
const TITLE = 'Sa Muse Ai — Bản dùng thử 5 ngày miễn phí';

const DESCRIPTION = `Đây là BẢN DÙNG THỬ của Sa Muse Ai — phần mềm tạo video AI HÀNG LOẠT trên nền Muse. Tải về cài là dùng được NGAY, MIỄN PHÍ 5 NGÀY với ĐẦY ĐỦ TÍNH NĂNG, không cần key. Thích thì mua key dùng tiếp, không thì thôi — không mất gì.

DÙNG THỬ MIỄN PHÍ 5 NGÀY — ĐẦY ĐỦ TÍNH NĂNG
Cài xong mở lên là chạy luôn, không cần nhập key. Bạn có trọn 5 ngày để trải nghiệm: tạo video hàng loạt, giữ nhân vật bằng ảnh tham chiếu @tag, nối dài video tới 3 phút, chạy nhiều tài khoản. Hết 5 ngày, nhập key bản quyền vào là dùng tiếp (liên hệ mua key bên dưới).

LÀM VIDEO HÀNG LOẠT, KHÔNG NGỒI CANH
Soạn 10, 20, 50 dòng ý tưởng là có 10, 20, 50 video. Tool chạy cuốn chiếu nhiều luồng, video xong đến đâu hiện đến đó, bấm Tải MP4 là có file trong máy.

GIỮ NGUYÊN NHÂN VẬT QUA TỪNG TẬP
Tải ảnh nhân vật lên một lần, gõ @tên-nhân-vật trong prompt là Muse giữ đúng khuôn mặt, kiểu tóc, trang phục qua mọi video — hợp làm phim bộ, series TikTok/YouTube nhiều tập.

NỐI DÀI VIDEO TỚI 3 PHÚT & CHỌN KHUNG HÌNH
1-2-3 phút tự chia phần rồi ghép thành MỘT file liền mạch. 9:16 dọc cho TikTok/Reels/Shorts, 16:9 ngang cho YouTube, 1:1 vuông cho Facebook.

SAU 5 NGÀY — MUA KEY ĐỂ DÙNG TIẾP
Hết hạn dùng thử, nhập key bản quyền vào màn hình kích hoạt là chạy full trở lại (không phải cài lại). Mỗi key dùng cho đúng 1 máy tính, thời hạn 30 ngày.
Mua key / hỗ trợ: email dinhvanthi.arena@gmail.com hoặc nhắn Fanpage https://www.facebook.com/dinhthi.daotao

HƯỚNG DẪN CÀI ĐẶT
Bước 1. Bấm nút Tải về trên trang này để tải file Sa_Muse_Ai_Dung_Thu.exe (khoảng 150 MB, dành cho Windows 10/11).
Bước 2. Mở file vừa tải. Nếu Windows hiện cảnh báo "Windows protected your PC" (SmartScreen), bấm "More info" rồi "Run anyway".
Bước 3. Cài xong, mở Sa Muse Ai từ biểu tượng ngoài màn hình. Lần đầu mở, tool tự chuẩn bị môi trường (cần mạng, mất vài phút).
Bước 4. Mở lên là CHẠY THỬ LUÔN — bạn có 5 NGÀY DÙNG THỬ MIỄN PHÍ, đầy đủ tính năng, không cần nhập gì. Góc phải tool hiện số ngày dùng thử còn lại.
Bước 5. Vào "Tài khoản Muse" thêm tài khoản Muse của bạn, dán danh sách ý tưởng rồi bấm "Bắt đầu tạo video".
Bước 6. Hết 5 ngày, nhập key bản quyền vào màn hình kích hoạt để dùng tiếp (liên hệ email/fanpage để mua key).

YÊU CẦU
Windows 10 hoặc 11, có cài Google Chrome, có tài khoản Muse và kết nối mạng.`;

async function run() {
  await connectDB();
  const data = {
    title: TITLE,
    category: 'Ứng dụng',
    shortDescription: 'DÙNG THỬ MIỄN PHÍ 5 NGÀY, đầy đủ tính năng, không cần key. Tạo video AI hàng loạt trên Muse: mỗi dòng ý tưởng là một video, giữ nhân vật bằng @tag, nối dài tới 3 phút, tự tải MP4 về máy. Hết 5 ngày nhập key dùng tiếp.',
    description: DESCRIPTION,
    coverImageUrl: '/images/tools/sa-muse-ai-cover.png',
    galleryImages: ['/images/tools/sa-muse-ai-1.jpg', '/images/tools/sa-muse-ai-2.jpg'],
    driveUrl: 'https://3dvietpro.com/downloads/Sa_Muse_Ai_Dung_Thu.exe',
    price: 0, // tải miễn phí, dùng thử 5 ngày; sau đó mua key ở bản thật (/admin/key-muse)
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
