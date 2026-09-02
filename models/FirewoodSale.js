const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Bán củi lại cho công ty (khách mua sỉ).
const FirewoodSale = sequelize.define(
  'FirewoodSale',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: false },
    companyPhone: { type: DataTypes.STRING(20), defaultValue: '' },
    quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.ENUM('ster', 'khoi', 'tan'), defaultValue: 'ster' },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    totalRevenue: {
      type: DataTypes.VIRTUAL,
      get() { return (this.quantity || 0) * (this.unitPrice || 0); },
    },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_firewood_sales' }
);

module.exports = FirewoodSale;
