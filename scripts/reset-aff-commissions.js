require('dotenv').config();
const connectDB = require('../config/db');

// Yêu cầu 2026-09-26: "cho về 0 đồng hết đi" + "xoá tiền thôi còn để lại
// tên" — xoá sạch toàn bộ tiền hoa hồng AFF (cả tài khoản thật dinhnam/Đinh
// Văn Cường lẫn 3 dòng "mẫu"), nhưng KHÔNG xoá bất kỳ User nào (giữ tên) và
// KHÔNG đụng vào doanh thu thật (Order/ProOrder/Tool đã thanh toán) — đó là
// tiền bán hàng thật, khác hẳn hoa hồng AFF.
async function run() {
  await connectDB();
  const { User, WalletTransaction, WithdrawRequest } = require('../models');
  const { Op } = require('sequelize');

  const rows = await WalletTransaction.findAll({
    where: { type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3', 'withdraw'] } },
  });

  const tacDongTheoUser = new Map(); // UserId -> tổng cần trừ khỏi walletBalance
  for (const tx of rows) {
    // Chỉ giao dịch đã 'paid' mới từng được cộng/trừ thật vào walletBalance
    // (xem commissionService.js#duyetMotHoaHong và #duyetRutTien) — dòng
    // 'pending' chưa từng đụng tới ví nên không cần trừ lại gì.
    if (tx.status !== 'paid') continue;
    tacDongTheoUser.set(tx.UserId, (tacDongTheoUser.get(tx.UserId) || 0) + tx.amount);
  }

  for (const [userId, tongTac] of tacDongTheoUser) {
    const user = await User.findByPk(userId);
    if (!user) continue;
    const soDuCu = user.walletBalance || 0;
    const soDuMoi = Math.max(0, soDuCu - tongTac);
    await user.update({ walletBalance: soDuMoi });
    console.log(`Ví "${user.name}" (${user.email}): ${soDuCu.toLocaleString('vi-VN')}đ -> ${soDuMoi.toLocaleString('vi-VN')}đ (trừ ${tongTac.toLocaleString('vi-VN')}đ hoa hồng/rút tiền)`);
  }

  const soGiaoDich = await WalletTransaction.destroy({
    where: { type: { [Op.in]: ['commission_l1', 'commission_l2', 'commission_l3', 'withdraw'] } },
  });
  const soYeuCauRut = await WithdrawRequest.destroy({ where: {} });

  console.log(`Đã xoá ${soGiaoDich} giao dịch hoa hồng/rút tiền, ${soYeuCauRut} yêu cầu rút tiền.`);
  console.log('Không đụng tới User (giữ nguyên tên/tài khoản) và không đụng tới doanh thu Order/ProOrder/Tool.');
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
