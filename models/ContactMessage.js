const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ContactMessage = sequelize.define(
  'ContactMessage',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, defaultValue: '' },
    subject: { type: DataTypes.STRING, defaultValue: 'Tu van khoa hoc' },
    message: { type: DataTypes.TEXT, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'contact_messages' }
);

module.exports = ContactMessage;
