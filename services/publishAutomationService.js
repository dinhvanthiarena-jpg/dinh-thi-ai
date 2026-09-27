const { Op } = require('sequelize');

const MAX_OLD_POSTS_TO_LINK = 3;
const MAX_AUTO_LINKS_PER_POST = 5; // chặn 1 bài cũ bị cộng dồn link vô hạn theo thời gian
const AUTO_LINK_MARKER_PREFIX = '<!-- auto-link-to:';

function daXayRaMarker(content, postId) {
  return content.includes(`${AUTO_LINK_MARKER_PREFIX}${postId} -->`);
}

function demSoAutoLink(content) {
  return (content.match(new RegExp(AUTO_LINK_MARKER_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

// Khi có 1 bài MỚI xuất bản, tìm các bài CŨ cùng chuyên mục đang có traffic
// cao nhất và chèn 1 internal link trỏ về bài mới vào cuối nội dung — mục
// đích: bài mới (chưa có backlink nội bộ nào, Google chưa biết mức độ quan
// trọng) mượn "uy tín" từ các bài cũ đang được nhiều người/nhiều nơi trỏ vào
// đọc, được crawl lại thường xuyên. Không đụng vào bài đã đạt trần
// MAX_AUTO_LINKS_PER_POST — tránh nội dung phình to vô hạn qua thời gian.
async function linkOldPostsToNew(newPost) {
  const BlogPost = require('../models/BlogPost');
  if (!newPost.isPublished) return;

  const candidates = await BlogPost.findAll({
    where: {
      id: { [Op.ne]: newPost.id },
      category: newPost.category,
      isPublished: true,
    },
    order: [['viewCount', 'DESC']],
    limit: 20,
  });

  let daChen = 0;
  for (const old of candidates) {
    if (daChen >= MAX_OLD_POSTS_TO_LINK) break;
    if (daXayRaMarker(old.content, newPost.id)) continue;
    if (demSoAutoLink(old.content) >= MAX_AUTO_LINKS_PER_POST) continue;

    const block = `\n<p>🆕 Đọc thêm: <a href="/blog/${newPost.slug}">${newPost.title}</a></p>${AUTO_LINK_MARKER_PREFIX}${newPost.id} -->`;
    await old.update({ content: old.content + block });
    daChen += 1;
  }
}

// IndexNow (indexnow.org) — giao thức mở được Bing/Yandex/Seznam hỗ trợ
// chính thức để báo "có URL mới/vừa đổi" ngay lập tức, khỏi chờ bot tự bò
// tới. Google KHÔNG nằm trong nhóm hỗ trợ IndexNow — Google Indexing API
// chính thức chỉ áp dụng cho trang JobPosting/BroadcastEvent theo policy
// của Google, dùng cho bài blog thường là sai mục đích và không đảm bảo có
// tác dụng, nên KHÔNG gọi ở đây. Với Google, tín hiệu đáng tin cậy nhất vẫn
// là sitemap.xml luôn cập nhật đúng lastmod + internal link mạnh (đúng mục
// đích của linkOldPostsToNew ở trên) + Search Console đã verify sẵn.
async function pingIndexNow(absoluteUrl) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  try {
    const endpoint = `https://api.indexnow.org/indexnow?url=${encodeURIComponent(absoluteUrl)}&key=${key}`;
    await fetch(endpoint);
  } catch (err) {
    console.error('[publishAutomation] pingIndexNow lỗi:', err.message);
  }
}

module.exports = { linkOldPostsToNew, pingIndexNow };
