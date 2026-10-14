require('dotenv').config();
const connectDB = require('../config/db');
const Tool = require('../models/Tool');

// SA-TRACKING LINK — web-app tĩnh phục vụ tại /sa-tracking-link/ (xem
// seed-english-air-tool.js để hiểu vì sao driveFileId để null).
const WEB_URL = 'https://3dvietpro.com/sa-tracking-link/';

const tool = {
  title: 'SA-TRACKING LINK — Tạo link affiliate',
  category: 'Ứng dụng',
  shortDescription:
    'Dán link sản phẩm Shopee, Lazada, TikTok Shop — tự làm sạch, gắn mã affiliate và UTM/SubID theo từng kênh, copy 1 chạm. Tự cập nhật khi có mạng.',
  description:
    '<div style="margin:0 0 24px"><p style="font-weight:700;margin:0 0 10px">▶ Video: cài SA-TRACKING LINK lên iPhone chỉ trong 30 giây</p>' +
    '<video controls playsinline preload="none" poster="/sa-tracking-link/huong-dan-iphone.jpg" style="width:100%;max-width:300px;border-radius:18px;border:1px solid #e5e7eb;background:#000"><source src="/sa-tracking-link/huong-dan-iphone.mp4" type="video/mp4"></video></div>
' +
    'SA-TRACKING LINK giúp người làm affiliate tạo link theo dõi hàng loạt chỉ trong vài giây.\n\n' +
    'Dán một hoặc nhiều link sản phẩm gốc, chọn kênh phân phối (Facebook Group, Fanpage, TikTok Bio, Telegram, Zalo…), bấm tạo: tool tự nhận sàn, loại bỏ tham số rác, ghép mã affiliate đã lưu và gắn UTM/SubID riêng của kênh. Kết quả hiện thành bảng, copy từng link hoặc tất cả, tải CSV.\n\n' +
    'Mã định danh, mẫu link và danh sách kênh lưu ngay trên máy bạn, có thể xuất/nhập để sao lưu. Tải về dùng được trên cả máy tính (file cài Windows) lẫn điện thoại (Android, iPhone). Ứng dụng tự kiểm tra và cập nhật bản mới mỗi khi có mạng, vẫn dùng được khi offline.',
  coverImageUrl: '/sa-tracking-link/icon.svg',
  galleryImages: ['/sa-tracking-link/screenshot.png'],
  // Link tải bản cài Windows (GitHub Release, ghi đè file khi ra bản cài mới). Đổi khác webAppUrl nên trang tool hiện cặp Máy tính + Điện thoại.
  driveUrl: 'https://github.com/dinhvanthiarena-jpg/dinh-thi-ai/releases/download/sa-tracking-link/SA-TRACKING-LINK-Setup.exe',
  webAppUrl: WEB_URL,
  isPublished: true,
};

async function run() {
  await connectDB();
  const existing = await Tool.findOne({ where: { webAppUrl: WEB_URL } });
  if (existing) { await existing.update(tool); console.log('updated:', existing.title, '->', existing.slug); }
  else { const c = await Tool.create(tool); console.log('created:', c.title, '->', c.slug); }
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });
