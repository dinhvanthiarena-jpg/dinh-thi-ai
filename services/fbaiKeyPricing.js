// Giá BÁN key SA-BOTAI (FBAI-…) 30 ngày để khách TỰ MUA bằng ví trong tool — thầy
// chốt 2026-10-03/04: "khách mua key → trừ ví → tự sinh key, không cần thầy duyệt".
// Thầy CHƯA chốt giá nên giá lưu ở file cấu hình, chỉnh trong trang quản trị
// (/admin/gia-key-sa-botai) — chưa đặt giá (null) thì tool chỉ hiện "nhắn Zalo nhận
// key", chưa cho tự mua. Không hard-code giá trong code.
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'fbai-key-pricing.json');

function read() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch (e) {
    return {};
  }
}

/** Giá 1 key 30 ngày (VNĐ) hoặc null nếu chưa mở bán tự động. */
function getPriceVnd() {
  const v = Number(read().keyPriceVnd);
  return Number.isFinite(v) && v >= 1000 ? Math.round(v) : null;
}

function setPriceVnd(value) {
  const n = Math.round(Number(value));
  const cfg = read();
  cfg.keyPriceVnd = Number.isFinite(n) && n >= 1000 ? n : null; // để trống/0 = tắt bán tự động
  cfg.updatedAt = Date.now();
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(cfg, null, 2));
  return cfg.keyPriceVnd;
}

module.exports = { getPriceVnd, setPriceVnd };
