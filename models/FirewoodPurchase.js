const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Mua củi để nhập kho, sau đó bán lại cho công ty (FirewoodSale).
const FirewoodPurchase = sequelize.define(
  'FirewoodPurchase',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    sourceName: { type: DataTypes.STRING, allowNull: false },
    sourcePhone: { type: DataTypes.STRING(20), defaultValue: '' },
    quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.ENUM('ster', 'khoi', 'tan'), defaultValue: 'ster' },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    totalCost: {
      type: DataTypes.VIRTUAL,
      get() { return (this.quantity || 0) * (this.unitPrice || 0); },
    },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_firewood_purchases' }
);

module.exports = FirewoodPurchase;
