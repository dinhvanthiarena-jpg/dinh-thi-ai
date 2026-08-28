const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Tiến độ học app Mon.L, giữ theo tài khoản.
 *
 * Trước đây tiến độ chỉ nằm trong localStorage của máy: xoá app, đổi điện thoại
 * hay dọn dữ liệu trình duyệt là mất sạch. Nay mỗi tài khoản có một bản trên
 * máy chủ, máy nào đăng nhập cũng lấy lại được.
 *
 * Cả gói tiến độ để trong một cột JSON thay vì tách cột: nội dung khoá học còn
 * đổi dài dài, tách ra thì mỗi lần thêm một loại bài lại phải sửa bảng.
 */
const MonlTienDo = sequelize.define(
  'MonlTienDo',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    // Dùng TEXT('long') chứ không JSON: bản MySQL cũ trên hosting chia sẻ có thể
    // chưa hỗ trợ kiểu JSON, mà ta cũng không truy vấn vào bên trong bao giờ.
    duLieu: { type: DataTypes.TEXT('long'), allowNull: false, defaultValue: '{}' },
    // Điểm kinh nghiệm tách riêng để trang quản trị xem được mà không phải mở gói.
    xp: { type: DataTypes.INTEGER, defaultValue: 0 },
    soBai: { type: DataTypes.INTEGER, defaultValue: 0 },
    chuoiNgay: { type: DataTypes.INTEGER, defaultValue: 0 },
    hocLanCuoi: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: 'monl_tien_do' }
);

module.exports = MonlTienDo;
