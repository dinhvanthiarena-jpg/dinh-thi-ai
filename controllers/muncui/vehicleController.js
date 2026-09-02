const { Vehicle } = require('../../models');

exports.list = async (req, res) => {
  const vehicles = await Vehicle.findAll({ order: [['name', 'ASC']] });
  let editing = null;
  if (req.query.edit) editing = await Vehicle.findByPk(req.query.edit);
  res.render('muncui/vehicles', { title: 'Xe', vehicles, editing });
};

exports.create = async (req, res) => {
  const { name, plateNumber, type, note } = req.body;
  if (!name || !name.trim()) {
    req.flash('error', 'Vui lòng nhập tên xe.');
    return res.redirect('/mun-cui/xe');
  }
  await Vehicle.create({ name: name.trim(), plateNumber, type, note });
  req.flash('success', 'Đã thêm xe.');
  res.redirect('/mun-cui/xe');
};

exports.update = async (req, res, next) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return next();
  const { name, plateNumber, type, note, isActive } = req.body;
  await vehicle.update({
    name: name?.trim() || vehicle.name,
    plateNumber,
    type,
    note,
    isActive: isActive === 'on',
  });
  req.flash('success', 'Đã cập nhật xe.');
  res.redirect('/mun-cui/xe');
};

exports.remove = async (req, res, next) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return next();
  await vehicle.destroy();
  req.flash('success', 'Đã xóa xe.');
  res.redirect('/mun-cui/xe');
};
