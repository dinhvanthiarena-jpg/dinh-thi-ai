// "Nhà máy tin tức AI" — tự động tổng hợp tin tức đang được nhiều báo đưa
// theo từng chuyên mục thành bài viết gốc (không sao chép), kèm nguồn tham
// khảo, rồi tự đăng lên blog. Chạy định kỳ từ services/contentScheduler.js.
const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');
const { parseRss } = require('../utils/rssParser');
const { BLOG_CATEGORIES } = require('../utils/blogCategories');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';

// Nguồn RSS công khai theo từng chuyên mục — cơ sở để tìm chủ đề, không phải
// để copy. Bài viết cuối cùng luôn được Claude viết lại hoàn toàn bằng lời
// văn riêng, tổng hợp nhiều tin, kèm mục "Nguồn tham khảo" — tránh kiểu
// "thin rewrite" vi phạm bản quyền mà thầy đã lưu ý.
const CATEGORY_FEEDS = {
  'ai-cong-nghe': ['https://vnexpress.net/rss/so-hoa.rss'],
  'xu-huong': ['https://vnexpress.net/rss/tin-moi-nhat.rss'],
  'dao-tao-nghe-nghiep': ['https://vnexpress.net/rss/giao-duc.rss'],
  'kinh-doanh': ['https://vnexpress.net/rss/kinh-doanh.rss'],
  'doi-song': ['https://vnexpress.net/rss/doi-song.rss'],
  'giai-tri': ['https://vnexpress.net/rss/giai-tri.rss'],
};

// Web vẫn chú trọng chủ đề AI & Công nghệ là chính — các chuyên mục khác vẫn
// duy trì (thầy muốn giữ những phần đang làm) nhưng với tỉ trọng thấp hơn.
// Số càng lớn thì chuyên mục đó càng được chọn nhiều lần hơn trong ngày.
const CATEGORY_WEIGHT = {
  'ai-cong-nghe': 4,
  'xu-huong': 3,
  'dao-tao-nghe-nghiep': 1,
  'kinh-doanh': 1,
  'doi-song': 1,
  'giai-tri': 1,
};

// Xáo trộn danh sách chuyên mục có tính đến trọng số ở trên (chuyên mục
// trọng số cao xuất hiện nhiều lần trong "túi" nên có xác suất được rút ra
// đầu tiên cao hơn), rồi rút gọn về danh sách không trùng lặp theo thứ tự đã
// xáo — dùng làm thứ tự ưu tiên thử khi tìm chuyên mục còn tin mới.
function weightedShuffledSlugs() {
  const pool = [];
  Object.keys(CATEGORY_FEEDS).forEach((slug) => {
    const weight = CATEGORY_WEIGHT[slug] || 1;
    for (let i = 0; i < weight; i++) pool.push(slug);
  });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [...new Set(pool)];
}

// Ảnh bìa dự phòng dạng SVG nhẹ — dùng khi không tìm được ảnh thật phù hợp.
const CATEGORY_COVER = {
  'ai-cong-nghe': '/images/blog/cat-ai-cong-nghe.svg',
  'xu-huong': '/images/blog/cat-xu-huong.svg',
  'dao-tao-nghe-nghiep': '/images/blog/cat-dao-tao-nghe-nghiep.svg',
  'kinh-doanh': '/images/blog/cat-kinh-doanh.svg',
  'doi-song': '/images/blog/cat-doi-song.svg',
  'giai-tri': '/images/blog/cat-giai-tri.svg',
};

// Từ khoá tiếng Anh để tìm ảnh thật liên quan trên Wikimedia Commons — kho
// ảnh được cấp phép tự do (CC BY/CC BY-SA/public domain), không phải ảnh của
// báo khác nên không dính bản quyền. Dùng link ảnh trực tiếp từ máy chủ
// Wikimedia (không tải về lưu trên server mình) nên không làm nặng web.
const CATEGORY_IMAGE_QUERY = {
  'ai-cong-nghe': 'artificial intelligence technology',
  'xu-huong': 'news media',
  'dao-tao-nghe-nghiep': 'education career training',
  'kinh-doanh': 'business digital technology',
  'doi-song': 'healthy lifestyle',
  'giai-tri': 'entertainment social media',
};

