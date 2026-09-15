// License key cho bản WEB của A-AI Ads — dùng CÙNG thuật toán checksum HMAC
// đã dùng cho tool desktop (xem D:\CLAUDE CODE\fb-ads-manager\license-core.js)
// vì thuật toán đó đã chứng minh hoạt động tốt, nhưng dùng SECRET + tiền tố
// khác ("AIWEB-" thay vì "FBAI-") để 2 loại key không dùng lẫn được cho nhau
// — key desktop và key web là 2 sản phẩm/gói giá khác nhau.
//
// Khác với key desktop (chỉ generate + validate tại chỗ, không server nào
// theo dõi), bản WEB cần theo dõi được: đã cấp cho ai/site nào, còn hiệu lực
// hay đã thu hồi — vì đây là mô hình mỗi khách hàng tự vận hành 1 bản clone
// của tool trên web CỦA HỌ (thầy quản lý bằng key, không phải admin của họ —
// xem ghi chú kiến trúc ở đầu services/aaiAdsService.js), nên cần thu hồi
// được key nếu khách ngừng trả phí.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET = 'AAiAdsWeb-DinhThiAi-K3y-S3cr3t-2026';
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTVWXYZ'; // không có 0/1/O/I/U — tránh nhầm khi gõ tay
const PREFIX = 'AIWEB';

const KEYS_PATH = path.join(__dirname, '..', 'data', 'aai-ads-web-licenses.json');

function loadKeys() {
  try {
    return JSON.parse(fs.readFileSync(KEYS_PATH, 'utf8'));
  } catch (e) {
    return [];
  }
}
function saveKeys(list) {
  fs.mkdirSync(path.dirname(KEYS_PATH), { recursive: true });
  fs.writeFileSync(KEYS_PATH, JSON.stringify(list, null, 2));
}

function randomBodyChars(n) {
  const bytes = crypto.randomBytes(n);
  let s = '';
  for (let i = 0; i < n; i++) s += ALPHABET[bytes[i] % ALPHABET.length];
  return s;
}
function checksumFor(body) {
  const hash = crypto.createHmac('sha256', SECRET).update(body).digest();
  let s = '';
  for (let i = 0; i < 4; i++) s += ALPHABET[hash[i] % ALPHABET.length];
  return s;
}
function formatKey(body, check) {
  const full = body + check;
  return `${PREFIX}-${full.slice(0, 4)}-${full.slice(4, 8)}-${full.slice(8, 12)}`;
}
function normalizeKey(input) {
  return String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Kiểm tra checksum hợp lệ về mặt TOÁN HỌC (không cần tra danh sách đã cấp) —
// dùng được ngay cả khi file aai-ads-web-licenses.json bị mất/chưa đồng bộ,
// giống cách tool desktop luôn tự xác thực được offline.
function isWellFormed(input) {
  let payload = normalizeKey(input);
  if (payload.startsWith(PREFIX)) payload = payload.slice(PREFIX.length);
  if (payload.length !== 12) return false;
  const body = payload.slice(0, 8);
  const check = payload.slice(8, 12);
  return checksumFor(body) === check;
}

// Tạo 1 key mới, lưu vào danh sách đã cấp kèm ghi chú (VD tên site/khách
// hàng) để thầy biết key nào cấp cho ai — trả về đối tượng key đầy đủ.
function issueKey(note) {
  const body = randomBodyChars(8);
  const check = checksumFor(body);
  const key = formatKey(body, check);
  const list = loadKeys();
  const entry = { key, note: note || '', issuedAt: Date.now(), active: true, boundDomain: null };
  list.unshift(entry);
  saveKeys(list);
  return entry;
}

function listKeys() {
  return loadKeys();
}

function revokeKey(key) {
  const list = loadKeys();
  const entry = list.find((k) => k.key === normalizeAndFormat(key));
  if (entry) entry.active = false;
  saveKeys(list);
  return entry;
}
function reactivateKey(key) {
  const list = loadKeys();
  const entry = list.find((k) => k.key === normalizeAndFormat(key));
  if (entry) entry.active = true;
  saveKeys(list);
  return entry;
}

// Ghi lại domain đã kích hoạt key này lần đầu — không bắt buộc, chỉ để thầy
// biết key nào đang chạy ở đâu; không dùng để chặn kích hoạt lại nơi khác
// (đổi hosting/domain là chuyện bình thường, không nên tự khoá thầy).
function recordActivation(key, domain) {
  const list = loadKeys();
  const entry = list.find((k) => k.key === normalizeAndFormat(key));
  if (entry && !entry.boundDomain) {
    entry.boundDomain = domain;
    saveKeys(list);
  }
}

function normalizeAndFormat(input) {
  let payload = normalizeKey(input);
  if (payload.startsWith(PREFIX)) payload = payload.slice(PREFIX.length);
  if (payload.length !== 12) return normalizeKey(input); // trả nguyên (sẽ không khớp gì) nếu sai định dạng
  return formatKey(payload.slice(0, 8), payload.slice(8, 12));
}

// Kiểm tra đầy đủ: đúng định dạng/checksum VÀ có trong danh sách đã cấp VÀ
// chưa bị thu hồi. Đây là hàm gate thật sự dùng để chặn truy cập.
function isActiveLicense(input) {
  if (!isWellFormed(input)) return false;
  const formatted = normalizeAndFormat(input);
  const entry = loadKeys().find((k) => k.key === formatted);
  return !!(entry && entry.active !== false);
}

module.exports = {
  issueKey,
  listKeys,
  revokeKey,
  reactivateKey,
  recordActivation,
  isActiveLicense,
  isWellFormed,
  normalizeAndFormat,
};
