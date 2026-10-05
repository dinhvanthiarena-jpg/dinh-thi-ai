const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Nhật ký ĐỒNG Ý điều khoản dịch vụ (bằng chứng pháp lý khi có tranh chấp): ai, lúc nào, từ IP nào,
 * đồng ý PHIÊN BẢN điều khoản nào. Chỉ thêm mới, không sửa/xoá.
 */
const TermsAcceptance = sequelize.define(
  'TermsAcceptance',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    version: { type: DataTypes.STRING(40), allowNull: false },
    ip: { type: DataTypes.STRING(64), allowNull: true },
    userAgent: { type: DataTypes.STRING(300), allowNull: true },
    source: { type: DataTypes.STRING(40), allowNull: true }, // register | login-gate | web
    acceptedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'terms_acceptances', indexes: [{ fields: ['UserId', 'version'] }] }
);

module.exports = TermsAcceptance;
