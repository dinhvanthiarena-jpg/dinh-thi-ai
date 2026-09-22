/**
 * Hoa hồng "Giới thiệu bạn bè" 2 cấp — áp dụng cho MỌI thứ bán được trên
 * web (mua tool, đóng học phí khóa học, mua gói Pro). Mô hình A -> B -> C:
 *   - C mua hàng, người giới thiệu trực tiếp của C là B -> B nhận hoa hồng
 *     Cấp 1 (commissionL1Percent).
 *   - Nếu B cũng được ai đó giới thiệu (A = B.parentId) -> A nhận hoa hồng
 *     Cấp 2 (commissionL2Percent) trên CHÍNH đơn hàng đó của C, không phải
 *     hoa hồng của B.
 *   - C không có ai giới thiệu (parentId rỗng) -> không ai được hoa hồng gì.
 *
 * Gọi distributeCommission() ở ĐÚNG 3 nơi tiền thật/ví thật đã được ghi
 * nhận thanh toán xong (KHÔNG gọi lúc tạo đơn, chỉ gọi khi đã chắc chắn đã
 * trả tiền):
 *   - services/walletService.js#muaTool
 *   - services/walletService.js#thanhToanHocPhiBangVi
 *   - controllers/checkoutController.js#mockPayConfirm
 *   - services/proService.js#ghiNhanDaTra
 */
const { Setting, User, WalletTransaction, WithdrawRequest } = require('../models');

async function getRates() {
  const [l1, l2] = await Promise.all([
    Setting.findByPk('commissionL1Percent'),
    Setting.findByPk('commissionL2Percent'),
  ]);
  return {
    l1Percent: Number(l1 ? l1.value : process.env.COMMISSION_L1_PERCENT || 10),
    l2Percent: Number(l2 ? l2.value : process.env.COMMISSION_L2_PERCENT || 3),
  };
}

async function setRates({ l1Percent, l2Percent }) {
  await Setting.upsert({ key: 'commissionL1Percent', value: String(l1Percent) });
  await Setting.upsert({ key: 'commissionL2Percent', value: String(l2Percent) });
}

/**
 * Cộng hoa hồng vào ví 1 người — dùng chung mã "COM-{relatedType}-{relatedId}-{cap}"
 * làm khóa CHỐNG CỘNG TRÙNG: WalletTransaction.code có ràng buộc UNIQUE sẵn,
 * nên nếu hàm này lỡ bị gọi 2 lần cho cùng 1 đơn hàng (vd code gọi nhầm 2
 * chỗ, hoặc race hiếm gặp), lần thứ 2 sẽ vỡ unique constraint và bị bỏ qua
 * an toàn — không cần thêm bảng khóa riêng.
 */
async function congHoaHong(recipient, amount, cap, relatedType, relatedId, moTa) {
  if (amount <= 0) return null;
  const code = `COM-${relatedType}-${relatedId}-${cap}`.toUpperCase();
  try {
    const balanceAfter = (recipient.walletBalance || 0) + amount;
    const tx = await WalletTransaction.create({
      code,
      type: cap === 'L1' ? 'commission_l1' : 'commission_l2',
      amount,
      status: 'paid',
      balanceAfter,
      description: moTa,
      relatedType,
      relatedId,
      paidAt: new Date(),
      UserId: recipient.id,
    });
    await recipient.update({ walletBalance: balanceAfter });
    return tx;
  } catch (err) {
    // Unique constraint trên `code` = đã cộng cho đơn này rồi, bỏ qua êm.
    if (err.name === 'SequelizeUniqueConstraintError') return null;
    throw err;
  }
}

/**
 * @param {User} buyer Người vừa mua hàng (C trong mô hình A -> B -> C).
 * @param {number} amount Giá trị đơn hàng để tính % hoa hồng trên đó.
 * @param {string} relatedType 'Tool' | 'Course' | 'Pro'
 * @param {number} relatedId id của Tool/Course/ProOrder tương ứng.
 */
async function distributeCommission(buyer, amount, relatedType, relatedId) {
  if (!buyer.parentId || !amount) return;
  const rates = await getRates();

  const b = await User.findByPk(buyer.parentId);
  if (!b) return;

  const amountL1 = Math.round((amount * rates.l1Percent) / 100);
  await congHoaHong(
    b,
    amountL1,
    'L1',
    relatedType,
    relatedId,
    `Hoa hồng giới thiệu (${rates.l1Percent}%) từ ${buyer.name} mua ${relatedType === 'Course' ? 'khóa học' : relatedType === 'Tool' ? 'tool' : 'gói Pro'}`
  );

  if (b.parentId) {
    const a = await User.findByPk(b.parentId);
    if (a) {
      const amountL2 = Math.round((amount * rates.l2Percent) / 100);
      await congHoaHong(
        a,
        amountL2,
        'L2',
        relatedType,
        relatedId,
        `Hoa hồng gián tiếp (${rates.l2Percent}%) từ ${buyer.name} (qua ${b.name})`
      );
    }
  }
}

/** Admin duyệt yêu cầu rút tiền — trừ ví + ghi 1 WalletTransaction (idempotent theo status). */
async function duyetRutTien(withdrawRequestId, boi) {
  const req_ = await WithdrawRequest.findByPk(withdrawRequestId);
  if (!req_ || req_.status !== 'pending') return req_;

  const user = await User.findByPk(req_.UserId);
  if (!user) throw new Error('Không tìm thấy người rút tiền.');
  if ((user.walletBalance || 0) < req_.amount) throw new Error('Số dư ví không đủ tại thời điểm duyệt.');

  const balanceAfter = user.walletBalance - req_.amount;
  await user.update({ walletBalance: balanceAfter });
  await WalletTransaction.create({
    type: 'withdraw',
    amount: -req_.amount,
    status: 'paid',
    balanceAfter,
    description: `Rút hoa hồng về ${req_.bankName} - ${req_.bankAccount}`,
    paidAt: new Date(),
    UserId: user.id,
  });
  await req_.update({ status: 'approved', approvedBy: boi, approvedAt: new Date() });
  return req_;
}

async function tuChoiRutTien(withdrawRequestId, boi, note) {
  const req_ = await WithdrawRequest.findByPk(withdrawRequestId);
  if (!req_ || req_.status !== 'pending') return req_;
  await req_.update({ status: 'rejected', approvedBy: boi, approvedAt: new Date(), note: note || '' });
  return req_;
}

module.exports = { getRates, setRates, distributeCommission, duyetRutTien, tuChoiRutTien };
