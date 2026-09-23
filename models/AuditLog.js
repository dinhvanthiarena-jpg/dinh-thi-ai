const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Nhật ký cho các hành động NHẠY CẢM của hệ thống Giới thiệu bạn bè/AFF —
// đổi tỷ lệ hoa hồng, duyệt/từ chối rút tiền, duyệt hoa hồng sớm. Chỉ ghi,
// không sửa/xóa — dùng để đối chiếu khi có tranh chấp về sau.
const AuditLog = sequelize.define(
  'AuditLog',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor: { type: DataTypes.STRING, allowNull: false }, // email/tên người thực hiện
    action: { type: DataTypes.STRING, allowNull: false }, // vd 'change_commission_rate'
    targetType: { type: DataTypes.STRING, defaultValue: '' }, // vd 'User', 'WithdrawRequest'
    targetId: { type: DataTypes.STRING, defaultValue: '' },
    oldValue: { type: DataTypes.TEXT, defaultValue: '' },
    newValue: { type: DataTypes.TEXT, defaultValue: '' },
    reason: { type: DataTypes.STRING, defaultValue: '' },
  },
  { tableName: 'audit_logs', updatedAt: false }
);

module.exports = AuditLog;
