const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Chi phí phát sinh khác của xưởng (xăng dầu, sửa xe, thuê bãi...) không
// gắn trực tiếp với một chuyến mua mùn hay lô củi cụ thể.
const Expense = sequelize.define(
  'Expense',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    category: {
      type: DataTypes.ENUM('xang_dau', 'sua_xe', 'thue_bai', 'khac'),
      defaultValue: 'khac',
    },
    amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_expenses' }
);

module.exports = Expense;
