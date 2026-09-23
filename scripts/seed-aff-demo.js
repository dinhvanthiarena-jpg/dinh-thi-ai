/**
 * Tạo dữ liệu MẪU minh hoạ cho hệ thống "Giới thiệu bạn bè" 3 cấp, đúng
 * cấu trúc trong file đặc tả thầy gửi (WEB -> A -> B -> C -> Khách hàng):
 *   A01 (cấp 1, không ai giới thiệu — nhánh gốc của WEB)
 *    └─ B01 (cấp 2, do A01 giới thiệu)
 *        └─ C01 (cấp 3, do B01 giới thiệu)
 *            └─ KhachD (khách hàng thường, do C01 giới thiệu — không tính
 *               là "thành viên mạng lưới" trên Mindmap vì bản thân KhachD
 *               không giới thiệu ai, chỉ đứng ở vị trí "khách mua qua link
 *               của C" giống hệt ví dụ trong đặc tả)
 * KhachD MUA THẬT 1 tool đang bán trên web (qua đúng hàm walletService,
 * không tự tay cộng số) — để hoa hồng chảy lên C01 (Cấp 1), B01 (Cấp 2),
 * A01 (Cấp 3) đúng bằng code thật đang chạy, không phải số liệu giả.
 *
 * Chạy 1 lần trên máy chủ (an toàn chạy lại nhiều lần — tự nhận ra đã có
 * sẵn thì bỏ qua, không tạo trùng):
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/seed-aff-demo.js
 */
require('dotenv').config();
const { Op } = require('sequelize');
const connectDB = require('../config/db');
const { User, Tool, ToolLicense } = require('../models');
const wallet = require('../services/walletService');

async function taoNguoiDungMauNeuChua(email, name, parentId) {
  let user = await User.findOne({ where: { email } });
  if (user) {
    console.log(`đã có sẵn: ${email}`);
    return user;
  }
  user = await User.create({ name, email, password: 'AffDemo@123', role: 'student', parentId: parentId || null });
  console.log(`đã tạo: ${email} (refCode ${user.refCode})`);
  return user;
}

async function run() {
  await connectDB();

  const a01 = await taoNguoiDungMauNeuChua('demo-a01@vidu.aff', 'Nguyễn Văn A (mẫu — Cấp A)', null);
  const b01 = await taoNguoiDungMauNeuChua('demo-b01@vidu.aff', 'Trần Thị B (mẫu — Cấp B)', a01.id);
  const c01 = await taoNguoiDungMauNeuChua('demo-c01@vidu.aff', 'Lê Văn C (mẫu — Cấp C)', b01.id);
  const khachD = await taoNguoiDungMauNeuChua('demo-khachd@vidu.aff', 'Phạm Thị D (mẫu — Khách hàng)', c01.id);

  const tool = await Tool.findOne({ where: { isPublished: true, price: { [Op.gt]: 0 } } });
  if (!tool) {
    console.log('Không tìm thấy tool trả phí nào đang bán để demo mua hàng — dừng ở bước tạo thành viên.');
    process.exit(0);
  }

  const daMua = await ToolLicense.findOne({ where: { UserId: khachD.id, ToolId: tool.id } });
  if (daMua) {
    console.log(`Khách D đã mua "${tool.title}" từ trước rồi — không mua lại (tránh cộng hoa hồng trùng).`);
    process.exit(0);
  }

  // Nạp đủ tiền vào ví Khách D để mua (thẳng vào walletBalance, giống như
  // đã nạp qua VietQR thật xong — bước NẠP không phải điều đang demo).
  await khachD.update({ walletBalance: (khachD.walletBalance || 0) + tool.price });

  const ketQua = await wallet.muaTool(khachD, tool);
  console.log(`Khách D đã mua "${tool.title}" giá ${tool.price.toLocaleString('vi-VN')}đ qua ví — hoa hồng đã tự chia cho C01 → B01 → A01 (trạng thái "chờ duyệt", sau 7 ngày mới khả dụng).`);
  console.log('License key demo:', ketQua.license.licenseKey);

  console.log('\nXem kết quả tại:');
  console.log('- /admin/aff/mang-luoi (Mindmap) — đăng nhập admin');
  console.log('- /admin/aff/thanh-vien/' + a01.id + ' (chi tiết A01)');
  console.log('- Đăng nhập demo-c01@vidu.aff / AffDemo@123 rồi vào /gioi-thieu-ban-be để xem góc nhìn của C');

  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
