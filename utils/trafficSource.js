// Classifies where a request came from, using the same signals every
// analytics tool relies on: paid-click IDs and utm_source in the query
// string (most reliable — set by the ad platform itself), falling back to
// the HTTP Referer header's hostname, and finally "Trực tiếp / Không xác
// định" when neither is present (typed URL, bookmark, native app link, or
// a referrer stripped by the visitor's browser/privacy settings).
function detectTrafficSource(req) {
  const query = req.query || {};

  if (query.gclid) return 'Quảng cáo Google (Ads)';
  if (query.fbclid) return 'Quảng cáo Facebook (Ads)';
  if (query.msclkid) return 'Quảng cáo Bing (Ads)';
  if (query.utm_source) return `UTM: ${String(query.utm_source).slice(0, 60)}`;

  const referer = req.get('referer') || req.get('referrer') || '';
  if (!referer) return 'Trực tiếp / Không xác định';

  let host;
  try {
    host = new URL(referer).hostname.toLowerCase().replace(/^www\./, '');
  } catch (err) {
    return 'Trực tiếp / Không xác định';
  }

  const appHost = (process.env.APP_URL || '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

  if (appHost && host === appHost) return 'Nội bộ (điều hướng trong web)';
  if (host.includes('google.')) return 'Google (tìm kiếm tự nhiên)';
  if (host.includes('bing.com')) return 'Bing';
  if (host.includes('yahoo.')) return 'Yahoo';
  if (host.includes('facebook.com') || host.includes('fb.com')) return 'Facebook';
  if (host.includes('t.me') || host.includes('telegram')) return 'Telegram';
  if (host.includes('zalo.me') || host.includes('zaloapp.com')) return 'Zalo';
  if (host.includes('tiktok.com')) return 'TikTok';
  if (host.includes('youtube.com')) return 'YouTube';

  return `Khác (${host})`;
}

module.exports = { detectTrafficSource };
