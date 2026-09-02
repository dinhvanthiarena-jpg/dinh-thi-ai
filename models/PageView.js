const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// One row per page load, so admin/analytics can group by day/month later
// (BlogPost.viewCount alone only gives a running total, no time breakdown).
const PageView = sequelize.define(
  'PageView',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    path: { type: DataTypes.STRING, allowNull: false },
    postSlug: { type: DataTypes.STRING, allowNull: true },
    source: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'page_views',
    updatedAt: false,
  }
);

module.exports = PageView;
