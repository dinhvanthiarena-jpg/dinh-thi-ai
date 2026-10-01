// Chạy 1 lần trên server: sequelize.sync() (không alter:true) không tự thêm
// cột mới vào bảng đã tồn tại. An toàn chạy lại nhiều lần — bỏ qua êm nếu
// cột đã có sẵn.
require('dotenv').config();
const { sequelize } = require('../config/db');

(async () => {
  try {
    await sequelize.getQueryInterface().addColumn('users', 'websiteBuildCredits', {
      type: sequelize.Sequelize.INTEGER,
      defaultValue: 0,
    });
    console.log('Đã thêm cột websiteBuildCredits vào bảng users.');
  } catch (err) {
    if (/duplicate column/i.test(err.message)) {
      console.log('Cột websiteBuildCredits đã tồn tại sẵn, bỏ qua.');
    } else {
      console.error('Lỗi:', err.message);
      process.exitCode = 1;
    }
  } finally {
    await sequelize.close();
  }
})();
