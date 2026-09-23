const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Sổ giao dịch ví — nguồn sự thật cho lịch sử, còn User.walletBalance là số dư
 * hiện tại (cache, cập nhật cùng lúc với mỗi giao dịch để đọc nhanh không cần
 * cộng dồn lại từ đầu mỗi lần hiển thị).
 *
 * `code` chỉ dùng cho giao dịch nạp tiền (type=topup) — mã ghi trong nội dung
 * chuyển khoản, giống hệt cơ chế ProOrder/proService.js đã chạy ổn cho gói
 * Pro: quét VietQR đã nhúng sẵn mã, SePay đọc được biến động số dư thì đối
 * chiếu mã này để cộng tiền vào ví — không ai phải nhập số thẻ ở đâu cả.
 */
const WalletTransaction = sequelize.define(
  'WalletTransaction',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    code: { type: DataTypes.STRING, allowNull: true, unique: true },
    type: {
      type: DataTypes.ENUM('topup', 'purchase', 'refund', 'adjustment', 'commission_l1', 'commission_l2', 'commission_l3', 'withdraw'),
      allowNull: false,
    },
    // Số tiền có dấu: dương là cộng vào ví (nạp/hoàn tiền), âm là trừ (mua hàng).
    amount: { type: DataTypes.INTEGER, allowNull: false },
    balanceAfter: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'cancelled'), defaultValue: 'paid' },
    description: { type: DataTypes.STRING, defaultValue: '' },
    // Gắn với thứ đã mua (Tool, Course...) mà không cần bảng nối riêng cho từng loại.
    relatedType: { type: DataTypes.STRING, allowNull: true },
    relatedId: { type: DataTypes.INTEGER, allowNull: true },
    bankRef: { type: DataTypes.STRING, defaultValue: '' },
    bankAmount: { type: DataTypes.INTEGER, allowNull: true },
    rawPayload: { type: DataTypes.TEXT, defaultValue: '' },
    confirmedBy: { type: DataTypes.STRING, defaultValue: '' },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'wallet_transactions' }
);

module.exports = WalletTransaction;
