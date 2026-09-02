const { LaborLog, Worker, PurchaseTrip, User } = require('../../models');
const { num, todayStr } = require('./helpers');

exports.list = async (req, res) => {
  const logs = await LaborLog.findAll({
    include: [
      { model: Worker, as: 'worker' },
      { model: PurchaseTrip, as: 'trip', attributes: ['id', 'date'] },
      { model: User, as: 'createdBy', attributes: ['name'] },
    ],
    order: [['date', 'DESC'], ['id', 'DESC']],
    limit: 200,
  });
  const workers = await Worker.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
  const totalWage = logs.reduce((sum, l) => sum + l.wage, 0);
  let editing = null;
  if (req.query.edit) editing = await LaborLog.findByPk(req.query.edit);
  res.render('muncui/labor', { title: 'Công nhật', logs, workers, totalWage, editing, today: todayStr() });
};

exports.create = async (req, res) => {
  const { date, WorkerId, task, wage, note } = req.body;
  if (!date || !WorkerId) {
    req.flash('error', 'Vui lòng chọn ngày và nhân công.');
    return res.redirect('/mun-cui/cong-nhat');
  }
  let dailyWage = num(wage);
  if (!dailyWage) {
    const worker = await Worker.findByPk(WorkerId);
    dailyWage = worker ? worker.defaultDailyWage : 0;
  }
  await LaborLog.create({ date, WorkerId, task, wage: dailyWage, note, CreatedById: req.user.id });
  req.flash('success', 'Đã ghi công nhật.');
  res.redirect('/mun-cui/cong-nhat');
};

exports.update = async (req, res, next) => {
  const log = await LaborLog.findByPk(req.params.id);
  if (!log) return next();
  const { date, WorkerId, task, wage, note } = req.body;
  await log.update({
    date: date || log.date,
    WorkerId: WorkerId || log.WorkerId,
    task,
    wage: num(wage),
    note,
  });
  req.flash('success', 'Đã cập nhật công nhật.');
  res.redirect('/mun-cui/cong-nhat');
};

exports.remove = async (req, res, next) => {
  const log = await LaborLog.findByPk(req.params.id);
  if (!log) return next();
  await log.destroy();
  req.flash('success', 'Đã xóa công nhật.');
  res.redirect('/mun-cui/cong-nhat');
};
