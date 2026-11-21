// Xoá 1 đơn đăng ký Sa Muse Ai theo MÃ ĐƠN (vd MUSEAB9S39): thu hồi key nếu đã cấp, trả lại lượt mã ưu đãi.
// Dùng để dọn đơn thử. Chạy: cd ~/dinh-thi-ai && source ~/nodevenv/dinh-thi-ai/20/bin/activate && node scripts/xoa-don-muse.js MAĐƠN
require('dotenv').config();
const connectDB = require('../config/db');
const MuseRegistration = require('../models/MuseRegistration');
const promo = require('../services/musePromoService');

async function run() {
  const code = String(process.argv[2] || '').trim().toUpperCase();
  if (!/^MUSE[A-Z0-9]{6}$/.test(code)) { console.log('Can ma don dang MUSExxxxxx'); process.exit(1); }
  await connectDB();
  const reg = await MuseRegistration.findOne({ where: { code } });
  if (!reg) { console.log('Khong thay don', code); process.exit(1); }
  if (reg.licenseKey) { require('../services/museLicenseService').revokeKey(reg.licenseKey); console.log('Da thu hoi key', reg.licenseKey); }
  const ten = reg.name;
  await reg.destroy();
  const hoan = promo.hoanTheoDon(code);
  console.log(`DA XOA don ${code} (${ten})${hoan ? ' va tra lai luot ma uu dai' : ''}`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
