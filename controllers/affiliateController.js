const AffiliateClick = require('../models/AffiliateClick');

// Trang giới thiệu cộng đồng "Mua Hàng Hoàn Tiền" của Đinh Thi Ai — khách gửi
// link Shopee/Lazada/TikTok Shop qua Zalo, được đổi thành link tiếp thị liên
// kết, mua xong nhận lại % hoa hồng vào ví (chuyển khoản thủ công). Trang này
// chỉ giới thiệu + kêu gọi tham gia nhóm Zalo — không có xử lý đơn hàng gì ở
// đây, giữ tách biệt với /go/shopee (redirect click) và /uu-dai (gợi ý sản
// phẩm) đã có sẵn.
exports.landing = (req, res) => {
  res.render('kiem-tien-affiliate', {
    title: 'Kiếm Tiền Affiliate - Mua Hàng Hoàn Tiền Cùng Đinh Thi Ai',
    description:
      'Tham gia cộng đồng Mua Hàng Hoàn Tiền của Đinh Thi Ai — gửi link sản phẩm Shopee, Lazada, TikTok Shop bạn muốn mua, nhận lại hoa hồng ngay khi đơn hàng hoàn tất.',
  });
};

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
