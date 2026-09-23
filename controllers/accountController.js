// Thiết lập tài khoản chung cho mọi user (không riêng đại lý) — thông tin cơ
// bản (họ tên, số điện thoại), đổi mật khẩu, và thông tin nhận tiền mặc định
// (dùng để tự điền form "Rút hoa hồng" ở trang Giới thiệu bạn bè).
exports.showSettings = (req, res) => {
  res.render('account/settings', { title: 'Thiết lập tài khoản' });
};

exports.updateProfile = async (req, res) => {
  const user = req.user;
  const name = String(req.body.name || '').trim();
  const phone = String(req.body.phone || '').trim();
  try {
    if (!name) throw new Error('Vui lòng nhập họ tên.');
    await user.update({ name, phone: phone || null });
    req.flash('success', 'Đã cập nhật thông tin tài khoản.');
  } catch (err) {
    req.flash('error', err.name === 'SequelizeUniqueConstraintError' ? 'Số điện thoại này đã được dùng.' : err.message);
  }
  res.redirect('/tai-khoan');
};

exports.updatePassword = async (req, res) => {
  const user = req.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    const dung = await user.comparePassword(currentPassword || '');
    if (!dung) throw new Error('Mật khẩu hiện tại không đúng.');
    if (!newPassword || newPassword.length < 6) throw new Error('Mật khẩu mới tối thiểu 6 ký tự.');
    if (newPassword !== confirmPassword) throw new Error('Xác nhận mật khẩu mới không khớp.');
    await user.update({ password: newPassword });
    req.flash('success', 'Đã đổi mật khẩu.');
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect('/tai-khoan');
};

exports.showPayment = (req, res) => {
  res.render('account/payment', { title: 'Thiết lập thanh toán' });
};

exports.updatePayment = async (req, res) => {
  const user = req.user;
  const bankName = String(req.body.bankName || '').trim().slice(0, 100);
  const bankAccount = String(req.body.bankAccount || '').trim().slice(0, 50);
  const bankAccountName = String(req.body.bankAccountName || '').trim().slice(0, 100);
  await user.update({ bankName, bankAccount, bankAccountName });
  req.flash('success', 'Đã lưu thông tin nhận tiền.');
  res.redirect('/tai-khoan/thanh-toan');
};
