const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/* Trạng thái nhắc học của một máy đã bật thông báo trong app English Air.
 *
 * Vì sao là bảng RIÊNG chứ không thêm cột vào push_subscriptions: chỗ này chạy
 * sequelize.sync() trần, mà sync() chỉ TẠO bảng còn thiếu chứ không sửa bảng đã
 * có. Thêm cột vào bảng cũ thì trên máy chủ cột đó không bao giờ mọc ra, phải
 * chạy lệnh vá tay. Bảng mới thì sync() tự tạo, không phải đụng gì.
 *
 * Nối với push_subscriptions qua `endpoint` — chính là địa chỉ đẩy của trình
 * duyệt đó, mỗi máy một cái.
 */
const NhacHoc = sequelize.define(
  'NhacHoc',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    endpoint: { type: DataTypes.TEXT, allowNull: false },
    // Người học có muốn bị nhắc không. Tắt trong Cài đặt thì thành false,
    // nhưng vẫn giữ hàng để bật lại là xong, khỏi phải xin quyền lần nữa.
    bat: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    // Ngày gần nhất người này thật sự học (YYYY-MM-DD, giờ Việt Nam)
    hocNgay: { type: DataTypes.STRING(10) },
    // Ngày đang đếm số lần nhắc, và đã nhắc mấy lần trong ngày đó
    nhacNgay: { type: DataTypes.STRING(10) },
    soNhac: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    // Mốc giờ đã nhắc gần nhất, để cùng một mốc không nhắc hai lần
    mocCuoi: { type: DataTypes.INTEGER, allowNull: false, defaultValue: -1 },
    // Chuỗi ngày học liên tiếp mà app báo lên, dùng để nhắc "sắp đứt chuỗi"
    chuoi: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: 'nhac_hoc' }
);

module.exports = NhacHoc;
