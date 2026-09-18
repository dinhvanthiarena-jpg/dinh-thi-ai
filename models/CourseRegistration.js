const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CourseRegistration = sequelize.define(
  'CourseRegistration',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, defaultValue: '' },
    zalo: { type: DataTypes.STRING, defaultValue: '' },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    source: { type: DataTypes.STRING, defaultValue: 'dang-ky-hoc-mien-phi' },
    isContacted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'course_registrations' }
);

module.exports = CourseRegistration;
