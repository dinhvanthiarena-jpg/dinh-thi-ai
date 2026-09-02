const { Op } = require('sequelize');
const { User } = require('../../models');

exports.list = async (req, res) => {
  const members = await User.findAll({
    where: { [Op.or]: [{ sawdustRole: { [Op.ne]: null } }, { role: 'admin' }] },
    order: [['name', 'ASC']],
  });
  res.render('muncui/members', { title: 'Thành viên Ban quản trị', members });
};

// Gán quyền cho một tài khoản đã có sẵn (tìm theo email hoặc số điện thoại),
// hoặc tạo mới tài khoản nếu chưa từng đăng ký.
exports.add = async (req, res) => {
  const { name, email, phone, password, sawdustRole } = req.body;
  const identifier = (email || phone || '').trim();
  if (!identifier || !sawdustRole) {
    req.flash('error', 'Vui lòng nhập email hoặc số điện thoại và chọn vai trò.');
    return res.redirect('/mun-cui/thanh-vien');
  }

  const isEmail = identifier.includes('@');
  let user = await User.findOne({ where: isEmail ? { email: identifier.toLowerCase() } : { phone: identifier } });

  if (!user) {
    if (!name || !password || password.length < 6) {
      req.flash('error', 'Tài khoản chưa tồn tại — cần nhập tên và mật khẩu (tối thiểu 6 ký tự) để tạo mới.');
      return res.redirect('/mun-cui/thanh-vien');
    }
    user = await User.create({
      name: name.trim(),
      email: isEmail ? identifier.toLowerCase() : null,
      phone: isEmail ? null : identifier,
      password,
      sawdustRole,
    });
  } else {
    await user.update({ sawdustRole });
  }

  req.flash('success', `Đã cấp quyền "${sawdustRole}" cho ${user.name}.`);
  res.redirect('/mun-cui/thanh-vien');
};

exports.updateRole = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next();
  const { sawdustRole } = req.body;
  await user.update({ sawdustRole: sawdustRole || null });
  req.flash('success', `Đã cập nhật vai trò của ${user.name}.`);
  res.redirect('/mun-cui/thanh-vien');
};

exports.remove = async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next();
  if (user.role === 'admin') {
    req.flash('error', 'Không thể gỡ quyền của quản trị viên site.');
    return res.redirect('/mun-cui/thanh-vien');
  }
  await user.update({ sawdustRole: null });
  req.flash('success', `Đã gỡ quyền truy cập của ${user.name}.`);
  res.redirect('/mun-cui/thanh-vien');
};
