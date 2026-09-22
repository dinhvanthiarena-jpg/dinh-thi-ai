const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Cấu hình chung của web sửa được từ /admin mà không cần sửa .env + deploy
// lại. Hiện dùng cho tỷ lệ % hoa hồng giới thiệu (commissionL1Percent,
// commissionL2Percent) — xem services/commissionService.js.
const Setting = sequelize.define(
  'Setting',
  {
    key: { type: DataTypes.STRING, primaryKey: true },
    value: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  },
  { tableName: 'settings', timestamps: false }
);

module.exports = Setting;
