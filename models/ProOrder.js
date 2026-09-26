const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Một lần mua gói Pro.
 *
 * `code` là mã ghi trong nội dung chuyển khoản. Người mua quét VietQR thì mã này
 * đã nằm sẵn trong nội dung, không phải gõ tay. Khi tiền vào tài khoản, ngân hàng
 * báo sang SePay/PayOS, hai bên khớp nhau bằng đúng mã đó rồi mở gói.
 */
const ProOrder = sequelize.define(
  'ProOrder',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    _id: { type: DataTypes.VIRTUAL, get() { return this.id; } },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    // 'half' = gói 6 tháng. ENUM trong MySQL không tự nới ra khi thêm gói mới —
    // sequelize.sync() chỉ TẠO bảng thiếu chứ không sửa bảng cũ. Thêm gói thì
    // phải chạy scripts/add-thue-columns.js, không thì đơn mua gói mới đổ lỗi.
    plan: { type: DataTypes.ENUM('month', 'half', 'year', 'family'), allowNull: false },
    // Mã nhóm sinh ra khi mua gói gia đình, để người thân nhập vào mà vào chung.
    familyCode: { type: DataTypes.STRING, defaultValue: '' },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    months: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid', 'cancelled'), defaultValue: 'pending' },
    provider: { type: DataTypes.STRING, defaultValue: 'vietqr' },
    // Ghi lại đúng những gì ngân hàng báo sang, để sau này còn đối chiếu khi có tranh cãi.
    bankRef: { type: DataTypes.STRING, defaultValue: '' },
    bankAmount: { type: DataTypes.INTEGER, allowNull: true },
    rawPayload: { type: DataTypes.TEXT, defaultValue: '' },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    // Ai duyệt tay (khi thầy tự bấm xác nhận trong trang quản trị).
    confirmedBy: { type: DataTypes.STRING, defaultValue: '' },

    // ── Thuế trích từ đơn này ──
    // Tính MỘT LẦN lúc xác nhận đã thu tiền rồi giữ nguyên. Thuế suất có thể
    // đổi theo năm, mà đơn cũ phải giữ đúng con số của lúc bán, không được
    // tính lại theo suất mới.
    thueGtgt: { type: DataTypes.INTEGER, defaultValue: 0 },
    thueTncn: { type: DataTypes.INTEGER, defaultValue: 0 },
    thueTyLe: { type: DataTypes.INTEGER, defaultValue: 0 },   // tổng % đã áp
    thueDaTinh: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'pro_orders' }
);

module.exports = ProOrder;
