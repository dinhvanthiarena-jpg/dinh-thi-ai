const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * Độ khó cá nhân hoá cho Mon-Maths: mỗi tài khoản có một "tier" riêng cho
 * từng cặp (lớp đã chọn, dạng toán) — không phải ai chọn lớp 3 cũng làm bài
 * lớp 3 y hệt nhau. Học giỏi thì tier tăng dần, đề khó dần (tương đương lớp
 * cao hơn); làm sai nhiều thì tier giảm, đề dễ lại (tương đương lớp thấp
 * hơn) — tránh học sinh giỏi cứ làm mãi bài dễ, học sinh yếu bị đề quá sức.
 *
 * Việc tính tier (chuỗi đúng/sai) làm ở client cho nhanh, không cần gọi máy
 * chủ sau mỗi câu; bảng này chỉ lưu lại kết quả để đổi máy vẫn giữ được
 * đúng trình độ đã đạt, không phải học lại từ đầu.
 */
const MathSkill = sequelize.define(
  'MathSkill',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    UserId: { type: DataTypes.INTEGER, allowNull: false },
    grade: { type: DataTypes.INTEGER, allowNull: false },
    op: { type: DataTypes.STRING(10), allowNull: false },
    tier: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  {
    tableName: 'math_skills',
    indexes: [{ unique: true, fields: ['UserId', 'grade', 'op'] }],
  }
);

module.exports = MathSkill;
