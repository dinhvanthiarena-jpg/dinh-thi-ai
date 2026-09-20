const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * 1 lần mua = 1 key. Key chỉ để thầy/khách tra cứu "đã mua tool nào, key gì" —
 * việc CHẶN TẢI VỀ dựa vào chính bản ghi này tồn tại (xem toolController.js:
 * download kiểm tra có ToolLicense của UserId+ToolId hay chưa), không dựa vào
 * xác thực key phía app khách (khác hẳn hệ key RS256 offline của V-AI STUDIO
 * hay hệ AIWEB- của A-AI Ads — 2 hệ đó cho app desktop đã build sẵn, không
 * đổi được cơ chế xác thực nữa).
 */
const ToolLicense = sequelize.define(
  'ToolLicense',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    licenseKey: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { tableName: 'tool_licenses' }
);

module.exports = ToolLicense;
