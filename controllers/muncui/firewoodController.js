const { FirewoodPurchase, FirewoodSale, Vehicle, User } = require('../../models');
const { num, todayStr } = require('./helpers');

// --- Mua củi ---
exports.purchaseList = async (req, res) => {
  const purchases = await FirewoodPurchase.findAll({
    include: [{ model: Vehicle, as: 'vehicle' }, { model: User, as: 'createdBy', attributes: ['name'] }],
    order: [['date', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  const vehicles = await Vehicle.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
  const totalCost = purchases.reduce((sum, p) => sum + p.totalCost, 0);
  let editing = null;
  if (req.query.edit) editing = await FirewoodPurchase.findByPk(req.query.edit);
  res.render('muncui/firewood-purchases', {
    title: 'Mua củi',
    purchases,
    vehicles,
    totalCost,
    editing,
    today: todayStr(),
  });
};

exports.purchaseCreate = async (req, res) => {
  const { date, sourceName, sourcePhone, quantity, unit, unitPrice, VehicleId, note } = req.body;
  if (!date || !sourceName || !num(quantity)) {
    req.flash('error', 'Vui lòng nhập ngày, nơi mua và khối lượng.');
    return res.redirect('/mun-cui/mua-cui');
  }
  await FirewoodPurchase.create({
    date,
    sourceName,
    sourcePhone,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    VehicleId: VehicleId || null,
    note,
    CreatedById: req.user.id,
  });
  req.flash('success', 'Đã ghi nhận mua củi.');
  res.redirect('/mun-cui/mua-cui');
};

exports.purchaseUpdate = async (req, res, next) => {
  const purchase = await FirewoodPurchase.findByPk(req.params.id);
  if (!purchase) return next();
  const { date, sourceName, sourcePhone, quantity, unit, unitPrice, VehicleId, note } = req.body;
  await purchase.update({
    date: date || purchase.date,
    sourceName: sourceName || purchase.sourceName,
    sourcePhone,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    VehicleId: VehicleId || null,
    note,
  });
  req.flash('success', 'Đã cập nhật đơn mua củi.');
  res.redirect('/mun-cui/mua-cui');
};

exports.purchaseRemove = async (req, res, next) => {
  const purchase = await FirewoodPurchase.findByPk(req.params.id);
  if (!purchase) return next();
  await purchase.destroy();
  req.flash('success', 'Đã xóa đơn mua củi.');
  res.redirect('/mun-cui/mua-cui');
};

// --- Bán củi (bán lại cho công ty) ---
exports.saleList = async (req, res) => {
  const sales = await FirewoodSale.findAll({
    include: [{ model: User, as: 'createdBy', attributes: ['name'] }],
    order: [['date', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalRevenue, 0);
  let editing = null;
  if (req.query.edit) editing = await FirewoodSale.findByPk(req.query.edit);
  res.render('muncui/firewood-sales', { title: 'Bán củi', sales, totalRevenue, editing, today: todayStr() });
};

exports.saleCreate = async (req, res) => {
  const { date, companyName, companyPhone, quantity, unit, unitPrice, note } = req.body;
  if (!date || !companyName || !num(quantity)) {
    req.flash('error', 'Vui lòng nhập ngày, tên công ty và khối lượng.');
    return res.redirect('/mun-cui/ban-cui');
  }
  await FirewoodSale.create({
    date,
    companyName,
    companyPhone,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    note,
    CreatedById: req.user.id,
  });
  req.flash('success', 'Đã ghi nhận đơn bán củi.');
  res.redirect('/mun-cui/ban-cui');
};

exports.saleUpdate = async (req, res, next) => {
  const sale = await FirewoodSale.findByPk(req.params.id);
  if (!sale) return next();
  const { date, companyName, companyPhone, quantity, unit, unitPrice, note } = req.body;
  await sale.update({
    date: date || sale.date,
    companyName: companyName || sale.companyName,
    companyPhone,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    note,
  });
  req.flash('success', 'Đã cập nhật đơn bán củi.');
  res.redirect('/mun-cui/ban-cui');
};

exports.saleRemove = async (req, res, next) => {
  const sale = await FirewoodSale.findByPk(req.params.id);
  if (!sale) return next();
  await sale.destroy();
  req.flash('success', 'Đã xóa đơn bán củi.');
  res.redirect('/mun-cui/ban-cui');
};
