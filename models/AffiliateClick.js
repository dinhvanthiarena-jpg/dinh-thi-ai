const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Logged by the /go/shopee redirect route every time a visitor actually
// clicks through to an affiliate link (not just sees the banner), so
// admin/analytics can report real click-throughs by day/month.
const AffiliateClick = sequelize.define(
  'AffiliateClick',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productName: { type: DataTypes.STRING, allowNull: false },
    productUrl: { type: DataTypes.STRING, allowNull: false },
    sourcePath: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'affiliate_clicks',
    updatedAt: false,
  }
);

module.exports = AffiliateClick;
