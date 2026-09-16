/**
 * Doi mat khau tai khoan admin (khong co form tu doi trong /admin hien tai).
 * Mat khau moi duoc bcrypt-hash tu dong qua hook beforeUpdate cua model User,
 * khong luu dang thuong (plain text) vao DB.
 *
 * Chay 1 lan tren may chu:
 *   source ~/nodevenv/dinh-thi-ai/20/bin/activate
 *   node scripts/reset-admin-password.js "<mat_khau_moi>"
 */
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function run() {
  const newPassword = process.argv[2];
  if (!newPassword) {
    console.error('Cach dung: node scripts/reset-admin-password.js "<mat_khau_moi>"');
    process.exit(1);
  }

  await connectDB();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@dinhthiai.com').toLowerCase();
  const admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    console.error('Khong tim thay tai khoan admin:', adminEmail);
    process.exit(1);
  }

  await admin.update({ password: newPassword });
  console.log('Da doi mat khau thanh cong cho:', admin.email);
  process.exit(0);
}

run().catch((err) => {
  console.error('loi:', err.message);
  process.exit(1);
});
