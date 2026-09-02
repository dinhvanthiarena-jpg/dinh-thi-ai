const { SawdustBatch, SawdustSale, PurchaseTrip, Sawmill, User } = require('../../models');
const { num, todayStr } = require('./helpers');

function stockSummary(batches) {
  // Tồn kho mùn theo đơn vị + trạng thái ủ (không quy đổi giữa các đơn vị
  // khác nhau, cộng dồn riêng theo từng đơn vị để không sai số liệu).
  const summary = {};
  batches
    .filter((b) => b.status !== 'da_xuat_het')
    .forEach((b) => {
      const key = b.unit;
      if (!summary[key]) summary[key] = { unit: key, dang_u: 0, da_u_xong: 0 };
      summary[key][b.status] = (summary[key][b.status] || 0) + b.quantity;
    });
  return Object.values(summary);
}

// --- Lô mùn tập kết / ủ ---
exports.batchList = async (req, res) => {
  const batches = await SawdustBatch.findAll({
    include: [{ model: PurchaseTrip, as: 'trip', include: [{ model: Sawmill, as: 'sawmill' }] }],
    order: [['intakeDate', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  let editing = null;
  if (req.query.edit) editing = await SawdustBatch.findByPk(req.query.edit);
  res.render('muncui/sawdust-batches', {
    title: 'Kho mùn (tập kết & ủ)',
    batches,
    summary: stockSummary(batches),
    editing,
    today: todayStr(),
  });
};

exports.batchCreate = async (req, res) => {
  const { intakeDate, quantity, unit, note } = req.body;
  if (!intakeDate || !num(quantity)) {
    req.flash('error', 'Vui lòng nhập ngày và khối lượng.');
    return res.redirect('/mun-cui/kho-mun');
  }
  await SawdustBatch.create({ intakeDate, quantity: num(quantity), unit, note });
  req.flash('success', 'Đã thêm lô mùn tập kết.');
  res.redirect('/mun-cui/kho-mun');
};

exports.batchUpdate = async (req, res, next) => {
  const batch = await SawdustBatch.findByPk(req.params.id);
  if (!batch) return next();
  const { intakeDate, quantity, unit, status, readyDate, note } = req.body;
  await batch.update({
    intakeDate: intakeDate || batch.intakeDate,
    quantity: num(quantity),
    unit,
    status,
    readyDate: readyDate || null,
    note,
  });
  req.flash('success', 'Đã cập nhật lô mùn.');
  res.redirect('/mun-cui/kho-mun');
};

exports.batchRemove = async (req, res, next) => {
  const batch = await SawdustBatch.findByPk(req.params.id);
  if (!batch) return next();
  await batch.destroy();
  req.flash('success', 'Đã xóa lô mùn.');
  res.redirect('/mun-cui/kho-mun');
};

// --- Bán mùn ---
exports.saleList = async (req, res) => {
  const sales = await SawdustSale.findAll({
    include: [{ model: User, as: 'createdBy', attributes: ['name'] }],
    order: [['date', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalRevenue, 0);
  let editing = null;
  if (req.query.edit) editing = await SawdustSale.findByPk(req.query.edit);
  res.render('muncui/sawdust-sales', { title: 'Bán mùn', sales, totalRevenue, editing, today: todayStr() });
};

exports.saleCreate = async (req, res) => {
  const { date, customerName, customerPhone, quantity, unit, unitPrice, note } = req.body;
  if (!date || !customerName || !num(quantity)) {
    req.flash('error', 'Vui lòng nhập ngày, khách hàng và khối lượng.');
    return res.redirect('/mun-cui/ban-mun');
  }
  await SawdustSale.create({
    date,
    customerName,
    customerPhone,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    note,
    CreatedById: req.user.id,
  });
  req.flash('success', 'Đã ghi nhận đơn bán mùn.');
  res.redirect('/mun-cui/ban-mun');
};

exports.saleUpdate = async (req, res, next) => {
  const sale = await SawdustSale.findByPk(req.params.id);
  if (!sale) return next();
  const { date, customerName, customerPhone, quantity, unit, unitPrice, note } = req.body;
  await sale.update({
    date: date || sale.date,
    customerName: customerName || sale.customerName,
    customerPhone,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    note,
  });
  req.flash('success', 'Đã cập nhật đơn bán mùn.');
  res.redirect('/mun-cui/ban-mun');
};

exports.saleRemove = async (req, res, next) => {
  const sale = await SawdustSale.findByPk(req.params.id);
  if (!sale) return next();
  await sale.destroy();
  req.flash('success', 'Đã xóa đơn bán mùn.');
  res.redirect('/mun-cui/ban-mun');
};
