const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Người đăng ký mua tool Sa Muse Ai (trang /dang-ky-tool-muse).
// status: 'cho-chuyen-khoan' → 'da-thanh-toan' (thầy bấm "Đã nhận tiền" → tự cấp key + gửi mail).
const MuseRegistration = sequelize.define(
  'MuseRegistration',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    hasClaude: { type: DataTypes.STRING, defaultValue: '' },
    hasMuse: { type: DataTypes.STRING, defaultValue: '' },
    note: { type: DataTypes.TEXT, defaultValue: '' },
    amount: { type: DataTypes.INTEGER, defaultValue: 500000 },
    status: { type: DataTypes.STRING, defaultValue: 'cho-chuyen-khoan' },
    paidAt: { type: DataTypes.DATE, defaultValue: null },
    licenseKey: { type: DataTypes.STRING, defaultValue: '' },
    emailSentAt: { type: DataTypes.DATE, defaultValue: null },
    emailError: { type: DataTypes.STRING, defaultValue: '' },
  },
  { tableName: 'muse_registrations' }
);

module.exports = MuseRegistration;
