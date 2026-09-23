const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Link tracking riêng đại lý tự tạo (VD kèm nguồn/chiến dịch cá nhân — đăng
// Facebook, Zalo...) cho 1 trang cụ thể (khóa học, tool...), khác với
// refCode gốc của User vốn dùng chung cho mọi trang. Bấm vào link này set
// CÙNG 1 cookie như refCode gốc (xem middleware/affiliateTracking.js) —
// chỉ khác là tăng clicksCount để đại lý đo được hiệu quả từng link riêng.
const AffiliateLink = sequelize.define(
  'AffiliateLink',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    originalUrl: { type: DataTypes.STRING, allowNull: false, defaultValue: '/' },
    affiliateCode: { type: DataTypes.STRING, allowNull: false, unique: true },
    utmSource: { type: DataTypes.STRING, defaultValue: '' },
    utmCampaign: { type: DataTypes.STRING, defaultValue: '' },
    clicksCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: 'affiliate_links' }
);

module.exports = AffiliateLink;
