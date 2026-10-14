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
    'SA-TRACKING LINK giúp người làm affiliate tạo link theo dõi hàng loạt chỉ trong vài giây.\n\n' +
    'Dán một hoặc nhiều link sản phẩm gốc, chọn kênh phân phối (Facebook Group, Fanpage, TikTok Bio, Telegram, Zalo…), bấm tạo: tool tự nhận sàn, loại bỏ tham số rác, ghép mã affiliate đã lưu và gắn UTM/SubID riêng của kênh. Kết quả hiện thành bảng, copy từng link hoặc tất cả, tải CSV.\n\n' +
    'Mã định danh, mẫu link và danh sách kênh lưu ngay trên máy bạn, có thể xuất/nhập để sao lưu. Ứng dụng tự kiểm tra và cập nhật bản mới mỗi khi có mạng, vẫn dùng được khi offline.',
  coverImageUrl: '/sa-tracking-link/icon.svg',
  driveUrl: WEB_URL,
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
