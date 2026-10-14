// License key cho tool DESKTOP SA FILM-AI (video-workflow-tool/desktop) — thầy yêu cầu 2026-10-14:
// "thiết kế có key, để sau này thương mại, hiện tại cứ cho dùng miễn phí đã, tạo key trên trang 3dvietpro".
//
// Cùng kiểu ONLINE như fbaiLicenseService.js: tool desktop PHẢI hỏi lại server này mỗi lần kích hoạt
// và định kỳ 24h — nên thầy thu hồi / đặt hạn / đổi thiết bị được bất cứ lúc nào, và ai cầm được
// source code của tool cũng không tự cấp được key hợp lệ (danh sách key nằm ở server này).
//
// Khác fbai: có `plan` (free | pro) và chế độ MIỄN PHÍ (freeMode) — khi bật, khách bấm "Nhận key miễn
// phí" ngay trong tool là được cấp key plan=free, không hết hạn. Sau này thương mại thì tắt freeMode
// (trang admin /admin/key-sa-film-ai) và chỉ còn key thầy cấp / key trả phí (plan=pro, có hạn).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET = 'SAFilmAI-DinhThiAi-K3y-S3cr3t-2026'; // KHÔNG đổi — đổi thì mọi key đã cấp sai checksum
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTVWXYZ';
const PREFIX = 'SAFILM';
const DAY = 24 * 60 * 60 * 1000;

const KEYS_PATH = path.join(__dirname, '..', 'data', 'safilm-licenses.json');
const SETTINGS_PATH = path.join(__dirname, '..', 'data', 'safilm-settings.json');

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return fallback; }
}
function writeJson(p, v) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v, null, 2));
}
const loadKeys = () => readJson(KEYS_PATH, []);
const saveKeys = (l) => writeJson(KEYS_PATH, l);

function getSettings() {
  return { freeMode: true, ...readJson(SETTINGS_PATH, {}) }; // mặc định MIỄN PHÍ theo ý thầy
}
function setFreeMode(on) {
  const s = { ...getSettings(), freeMode: !!on };
  writeJson(SETTINGS_PATH, s);
  return s;
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

// days: số ngày hiệu lực; 0/undefined = KHÔNG hết hạn (dùng cho key miễn phí / key thầy tặng).
function issueKey({ note = '', plan = 'free', days = 0, email = '', deviceId = null, machine = null } = {}) {
  const body = randomBodyChars(8);
  const key = formatKey(body, checksumFor(body));
  const entry = {
    key, note, plan, email,
    issuedAt: Date.now(),
    expiresAt: days > 0 ? Date.now() + days * DAY : null,
    active: true,
    boundDeviceId: deviceId, boundMachine: machine, lastSeenAt: null,
  };
  const list = loadKeys();
  list.unshift(entry);
  saveKeys(list);
  return entry;
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
const resetDevice = (key) => update(key, (e) => { e.boundDeviceId = null; e.boundMachine = null; });
// Gia hạn: cộng `days` ngày vào hạn CÒN LẠI (không mất ngày đã trả). Key không hạn thì đặt hạn từ hôm nay.
const extendKey = (key, days) => update(key, (e) => {
  e.expiresAt = Math.max(Date.now(), e.expiresAt || 0) + (days || 30) * DAY;
  e.active = true;
});
const setPlan = (key, plan) => update(key, (e) => { e.plan = plan; });

// Kích hoạt / xác minh định kỳ. 1 key = 1 thiết bị (deviceId do tool tự sinh, không đổi giữa các lần mở).
function checkAndBindDevice(key, deviceId, label) {
  if (!isWellFormed(key)) return { valid: false, reason: 'invalid_key' };
  const list = loadKeys();
  const entry = findEntry(list, key);
  if (!entry) return { valid: false, reason: 'invalid_key' };
  if (entry.active === false) return { valid: false, reason: 'revoked' };
  if (entry.expiresAt && Date.now() > entry.expiresAt) return { valid: false, reason: 'expired' };
  if (deviceId) {
    if (!entry.boundDeviceId) {
      entry.boundDeviceId = deviceId;
      if (label) entry.boundMachine = label;
    } else if (entry.boundDeviceId !== deviceId) {
      return { valid: false, reason: 'device_mismatch' };
    } else if (label && label !== entry.boundMachine) {
      entry.boundMachine = label;
    }
  }
  entry.lastSeenAt = Date.now();
  saveKeys(list);
  return { valid: true, plan: entry.plan || 'free', expiresAt: entry.expiresAt || null };
}

// Nhận key miễn phí (chỉ khi freeMode bật). Cùng 1 thiết bị gọi lại -> trả đúng key cũ, không cấp thêm.
function claimFreeKey({ deviceId, email, label }) {
  if (!getSettings().freeMode) return { error: 'free_closed' };
  if (!deviceId) return { error: 'no_device' };
  const list = loadKeys();
  // Máy đã bị thu hồi key thì không được xin key miễn phí mới để lách (thầy mở lại bằng "Kích hoạt lại" / "Đổi thiết bị")
  if (list.some((k) => k.boundDeviceId === deviceId && k.active === false)) return { error: 'revoked' };
  const existing = list.find((k) => k.boundDeviceId === deviceId && k.plan === 'free' && k.active !== false);
  if (existing && (!existing.expiresAt || existing.expiresAt > Date.now())) return { key: existing.key, reused: true };
  const entry = issueKey({ note: 'Key miễn phí tự nhận', plan: 'free', email: email || '', deviceId, machine: label || null });
  return { key: entry.key, reused: false };
}

module.exports = {
  issueKey, listKeys, revokeKey, reactivateKey, resetDevice, extendKey, setPlan,
  checkAndBindDevice, claimFreeKey, getSettings, setFreeMode, isWellFormed, normalizeAndFormat,
};
