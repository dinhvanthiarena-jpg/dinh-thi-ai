const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    name: { type: DataTypes.STRING, allowNull: false },
    // Ai đăng ký bằng số điện thoại thì không có email, và ngược lại — nên cả hai
    // đều để trống được. UNIQUE của MySQL cho nhiều NULL nhưng không cho nhiều
    // chuỗi rỗng, vì vậy chỗ nào bỏ trống phải ghi NULL chứ đừng ghi ''.
    email: { type: DataTypes.STRING, allowNull: true, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('student', 'admin'), defaultValue: 'student' },
    avatarUrl: { type: DataTypes.STRING, defaultValue: '' },
    phone: { type: DataTypes.STRING(20), allowNull: true, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    // Hạn dùng gói Pro của app Mon.L. Rỗng hoặc đã qua nghĩa là bản miễn phí.
    proUntil: { type: DataTypes.DATE, allowNull: true },
    // Gói gia đình: mọi thành viên mang cùng một mã, người mua là chủ nhóm.
    familyCode: { type: DataTypes.STRING, defaultValue: '' },
    familyOwner: { type: DataTypes.BOOLEAN, defaultValue: false },
    // Dùng thử 7 ngày, mỗi tài khoản chỉ một lần.
    trialUsed: { type: DataTypes.BOOLEAN, defaultValue: false },
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
