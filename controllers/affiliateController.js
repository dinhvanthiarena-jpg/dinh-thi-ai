const AffiliateClick = require('../models/AffiliateClick');

// Only ever redirect to Shopee's own domains — this endpoint takes a raw
// URL in the query string, so without this allowlist it would be an open
// redirect anyone could abuse to disguise a phishing link as our own site.
const ALLOWED_HOSTS = ['shopee.vn', 's.shopee.vn'];

exports.goShopee = async (req, res) => {
  const rawUrl = req.query.url || '';
  let target;
  try {
    target = new URL(rawUrl);
  } catch (err) {
    return res.redirect('/uu-dai');
  }

  const isAllowed = ALLOWED_HOSTS.some(
    (host) => target.hostname === host || target.hostname.endsWith(`.${host}`)
  );
  if (!isAllowed) {
    return res.redirect('/uu-dai');
  }

  await AffiliateClick.create({
    productName: (req.query.name || '').slice(0, 255) || target.href,
    productUrl: target.href,
    sourcePath: req.get('referer') || null,
  });

  res.redirect(target.href);
};
