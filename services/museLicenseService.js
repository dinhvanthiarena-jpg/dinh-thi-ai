// License key cho tool desktop SA MUSE-AI (bản đổi tên của "Tool Muse", thay hệ Firebase muse-ai-617ac cũ)
// — thầy yêu cầu 2026-11-03: không có key hợp lệ thì tool không chạy.
//
// Cùng kiểu ONLINE như safilmLicenseService.js: tool hỏi lại server này khi kích hoạt và định kỳ (6h),
// nên thầy thu hồi / gia hạn / đổi máy được bất cứ lúc nào. Mỗi key gắn đúng 1 máy theo mã máy
// `MUSE-XXXX-XXXX-XXXX-XXXX` (tool băm từ Windows MachineGuid). Thầy có thể nhập sẵn mã máy khi cấp key,
// hoặc để trống — lần kích hoạt đầu tiên sẽ tự khoá key vào máy đó.
//
// Khác safilm: không có chế độ nhận key miễn phí; `plan` là hạn mức số tài khoản Muse lưu trong tool
// (giữ đúng ý nghĩa status của hệ Firebase cũ): free = 3, 10 = 10, 50 = 50, active = không giới hạn.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET = 'SAMuseAI-DinhThiAi-K3y-S3cr3t-2026'; // KHÔNG đổi — đổi thì mọi key đã cấp sai checksum
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTVWXYZ';
const PREFIX = 'SAMUSE';
const DAY = 24 * 60 * 60 * 1000;
const PLANS = { free: 3, 10: 10, 50: 50, active: null };
const MACHINE_RE = /^MUSE-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/;

const KEYS_PATH = path.join(__dirname, '..', 'data', 'muse-licenses.json');
// Bản phát hành tool để máy khách TỰ CẬP NHẬT: {version, url, notes} — thầy sửa trên /admin/key-muse.
const APP_VERSION_PATH = path.join(__dirname, '..', 'data', 'muse-app-version.json');

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return fallback; }
}
function writeJson(p, v) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2));
}
const loadKeys = () => readJson(KEYS_PATH, []);
const saveKeys = (l) => writeJson(KEYS_PATH, l);

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
const normalizeKey = (input) => String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
function formatKey(body, check) {
  const full = body + check;
  return `${PREFIX}-${full.slice(0, 4)}-${full.slice(4, 8)}-${full.slice(8, 12)}`;
}
function payloadOf(input) {
  let p = normalizeKey(input);
  if (p.startsWith(PREFIX)) p = p.slice(PREFIX.length);
  return p;
}
function isWellFormed(input) {
  const p = payloadOf(input);
  return p.length === 12 && checksumFor(p.slice(0, 8)) === p.slice(8, 12);
}
function normalizeAndFormat(input) {
  const p = payloadOf(input);
  return p.length === 12 ? formatKey(p.slice(0, 8), p.slice(8, 12)) : normalizeKey(input);
}
const normalizePlan = (plan) => (Object.prototype.hasOwnProperty.call(PLANS, String(plan)) ? String(plan) : 'active');
// '' = chưa gắn máy; null = mã máy nhập sai định dạng
function normalizeMachineId(input) {
  const s = String(input || '').trim().toUpperCase();
  if (!s) return '';
  return MACHINE_RE.test(s) ? s : null;
}

// days: số ngày hiệu lực; mặc định 30 ngày; truyền 0 = KHÔNG hết hạn.
function issueKey({ note = '', plan = 'active', days = 30, machineId = '' } = {}) {
  const body = randomBodyChars(8);
  const key = formatKey(body, checksumFor(body));
  const entry = {
    key, note, plan: normalizePlan(plan),
    issuedAt: Date.now(),
    expiresAt: days > 0 ? Date.now() + days * DAY : null,
    active: true,
    machineId: machineId || null, machineLabel: null, lastSeenAt: null, lastVersion: null,
  };
  const list = loadKeys();
  list.unshift(entry);
  saveKeys(list);
  return entry;
}

// Bản phát hành tool (máy khách hỏi mỗi 6h để tự cập nhật)
function getAppVersion() {
  const d = readJson(APP_VERSION_PATH, {});
  return {
    version: String(d.version || '').slice(0, 20),
    url: String(d.url || '').slice(0, 300),
    notes: String(d.notes || '').slice(0, 300),
  };
}
function setAppVersion({ version = '', url = '', notes = '' } = {}) {
  const data = {
    version: String(version || '').trim().slice(0, 20),
    url: String(url || '').trim().slice(0, 300),
    notes: String(notes || '').trim().slice(0, 300),
    updatedAt: Date.now(),
  };
  writeJson(APP_VERSION_PATH, data);
  return data;
}

const findEntry = (list, key) => list.find((k) => k.key === normalizeAndFormat(key));

function listKeys() { return loadKeys(); }

function update(key, fn) {
  const list = loadKeys();
  const entry = findEntry(list, key);
  if (entry) { fn(entry); saveKeys(list); }
  return entry;
}
const revokeKey = (key) => update(key, (e) => { e.active = false; });
const reactivateKey = (key) => update(key, (e) => { e.active = true; });
const resetMachine = (key) => update(key, (e) => { e.machineId = null; e.machineLabel = null; });
const setMachine = (key, machineId) => update(key, (e) => { e.machineId = machineId || null; e.machineLabel = null; });
// Gia hạn: cộng `days` ngày vào hạn CÒN LẠI (không mất ngày đã trả). Key không hạn thì đặt hạn từ hôm nay.
const extendKey = (key, days) => update(key, (e) => {
  e.expiresAt = Math.max(Date.now(), e.expiresAt || 0) + (days || 30) * DAY;
  e.active = true;
});
const setUnlimited = (key) => update(key, (e) => { e.expiresAt = null; });
const setPlan = (key, plan) => update(key, (e) => { e.plan = normalizePlan(plan); });

// Kích hoạt / xác minh định kỳ từ tool. 1 key = 1 mã máy.
function verify(key, machineId, { label = '', version = '' } = {}) {
  if (!isWellFormed(key)) return { valid: false, reason: 'invalid_key' };
  const mid = normalizeMachineId(machineId);
  if (!mid) return { valid: false, reason: 'invalid_machine' };
  const list = loadKeys();
  const entry = findEntry(list, key);
  if (!entry) return { valid: false, reason: 'invalid_key' };
  if (entry.active === false) return { valid: false, reason: 'revoked' };
  if (entry.expiresAt && Date.now() > entry.expiresAt) return { valid: false, reason: 'expired', expiresAt: entry.expiresAt };
  if (!entry.machineId) entry.machineId = mid;
  else if (entry.machineId !== mid) return { valid: false, reason: 'machine_mismatch' };
  if (label) entry.machineLabel = label;
  if (version) entry.lastVersion = version;
  entry.lastSeenAt = Date.now();
  saveKeys(list);
  const plan = normalizePlan(entry.plan);
  return { valid: true, key: entry.key, plan, maxAccounts: PLANS[plan], expiresAt: entry.expiresAt || null, serverTime: Date.now() };
}

module.exports = {
  PLANS, issueKey, listKeys, revokeKey, reactivateKey, resetMachine, setMachine, extendKey, setUnlimited, setPlan,
  verify, isWellFormed, normalizeAndFormat, normalizeMachineId,
  getAppVersion, setAppVersion,
};
