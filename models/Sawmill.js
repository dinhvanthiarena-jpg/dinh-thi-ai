const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Xưởng xẻ / vựa gỗ — nơi xe hàng ngày đến mua mùn cưa.
const Sawmill = sequelize.define(
  'Sawmill',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, defaultValue: '' },
    contactPerson: { type: DataTypes.STRING, defaultValue: '' },
    phone: { type: DataTypes.STRING(20), defaultValue: '' },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'muncui_sawmills' }
);

module.exports = Sawmill;
