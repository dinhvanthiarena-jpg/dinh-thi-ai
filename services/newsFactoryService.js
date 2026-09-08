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

// Ảnh bìa dạng SVG nhẹ (vài trăm byte, không phải ảnh chụp) — để web không
// bị nặng khi đăng nhiều bài tự động mỗi ngày, theo đúng yêu cầu của thầy.
const CATEGORY_COVER = {
  'ai-cong-nghe': '/images/blog/cat-ai-cong-nghe.svg',
  'xu-huong': '/images/blog/cat-xu-huong.svg',
  'dao-tao-nghe-nghiep': '/images/blog/cat-dao-tao-nghe-nghiep.svg',
  'kinh-doanh': '/images/blog/cat-kinh-doanh.svg',
  'doi-song': '/images/blog/cat-doi-song.svg',
  'giai-tri': '/images/blog/cat-giai-tri.svg',
};

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
// bài trước để không viết trùng lại đúng 1 tin), lấy tối đa 5 tin mới nhất
// của chuyên mục đó làm nguồn tổng hợp cho 1 bài "điểm tin".
async function pickTopic() {
  const slugs = weightedShuffledSlugs();

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

    return { category: slug, items: fresh.slice(0, 5) };
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

async function generateArticle(categorySlug, keyword, items) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const categoryLabel = (BLOG_CATEGORIES.find((c) => c.slug === categorySlug) || {}).label || categorySlug;
  const sourcesText = items
    .map((item, idx) => `${idx + 1}. "${item.title}" — ${item.description}\nLink: ${item.link}`)
    .join('\n\n');

  const systemPrompt = `Bạn là biên tập viên chuyên mục "${categoryLabel}" của website Đinh Thi Ai (nền tảng đào tạo ứng dụng AI cho người đi làm và doanh nghiệp tại Việt Nam).

NHIỆM VỤ: Viết MỘT bài "điểm tin tổng hợp" bằng tiếng Việt, tổng hợp và diễn giải lại các tin dưới đây thành bài viết mạch lạc, có góc nhìn riêng. TUYỆT ĐỐI KHÔNG sao chép nguyên văn bất kỳ câu nào từ tin gốc — phải viết lại hoàn toàn bằng lời văn của bạn.

TỪ KHOÁ SEO CẦN NHẮM TỚI: "${keyword}" — đưa từ khoá này (hoặc biến thể tự nhiên) vào tiêu đề, đoạn mở đầu và ít nhất 1 heading phụ.

YÊU CẦU:
1. Bài dài 500-800 từ tiếng Việt, chia đoạn rõ ràng, có thể dùng heading phụ dạng "## Tiêu đề phụ" khi hợp lý.
2. Mở đầu nêu bối cảnh chung liên quan đến từ khoá SEO, sau đó lần lượt đề cập từng tin được cung cấp (diễn giải lại, không copy), có thể thêm nhận định hoặc liên hệ ngắn gọn tới việc ứng dụng AI/kỹ năng số nếu hợp lý và tự nhiên (không gượng ép).
3. KHÔNG bịa thêm số liệu, sự kiện, trích dẫn không có trong tin gốc được cung cấp.
4. Cuối bài PHẢI có đoạn bắt đầu bằng "**Nguồn tham khảo:**" rồi liệt kê từng nguồn đã dùng theo định dạng markdown: [Tên bài gốc](link).
5. CHỈ trả về JSON hợp lệ (không kèm giải thích, không bọc trong dấu backtick), đúng cấu trúc:
{"title": "tiêu đề bài viết mới (không trùng tiêu đề gốc, có chứa từ khoá SEO)", "excerpt": "mô tả ngắn 140-160 ký tự dùng làm meta description, có chứa từ khoá SEO", "content": "toàn bộ nội dung bài viết, dùng \\n\\n giữa các đoạn", "tags": ["3 đến 5 từ khoá liên quan"]}`;

  const userMessage = `Các tin tức để tổng hợp:\n\n${sourcesText}`;

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

async function createTrendingPost() {
  const topic = await pickTopic();
  if (!topic) {
    console.log('[newsFactory] Không tìm được tin mới để tổng hợp (đã dùng hết hoặc feed lỗi).');
    return null;
  }

  const keyword = pickKeyword(topic.category);
  const article = await generateArticle(topic.category, keyword, topic.items);
  if (!article) {
    console.log('[newsFactory] Claude không trả về bài viết hợp lệ, bỏ qua lần này.');
    return null;
  }

  const post = await BlogPost.create({
    title: article.title,
    excerpt: article.excerpt || '',
    content: markdownToHtml(article.content),
    category: topic.category,
    tags: Array.isArray(article.tags) ? article.tags : [],
    coverImageUrl: CATEGORY_COVER[topic.category],
    isPublished: true,
    isAutoGenerated: true,
    sourceUrl: topic.items[0].link,
    seoKeyword: keyword,
  });

  console.log(`[newsFactory] Đã đăng bài tự động "${post.title}" (chuyên mục ${topic.category}, từ khoá "${keyword}")`);
  return post;
}

module.exports = { createTrendingPost, pickTopic, generateArticle };
