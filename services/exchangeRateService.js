/**
 * Tỷ giá USD/VND thị trường, tự động cập nhật — dùng để quy đổi phí tính
 * bằng USD (ví dụ phí "tạo web" $50 của SA-AI BOT) sang VNĐ để trừ ví.
 *
 * Nguồn: open.er-api.com (miễn phí, không cần API key, cập nhật ~1 lần/ngày,
 * tỷ giá thị trường liên ngân hàng — không phải tỷ giá bán ra của 1 ngân
 * hàng cụ thể). Cache trong bộ nhớ 1 giờ để đỡ gọi API mỗi lần tính giá;
 * nếu API lỗi/mất mạng, dùng tỷ giá dự phòng cứng (FALLBACK_RATE) chứ
 * không để vỡ luồng thanh toán.
 */
const https = require('https');

const CACHE_MS = 60 * 60 * 1000; // 1 giờ
const FALLBACK_RATE = 25800; // dự phòng nếu không gọi được API, cập nhật tay nếu lệch xa thực tế lâu ngày

let cache = { rate: null, fetchedAt: 0 };

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function layTyGiaUsdVnd() {
  const now = Date.now();
  if (cache.rate && now - cache.fetchedAt < CACHE_MS) return cache.rate;
  try {
    const json = await fetchJson('https://open.er-api.com/v6/latest/USD');
    const rate = json && json.rates && Number(json.rates.VND);
    if (rate && rate > 1000 && rate < 100000) {
      cache = { rate, fetchedAt: now };
      return rate;
    }
    throw new Error('Tỷ giá trả về không hợp lệ');
  } catch (err) {
    console.error('[exchangeRateService] lỗi lấy tỷ giá, dùng dự phòng:', err.message);
    return cache.rate || FALLBACK_RATE;
  }
}

async function quyDoiUsdSangVnd(usd) {
  const rate = await layTyGiaUsdVnd();
  return Math.round(usd * rate);
}

module.exports = { layTyGiaUsdVnd, quyDoiUsdSangVnd, FALLBACK_RATE };
