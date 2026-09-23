// Kích hoạt bản A-AI Ads clone bằng license key do thầy Đinh Thi Ai cấp.
//
// Khác kiểu key desktop (tự kiểm tra checksum tại chỗ, không server nào theo
// dõi) — key ở đây PHẢI hỏi lại 1 server trung tâm (3dvietpro.com) mỗi lần
// kích hoạt VÀ định kỳ sau đó, vì đây là cách DUY NHẤT thầy thu hồi được
// quyền dùng tool sau khi đã cấp (khách ngừng trả phí chẳng hạn) — nếu chỉ
// kiểm tra checksum toán học thuần offline thì 1 key hợp lệ sẽ mãi mãi hợp lệ,
// không thể "tắt" từ xa được.
//
// Có "grace period" (mặc định 3 ngày) để chịu được server trung tâm tạm thời
// không tới được (bảo trì, mất mạng...) mà không khoá nhầm khách hàng đang
// trả phí đầy đủ — chỉ khoá thật khi server trung tâm XÁC NHẬN RÕ là key đã
// bị thu hồi (trả về valid:false), không phải khi không liên lạc được.
//
// Thầy yêu cầu 2026-09-23: "2 cái này về bản chất là 1 cái tool... cho dùng
// chung kể cả trên web lẫn trên tool" - từ nay module này chấp nhận CẢ 2 dạng
// key: FBAI-XXXX (key chính, dùng chung với tool desktop SA-AI BOT - khách
// mới chỉ cần 1 key cho cả 2 nơi) và AIWEB-XXXX (key cũ, giữ lại để không làm
// gián đoạn khách đã mua trước đây). Mỗi dạng verify với đúng server tương
// ứng (fbai-license hoặc aai-license) - KHÔNG gửi kèm deviceId khi verify
// FBAI ở đây, vì đây là web chạy trên SERVER của khách (không phải 1 thiết bị
// đơn lẻ như desktop) - server fbai-license/verify bỏ qua khoá thiết bị khi
// không có deviceId, nên không tranh giành "1 thiết bị" với app desktop của
// cùng khách đó.
const fs = require('fs');
const path = require('path');

const FBAI_VERIFY_URL = process.env.FBAI_LICENSE_VERIFY_URL || 'https://3dvietpro.com/api/fbai-license/verify';
const AIWEB_VERIFY_URL = process.env.AAI_LICENSE_VERIFY_URL || 'https://3dvietpro.com/api/aai-license/verify';
const GRACE_PERIOD_MS = 3 * 24 * 60 * 60 * 1000; // 3 ngày
const STATE_PATH = path.join(__dirname, 'data', 'aai-ads-activation.json');

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  } catch (e) {
    return null;
  }
}
function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

function isWellFormed(input) {
  const normalized = String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return /^AIWEB[A-Z0-9]{12}$/.test(normalized) || /^FBAI[A-Z0-9]{12}$/.test(normalized);
}

