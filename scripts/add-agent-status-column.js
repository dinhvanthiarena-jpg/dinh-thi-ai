/**
 * Thêm cột users.agentStatus (đăng ký làm đại lý -> Admin duyệt), xem
 * models/User.js. sequelize.sync() không ALTER bảng đã có nên phải thêm tay.
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/add-agent-status-column.js
 * Chạy lại nhiều lần vẫn an toàn.
 *
 * Backfill: những user ĐÃ đang là người giới thiệu (đã có ai đó dùng
 * parentId trỏ tới họ, hoặc đã từng tạo AffiliateLink riêng) coi như đã
 * "đang hoạt động" từ trước khi có bước duyệt này -> tự động set
 * agentStatus='approved' luôn, tránh việc bật tính năng duyệt làm gãy
 * ngang các link giới thiệu đang chạy thật (vd các user demo A01/B01/C01
 * đã tạo bởi scripts/seed-aff-demo.js).
 */
require('dotenv').config();
const { Op } = require('sequelize');
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');

async function run() {
  await connectDB();
  const { User, AffiliateLink } = require('../models');

  const [co] = await sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'agentStatus'`
  );
  if (co.length) {
    console.log('cột users.agentStatus đã có sẵn');
  } else {
    await sequelize.query(
      `ALTER TABLE \`users\` ADD COLUMN \`agentStatus\` ENUM('none','pending','approved','rejected') NOT NULL DEFAULT 'none'`
    );
    console.log('đã thêm cột users.agentStatus');
  }

  const nguoiCoConTrucTiep = await User.findAll({ where: { parentId: { [Op.ne]: null } }, attributes: ['parentId'] });
  const idsDaLaNguoiGioiThieu = new Set(nguoiCoConTrucTiep.map((u) => u.parentId));

  const linkDaTao = await AffiliateLink.findAll({ attributes: ['UserId'] });
  linkDaTao.forEach((l) => idsDaLaNguoiGioiThieu.add(l.UserId));

  if (idsDaLaNguoiGioiThieu.size) {
    const [ketQua] = await User.update(
      { agentStatus: 'approved' },
      { where: { id: { [Op.in]: Array.from(idsDaLaNguoiGioiThieu) }, agentStatus: 'none' } }
    );
    console.log(`đã tự động duyệt (approved) ${ketQua} user đang giới thiệu từ trước`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
