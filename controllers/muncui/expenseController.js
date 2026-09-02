const { Expense, User } = require('../../models');
const { num, todayStr } = require('./helpers');

exports.list = async (req, res) => {
  const expenses = await Expense.findAll({
    include: [{ model: User, as: 'createdBy', attributes: ['name'] }],
    order: [['date', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  let editing = null;
  if (req.query.edit) editing = await Expense.findByPk(req.query.edit);
  res.render('muncui/expenses', { title: 'Chi phí khác', expenses, total, editing, today: todayStr() });
};

exports.create = async (req, res) => {
  const { date, category, amount, note } = req.body;
  if (!date || !num(amount)) {
    req.flash('error', 'Vui lòng nhập ngày và số tiền.');
    return res.redirect('/mun-cui/chi-phi');
  }
  await Expense.create({ date, category, amount: num(amount), note, CreatedById: req.user.id });
  req.flash('success', 'Đã ghi nhận chi phí.');
  res.redirect('/mun-cui/chi-phi');
};

exports.update = async (req, res, next) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) return next();
  const { date, category, amount, note } = req.body;
  await expense.update({ date: date || expense.date, category, amount: num(amount), note });
  req.flash('success', 'Đã cập nhật chi phí.');
  res.redirect('/mun-cui/chi-phi');
};

exports.remove = async (req, res, next) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) return next();
  await expense.destroy();
  req.flash('success', 'Đã xóa chi phí.');
  res.redirect('/mun-cui/chi-phi');
};
