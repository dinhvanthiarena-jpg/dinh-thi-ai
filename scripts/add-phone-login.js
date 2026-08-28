/**
 * Cho phép tài khoản đăng ký chỉ bằng số điện thoại.
 *
 * sequelize.sync() tạo được bảng mới nhưng KHÔNG đổi cột đã có, nên phải tự
 * chạy ALTER. Script viết để chạy lại bao nhiêu lần cũng không hỏng gì.
 *
 *   node scripts/add-phone-login.js
 */
require('dotenv').config();
const { sequelize } = require('../config/db');

async function coCot(ten) {
  const [r] = await sequelize.query(
    "SELECT COLUMN_NAME, IS_NULLABLE FROM information_schema.COLUMNS " +
    "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = ?",
    { replacements: [ten] }
  );
  return r[0] || null;
}

async function coChiMuc(ten) {
  const [r] = await sequelize.query(
    "SELECT INDEX_NAME FROM information_schema.STATISTICS " +
    "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = ?",
    { replacements: [ten] }
  );
  return r.length > 0;
}

(async () => {
  await sequelize.authenticate();
  console.log('Đã nối được cơ sở dữ liệu.');

  // 1. Email thành không bắt buộc — ai đăng ký bằng số điện thoại thì bỏ trống.
  const email = await coCot('email');
  if (!email) throw new Error('Không thấy cột email, dừng lại cho chắc.');
  if (email.IS_NULLABLE === 'NO') {
    await sequelize.query('ALTER TABLE users MODIFY email VARCHAR(255) NULL');
    console.log('email: đã cho phép để trống.');
  } else {
    console.log('email: vốn đã cho phép để trống, bỏ qua.');
  }

  // 2. Chuỗi rỗng phải thành NULL trước, vì UNIQUE cho nhiều NULL nhưng
  //    KHÔNG cho nhiều chuỗi rỗng — không đổi thì bước 3 chết ngay.
  await sequelize.query("UPDATE users SET email = NULL WHERE email = ''");
  await sequelize.query("UPDATE users SET phone = NULL WHERE phone = ''");
  console.log('Đã dọn chuỗi rỗng thành NULL.');

  // 3. Số điện thoại phải là duy nhất, không thì hai người trùng số.
  if (await coChiMuc('users_phone_unique')) {
    console.log('phone: chỉ mục duy nhất đã có, bỏ qua.');
  } else {
    const [trung] = await sequelize.query(
      'SELECT phone, COUNT(*) n FROM users WHERE phone IS NOT NULL GROUP BY phone HAVING n > 1'
    );
    if (trung.length) {
      console.log('DỪNG: có số điện thoại bị trùng, phải xử lý tay trước:');
      trung.forEach((t) => console.log('  ', t.phone, '->', t.n, 'tài khoản'));
      process.exit(1);
    }
    await sequelize.query('ALTER TABLE users MODIFY phone VARCHAR(20) NULL');
    await sequelize.query('ALTER TABLE users ADD UNIQUE INDEX users_phone_unique (phone)');
    console.log('phone: đã thêm chỉ mục duy nhất.');
  }

  const [dem] = await sequelize.query(
    'SELECT COUNT(*) tong, SUM(phone IS NOT NULL) co_sdt, SUM(email IS NOT NULL) co_email FROM users'
  );
  console.log('Hiện có:', dem[0]);
  console.log('Xong.');
  process.exit(0);
})().catch((e) => {
  console.error('Lỗi:', e.message);
  process.exit(1);
});
