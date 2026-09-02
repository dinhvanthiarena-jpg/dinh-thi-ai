const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Xe tải dùng để đi mua/chở mùn cưa và củi.
const Vehicle = sequelize.define(
  'Vehicle',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    plateNumber: { type: DataTypes.STRING(20), defaultValue: '' },
    type: { type: DataTypes.ENUM('mun', 'cui', 'ca_hai'), defaultValue: 'ca_hai' },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: 'muncui_vehicles' }
);

module.exports = Vehicle;
