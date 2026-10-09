const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * HỢP ĐỒNG ĐIỆN TỬ SA-BOTAI của từng khách — tự sinh khi khách tích đồng ý điều khoản (thầy yêu cầu 2026-10-09:
 * "lưu vào hệ thống cùng thông tin người đăng ký, tự ra luôn bản hợp đồng, để an toàn về luật").
 * BẤT BIẾN: chỉ thêm mới. `html` là nguyên văn hợp đồng đã điền thông tin Bên B + giá tại thời điểm giao kết;
 * `contentHash` (SHA-256 của html) để chứng minh nội dung không bị sửa sau này. Các trường tên/email/SĐT/IP/giờ
 * được chép lại (snapshot) để dù tài khoản đổi thông tin hay bị xoá thì hợp đồng vẫn còn đủ.
 */
const Contract = sequelize.define(
  'Contract',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    contractNo: { type: DataTypes.STRING(40), allowNull: false, unique: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    version: { type: DataTypes.STRING(40), allowNull: false },
    customerName: { type: DataTypes.STRING(200), allowNull: true },
    customerEmail: { type: DataTypes.STRING(200), allowNull: true },
    customerPhone: { type: DataTypes.STRING(40), allowNull: true },
    ip: { type: DataTypes.STRING(64), allowNull: true },
    userAgent: { type: DataTypes.STRING(300), allowNull: true },
    source: { type: DataTypes.STRING(40), allowNull: true },
    acceptedAt: { type: DataTypes.DATE, allowNull: false },
    html: { type: DataTypes.TEXT('long'), allowNull: false },
    contentHash: { type: DataTypes.STRING(64), allowNull: false },
    emailedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'contracts', indexes: [{ fields: ['UserId'] }] }
);

module.exports = Contract;
