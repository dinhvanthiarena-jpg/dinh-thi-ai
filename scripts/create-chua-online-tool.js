require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Đăng "Chùa Online 3D" vào Kho tài nguyên (/kho-tai-nguyen) — thầy Đinh Thi Ai yêu cầu 2026-11-01.
// File cài: https://3dvietpro.com/downloads/sa-ai-bot/chua-online/Chua-Online-3D-Setup.exe (đã tải lên bằng FTP).
// Ảnh: public/images/tools/chua-online-cover.png, chua-online-1.png, chua-online-2.png
// Chạy: cd ~/dinh-thi-ai && source ~/nodevenv/dinh-thi-ai/20/bin/activate && node scripts/create-chua-online-tool.js
// (chỉ thay đổi dữ liệu, không cần restart app). Chạy lại sẽ cập nhật mục đã có thay vì tạo trùng.
const TITLE = 'Chùa Online 3D — kết nối trực tiếp TikTok LIVE';

const DESCRIPTION = `Chùa Online 3D là ứng dụng biến buổi livestream TikTok của bạn thành một ngôi chùa 3D sống động. Người xem chỉ cần bình luận hoặc vào phòng live là có một nhân vật 3D xuất hiện, đi vào chùa, ngồi vào ghế rồi quỳ bái trước tượng Phật. Người xem rời đi, nhân vật tự đứng dậy đi ra.

ĐIỂM ĐẶC BIỆT: KẾT NỐI TRỰC TIẾP VỚI TIKTOK LIVE, THỜI GIAN THỰC
Chỉ cần nhập tên kênh TikTok đang live rồi bấm Kết nối. Bình luận, người vào phòng, thả tim, tặng quà, theo dõi, chia sẻ đều hiện ngay trong chùa. Ảnh đại diện TikTok của người xem hiện cạnh tên.

Không gian chùa 3D
Sảnh chùa vàng với tượng Phật và các tia sáng xoay quanh đầu Phật. Hương khói bay nhẹ, đèn lồng, cột rồng, câu đối hai bên, hàng ghế gỗ và nệm cho từng người. Camera trôi nhẹ nhàng, có nhiều góc máy: chính diện, trên cao, bên trái, bên phải, đi theo người mới vào. Có tiếng tụng kinh phát nền, chỉnh âm lượng ngay trong app.

Tương tác tâm linh
Người xem gõ "cầu bình an", "cầu tài lộc", "cầu sức khỏe", "cầu tình duyên"... bảng tâm nguyện tự cộng lượt. Bảng vàng cúng dường và Top tim ghi nhận người ủng hộ. Hai chú tiểu chào đón, cảm ơn người xem và nhắc những lời hay. Phật đọc tên người vào phòng và trả lời ngẫu nhiên bình luận bằng giọng tiếng Việt (bật/tắt bằng ô "Phật nói" và "Đọc tiếng"). Nút Đổi tên để đặt tên chùa, tên kênh riêng của bạn.

Chi phí
69.000đ cho 1 tháng: bạn có sẵn sàng mời tác giả ly coffee không? Rất cảm ơn bạn ủng hộ để đội ngũ phát triển nhiều app hay hơn nữa. Mở app lần đầu sẽ hiện mã QR chuyển khoản, chuyển xong gửi bill kèm mã máy vào Zalo 0977317988, admin gửi key kích hoạt, dán key vào app là dùng được. App tự động cập nhật khi có bản mới, tự cài khi bạn đóng app, không làm gián đoạn buổi live.

HƯỚNG DẪN 1: CÁCH CÀI ĐẶT
Bước 1. Bấm nút Tải về trên trang này để tải file Chua-Online-3D-Setup.exe (dung lượng khoảng 126 MB, dùng cho Windows 10 hoặc 11).
Bước 2. Mở file vừa tải. Nếu Windows hiện cảnh báo "Windows protected your PC" (SmartScreen) vì app chưa ký số, bấm "Thông tin thêm" (More info) rồi bấm "Vẫn chạy" (Run anyway).
Bước 3. Chọn thư mục cài đặt (hoặc để mặc định), bấm Install và đợi cài xong.
Bước 4. Mở app Chua Online 3D từ biểu tượng ngoài màn hình hoặc trong menu Start. Lần đầu mở app sẽ hiện bảng mời cà phê kèm mã QR và mã máy của bạn. Chuyển khoản, gửi bill kèm mã máy qua Zalo 0977317988, dán key nhận được vào ô "Dán key kích hoạt" rồi bấm Kích hoạt.
Bước 5. Muốn xem thử không cần live: tick ô Demo ở thanh phía trên, sẽ thấy người giả đi vào chùa.

HƯỚNG DẪN 2: CÁCH NỐI VỚI TIKTOK LIVE
Phần A. Nối app với buổi live để nhận bình luận
1. Bật buổi live trên TikTok trước (kênh phải đang live thì app mới nhận được dữ liệu).
2. Mở app Chua Online 3D, bỏ tick ô Demo.
3. Ở ô "Tên kênh TikTok đang live", gõ tên kênh của bạn (không cần dấu @), bấm Kết nối.
4. Dòng chữ xanh "Đã kết nối" hiện ra là thành công. Từ giờ ai bình luận hoặc vào phòng sẽ thành nhân vật trong chùa.
5. Bấm phím H (hoặc nút "Ẩn") để ẩn thanh điều khiển cho sạch hình. Muốn hiện lại, rê chuột lên mép trên cửa sổ rồi bấm vào dòng hiện ra, hoặc bấm phím H.

Phần B. Phát hình ảnh chùa lên TikTok LIVE
App chỉ là một cửa sổ trên máy tính, bạn cần dùng phần mềm phát hình để đưa cửa sổ này lên live. Có hai cách thông dụng:
- TikTok LIVE Studio: thêm nguồn "Thu cửa sổ" (Window capture), chọn cửa sổ của app Chua Online 3D, kéo cho vừa khung dọc, rồi bấm Go LIVE.
- OBS Studio: thêm nguồn "Thu cửa sổ" (Window Capture) chọn app, thêm nguồn thu âm thanh ứng dụng để có tiếng tụng kinh, rồi phát lên TikTok. Phần cài đặt phát video từ OBS (nhập mã luồng, chọn độ phân giải) bạn hãy tự tìm hiểu thêm trên mạng với từ khóa "cách phát video từ OBS lên TikTok LIVE". Lưu ý: TikTok chỉ cấp mã luồng cho một số tài khoản, nếu tài khoản của bạn chưa có thì hãy dùng TikTok LIVE Studio.

Lưu ý
App đọc dữ liệu công khai của buổi live bằng phương thức cộng đồng không chính thức, nếu TikTok thay đổi thì app sẽ được cập nhật. Cần Windows 10 hoặc 11.`;

async function run() {
  await connectDB();
  const data = {
    title: TITLE,
    category: 'Ứng dụng',
    shortDescription: 'Biến buổi live TikTok thành ngôi chùa 3D: người xem bình luận là có nhân vật đi vào chùa, quỳ bái Phật, Phật đọc tên và trả lời bình luận. Kết nối TRỰC TIẾP TikTok LIVE.',
    description: DESCRIPTION,
    coverImageUrl: '/images/tools/chua-online-cover.png',
    galleryImages: ['/images/tools/chua-online-1.png', '/images/tools/chua-online-2.png'],
    driveUrl: 'https://3dvietpro.com/downloads/sa-ai-bot/chua-online/Chua-Online-3D-Setup.exe',
    price: 0, // tải miễn phí, thu phí bản quyền ngay trong app (69.000đ/tháng, từ bản 1.2.3 không còn dùng thử)
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