// Tìm 1 ảnh thật, có giấy phép tự do, liên quan tới chuyên mục trên
// Wikimedia Commons — không cần API key, không cần tải/lưu ảnh về server.
// Trả về null nếu không tìm được (khi đó dùng ảnh SVG dự phòng).
async function fetchStockImage(categorySlug) {
  const query = CATEGORY_IMAGE_QUERY[categorySlug] || 'technology';
  const apiUrl =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6' +
    `&gsrsearch=${encodeURIComponent(`${query} filetype:bitmap`)}&gsrlimit=15` +
    '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&format=json&origin=*';

  try {
    const res = await fetch(apiUrl, { headers: { 'user-agent': 'DinhThiAi-NewsFactory/1.0' } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values((data.query && data.query.pages) || {});
    const candidates = pages
      .map((p) => (p.imageinfo && p.imageinfo[0]) || null)
      .filter((info) => info && info.thumburl && /\.(jpe?g|png)(\?|$)/i.test(info.thumburl));
    if (!candidates.length) return null;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const meta = chosen.extmetadata || {};
    const artist = ((meta.Artist && meta.Artist.value) || 'Không rõ tác giả').replace(/<[^>]+>/g, '').trim();
    const license = (meta.LicenseShortName && meta.LicenseShortName.value) || 'Wikimedia Commons';
    return { url: chosen.thumburl, credit: `Ảnh: ${artist} — Wikimedia Commons (${license})` };
  } catch (err) {
    console.error('[newsFactory] fetchStockImage failed', err.message);
    return null;
  }
}

// Mỗi chuyên mục có vài cụm từ khoá SEO xoay vòng theo ngày trong năm — giúp
// mỗi bài tự động nhắm đúng 1 từ khoá cụ thể thay vì chung chung.
const CATEGORY_KEYWORDS = {
  'ai-cong-nghe': ['ứng dụng AI trong công việc', 'công cụ AI mới nhất', 'xu hướng AI 2026', 'AI thay đổi cách làm việc', 'tin công nghệ AI mới nhất'],
  'xu-huong': ['tin tức nổi bật hôm nay', 'sự kiện đang được quan tâm', 'tin hot trong ngày', 'điểm tin trong ngày'],
  'dao-tao-nghe-nghiep': ['đào tạo kỹ năng nghề nghiệp', 'xu hướng tuyển dụng', 'kỹ năng cần thiết cho người đi làm', 'đào tạo nhân sự doanh nghiệp'],
  'kinh-doanh': ['chuyển đổi số doanh nghiệp', 'xu hướng kinh doanh 2026', 'ứng dụng công nghệ trong kinh doanh', 'quản trị doanh nghiệp thời AI'],
  'doi-song': ['kỹ năng sống thời đại số', 'mẹo sống hiện đại', 'xu hướng đời sống', 'cân bằng công việc cuộc sống'],
  'giai-tri': ['tin giải trí nổi bật', 'xu hướng mạng xã hội', 'tin tức showbiz'],
};

function pickKeyword(categorySlug) {
  const list = CATEGORY_KEYWORDS[categorySlug] || [];
  if (!list.length) return '';
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return list[dayOfYear % list.length];
}

async function fetchFeedItems(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml);
  } catch (err) {
    console.error('[newsFactory] fetch feed failed', url, err.message);
    return [];
  }
}

// Chọn 1 chuyên mục còn tin chưa dùng (kiểm tra qua sourceUrl đã lưu ở các
// bài trước để không viết trùng lại đúng 1 tin), lấy tin MỚI NHẤT của chuyên
// mục đó làm chủ đề cho 1 bài viết chuyên sâu (1 bài = 1 chủ đề, không còn
// gộp nhiều tin thành 1 bài điểm tin). Truyền forcedSlug để ưu tiên thử đúng
// 1 chuyên mục trước (VD: lấp cột còn trống trên trang chủ), vẫn rơi về thứ
// tự xáo trộn theo trọng số nếu chuyên mục đó không còn tin mới.
async function pickTopic(forcedSlug) {
  const rest = weightedShuffledSlugs().filter((s) => s !== forcedSlug);
  const slugs = forcedSlug && CATEGORY_FEEDS[forcedSlug] ? [forcedSlug, ...rest] : rest;

  for (const slug of slugs) {
    const items = (await Promise.all(CATEGORY_FEEDS[slug].map(fetchFeedItems)))
      .flat()
      .filter((i) => i.title && i.link);
    if (!items.length) continue;

    const links = items.map((i) => i.link);
    const used = await BlogPost.findAll({ where: { sourceUrl: { [Op.in]: links } }, attributes: ['sourceUrl'] });
    const usedLinks = new Set(used.map((p) => p.sourceUrl));
    const fresh = items.filter((i) => !usedLinks.has(i.link));
    if (!fresh.length) continue;

    return { category: slug, item: fresh[0] };
  }
  return null;
}

