const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Review = sequelize.define(
  'Review',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, defaultValue: '' },
  },
  {
    tableName: 'reviews',
    indexes: [{ unique: true, fields: ['UserId', 'CourseId'] }],
  }
);

module.exports = Review;
