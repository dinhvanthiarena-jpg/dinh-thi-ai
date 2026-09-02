// Tiện ích dùng chung cho các controller của module Mùn cưa & Củi.

function num(value, fallback = 0) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Khoảng ngày lọc báo cáo: mặc định là tháng hiện tại nếu không truyền query.
function dateRange(req) {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const from = (req.query.from && /^\d{4}-\d{2}-\d{2}$/.test(req.query.from)) ? req.query.from : firstOfMonth;
  const to = (req.query.to && /^\d{4}-\d{2}-\d{2}$/.test(req.query.to)) ? req.query.to : todayStr();
  return { from, to };
}

module.exports = { num, todayStr, dateRange };
