require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Tạo mục "SA-AI BOT" trong Kho tài nguyên (/kho-tai-nguyen) — thầy Đinh Thi Ai
// yêu cầu 2026-09-24: đăng giới thiệu công cụ desktop SA-AI BOT (fb-ads-manager)
// lên đây để khách bấm mua. Ảnh bìa lấy từ D:\CLAUDE CODE\fb-ads-manager\assets\
// "bia tool.png", copy sẵn vào public/images/tools/sa-ai-bot-cover.png.
//
// Tạo ở trạng thái ẨN (isPublished: false) + link tải PLACEHOLDER vì thầy CHƯA
// gửi file cài đặt thật và CHƯA chốt giá bán — cập nhật 2 trường driveUrl/price
// rồi bật isPublished khi thầy gửi file + giá, KHÔNG được để hiện công khai lúc
// link tải còn là placeholder (khách sẽ mua/tải phải lỗi).
async function run() {
  await connectDB();

  const existing = await Tool.findOne({ where: { title: 'SA-AI BOT — Bộ não AI siêu trí tuệ cho web' } });
  if (existing) {
    console.log('Đã tồn tại, bỏ qua:', existing.id, existing.slug);
    process.exit(0);
  }

  const tool = await Tool.create({
    title: 'SA-AI BOT — Bộ não AI siêu trí tuệ cho web',
    category: 'Công cụ',
    shortDescription: 'Bộ não AI tất-cả-trong-một: tự chạy quảng cáo Facebook & Google, tự đăng bài đa nền tảng, tự chăm sóc khách qua Telegram & Zalo.',
    description: `Không phải thêm một cái app nữa để bạn phải mở 5-6 lần mỗi ngày. SA-AI BOT là bộ não AI DUY NHẤT, làm việc thay bạn trên tất cả các nền tảng bạn đang bán hàng — từ Website, Facebook, cho tới Telegram và Zalo.

Trái tim của tool: một bộ não AI, chạy khắp mọi nơi
Bạn không cần viết bài, không cần nghĩ chủ đề, không cần đăng tay từng chỗ. Chỉ cần cấu hình một lần duy nhất, AI sẽ tự tra cứu tin tức và xu hướng mới nhất đúng lĩnh vực của bạn, tự viết bài với văn phong tự nhiên không sao chép không trùng lặp, tự tìm ảnh minh hoạ phù hợp, rồi tự đăng đồng thời lên Website, Fanpage và nhiều Group cùng lúc.

Bạn ngủ, bộ não AI vẫn thức làm việc. Bạn không cần nhớ hôm nay đã đăng bài chưa — nó tự chạy hàng ngày, đúng khung giờ, đúng tần suất bạn đặt.

Kéo traffic từ mọi nền tảng — không bỏ sót cánh cửa khách hàng nào
Khách hàng của bạn không chỉ ở một chỗ. SA-AI BOT phủ sóng đúng nơi họ đang lướt mỗi ngày.

Website: tự đăng bài chuẩn SEO, tự quét lỗi và đo tốc độ tải trang bằng dữ liệu thật từ Google.
Facebook: chạy quảng cáo thông minh — AI tự đề xuất ngân sách, đối tượng, viết nội dung quảng cáo — kèm đăng bài tự động lên Fanpage và nhiều Group cùng lúc.
Telegram: chatbot AI trực 24/7, trả lời khách đúng tính cách thương hiệu của bạn, không bao giờ để khách chờ.
Zalo: tự động nhắn tin, chăm sóc bạn bè và nhóm Zalo sẵn có, tự trả lời ngay khi có người nhắn tới.

Một nội dung, một chiến dịch, phủ khắp các mặt trận cùng lúc — thay vì bạn phải đăng nhập từng nền tảng, đăng tay từng nơi mỗi ngày.

Không chỉ đăng bài — còn biết chạy quảng cáo và tự tối ưu
AI Decision Center tự đọc toàn bộ chiến dịch, tự phát hiện vấn đề, tự đề xuất hành động, bạn chỉ cần bấm duyệt. AI Learning Loop càng dùng lâu càng học ra quy luật khách hàng của riêng bạn. Tool cũng tự động tắt chiến dịch kém hiệu quả, tự tăng ngân sách chiến dịch đang tốt, để bạn không cần canh máy tính cả ngày. Cần nghiên cứu đối thủ? Tool cho xem đối thủ đang chạy quảng cáo gì, và target thẳng vào người đang quan tâm tới họ.

Không chỉ chạy quảng cáo — còn biết tiền lời thật là bao nhiêu
Tool tính lợi nhuận thật, đã trừ giá vốn, phí ship, hoa hồng và chi phí quảng cáo, chứ không chỉ dừng ở một con số ROAS đẹp trên bề mặt. Đi kèm là CRM chấm điểm khách hàng tiềm năng tự động, giúp bạn biết ai đáng chăm sóc trước.

An toàn tuyệt đối
Mọi tài khoản và API Key chỉ lưu trên máy của bạn, gửi thẳng tới Facebook, Google, AI — không qua bất kỳ máy chủ trung gian nào. Chiến dịch quảng cáo luôn được tạo ở trạng thái tạm dừng, tool không bao giờ tự ý tiêu tiền thay bạn, bạn luôn là người bấm nút kích hoạt cuối cùng.

Vì sao chọn một tool duy nhất thay vì dùng rời từng công cụ
Một Fanpage cần công cụ đăng bài. Một website cần công cụ SEO. Một shop cần công cụ chatbot chăm sóc khách. Bình thường bạn phải trả tiền cho nhiều phần mềm khác nhau, rồi tự tay nối chúng lại với nhau. SA-AI BOT gộp tất cả vào một nơi, dùng chung một bộ não AI duy nhất — tiết kiệm thời gian, tiết kiệm chi phí, và không bỏ sót nền tảng nào trong cuộc chiến giành khách hàng.

Sẵn sàng để AI làm việc thay bạn 24/7 trên mọi nền tảng? Sở hữu SA-AI BOT ngay hôm nay — một lần cài đặt, chạy mãi mãi.`,
    coverImageUrl: '/images/tools/sa-ai-bot-cover.png',
    driveUrl: 'CHUA-CO-FILE-SE-CAP-NHAT-SAU',
    price: 0,
    isPublished: false,
  });

  console.log('Đã tạo:', tool.id, tool.slug);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
