/**
 * Dọn dữ liệu cũ — trước khi có luật "chỉ Cấp 1-3 được là đại lý"
 * (services/commissionService.js#CAP_TOI_DA_LAM_DAI_LY), vài tài khoản test
 * đã lỡ có agentStatus khác 'none' dù đứng Cấp 4 trở đi (VD demo-khachd,
 * quynh heo). Đưa hết các tài khoản đó về agentStatus='none' — không đụng
 * gì tới ví/hoa hồng đã có, chỉ tắt tư cách đại lý sai luật.
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/downgrade-cap4-agents.js
 * Chạy lại nhiều lần vẫn an toàn (idempotent).
 */
require('dotenv').config();
const { Op } = require('sequelize');
const connectDB = require('../config/db');

async function run() {
  await connectDB();
  const { User } = require('../models');
  const commission = require('../services/commissionService');

  const ungVien = await User.findAll({
    where: { agentStatus: { [Op.ne]: 'none' } },
    attributes: ['id', 'name', 'email', 'agentStatus'],
  });

  let dem = 0;
  for (const u of ungVien) {
    const cap = await commission.doSauTuWeb(u.id);
    if (cap > commission.CAP_TOI_DA_LAM_DAI_LY) {
      await u.update({ agentStatus: 'none' });
      console.log(`Cấp ${cap} — đã hạ "${u.name}" (${u.email}) về agentStatus='none' (trước đó: ${u.agentStatus})`);
      dem += 1;
    }
  }
  console.log(`Xong — đã hạ ${dem}/${ungVien.length} tài khoản đại lý sai Cấp.`);
  process.exit(0);
}

run().catch((err) => {
  console.error('lỗi:', err.message);
  process.exit(1);
});
