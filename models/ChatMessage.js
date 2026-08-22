const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ChatMessage = sequelize.define(
  'ChatMessage',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    channel: { type: DataTypes.ENUM('web', 'messenger'), allowNull: false },
    sessionId: { type: DataTypes.STRING, allowNull: false },
    customerName: { type: DataTypes.STRING, defaultValue: '' },
    role: { type: DataTypes.ENUM('user', 'assistant'), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    handedOff: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: 'chat_messages',
    indexes: [{ fields: ['channel', 'sessionId', 'createdAt'] }],
  }
);

module.exports = ChatMessage;
