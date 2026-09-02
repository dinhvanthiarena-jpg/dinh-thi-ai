const { PurchaseTrip, Sawmill, Vehicle, Worker, SawdustBatch, User } = require('../../models');
const { num, todayStr } = require('./helpers');

async function loadFormData() {
  const [sawmills, vehicles, drivers] = await Promise.all([
    Sawmill.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }),
    Vehicle.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }),
    Worker.findAll({ where: { isActive: true }, order: [['name', 'ASC']] }),
  ]);
  return { sawmills, vehicles, drivers };
}

exports.list = async (req, res) => {
  const trips = await PurchaseTrip.findAll({
    include: [
      { model: Sawmill, as: 'sawmill' },
      { model: Vehicle, as: 'vehicle' },
      { model: Worker, as: 'driver' },
      { model: User, as: 'createdBy', attributes: ['name'] },
    ],
    order: [['date', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  const { sawmills, vehicles, drivers } = await loadFormData();
  let editing = null;
  if (req.query.edit) editing = await PurchaseTrip.findByPk(req.query.edit);
  res.render('muncui/trips', {
    title: 'Chuyến mua mùn',
    trips,
    sawmills,
    vehicles,
    drivers,
    editing,
    today: todayStr(),
  });
};

exports.create = async (req, res) => {
  const { date, SawmillId, VehicleId, DriverId, quantity, unit, unitPrice, fuelCost, otherCost, note } = req.body;
  if (!date || !SawmillId || !num(quantity)) {
    req.flash('error', 'Vui lòng nhập đủ ngày, xưởng xẻ và khối lượng.');
    return res.redirect('/mun-cui/chuyen-mua-mun');
  }
  const trip = await PurchaseTrip.create({
    date,
    SawmillId,
    VehicleId: VehicleId || null,
    DriverId: DriverId || null,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    fuelCost: num(fuelCost),
    otherCost: num(otherCost),
    note,
    CreatedById: req.user.id,
  });
  // Mỗi chuyến mua mùn mang về xưởng đều tự động tạo một lô mùn tập kết để
  // ủ — đúng quy trình thực tế, khỏi phải nhập tay lại lần hai ở kho.
  await SawdustBatch.create({
    intakeDate: date,
    PurchaseTripId: trip.id,
    quantity: num(quantity),
    unit,
    status: 'dang_u',
  });
  req.flash('success', 'Đã ghi nhận chuyến mua mùn và tạo lô ủ tương ứng.');
  res.redirect('/mun-cui/chuyen-mua-mun');
};

exports.update = async (req, res, next) => {
  const trip = await PurchaseTrip.findByPk(req.params.id);
  if (!trip) return next();
  const { date, SawmillId, VehicleId, DriverId, quantity, unit, unitPrice, fuelCost, otherCost, note } = req.body;
  await trip.update({
    date: date || trip.date,
    SawmillId: SawmillId || trip.SawmillId,
    VehicleId: VehicleId || null,
    DriverId: DriverId || null,
    quantity: num(quantity),
    unit,
    unitPrice: num(unitPrice),
    fuelCost: num(fuelCost),
    otherCost: num(otherCost),
    note,
  });
  req.flash('success', 'Đã cập nhật chuyến mua mùn.');
  res.redirect('/mun-cui/chuyen-mua-mun');
};

exports.remove = async (req, res, next) => {
  const trip = await PurchaseTrip.findByPk(req.params.id);
  if (!trip) return next();
  await trip.destroy();
  req.flash('success', 'Đã xóa chuyến mua mùn.');
  res.redirect('/mun-cui/chuyen-mua-mun');
};
