const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define(
  'Order',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    currency: { type: DataTypes.STRING, defaultValue: 'VND' },
    couponCode: { type: DataTypes.STRING, defaultValue: '' },
    discountAmount: { type: DataTypes.INTEGER, defaultValue: 0 },
    provider: { type: DataTypes.ENUM('mock', 'vnpay', 'stripe'), defaultValue: 'mock' },
    status: { type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'), defaultValue: 'pending' },
    transactionRef: { type: DataTypes.STRING, defaultValue: '' },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'orders' }
);

module.exports = Order;
