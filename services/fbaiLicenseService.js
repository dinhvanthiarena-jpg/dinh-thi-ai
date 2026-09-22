// License key cho tool DESKTOP AAi-3dvietpro (fb-ads-manager) — thầy yêu cầu
// 2026-09-16: "làm thế nào để cho dù claude khác làm nhưng vẫn phải hỏi key
// trên trang 3dvietpro" — chuyển license desktop từ kiểu offline-thuần (chỉ
// kiểm tra checksum tại chỗ trong D:\CLAUDE CODE\fb-ads-manager\license-core.js,
// không server nào theo dõi/thu hồi được) sang kiểu ONLINE giống hệt
// aaiLicenseService.js (bản web): mỗi lần kích hoạt/tái xác minh PHẢI hỏi
// lại server này — vì đó là cách DUY NHẤT thu hồi được key sau khi đã cấp,
// và cũng là cách duy nhất đảm bảo "ai cầm được source code (kể cả 1 phiên
// Claude khác) cũng không tự cấp key hợp lệ được" — vì bản thân server này
// (nơi giữ danh sách key đã cấp) không đi kèm theo source code desktop.
//
// Dùng LẠI đúng thuật toán checksum + SECRET + tiền tố "FBAI-" đã có sẵn
// trong license-core.js (không đổi) — để các key ĐàCẤP TRƯỚC ĐÂY theo kiểu
// offline (nếu có) vẫn đúng định dạng/checksum, chỉ cần thầy chủ động thêm
// chúng vào danh sách đã cấp ở đây (issueKey) để chúng bắt đầu được server
// này theo dõi/thu hồi được từ nay về sau.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRET = 'FBAdsManager-DinhThiAi-K3y-S3cr3t-2026'; // giống hệt license-core.js — KHÔNG đổi, nếu không mọi key cũ sẽ sai checksum
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTVWXYZ';
const PREFIX = 'FBAI';
const LICENSE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // bán theo tháng, giống hệt aaiLicenseService

const KEYS_PATH = path.join(__dirname, '..', 'data', 'fbai-desktop-licenses.json');

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

function isWellFormed(input) {
  let payload = normalizeKey(input);
  if (payload.startsWith(PREFIX)) payload = payload.slice(PREFIX.length);
  if (payload.length !== 12) return false;
  const body = payload.slice(0, 8);
  const check = payload.slice(8, 12);
  return checksumFor(body) === check;
}

function issueKey(note) {
  const body = randomBodyChars(8);
  const check = checksumFor(body);
  const key = formatKey(body, check);
  const list = loadKeys();
  const entry = { key, note: note || '', issuedAt: Date.now(), expiresAt: Date.now() + LICENSE_DURATION_MS, active: true, boundMachine: null, boundDeviceId: null };
  list.unshift(entry);
  saveKeys(list);
  return entry;
}

function renewKey(key) {
  const list = loadKeys();
  const entry = list.find((k) => k.key === normalizeAndFormat(key));
  if (entry) {
    entry.expiresAt = Date.now() + LICENSE_DURATION_MS;
    entry.active = true;
  }
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

// Ghi lại tên máy/định danh máy đã kích hoạt key này lần đầu — chỉ để thầy
// biết key đang chạy ở đâu, không dùng để chặn kích hoạt lại máy khác.
function recordActivation(key, machineLabel) {
  const list = loadKeys();
  const entry = list.find((k) => k.key === normalizeAndFormat(key));
  if (entry && !entry.boundMachine) {
    entry.boundMachine = machineLabel;
    saveKeys(list);
  }
}

// Khoá "1 thiết bị" thầy yêu cầu 2026-09-22: mỗi key chỉ chạy được trên ĐÚNG
// 1 "danh tính thiết bị" (boundDeviceId - do tool desktop tự sinh ngẫu nhiên
// 1 lần, KHÔNG đổi mỗi lần mở app) tại một thời điểm - chặn việc 1 khách đưa
// key cho người khác dùng trên máy của họ. Desktop + hosting do CHÍNH khách
// đó tự triển khai vẫn tính là "1 thiết bị", vì tool desktop tự đẩy ĐÚNG
// deviceId của mình sang hosting khi đồng bộ (xem hosting:sync-automation ở
// fb-ads-manager/main.js) - không phải deviceId hosting tự sinh riêng.
//
// deviceId rỗng/không gửi (client cũ, hoặc gọi thẳng bằng tay) thì BỎ QUA
// việc khoá thiết bị, chỉ kiểm tra như isActiveLicense() bình thường - tránh
// phá vỡ những nơi gọi verify mà chưa kịp gửi deviceId.
function checkAndBindDevice(key, deviceId, label) {
  if (!isWellFormed(key)) return { valid: false, reason: 'invalid_key' };
  const formatted = normalizeAndFormat(key);
  const list = loadKeys();
  const entry = list.find((k) => k.key === formatted);
  if (!entry || entry.active === false) return { valid: false, reason: 'revoked' };
  if (entry.expiresAt && Date.now() > entry.expiresAt) return { valid: false, reason: 'expired' };

  if (deviceId) {
    if (!entry.boundDeviceId) {
      entry.boundDeviceId = deviceId;
      if (label) entry.boundMachine = label;
      saveKeys(list);
    } else if (entry.boundDeviceId !== deviceId) {
      return { valid: false, reason: 'device_mismatch' };
    } else if (label && label !== entry.boundMachine) {
      entry.boundMachine = label;
      saveKeys(list);
    }
  }
  return { valid: true };
}

// Cho khách đổi máy hợp lệ (máy cũ hỏng/thầy xác nhận thủ công) - gỡ khoá
// thiết bị hiện tại, lần verify kế tiếp với deviceId bất kỳ sẽ bind lại.
function resetDevice(key) {
  const list = loadKeys();
  const entry = list.find((k) => k.key === normalizeAndFormat(key));
  if (entry) {
    entry.boundDeviceId = null;
    entry.boundMachine = null;
    saveKeys(list);
  }
  return entry;
}

function normalizeAndFormat(input) {
  let payload = normalizeKey(input);
  if (payload.startsWith(PREFIX)) payload = payload.slice(PREFIX.length);
  if (payload.length !== 12) return normalizeKey(input);
  return formatKey(payload.slice(0, 8), payload.slice(8, 12));
}

function isActiveLicense(input) {
  if (!isWellFormed(input)) return false;
  const formatted = normalizeAndFormat(input);
  const entry = loadKeys().find((k) => k.key === formatted);
  if (!entry || entry.active === false) return false;
  if (entry.expiresAt && Date.now() > entry.expiresAt) return false;
  return true;
}

module.exports = {
  issueKey,
  listKeys,
  revokeKey,
  reactivateKey,
  renewKey,
  recordActivation,
  isActiveLicense,
  checkAndBindDevice,
  resetDevice,
  isWellFormed,
  normalizeAndFormat,
};