function stripCodeFence(text) {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

// blog/show.ejs render thẳng post.content ra HTML (không qua trình duyệt
// markdown), nhưng Claude được yêu cầu viết ở dạng markdown đơn giản (##,
// **bold**, [link](url)) cho dễ đọc/viết — nên phải tự chuyển sang HTML ở
// đây trước khi lưu, nếu không tiêu đề phụ/link nguồn sẽ hiện ra thành chữ
// thô "## ..." / "[...](...)" ngay trên trang.
function inlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = block.match(/^#{2,3}\s+(.+)$/);
      if (heading) return `<h2>${inlineMarkdown(heading[1])}</h2>`;
      return `<p>${inlineMarkdown(block).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

async function generateArticle(categorySlug, keyword, item) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const categoryLabel = (BLOG_CATEGORIES.find((c) => c.slug === categorySlug) || {}).label || categorySlug;

  const systemPrompt = `Bạn là biên tập viên chuyên mục "${categoryLabel}" của website Đinh Thi Ai (nền tảng đào tạo ứng dụng AI cho người đi làm và doanh nghiệp tại Việt Nam).

NHIỆM VỤ: Viết MỘT bài viết CHUYÊN SÂU bằng tiếng Việt về chủ đề được cung cấp bên dưới. Đây chỉ là ĐIỂM KHỞI ĐẦU — bạn PHẢI viết lại hoàn toàn bằng lời văn, cấu trúc và góc nhìn riêng của mình. TUYỆT ĐỐI KHÔNG sao chép nguyên văn bất kỳ câu nào từ tin gốc, không dịch/diễn đạt lại từng câu một theo đúng thứ tự của bài gốc.

TỪ KHOÁ SEO CẦN NHẮM TỚI: "${keyword}" — đưa từ khoá này (hoặc biến thể tự nhiên) vào tiêu đề, đoạn mở đầu và ít nhất 2 heading phụ.

YÊU CẦU:
1. Bài dài 800-1200 từ tiếng Việt, chia nhiều đoạn/heading phụ dạng "## Tiêu đề phụ" rõ ràng — đi sâu phân tích, giải thích bối cảnh, ý nghĩa và ứng dụng thực tế của chủ đề, KHÔNG chỉ tóm tắt lại tin gốc trong vài dòng.
2. Có thể mở rộng thêm góc nhìn, giải thích khái niệm liên quan, gợi ý ứng dụng thực tế cho người đọc — miễn là dựa trên kiến thức chung hợp lý, KHÔNG bịa thêm số liệu, trích dẫn hay sự kiện cụ thể ngoài thông tin gốc được cung cấp.
3. Giọng văn chuyên nghiệp, mạch lạc, phù hợp độc giả Việt Nam quan tâm đến chuyên mục "${categoryLabel}".
4. Cuối bài PHẢI có đoạn bắt đầu bằng "**Nguồn tham khảo:**" rồi 1 dòng duy nhất theo định dạng markdown: [Tên bài gốc](link).
5. CHỈ trả về JSON hợp lệ (không kèm giải thích, không bọc trong dấu backtick), đúng cấu trúc:
{"title": "tiêu đề bài viết mới (không trùng tiêu đề gốc, có chứa từ khoá SEO)", "excerpt": "mô tả ngắn 140-160 ký tự dùng làm meta description, có chứa từ khoá SEO", "content": "toàn bộ nội dung bài viết, dùng \\n\\n giữa các đoạn", "tags": ["3 đến 5 từ khoá liên quan"]}`;

  const userMessage = `Chủ đề gốc: "${item.title}"\nTóm tắt: ${item.description}\nLink: ${item.link}`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      console.error('[newsFactory] Anthropic API error', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const rawText = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();
    const parsed = JSON.parse(stripCodeFence(rawText));
    if (!parsed.title || !parsed.content) return null;
    return parsed;
  } catch (err) {
    console.error('[newsFactory] generateArticle failed', err.message);
    return null;
  }
}

async function createTrendingPost(forcedSlug) {
  const topic = await pickTopic(forcedSlug);
  if (!topic) {
    console.log('[newsFactory] Không tìm được tin mới để tổng hợp (đã dùng hết hoặc feed lỗi).');
    return null;
  }

  const keyword = pickKeyword(topic.category);
  const [article, stockImage] = await Promise.all([
    generateArticle(topic.category, keyword, topic.item),
    fetchStockImage(topic.category),
  ]);
  if (!article) {
    console.log('[newsFactory] Claude không trả về bài viết hợp lệ, bỏ qua lần này.');
    return null;
  }

  // Ghi rõ nguồn ảnh ngay dưới nội dung — bắt buộc với ảnh giấy phép CC
  // BY/CC BY-SA của Wikimedia Commons.
  const contentHtml = markdownToHtml(article.content) + (stockImage ? `\n<p class="text-xs text-muted italic">${stockImage.credit}</p>` : '');

  const post = await BlogPost.create({
    title: article.title,
    excerpt: article.excerpt || '',
    content: contentHtml,
    category: topic.category,
    tags: Array.isArray(article.tags) ? article.tags : [],
    coverImageUrl: (stockImage && stockImage.url) || CATEGORY_COVER[topic.category],
    isPublished: true,
    isAutoGenerated: true,
    sourceUrl: topic.item.link,
    seoKeyword: keyword,
  });

  console.log(`[newsFactory] Đã đăng bài tự động "${post.title}" (chuyên mục ${topic.category}, từ khoá "${keyword}")`);
  return post;
}

module.exports = { createTrendingPost, pickTopic, generateArticle };
