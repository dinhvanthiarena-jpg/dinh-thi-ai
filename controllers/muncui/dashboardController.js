const { Op } = require('sequelize');
const {
  PurchaseTrip,
  LaborLog,
  SawdustBatch,
  SawdustSale,
  FirewoodPurchase,
  FirewoodSale,
  Expense,
  Sawmill,
  Vehicle,
} = require('../../models');
const { todayStr } = require('./helpers');

function sum(list, field) {
  return list.reduce((total, item) => total + (item[field] || 0), 0);
}

exports.dashboard = async (req, res) => {
  const today = todayStr();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const [
    tripsToday,
    laborToday,
    monthTrips,
    monthFirewoodPurchases,
    monthLabor,
    monthExpenses,
    monthSawdustSales,
    monthFirewoodSales,
    allBatches,
    sawmillCount,
    vehicleCount,
  ] = await Promise.all([
    PurchaseTrip.findAll({ where: { date: today }, include: [{ model: Sawmill, as: 'sawmill' }, { model: Vehicle, as: 'vehicle' }] }),
    LaborLog.findAll({ where: { date: today } }),
    PurchaseTrip.findAll({ where: { date: { [Op.gte]: monthStart } } }),
    FirewoodPurchase.findAll({ where: { date: { [Op.gte]: monthStart } } }),
    LaborLog.findAll({ where: { date: { [Op.gte]: monthStart } } }),
    Expense.findAll({ where: { date: { [Op.gte]: monthStart } } }),
    SawdustSale.findAll({ where: { date: { [Op.gte]: monthStart } } }),
    FirewoodSale.findAll({ where: { date: { [Op.gte]: monthStart } } }),
    SawdustBatch.findAll({ where: { status: { [Op.ne]: 'da_xuat_het' } } }),
    Sawmill.count({ where: { isActive: true } }),
    Vehicle.count({ where: { isActive: true } }),
  ]);

  const sawdustStock = {};
  allBatches.forEach((b) => {
    if (!sawdustStock[b.unit]) sawdustStock[b.unit] = { unit: b.unit, dang_u: 0, da_u_xong: 0 };
    sawdustStock[b.unit][b.status] += b.quantity;
  });

  const monthSawdustCost = monthTrips.reduce((t, tr) => t + tr.quantity * tr.unitPrice + tr.fuelCost + tr.otherCost, 0);
  const monthFirewoodCost = monthFirewoodPurchases.reduce((t, p) => t + p.quantity * p.unitPrice, 0);
  const monthLaborCost = sum(monthLabor, 'wage');
  const monthOtherCost = sum(monthExpenses, 'amount');
  const monthSawdustRevenue = monthSawdustSales.reduce((t, s) => t + s.quantity * s.unitPrice, 0);
  const monthFirewoodRevenue = monthFirewoodSales.reduce((t, s) => t + s.quantity * s.unitPrice, 0);
  const monthTotalCost = monthSawdustCost + monthFirewoodCost + monthLaborCost + monthOtherCost;
  const monthTotalRevenue = monthSawdustRevenue + monthFirewoodRevenue;

  res.render('muncui/dashboard', {
    title: 'Tổng quan',
    today,
    tripsToday,
    laborToday,
    laborTodayTotal: sum(laborToday, 'wage'),
    sawdustStock: Object.values(sawdustStock),
    sawmillCount,
    vehicleCount,
    month: {
      sawdustCost: monthSawdustCost,
      firewoodCost: monthFirewoodCost,
      laborCost: monthLaborCost,
      otherCost: monthOtherCost,
      totalCost: monthTotalCost,
      sawdustRevenue: monthSawdustRevenue,
      firewoodRevenue: monthFirewoodRevenue,
      totalRevenue: monthTotalRevenue,
      profit: monthTotalRevenue - monthTotalCost,
    },
  });
};
