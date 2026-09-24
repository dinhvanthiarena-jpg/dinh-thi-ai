require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// Thầy Đinh Thi Ai yêu cầu 2026-09-24: chèn banner "5 bước dùng SA-AI BOT"
// (F:\TOOL 3DVIETPRO\KINH DOANH AFF\anh baner.png, copy vào
// public/images/tools/sa-ai-bot-how-it-works.png) lên NGAY ĐẦU bài giới thiệu.
const imgBlock = (src, alt) =>
  `<div class="rounded-2xl overflow-hidden shadow-card my-6"><img src="${src}" alt="${alt}" class="w-full h-auto object-cover" loading="lazy" /></div>`;

async function run() {
  await connectDB();

  const tool = await Tool.findByPk(6);
  if (!tool) {
    console.error('Không tìm thấy Tool id 6');
    process.exit(1);
  }

  tool.set({
    description: `${imgBlock('/images/tools/sa-ai-bot-how-it-works.png', 'SA-AI BOT — 5 bước sử dụng: đăng nhập web, ra lệnh đăng bài tự động, tìm key hot, bot Zalo, bot Telegram')}

SA-AI BOT — Một bộ não AI, phủ sóng mọi mặt trận bán hàng

Không phải thêm một cái app nữa để bạn phải mở 5-6 lần mỗi ngày. SA-AI BOT là bộ não AI DUY NHẤT, làm việc thay bạn trên tất cả các nền tảng bạn đang bán hàng.

🧠 Trái tim của tool: MỘT bộ não AI, chạy khắp mọi nơi
Bạn không cần viết bài, không cần nghĩ chủ đề, không cần đăng tay từng chỗ. Chỉ cần cấu hình một lần duy nhất, AI sẽ:
- Tự tra cứu tin tức/xu hướng mới nhất, thật nhất đúng lĩnh vực của bạn
- Tự viết bài — văn phong tự nhiên, không sao chép, không trùng lặp
- Tự tìm ảnh minh hoạ phù hợp
- Tự đăng đồng thời lên Website + Fanpage + nhiều Group cùng lúc

Bạn ngủ, bộ não AI vẫn thức làm việc. Bạn không cần nhớ hôm nay đã đăng bài chưa — nó tự chạy hàng ngày, đúng khung giờ, đúng tần suất bạn đặt.

${imgBlock('/images/tools/sa-ai-bot-overview.png', 'SA-AI BOT — bộ não AI tất-cả-trong-một')}

📢 Kéo traffic từ MỌI nền tảng — không bỏ sót một cánh cửa khách hàng nào
Khách hàng của bạn không chỉ ở một chỗ. SA-AI BOT phủ sóng đúng nơi họ đang lướt:

🌐 Website — Tự đăng bài chuẩn SEO, tự quét lỗi & đo tốc độ tải trang bằng dữ liệu thật từ Google
📘 Facebook — Chạy Ads thông minh (AI đề xuất ngân sách, đối tượng, viết copy) + đăng bài tự động lên Fanpage & nhiều Group
💬 Telegram — Chatbot AI trực 24/7, trả lời khách đúng tính cách thương hiệu của bạn — không bao giờ để khách chờ
💚 Zalo — Tự động nhắn tin, chăm sóc bạn bè/nhóm Zalo sẵn có, tự trả lời khi có người nhắn tới

${imgBlock('/images/tools/sa-ai-bot-zalo-auto.png', 'SA-AI BOT — Zalo Auto nhắn tin, trả lời tự động')}

Một nội dung, một chiến dịch — phủ khắp 4 mặt trận cùng lúc, thay vì bạn phải đăng nhập từng nền tảng, đăng tay từng nơi mỗi ngày.

🎯 Không chỉ đăng bài — còn biết chạy Ads và tự tối ưu
- AI Decision Center: AI tự đọc toàn bộ chiến dịch, tự phát hiện vấn đề, tự đề xuất hành động — bạn chỉ cần bấm duyệt
- AI Learning Loop: càng dùng lâu, AI càng "học" ra quy luật khách hàng của riêng bạn — không chỉ nhận xét dữ liệu hôm nay
- Tự động tối ưu ngân sách: tắt chiến dịch kém hiệu quả, tăng ngân sách chiến dịch đang tốt — không cần canh máy cả ngày
- Nghiên cứu đối thủ: xem đối thủ đang chạy quảng cáo gì, target luôn người đang quan tâm tới họ

🔐 An toàn tuyệt đối
- Mọi tài khoản, API Key chỉ lưu trên máy của bạn — gửi thẳng tới Facebook/Google/AI, không qua máy chủ trung gian nào
- Chiến dịch quảng cáo luôn tạo ở trạng thái tạm dừng — tool không bao giờ tự ý tiêu tiền thay bạn, bạn luôn là người bấm nút cuối cùng

Vì sao chọn SA-AI BOT thay vì dùng rời từng công cụ?
Một Fanpage cần công cụ đăng bài. Một website cần công cụ SEO. Một shop cần công cụ chatbot. Bình thường bạn phải trả tiền cho 4-5 phần mềm khác nhau, tự tay nối chúng lại với nhau.

SA-AI BOT gộp tất cả vào một nơi, dùng chung một bộ não AI — tiết kiệm thời gian, tiết kiệm chi phí, và quan trọng nhất: không bỏ sót nền tảng nào trong cuộc chiến giành khách hàng.

👉 Sẵn sàng để AI làm việc thay bạn 24/7 trên mọi nền tảng?
Sở hữu SA-AI BOT ngay hôm nay — 1 lần cài đặt, chạy mãi mãi.`,
  });
  await tool.save();

  console.log('Đã chèn banner đầu bài:', tool.id, tool.slug);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
