const { Op } = require('sequelize');
const {
  PurchaseTrip,
  LaborLog,
  FirewoodPurchase,
  Expense,
  SawdustSale,
  FirewoodSale,
} = require('../../models');
const { dateRange } = require('./helpers');

exports.report = async (req, res) => {
  const { from, to } = dateRange(req);
  const whereRange = { date: { [Op.gte]: from, [Op.lte]: to } };

  const [trips, laborLogs, firewoodPurchases, expenses, sawdustSales, firewoodSales] = await Promise.all([
    PurchaseTrip.findAll({ where: whereRange }),
    LaborLog.findAll({ where: whereRange }),
    FirewoodPurchase.findAll({ where: whereRange }),
    Expense.findAll({ where: whereRange }),
    SawdustSale.findAll({ where: whereRange }),
    FirewoodSale.findAll({ where: whereRange }),
  ]);

  const sawdustCost = trips.reduce((t, tr) => t + tr.quantity * tr.unitPrice + tr.fuelCost + tr.otherCost, 0);
  const firewoodCost = firewoodPurchases.reduce((t, p) => t + p.quantity * p.unitPrice, 0);
  const laborCost = laborLogs.reduce((t, l) => t + l.wage, 0);
  const otherCost = expenses.reduce((t, e) => t + e.amount, 0);
  const sawdustRevenue = sawdustSales.reduce((t, s) => t + s.quantity * s.unitPrice, 0);
  const firewoodRevenue = firewoodSales.reduce((t, s) => t + s.quantity * s.unitPrice, 0);
  const totalCost = sawdustCost + firewoodCost + laborCost + otherCost;
  const totalRevenue = sawdustRevenue + firewoodRevenue;

  res.render('muncui/reports', {
    title: 'Báo cáo thu chi',
    from,
    to,
    stats: {
      tripCount: trips.length,
      sawdustQuantity: trips.reduce((t, tr) => t + tr.quantity, 0),
      firewoodQuantity: firewoodPurchases.reduce((t, p) => t + p.quantity, 0),
      laborDays: laborLogs.length,
      sawdustCost,
      firewoodCost,
      laborCost,
      otherCost,
      totalCost,
      sawdustRevenue,
      firewoodRevenue,
      totalRevenue,
      profit: totalRevenue - totalCost,
    },
  });
};
