const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Yêu cầu rút hoa hồng giới thiệu về ngân hàng cá nhân — tách riêng khỏi
// WalletTransaction: request ở trạng thái "pending" CHƯA trừ ví, chỉ khi
// Admin duyệt (status -> 'approved') mới thực sự trừ tiền + ghi 1
// WalletTransaction (type='withdraw', amount âm) — xem
// services/commissionService.js#duyetRutTien.
const WithdrawRequest = sequelize.define(
  'WithdrawRequest',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    bankName: { type: DataTypes.STRING, allowNull: false },
    bankAccount: { type: DataTypes.STRING, allowNull: false },
    bankAccountName: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending' },
    approvedBy: { type: DataTypes.STRING, defaultValue: '' },
    approvedAt: { type: DataTypes.DATE, allowNull: true },
    note: { type: DataTypes.STRING, defaultValue: '' },
  },
  { tableName: 'withdraw_requests' }
);

module.exports = WithdrawRequest;
