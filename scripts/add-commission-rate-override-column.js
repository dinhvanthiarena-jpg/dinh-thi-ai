// Chạy 1 lần trên server: sequelize.sync() (không alter:true) không tự thêm
// cột mới vào bảng đã tồn tại, nên field commissionRateOverride mới thêm
// vào models/User.js cần 1 script ALTER TABLE thủ công. An toàn chạy lại
// nhiều lần — bỏ qua êm nếu cột đã có sẵn.
require('dotenv').config();
const { sequelize } = require('../config/db');

(async () => {
  try {
    await sequelize.getQueryInterface().addColumn('users', 'commissionRateOverride', {
      type: sequelize.Sequelize.FLOAT,
      allowNull: true,
    });
    console.log('Đã thêm cột commissionRateOverride vào bảng users.');
  } catch (err) {
    if (/duplicate column/i.test(err.message)) {
      console.log('Cột commissionRateOverride đã tồn tại sẵn, bỏ qua.');
    } else {
      console.error('Lỗi:', err.message);
      process.exitCode = 1;
    }
  } finally {
    await sequelize.close();
  }
})();
