const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'admin'), defaultValue: 'student' },
    avatarUrl: { type: DataTypes.STRING, defaultValue: '' },
    phone: { type: DataTypes.STRING, defaultValue: '' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    // Hạn dùng gói Pro của app Mon.L. Rỗng hoặc đã qua nghĩa là bản miễn phí.
    proUntil: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

User.prototype.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = User;
