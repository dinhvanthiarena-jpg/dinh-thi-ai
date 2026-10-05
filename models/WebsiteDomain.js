const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Các TÊN MIỀN khách đã dùng để "tạo web" bằng SA-BOTAI — dùng để ĐẾM web theo tên miền (thầy chốt
 * 2026-10-05): tên miền đầu tiên (kèm key lần đầu) miễn phí, sửa/đưa lên lại CÙNG tên miền không mất
 * thêm phí; từ tên miền thứ 2 trở đi thu phí (xem walletService.thuPhiTaoWeb).
 */
const WebsiteDomain = sequelize.define(
  'WebsiteDomain',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    domain: { type: DataTypes.STRING(190), allowNull: false },
    deployCount: { type: DataTypes.INTEGER, defaultValue: 1 },
    feeVnd: { type: DataTypes.INTEGER, defaultValue: 0 },
    freeReason: { type: DataTypes.STRING, allowNull: true },
    licenseKey: { type: DataTypes.STRING, allowNull: true },
    firstDeployedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    lastDeployedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'website_domains', indexes: [{ unique: true, fields: ['UserId', 'domain'] }] }
);

module.exports = WebsiteDomain;
