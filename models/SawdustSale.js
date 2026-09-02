const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Bán mùn cưa đã ủ ra cho khách/công ty.
const SawdustSale = sequelize.define(
  'SawdustSale',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    customerName: { type: DataTypes.STRING, allowNull: false },
    customerPhone: { type: DataTypes.STRING(20), defaultValue: '' },
    quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.ENUM('khoi', 'bao', 'tan'), defaultValue: 'khoi' },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    totalRevenue: {
      type: DataTypes.VIRTUAL,
      get() { return (this.quantity || 0) * (this.unitPrice || 0); },
    },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_sawdust_sales' }
);

module.exports = SawdustSale;
