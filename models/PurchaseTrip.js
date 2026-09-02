const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Một chuyến xe đi mua mùn cưa tại xưởng xẻ, mang về tập kết tại xưởng để ủ.
const PurchaseTrip = sequelize.define(
  'PurchaseTrip',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.ENUM('khoi', 'bao', 'tan'), defaultValue: 'khoi' },
    unitPrice: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    fuelCost: { type: DataTypes.FLOAT, defaultValue: 0 },
    otherCost: { type: DataTypes.FLOAT, defaultValue: 0 },
    totalCost: {
      type: DataTypes.VIRTUAL,
      get() {
        return (this.quantity || 0) * (this.unitPrice || 0) + (this.fuelCost || 0) + (this.otherCost || 0);
      },
    },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_purchase_trips' }
);

module.exports = PurchaseTrip;
