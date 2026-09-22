const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

/** Mã ngắn, dễ đọc, không có ký tự dễ nhìn nhầm (0/O, 1/I) — giống proService/walletService. */
function chuoiNgau(n) {
  const CHU = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < n; i += 1) s += CHU[Math.floor(Math.random() * CHU.length)];
  return s;
}
async function generateUniqueRefCode() {
  let code = chuoiNgau(6);
  for (let i = 0; i < 5 && (await User.findOne({ where: { refCode: code } })); i += 1) code = chuoiNgau(6);
  return code;
}

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
    // Số dư ví (VNĐ) — cache cập nhật cùng lúc với mỗi WalletTransaction, xem
    // services/walletService.js. Nguồn sự thật cho LỊCH SỬ là bảng
    // wallet_transactions; cột này chỉ để đọc nhanh số dư hiện tại.
    walletBalance: { type: DataTypes.INTEGER, defaultValue: 0 },
    // Hệ thống "Giới thiệu bạn bè" (affiliate nội bộ 2 cấp) — xem
    // services/commissionService.js. refCode: mã giới thiệu riêng của CHÍNH
    // người này, tự sinh lúc tạo tài khoản (hook beforeCreate bên dưới).
    // parentId: id người đã giới thiệu tài khoản này (F trên trực tiếp) —
    // gán 1 LẦN DUY NHẤT lúc đăng ký dựa vào cookie ?ref=, không đổi được
    // sau đó (xem controllers/authController.js#register).
    refCode: { type: DataTypes.STRING, allowNull: true, unique: true },
    parentId: { type: DataTypes.INTEGER, allowNull: true },
  },
  {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
        if (!user.refCode) {
          user.refCode = await generateUniqueRefCode();
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
module.exports.generateUniqueRefCode = generateUniqueRefCode;
