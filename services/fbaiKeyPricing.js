// Bảng giá SA-BOTAI do thầy chốt (2026-10-05), lưu ở file cấu hình để chỉnh trong trang quản trị
// (/admin/gia-key-sa-botai) — KHÔNG hard-code giá rải rác trong code.
//
//  - Mọi giá niêm yết bằng USD, thu bằng VNĐ theo tỷ giá CỐ ĐỊNH 26.000đ/$ (đã gồm thuế).
//  - Phí tạo web: web ĐẦU TIÊN kèm key lần đầu miễn phí (đếm theo TÊN MIỀN khách đưa vào, sửa/đưa lên lại
//    cùng tên miền không giới hạn); từ tên miền thứ 2 trở đi thu WEB_FEE_USD (35$) mỗi tên miền.
//  - Gia hạn dùng tool: gói theo số tháng (1 tháng = 30 ngày). Thầy nói "2 tháng 49$" và "5 tháng 129$" —
//    hai mức này thấp hơn cả gói 1 tháng (55$) và 3 tháng (149$) nên có vẻ nhầm, em để TẮT sẵn (enabled=false)
//    chờ thầy xác nhận rồi bật trong trang quản trị.
//  - Key cấp lần đầu chạy đúng 90 ngày (FIRST_KEY_DAYS), sau đó phải đóng phí theo tháng.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'fbai-pricing.json');
const OLD_FILE = path.join(__dirname, '..', 'data', 'fbai-key-pricing.json'); // bản thử trước, bỏ

const USD_RATE = 26000; // CỐ ĐỊNH, thầy chốt
const FIRST_KEY_DAYS = 90;
const DAYS_PER_MONTH = 30;

const DEFAULTS = {
  webFeeUsd: 35,
  plans: [
    { months: 1, usd: 55, enabled: true },
    { months: 2, usd: 49, enabled: false },
    { months: 3, usd: 149, enabled: true },
    { months: 5, usd: 129, enabled: false },
  ],
  legal: { ten: 'ĐINH VĂN THI (thương hiệu Đinh Thi Ai – 3dvietpro.com)', mst: 'Đang cập nhật', diaChi: 'Đang cập nhật', email: '' },
};

function read() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}
function write(cfg) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(cfg, null, 2));
}

const toVnd = (usd) => Math.round(Number(usd) * USD_RATE);

function getConfig() {
  const c = read();
  const plans = (Array.isArray(c.plans) && c.plans.length ? c.plans : DEFAULTS.plans)
    .map((p) => ({ months: Number(p.months), usd: Number(p.usd), enabled: p.enabled !== false }))
    .filter((p) => p.months >= 1 && p.usd > 0)
    .sort((a, b) => a.months - b.months);
  return {
    webFeeUsd: Number(c.webFeeUsd) > 0 ? Number(c.webFeeUsd) : DEFAULTS.webFeeUsd,
    plans,
    legal: { ...DEFAULTS.legal, ...(c.legal || {}) },
  };
}

/** Các gói gia hạn ĐANG BÁN (đã bật), kèm giá VNĐ và số ngày. */
function getPlans() {
  return getConfig().plans.filter((p) => p.enabled).map((p) => ({ ...p, vnd: toVnd(p.usd), days: p.months * DAYS_PER_MONTH }));
}
function getAllPlans() {
  return getConfig().plans.map((p) => ({ ...p, vnd: toVnd(p.usd), days: p.months * DAYS_PER_MONTH }));
}
function getPlan(months) {
  return getPlans().find((p) => p.months === Number(months)) || null;
}
function getWebFee() {
  const usd = getConfig().webFeeUsd;
  return { usd, vnd: toVnd(usd) };
}
function getLegal() {
  return getConfig().legal;
}

/** Lưu từ trang quản trị: { webFeeUsd, plans:[{months,usd,enabled}], legal:{...} } (trường nào thiếu thì giữ nguyên). */
function saveConfig(partial) {
  const cur = getConfig();
  const next = {
    webFeeUsd: partial.webFeeUsd != null && Number(partial.webFeeUsd) > 0 ? Number(partial.webFeeUsd) : cur.webFeeUsd,
    plans: Array.isArray(partial.plans) ? partial.plans : cur.plans,
    legal: { ...cur.legal, ...(partial.legal || {}) },
    updatedAt: Date.now(),
  };
  write(next);
  return getConfig();
}

module.exports = { USD_RATE, FIRST_KEY_DAYS, DAYS_PER_MONTH, toVnd, getPlans, getAllPlans, getPlan, getWebFee, getLegal, getConfig, saveConfig };
