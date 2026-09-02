const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Công nhật hàng ngày — nhân công được tính lương theo ngày làm việc, không
// theo tháng, nên mỗi bản ghi ứng với một người trong một ngày.
const LaborLog = sequelize.define(
  'LaborLog',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    task: {
      type: DataTypes.ENUM('mua_mun', 'boc_xep', 'dao_u', 'boc_cui', 'khac'),
      defaultValue: 'khac',
    },
    wage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    note: { type: DataTypes.TEXT, defaultValue: '' },
  },
  { tableName: 'muncui_labor_logs' }
);

module.exports = LaborLog;
