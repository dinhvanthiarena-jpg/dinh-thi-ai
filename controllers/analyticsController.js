const { sequelize } = require('../config/db');

// Raw SQL (not Sequelize's query builder) because MySQL's DATE()/DATE_FORMAT()
// grouping has no clean Sequelize-agnostic equivalent, and this is a
// read-only reporting query with no user input to worry about.
async function groupByDay(table, days) {
  const [rows] = await sequelize.query(
    `SELECT DATE(createdAt) AS day, COUNT(*) AS total
     FROM ${table}
     WHERE createdAt >= (NOW() - INTERVAL ${days} DAY)
     GROUP BY DATE(createdAt)
     ORDER BY day DESC`
  );
  return rows;
}

async function groupByMonth(table, months) {
  const [rows] = await sequelize.query(
    `SELECT DATE_FORMAT(createdAt, '%Y-%m') AS month, COUNT(*) AS total
     FROM ${table}
     WHERE createdAt >= (NOW() - INTERVAL ${months} MONTH)
     GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
     ORDER BY month DESC`
  );
  return rows;
}

async function groupBySource(table, days) {
  const [rows] = await sequelize.query(
    `SELECT COALESCE(source, 'Trực tiếp / Không xác định') AS source, COUNT(*) AS total
     FROM ${table}
     WHERE createdAt >= (NOW() - INTERVAL ${days} DAY)
     GROUP BY COALESCE(source, 'Trực tiếp / Không xác định')
     ORDER BY total DESC`
  );
  return rows;
}

exports.dashboard = async (req, res) => {
  const [
    viewsByDay,
    viewsByMonth,
    clicksByDay,
    clicksByMonth,
    viewsBySource,
  ] = await Promise.all([
    groupByDay('page_views', 30),
    groupByMonth('page_views', 12),
    groupByDay('affiliate_clicks', 30),
    groupByMonth('affiliate_clicks', 12),
    groupBySource('page_views', 30),
  ]);

  const viewsBySourceTotal = viewsBySource.reduce((sum, row) => sum + Number(row.total), 0);

  res.render('admin/analytics', {
    title: 'Thống kê lượt xem & lượt bấm',
    viewsByDay,
    viewsByMonth,
    clicksByDay,
    clicksByMonth,
    viewsBySource,
    viewsBySourceTotal,
  });
};
