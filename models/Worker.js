const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Nhân công thời vụ / công nhật của xưởng (tài xế, bốc xếp, đảo ủ mùn...).
const Worker = sequelize.define(
  'Worker',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING(20), defaultValue: '' },
    defaultDailyWage: { type: DataTypes.FLOAT, defaultValue: 0 },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'muncui_workers' }
);

module.exports = Worker;
