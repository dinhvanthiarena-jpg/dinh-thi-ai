const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Tracks which Page comments already got an auto private-reply, so a
// duplicate webhook delivery (Facebook retries on slow/non-200 responses)
// never sends the same person the tool link twice.
const RepliedComment = sequelize.define(
  'RepliedComment',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fbCommentId: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { tableName: 'replied_comments' }
);

module.exports = RepliedComment;
