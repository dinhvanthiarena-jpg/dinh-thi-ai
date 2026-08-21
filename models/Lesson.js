const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Lesson = sequelize.define(
  'Lesson',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    title: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
    videoUrl: { type: DataTypes.STRING, defaultValue: '' },
    contentText: { type: DataTypes.TEXT, defaultValue: '' },
    durationMinutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    isPreview: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'lessons' }
);

module.exports = Lesson;
