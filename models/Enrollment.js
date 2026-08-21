const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Enrollment = sequelize.define(
  'Enrollment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    completedLessons: { type: DataTypes.JSON, defaultValue: [] },
    progressPercent: { type: DataTypes.INTEGER, defaultValue: 0 },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    certificateIssued: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'enrollments',
    indexes: [{ unique: true, fields: ['UserId', 'CourseId'] }],
  }
);

module.exports = Enrollment;
