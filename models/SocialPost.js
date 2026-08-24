const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SocialPost = sequelize.define(
  'SocialPost',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sourceType: { type: DataTypes.ENUM('course', 'blog'), allowNull: false },
    sourceId: { type: DataTypes.INTEGER, allowNull: false },
    sourceTitle: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    fbPostId: { type: DataTypes.STRING, allowNull: true },
    postedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: 'social_posts' }
);

module.exports = SocialPost;
