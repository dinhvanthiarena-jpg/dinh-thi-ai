const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Một lô mùn cưa tập kết tại xưởng để ủ trước khi đem bán.
const SawdustBatch = sequelize.define(
  'SawdustBatch',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    intakeDate: { type: DataTypes.DATEONLY, allowNull: false },
    quantity: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.ENUM('khoi', 'bao', 'tan'), defaultValue: 'khoi' },
    status: { type: DataTypes.ENUM('dang_u', 'da_u_xong', 'da_xuat_het'), defaultValue: 'dang_u' },
    readyDate: { type: DataTypes.DATEONLY, allowNull: true },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_sawdust_batches' }
);

module.exports = SawdustBatch;
