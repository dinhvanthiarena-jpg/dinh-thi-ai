// Bảng giá SA-BOTAI do thầy chốt (2026-10-05/09), lưu ở file cấu hình để chỉnh trong trang quản trị
// (/admin/gia-key-sa-botai) — KHÔNG hard-code giá rải rác trong code.
//
//  - Giá niêm yết gốc bằng USD, thu bằng VNĐ theo tỷ giá thầy đặt (mặc định 26.100đ/$ theo bảng giá: 199$ = 5.193.900đ).
//    TRONG TOOL chỉ hiển thị TIỀN VIỆT (thầy yêu cầu 2026-10-09).
//  - Gói khởi đầu (key lần đầu, 3 tháng): 199$. Mua qua admin (Zalo 0977 317 988) — `autoSell` mặc định TẮT; bật thì khách tự
//    mua trong tool bằng QR và tự được cấp key 90 ngày.
//  - Từ tháng thứ 4: 55$/tháng duy trì đăng bài tự động (gói 1 tháng, tự thanh toán trong tool).
//  - Web tạo mới theo yêu cầu (tên miền thứ 2 trở đi): 35$.
//  - Các gói 2 tháng (49$), 3 tháng (149$), 5 tháng (129$) thầy từng nhắc nhưng không có trong bảng giá chính thức → TẮT sẵn.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'fbai-pricing.json');

const DEFAULT_RATE = 26100;
const FIRST_KEY_DAYS = 90;
const DAYS_PER_MONTH = 30;

const DEFAULT_PLANS = [
  { id: 'khoi-dau', months: 3, usd: 199, kind: 'first', enabled: false },
  { id: '1-thang', months: 1, usd: 55, enabled: true },
  { id: '2-thang', months: 2, usd: 49, enabled: false },
  { id: '3-thang', months: 3, usd: 149, enabled: false },
  { id: '5-thang', months: 5, usd: 129, enabled: false },
];
const DEFAULTS = {
  usdRate: DEFAULT_RATE,
  webFeeUsd: 35,
  legal: { ten: 'HỢP TÁC XÃ CÔNG NGHỆ AFF (HTX Công nghệ AFF)', mst: 'Đang cập nhật', diaChi: 'Đang cập nhật', email: '', dienThoai: '' },
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

function getUsdRate() {
  const r = Number(read().usdRate);
  return r >= 10000 && r <= 100000 ? Math.round(r) : DEFAULTS.usdRate;
}
const toVnd = (usd) => Math.round(Number(usd) * getUsdRate());

function normalizePlans(saved) {
  const byId = new Map();
  for (const p of Array.isArray(saved) ? saved : []) {
    const months = Number(p.months);
    if (!(months >= 1) || !(Number(p.usd) > 0)) continue;
    const id = p.id || (p.kind === 'first' ? 'khoi-dau' : `${months}-thang`);
    byId.set(id, { id, months, usd: Number(p.usd), kind: p.kind === 'first' || id === 'khoi-dau' ? 'first' : undefined, enabled: p.enabled === true });
  }
  // luôn có đủ các gói mặc định (gói nào chưa lưu thì dùng mặc định)
  for (const d of DEFAULT_PLANS) if (!byId.has(d.id)) byId.set(d.id, { ...d });
  return [...byId.values()].sort((a, b) => (a.kind === 'first' ? -1 : 0) - (b.kind === 'first' ? -1 : 0) || a.months - b.months);
}

function getConfig() {
  const c = read();
  return {
    usdRate: getUsdRate(),
    webFeeUsd: Number(c.webFeeUsd) > 0 ? Number(c.webFeeUsd) : DEFAULTS.webFeeUsd,
    plans: normalizePlans(c.plans),
    legal: { ...DEFAULTS.legal, ...(c.legal || {}) },
  };
}

const decorate = (p) => ({ ...p, vnd: toVnd(p.usd), days: p.months * DAYS_PER_MONTH });

/** Các gói khách TỰ MUA được trong tool (đã bật tự bán). Gói khởi đầu chỉ có mặt nếu thầy bật. */
function getPlans() {
  return getConfig().plans.filter((p) => p.enabled).map(decorate);
}
function getAllPlans() {
  return getConfig().plans.map(decorate);
}
function getPlanById(id) {
  return getPlans().find((p) => p.id === id) || null;
}
/** Tương thích bản cũ: tìm theo số tháng (ưu tiên gói thường, không lấy gói khởi đầu). */
function getPlan(months) {
  return getPlans().find((p) => p.months === Number(months) && p.kind !== 'first') || null;
}
/** Giá gói khởi đầu để HIỂN THỊ cho khách (dù chưa bật tự bán): { months, days, vnd, autoSell }. */
function getFirstOffer() {
  const p = getConfig().plans.find((x) => x.kind === 'first');
  return p ? { ...decorate(p), autoSell: !!p.enabled } : null;
}
function getWebFee() {
  const usd = getConfig().webFeeUsd;
  return { usd, vnd: toVnd(usd) };
}
function getLegal() {
  return getConfig().legal;
}

/** Lưu từ trang quản trị (trường nào thiếu thì giữ nguyên). */
function saveConfig(partial) {
  const cur = getConfig();
  const next = {
    usdRate: Number(partial.usdRate) >= 10000 ? Math.round(Number(partial.usdRate)) : cur.usdRate,
    webFeeUsd: partial.webFeeUsd != null && Number(partial.webFeeUsd) > 0 ? Number(partial.webFeeUsd) : cur.webFeeUsd,
    plans: Array.isArray(partial.plans) ? normalizePlans(partial.plans) : cur.plans,
    legal: { ...cur.legal, ...(partial.legal || {}) },
    updatedAt: Date.now(),
  };
  write(next);
  return getConfig();
}

module.exports = {
  get USD_RATE() { return getUsdRate(); },
  FIRST_KEY_DAYS, DAYS_PER_MONTH, toVnd, getPlans, getAllPlans, getPlan, getPlanById, getFirstOffer, getWebFee, getLegal, getConfig, saveConfig, getUsdRate,
};