function verifyUrlFor(key) {
  const normalized = String(key || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return normalized.startsWith('FBAI') ? FBAI_VERIFY_URL : AIWEB_VERIFY_URL;
}

async function verifyOnline(key) {
  try {
    const res = await fetch(`${verifyUrlFor(key)}?key=${encodeURIComponent(key)}`);
    if (!res.ok) return { ok: false, networkError: true };
    const data = await res.json();
    return { ok: true, valid: !!data.valid };
  } catch (e) {
    return { ok: false, networkError: true };
  }
}

// Gọi khi khách nhập key lần đầu — bắt buộc phải liên lạc được với server
// trung tâm để xác nhận thật, không chấp nhận "chưa xác minh được thì cứ cho
// qua" ở bước kích hoạt (grace period chỉ áp dụng cho các lần TÁI xác minh
// sau này, không áp dụng cho lần đầu).
async function activate(key) {
  if (!isWellFormed(key)) {
    return { ok: false, error: 'Key sai định dạng — đúng dạng phải là FBAI-XXXX-XXXX-XXXX (key SA-AI BOT) hoặc AIWEB-XXXX-XXXX-XXXX.' };
  }
  const result = await verifyOnline(key);
  if (!result.ok) {
    return { ok: false, error: 'Không liên lạc được với server xác thực — thử lại sau ít phút.' };
  }
  if (!result.valid) {
    return { ok: false, error: 'Key không hợp lệ hoặc đã bị thu hồi. Liên hệ người cấp key để được hỗ trợ.' };
  }
  saveState({ key, activatedAt: Date.now(), lastVerifiedAt: Date.now(), lastVerifiedValid: true });
  return { ok: true };
}

// Tái xác minh định kỳ (gọi từ router mỗi request, dùng cache trong ngày để
// không gọi mạng mỗi lần — xem shouldReverify()) — cập nhật state, và QUAN
// TRỌNG: nếu server xác nhận rõ key đã bị thu hồi thì khoá NGAY, không chờ
// hết grace period (grace period chỉ dành cho lỗi mạng/server sập tạm thời).
async function reverify(key) {
  const result = await verifyOnline(key);
  const state = loadState() || {};
  if (result.ok) {
    saveState({ ...state, key, lastVerifiedAt: Date.now(), lastVerifiedValid: result.valid });
  }
  // Lỗi mạng: giữ nguyên lastVerifiedValid cũ, chỉ grace period tự nhiên hết hạn mới khoá.
}

function shouldReverify(state) {
  if (!state.lastVerifiedAt) return true;
  return Date.now() - state.lastVerifiedAt > 24 * 60 * 60 * 1000; // tái xác minh mỗi 24h
}

// Middleware gate — dùng cho MỌI route của module (trừ chính route kích hoạt).
function requireActivation() {
  return async (req, res, next) => {
    const state = loadState();
    if (!state || !state.key) {
      return res.status(403).send(renderActivationPage());
    }
    if (shouldReverify(state)) {
      // Không chặn request hiện tại chờ mạng — tái xác minh nền, dùng trạng
      // thái đã lưu cho request này, áp dụng kết quả mới cho lần sau.
      reverify(state.key).catch(() => {});
    }
    const withinGrace = state.lastVerifiedAt && Date.now() - state.lastVerifiedAt < GRACE_PERIOD_MS;
    if (state.lastVerifiedValid === false && !withinGrace) {
      return res.status(403).send(renderActivationPage('Key đã bị thu hồi hoặc hết hạn. Liên hệ người cấp key để được hỗ trợ.'));
    }
    next();
  };
}

function renderActivationPage(errorMessage) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Kích hoạt A-AI Ads</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAF5FF; font-family: system-ui, sans-serif; }
  .box { background: #fff; border-radius: 16px; box-shadow: 0 1px 3px rgba(30,27,75,.08); padding: 40px; max-width: 420px; width: 100%; }
  h1 { font-size: 20px; margin: 0 0 8px; color: #1E1B4B; }
  p { font-size: 14px; color: #475569; margin: 0 0 20px; }
  input { width: 100%; box-sizing: border-box; border: 1px solid #DDD6FE; border-radius: 8px; padding: 12px 16px; font-size: 16px; font-family: monospace; text-align: center; letter-spacing: 1px; margin-bottom: 16px; }
  button { width: 100%; background: #7C3AED; color: #fff; border: none; border-radius: 8px; padding: 12px; font-size: 15px; font-weight: 600; cursor: pointer; }
  button:hover { background: #6D28D9; }
  .error { background: #FEF2F2; color: #DC2626; border-radius: 8px; padding: 12px 16px; font-size: 13px; margin-bottom: 16px; }
</style>
</head>
<body>
  <div class="box">
    <h1>🚀 Kích hoạt A-AI Ads</h1>
    <p>Nhập license key SA-AI BOT được cấp (dùng chung với tool desktop) để bắt đầu sử dụng công cụ quảng cáo AI tự động.</p>
    ${errorMessage ? `<div class="error">${errorMessage}</div>` : ''}
    <form method="POST" action="/aai-ads/activate">
      <input name="key" placeholder="FBAI-XXXX-XXXX-XXXX" autocomplete="off" autofocus required />
      <button type="submit">Kích hoạt</button>
    </form>
  </div>
</body>
</html>`;
}

module.exports = { activate, requireActivation, renderActivationPage, isWellFormed };
