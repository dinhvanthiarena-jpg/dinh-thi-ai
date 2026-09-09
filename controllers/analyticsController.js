const { Op } = require('sequelize');
const { sequelize } = require('../config/db');
const BlogPost = require('../models/BlogPost');

const CHART_W = 700;
const CHART_H = 220;
const PAD = { top: 12, right: 12, bottom: 24, left: 40 };
const CHART_COLORS = ['#7c3aed', '#db2777', '#f59e0b', '#06b6d4', '#10b981'];

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

async function groupByDayAndSource(table, days) {
  const [rows] = await sequelize.query(
    `SELECT DATE(createdAt) AS day, COALESCE(source, 'Trực tiếp / Không xác định') AS source, COUNT(*) AS total
     FROM ${table}
     WHERE createdAt >= (NOW() - INTERVAL ${days} DAY)
     GROUP BY DATE(createdAt), COALESCE(source, 'Trực tiếp / Không xác định')
     ORDER BY day ASC`
  );
  return rows;
}

async function topPages(days, limit) {
  const [rows] = await sequelize.query(
    `SELECT postSlug, COUNT(*) AS total
     FROM page_views
     WHERE createdAt >= (NOW() - INTERVAL ${days} DAY) AND postSlug IS NOT NULL
     GROUP BY postSlug
     ORDER BY total DESC
     LIMIT ${limit}`
  );
  if (!rows.length) return [];
  const posts = await BlogPost.findAll({
    where: { slug: { [Op.in]: rows.map((r) => r.postSlug) } },
    attributes: ['slug', 'title'],
  });
  const titleBySlug = new Map(posts.map((p) => [p.slug, p.title]));
  return rows.map((r) => ({
    slug: r.postSlug,
    title: titleBySlug.get(r.postSlug) || r.postSlug,
    total: Number(r.total),
  }));
}

// Bảng "requests by host over time" kiểu Cloudflare: trục ngày ở dưới, mỗi
// nguồn truy cập là 1 đường màu riêng — dựng sẵn toạ độ điểm (points) ở đây
// để view chỉ việc in ra <polyline>, không phải tính toán trong EJS.
function buildDailyChart(rawRows, sourceTotals, days) {
  const dayList = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayList.push(d.toISOString().slice(0, 10));
  }

  const topSourceNames = sourceTotals.slice(0, CHART_COLORS.length).map((s) => s.source);
  const valuesBySource = new Map(topSourceNames.map((name) => [name, new Array(dayList.length).fill(0)]));

  rawRows.forEach((row) => {
    if (!valuesBySource.has(row.source)) return;
    const dayStr = new Date(row.day).toISOString().slice(0, 10);
    const idx = dayList.indexOf(dayStr);
    if (idx === -1) return;
    valuesBySource.get(row.source)[idx] = Number(row.total);
  });

  const maxVal = Math.max(1, ...[...valuesBySource.values()].flat());
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;

  const series = topSourceNames.map((name, i) => {
    const values = valuesBySource.get(name);
    const points = values
      .map((v, idx) => {
        const x = PAD.left + (dayList.length > 1 ? (idx / (dayList.length - 1)) * innerW : innerW / 2);
        const y = PAD.top + innerH - (v / maxVal) * innerH;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    const total = sourceTotals.find((s) => s.source === name);
    return { name, color: CHART_COLORS[i], points, total: total ? Number(total.total) : 0 };
  });

  const tickCount = 5;
  const xTicks = Array.from({ length: tickCount }, (_, i) => {
    const idx = Math.round((i / (tickCount - 1)) * (dayList.length - 1));
    const x = PAD.left + (dayList.length > 1 ? (idx / (dayList.length - 1)) * innerW : innerW / 2);
    const label = new Date(dayList[idx]).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    return { x: x.toFixed(1), label };
  });
  const yTicks = [0, 0.5, 1].map((frac) => ({
    y: (PAD.top + innerH * (1 - frac)).toFixed(1),
    label: Math.round(maxVal * frac).toLocaleString('vi-VN'),
  }));

  return {
    width: CHART_W,
    height: CHART_H,
    plotBottom: PAD.top + innerH,
    plotLeft: PAD.left,
    series,
    xTicks,
    yTicks,
    othersCount: Math.max(0, sourceTotals.length - topSourceNames.length),
  };
}

exports.dashboard = async (req, res) => {
  const [
    viewsByDay,
    viewsByMonth,
    clicksByDay,
    clicksByMonth,
    viewsBySource,
    viewsByDaySource,
    topViewedPages,
  ] = await Promise.all([
    groupByDay('page_views', 30),
    groupByMonth('page_views', 12),
    groupByDay('affiliate_clicks', 30),
    groupByMonth('affiliate_clicks', 12),
    groupBySource('page_views', 30),
    groupByDayAndSource('page_views', 30),
    topPages(30, 8),
  ]);

  const viewsBySourceTotal = viewsBySource.reduce((sum, row) => sum + Number(row.total), 0);
  const dailyChart = buildDailyChart(viewsByDaySource, viewsBySource, 30);
  const topViewedPagesTotal = topViewedPages.reduce((sum, row) => sum + row.total, 0);

  res.render('admin/analytics', {
    title: 'Thống kê lượt xem & lượt bấm',
    viewsByDay,
    viewsByMonth,
    clicksByDay,
    clicksByMonth,
    viewsBySource,
    viewsBySourceTotal,
    dailyChart,
    topViewedPages,
    topViewedPagesTotal,
  });
};
