const { Worker } = require('../../models');
const { num } = require('./helpers');

exports.list = async (req, res) => {
  const workers = await Worker.findAll({ order: [['name', 'ASC']] });
  let editing = null;
  if (req.query.edit) editing = await Worker.findByPk(req.query.edit);
  res.render('muncui/workers', { title: 'Nhân công', workers, editing });
};

exports.create = async (req, res) => {
  const { name, phone, defaultDailyWage, note } = req.body;
  if (!name || !name.trim()) {
    req.flash('error', 'Vui lòng nhập tên nhân công.');
    return res.redirect('/mun-cui/nhan-cong');
  }
  await Worker.create({ name: name.trim(), phone, defaultDailyWage: num(defaultDailyWage), note });
  req.flash('success', 'Đã thêm nhân công.');
  res.redirect('/mun-cui/nhan-cong');
};

exports.update = async (req, res, next) => {
  const worker = await Worker.findByPk(req.params.id);
  if (!worker) return next();
  const { name, phone, defaultDailyWage, note, isActive } = req.body;
  await worker.update({
    name: name?.trim() || worker.name,
    phone,
    defaultDailyWage: num(defaultDailyWage),
    note,
    isActive: isActive === 'on',
  });
  req.flash('success', 'Đã cập nhật nhân công.');
  res.redirect('/mun-cui/nhan-cong');
};

exports.remove = async (req, res, next) => {
  const worker = await Worker.findByPk(req.params.id);
  if (!worker) return next();
  await worker.destroy();
  req.flash('success', 'Đã xóa nhân công.');
  res.redirect('/mun-cui/nhan-cong');
};
