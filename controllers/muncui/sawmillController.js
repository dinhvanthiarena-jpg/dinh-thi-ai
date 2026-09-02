const { Sawmill } = require('../../models');

exports.list = async (req, res) => {
  const sawmills = await Sawmill.findAll({ order: [['name', 'ASC']] });
  let editing = null;
  if (req.query.edit) editing = await Sawmill.findByPk(req.query.edit);
  res.render('muncui/sawmills', { title: 'Xưởng xẻ', sawmills, editing });
};

exports.create = async (req, res) => {
  const { name, address, contactPerson, phone, note } = req.body;
  if (!name || !name.trim()) {
    req.flash('error', 'Vui lòng nhập tên xưởng xẻ.');
    return res.redirect('/mun-cui/xuong-xe');
  }
  await Sawmill.create({ name: name.trim(), address, contactPerson, phone, note });
  req.flash('success', 'Đã thêm xưởng xẻ.');
  res.redirect('/mun-cui/xuong-xe');
};

exports.update = async (req, res, next) => {
  const sawmill = await Sawmill.findByPk(req.params.id);
  if (!sawmill) return next();
  const { name, address, contactPerson, phone, note, isActive } = req.body;
  await sawmill.update({
    name: name?.trim() || sawmill.name,
    address,
    contactPerson,
    phone,
    note,
    isActive: isActive === 'on',
  });
  req.flash('success', 'Đã cập nhật xưởng xẻ.');
  res.redirect('/mun-cui/xuong-xe');
};

exports.remove = async (req, res, next) => {
  const sawmill = await Sawmill.findByPk(req.params.id);
  if (!sawmill) return next();
  await sawmill.destroy();
  req.flash('success', 'Đã xóa xưởng xẻ.');
  res.redirect('/mun-cui/xuong-xe');
};
