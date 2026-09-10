// "Nhà máy tin tức AI" — tự động tổng hợp tin tức đang được nhiều báo đưa
// theo từng chuyên mục thành bài viết gốc (không sao chép), kèm nguồn tham
// khảo, rồi tự đăng lên blog. Chạy định kỳ từ services/contentScheduler.js.
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');
const { parseRss } = require('../utils/rssParser');
const { BLOG_CATEGORIES } = require('../utils/blogCategories');

const AUTO_IMAGE_DIR = path.join(__dirname, '..', 'public', 'images', 'blog', 'auto');

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
// Mỗi chuyên mục có 3 mẫu khác nhau, chọn ngẫu nhiên — tránh tình trạng nhiều
// bài liền nhau trong cùng 1 chuyên mục hiện y hệt 1 icon.
const CATEGORY_COVER_VARIANTS = {
  'ai-cong-nghe': ['cat-ai-cong-nghe.svg', 'cat-ai-cong-nghe-b.svg', 'cat-ai-cong-nghe-c.svg'],
  'xu-huong': ['cat-xu-huong.svg', 'cat-xu-huong-b.svg', 'cat-xu-huong-c.svg'],
  'dao-tao-nghe-nghiep': ['cat-dao-tao-nghe-nghiep.svg', 'cat-dao-tao-nghe-nghiep-b.svg', 'cat-dao-tao-nghe-nghiep-c.svg'],
  'kinh-doanh': ['cat-kinh-doanh.svg', 'cat-kinh-doanh-b.svg', 'cat-kinh-doanh-c.svg'],
  'doi-song': ['cat-doi-song.svg', 'cat-doi-song-b.svg', 'cat-doi-song-c.svg'],
  'giai-tri': ['cat-giai-tri.svg', 'cat-giai-tri-b.svg', 'cat-giai-tri-c.svg'],
};

function pickCategoryCover(categorySlug, avoidFile) {
  const variants = CATEGORY_COVER_VARIANTS[categorySlug] || CATEGORY_COVER_VARIANTS['ai-cong-nghe'];
  // Loại bỏ mẫu vừa dùng ở bài gần nhất cùng chuyên mục (nếu có) trước khi rút
  // ngẫu nhiên — ngẫu nhiên thuần tuý vẫn có thể ra trùng liên tiếp nhiều lần.
  const pool = avoidFile ? variants.filter((f) => `/images/blog/${f}` !== avoidFile) : variants;
  const choices = pool.length ? pool : variants;
  const file = choices[Math.floor(Math.random() * choices.length)];
  return `/images/blog/${file}`;
}

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
  'giai-tri': 'red carpet event photography',
};

// Tải file ảnh về lưu trong public/images/blog/auto/ — hotlink trực tiếp từ
// Wikimedia từng gây lỗi vỡ ảnh (dịch vụ tạo thumbnail theo yêu cầu của
// Wikimedia có lúc phản hồi chậm ngay lần đầu trang tải, trình duyệt không tự
// thử lại). Sau khi dọn ~4.6GB dung lượng thừa (backup + WordPress cũ),
// hosting đủ chỗ để tải hẳn ảnh về — mỗi ảnh chỉ vài chục-vài trăm KB.
async function downloadImage(url, pageid) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ext = /\.png(\?|$)/i.test(url) ? 'png' : 'jpg';
    const filename = `${pageid}-${Date.now().toString(36)}.${ext}`;
    fs.mkdirSync(AUTO_IMAGE_DIR, { recursive: true });
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(AUTO_IMAGE_DIR, filename), buffer);
    return `/images/blog/auto/${filename}`;
  } catch (err) {
    console.error('[newsFactory] downloadImage failed', err.message);
    return null;
  }
}

// Loại các file rõ ràng là logo/huy hiệu/quốc kỳ/biểu trưng — search Wikimedia
// theo từ khoá chung hay vô tình trả về ảnh logo của 1 đài/báo/tổ chức nào đó
// (không liên quan nội dung, nhìn không chuyên nghiệp khi làm ảnh bìa blog).
const LOGO_TITLE_PATTERN = /\b(logo|wordmark|emblem|seal of|coat of arms|flag of|icon)\b/i;

// Loại ảnh chân dung định danh của 1 người nổi tiếng/chính khách cụ thể —
// kho ảnh chính khách trên Wikimedia rất lớn (họp báo chính thức, CC-licensed)
// nên search theo từ khoá chung (VD "emotional guidance", "leadership") rất dễ
// vô tình trúng ảnh 1 nguyên thủ quốc gia, gắn nhầm mặt người thật cụ thể vào
// bài viết không liên quan gì tới họ — phản cảm và rủi ro hơn hẳn 1 ảnh chỉ
// đơn thuần "không khớp chủ đề". Chỉ chấp nhận ảnh 1 người thật khi bài viết
// thực sự nói về nhân vật/sự kiện có người đó (lúc này usedPageIds + specific
// query đã đủ chặt), còn lại thà rơi về SVG dự phòng còn an toàn hơn.
const PERSON_PORTRAIT_PATTERN =
  /\b(president|politician|prime minister|minister of|foreign minister|chancellor|monarch|king of|queen of|senator|governor|diplomat|portraits? of|headshot|head of state)\b/i;

function isPersonPortrait(title, meta) {
  // Categories là tín hiệu đáng tin nhất — Commons gắn "Portraits of <Tên>"
  // chuẩn hoá cho ảnh chân dung định danh, kể cả khi tên file/mô tả không hề
  // nhắc tới chức danh gì (VD file chỉ tên "Knowledge Day greetings.jpg"
  // nhưng Categories vẫn có "Portraits of Vladimir Putin").
  const text = [
    title,
    meta && meta.ObjectName && meta.ObjectName.value,
    meta && meta.ImageDescription && meta.ImageDescription.value,
    meta && meta.Categories && meta.Categories.value,
  ]
    .filter(Boolean)
    .join(' ');
  return PERSON_PORTRAIT_PATTERN.test(text);
}

async function searchWikimedia(query, usedPageIds) {
  const apiUrl =
    'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6' +
    `&gsrsearch=${encodeURIComponent(`${query} filetype:bitmap`)}&gsrlimit=50` +
    '&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=900&format=json&origin=*';

  const res = await fetch(apiUrl, { headers: { 'user-agent': 'DinhThiAi-NewsFactory/1.0' } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values((data.query && data.query.pages) || {});
  // Chỉ nhận ảnh mà FILE GỐC là ảnh chụp thật (.jpg/.png) — không nhận ảnh
  // "bitmap" được Wikimedia tự chuyển từ PDF/SVG/tài liệu khác, vì loại đó
  // thường không liên quan tới chủ đề (bìa sách, sơ đồ...) và thumbnail
  // sinh theo yêu cầu nên hay tải lỗi/rớt ảnh trên trang. Cũng loại bỏ
  // logo/huy hiệu qua tên file, và ảnh chân dung chính khách/người nổi tiếng.
  return pages
    .filter((p) => !usedPageIds || !usedPageIds.has(String(p.pageid)))
    .filter((p) => !LOGO_TITLE_PATTERN.test(p.title || ''))
    .map((p) => ({ pageid: p.pageid, title: p.title, info: (p.imageinfo && p.imageinfo[0]) || null }))
    .filter(
      (c) =>
        c.info &&
        c.info.thumburl &&
        c.info.url &&
        /\.(jpe?g|png)(\?|$)/i.test(c.info.thumburl) &&
        /\.(jpe?g|png)(\?|$)/i.test(c.info.url)
    )
    .filter((c) => !isPersonPortrait(c.title, c.info.extmetadata));
}

// Xác thực bằng Claude (đọc được ảnh) rằng ảnh vừa tải THỰC SỰ minh hoạ đúng
// nội dung bài — các bộ lọc theo tên file/category ở trên (loại logo, loại
// chân dung định danh) chỉ bắt được từng loại lỗi cụ thể đã biết. Đây là lớp
// kiểm tra tổng quát hơn: search Wikimedia theo từ khoá chung đôi khi trả về
// ảnh hoàn toàn lạc đề mà không cách nào liệt kê hết bằng regex (phát hiện
// thực tế: 1 sơ đồ kỹ thuật "Embodied AI" và 1 ảnh chiếc xe hơi đều bị gắn
// nhầm vào bài viết về điện thoại). Trả về true khi không chắc chắn (thiếu
// API key, lỗi mạng) để không làm gãy cả pipeline vì 1 lần gọi lỗi.
async function isImageRelevant(localPath, postTitle) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || !postTitle) return true;

  try {
    const absPath = path.join(__dirname, '..', 'public', localPath.replace(/^\//, ''));
    const buffer = fs.readFileSync(absPath);
    const mediaType = /\.png$/i.test(localPath) ? 'image/png' : 'image/jpeg';

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 10,
        system:
          'Bạn xét duyệt ảnh bìa cho 1 bài blog tin tức. Đây là ảnh MINH HOẠ chung, KHÔNG phải ảnh báo chí phải khớp đúng sự kiện cụ thể — tiêu chuẩn chấp nhận PHẢI RỘNG, giống cách các trang tin dùng ảnh stock chung chung (văn phòng, biểu đồ, thành phố, bàn làm việc, con người đang làm việc...) cho hầu hết mọi bài. Trả lời DUY NHẤT 1 từ: "CO" nếu ảnh thuộc cùng LĨNH VỰC/NGỮ CẢNH LỚN với tiêu đề (VD: bất kỳ ảnh văn phòng/biểu đồ/tài chính/thành phố nào đều hợp lệ cho bài kinh doanh dù không khớp đúng công ty hay sự kiện cụ thể trong tiêu đề; ảnh laptop/mạch điện tử/máy tính đều hợp lệ cho bài công nghệ nói chung), chỉ trả lời "KHONG" khi: (1) ảnh thuộc HẲN MỘT LĨNH VỰC KHÁC không liên quan gì (VD: sơ đồ khoa học nhận thức/sinh học cho bài về điện thoại, ảnh động vật cho bài tài chính, ảnh chiếc xe hơi cho bài về smartphone); (2) ảnh cận mặt 1 người có tên cụ thể không hề được nhắc tới trong tiêu đề; hoặc (3) ảnh có LOGO/TÊN THƯƠNG HIỆU, TÊN ĐÀI TRUYỀN HÌNH/KÊNH TRUYỀN THÔNG hiện rõ, dễ đọc trong khung hình mà thương hiệu/đài đó không được nhắc tới trong tiêu đề (dễ gây hiểu lầm là quảng cáo/liên kết với thương hiệu đó). Khi phân vân, LUÔN trả lời "CO". Không giải thích gì thêm.',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: buffer.toString('base64') } },
              { type: 'text', text: `Tiêu đề bài viết: "${postTitle}"` },
            ],
          },
        ],
      }),
    });
    if (!response.ok) return true;
    const data = await response.json();
    const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim().toUpperCase();
    return text.startsWith('CO');
  } catch (err) {
    console.error('[newsFactory] isImageRelevant failed', err.message);
    return true;
  }
}

// Tìm 1 ảnh thật, có giấy phép tự do, minh hoạ đúng nội dung bài trên
// Wikimedia Commons — không cần API key. Ưu tiên thử specificQuery (mô tả
// cảnh cụ thể do Claude sinh ra theo đúng bài viết) trước, chỉ rơi về từ khoá
// chung theo chuyên mục nếu không tìm/tải được ảnh nào phù hợp — đây là cách
// hợp pháp để có ảnh minh hoạ sát bài viết mà KHÔNG copy ảnh có bản quyền
// trực tiếp từ báo nguồn (ghi nguồn không đồng nghĩa có giấy phép sử dụng
// ảnh báo chí). usedPageIds (Set các pageid Commons đã dùng cho bài khác) để
// loại trừ, tránh trùng ảnh giữa các bài. postTitle (nếu có) được dùng để
// Claude xác thực độ liên quan trước khi chấp nhận ảnh. Trả về null nếu
// không tìm/tải được ảnh nào (khi đó dùng ảnh SVG dự phòng).
async function fetchStockImage(categorySlug, usedPageIds, specificQuery, postTitle) {
  const fallbackQuery = CATEGORY_IMAGE_QUERY[categorySlug] || 'technology';
  const queries = [specificQuery, fallbackQuery].filter(Boolean);

  try {
    for (const query of queries) {
      const candidates = await searchWikimedia(query, usedPageIds);
      if (!candidates.length) continue;

      // Thử tối đa 5 ứng viên ngẫu nhiên, tải hẳn từng ảnh về cho tới khi có
      // 1 ảnh tải thành công (không chỉ kiểm tra HEAD — phải tải được thật)
      // VÀ được Claude xác nhận thực sự liên quan tới bài viết.
      const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, 5);
      for (const c of shuffled) {
        const saved = await downloadImage(c.info.thumburl, c.pageid);
        if (!saved) continue;

        const relevant = await isImageRelevant(saved, postTitle);
        if (!relevant) {
          fs.unlink(path.join(__dirname, '..', 'public', saved.replace(/^\//, '')), () => {});
          continue;
        }

        const meta = c.info.extmetadata || {};
        const artist = ((meta.Artist && meta.Artist.value) || 'Không rõ tác giả').replace(/<[^>]+>/g, '').trim();
        const license = (meta.LicenseShortName && meta.LicenseShortName.value) || 'Wikimedia Commons';
        return {
          url: saved,
          credit: `Ảnh: ${artist} — Wikimedia Commons (${license})`,
          sourceId: String(c.pageid),
        };
      }
    }
    return null;
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
      const heading = block.match(/^#{1,3}\s+(.+)$/);
      if (heading) return `<h2>${inlineMarkdown(heading[1])}</h2>`;
      return `<p>${inlineMarkdown(block).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

async function generateArticle(categorySlug, keyword, item) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const categoryLabel = (BLOG_CATEGORIES.find((c) => c.slug === categorySlug) || {}).label || categorySlug;

  const systemPrompt = `Bạn là biên tập viên chuyên mục "${categoryLabel}" của website Vietpro (nền tảng đào tạo ứng dụng AI cho người đi làm và doanh nghiệp tại Việt Nam).

NHIỆM VỤ: Viết MỘT bài viết CHUYÊN SÂU bằng tiếng Việt về chủ đề được cung cấp bên dưới. Đây chỉ là ĐIỂM KHỞI ĐẦU — bạn PHẢI viết lại hoàn toàn bằng lời văn, cấu trúc và góc nhìn riêng của mình. TUYỆT ĐỐI KHÔNG sao chép nguyên văn bất kỳ câu nào từ tin gốc, không dịch/diễn đạt lại từng câu một theo đúng thứ tự của bài gốc.

TỪ KHOÁ SEO CẦN NHẮM TỚI: "${keyword}" — đưa từ khoá này (hoặc biến thể tự nhiên) vào tiêu đề, đoạn mở đầu và ít nhất 2 heading phụ.

YÊU CẦU:
1. Bài dài 800-1200 từ tiếng Việt, chia nhiều đoạn/heading phụ dạng "## Tiêu đề phụ" rõ ràng — đi sâu phân tích, giải thích bối cảnh, ý nghĩa và ứng dụng thực tế của chủ đề, KHÔNG chỉ tóm tắt lại tin gốc trong vài dòng.
2. Có thể mở rộng thêm góc nhìn, giải thích khái niệm liên quan, gợi ý ứng dụng thực tế cho người đọc — miễn là dựa trên kiến thức chung hợp lý, KHÔNG bịa thêm số liệu, trích dẫn hay sự kiện cụ thể ngoài thông tin gốc được cung cấp.
3. VIẾT HOÀN TOÀN BẰNG TIẾNG VIỆT THUẦN — TUYỆT ĐỐI không chen từ/cụm từ tiếng Anh vào giữa câu tiếng Việt (VD: không viết "obligations", "proactive", "mindset", "aspects", "accumulate"...). Chỉ giữ nguyên các từ viết tắt kỹ thuật đã quá quen thuộc với người Việt như AI, SEO nếu thật sự cần. Đây là lỗi NGHIÊM TRỌNG cần tránh tuyệt đối.
4. Giọng văn chuyên nghiệp, mạch lạc, phù hợp độc giả Việt Nam quan tâm đến chuyên mục "${categoryLabel}".
5. KHÔNG lặp lại tiêu đề bài viết thành một heading ở đầu content (trang web đã tự hiển thị tiêu đề riêng) — bắt đầu content ngay bằng đoạn mở bài. Không dùng gạch đầu dòng "-" hay danh sách số thứ tự để liệt kê — viết thành đoạn văn liền mạch.
6. Cuối bài PHẢI có đoạn bắt đầu bằng "**Nguồn tham khảo:**" rồi 1 dòng duy nhất theo định dạng markdown: [Tên bài gốc](link).
7. CHỈ trả về JSON hợp lệ (không kèm giải thích, không bọc trong dấu backtick), đúng cấu trúc:
{"title": "tiêu đề bài viết mới (không trùng tiêu đề gốc, có chứa từ khoá SEO)", "excerpt": "mô tả ngắn 140-160 ký tự dùng làm meta description, có chứa từ khoá SEO", "content": "toàn bộ nội dung bài viết, dùng \\n\\n giữa các đoạn", "tags": ["3 đến 5 từ khoá liên quan"], "imageQuery": "cụm từ tiếng Anh (3-6 từ) mô tả 1 CẢNH THẬT cụ thể, có thể chụp được bằng ảnh, minh hoạ đúng nội dung bài (VD: 'elderly couple calculating retirement savings', không viết khái niệm trừu tượng như 'financial freedom trend'; KHÔNG dùng tên thương hiệu/tên báo/tên đài vì dễ ra ảnh logo thay vì ảnh nội dung. QUAN TRỌNG: trừ khi bài viết thực sự nói về 1 nhân vật cụ thể (chính khách, người nổi tiếng) được nêu tên trong tiêu đề, TUYỆT ĐỐI không mô tả kiểu 'chân dung/khuôn mặt 1 người' (không dùng từ như portrait, headshot, politician, president, leader...) — kho ảnh chính khách trên Wikimedia rất lớn nên mô tả mơ hồ kiểu 'person feeling emotional' rất dễ vô tình trúng ảnh mặt 1 nguyên thủ quốc gia không liên quan gì, cực kỳ phản cảm. Ưu tiên mô tả CẢNH/HOẠT ĐỘNG/ĐỒ VẬT (VD: 'hands holding smartphone office desk', 'busy city street traffic evening'). RIÊNG CHUYÊN MỤC GIẢI TRÍ về 1 người nổi tiếng/showbiz cụ thể: KHÔNG cố mô tả đúng người đó hay tên chương trình/kênh — Wikimedia hầu như không có ảnh tự do của họ, sẽ luôn ra sai. Thay vào đó mô tả 1 KHUNG CẢNH GIẢI TRÍ CHUNG phù hợp không khí bài (VD: 'red carpet event photography', 'fashion runway show lights', 'film festival crowd evening', 'concert stage lighting')"}`;

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
  const usedImages = await BlogPost.findAll({
    where: { coverImageSourceId: { [Op.ne]: null } },
    attributes: ['coverImageSourceId'],
  });
  const usedPageIds = new Set(usedImages.map((p) => p.coverImageSourceId));

  const [article, lastCategoryPost] = await Promise.all([
    generateArticle(topic.category, keyword, topic.item),
    BlogPost.findOne({ where: { category: topic.category }, order: [['createdAt', 'DESC']] }),
  ]);
  if (!article) {
    console.log('[newsFactory] Claude không trả về bài viết hợp lệ, bỏ qua lần này.');
    return null;
  }
  // Tìm ảnh SAU khi có bài viết vì cần imageQuery do Claude sinh ra theo
  // đúng nội dung bài — ảnh sát chủ đề hơn nhiều so với chỉ tra theo chuyên mục chung.
  const stockImage = await fetchStockImage(topic.category, usedPageIds, article.imageQuery, article.title);

  // Ghi rõ nguồn ảnh ngay dưới nội dung — bắt buộc với ảnh giấy phép CC
  // BY/CC BY-SA của Wikimedia Commons.
  const contentHtml = markdownToHtml(article.content) + (stockImage ? `\n<p class="text-xs text-muted italic">${stockImage.credit}</p>` : '');

  const post = await BlogPost.create({
    title: article.title,
    excerpt: article.excerpt || '',
    content: contentHtml,
    category: topic.category,
    tags: Array.isArray(article.tags) ? article.tags : [],
    coverImageUrl: (stockImage && stockImage.url) || pickCategoryCover(topic.category, lastCategoryPost && lastCategoryPost.coverImageUrl),
    coverImageSourceId: (stockImage && stockImage.sourceId) || null,
    isPublished: true,
    isAutoGenerated: true,
    sourceUrl: topic.item.link,
    seoKeyword: keyword,
  });

  console.log(`[newsFactory] Đã đăng bài tự động "${post.title}" (chuyên mục ${topic.category}, từ khoá "${keyword}")`);
  return post;
}

// Sinh 1 cụm từ khoá tiếng Anh mô tả cảnh thật để tìm ảnh trên Wikimedia, dựa
// vào tiêu đề bài — dùng cho script backfill nâng cấp ảnh của các bài đã đăng
// trước khi có trường imageQuery (xem generateArticle ở trên).
async function suggestImageQuery(title) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 60,
        system:
          'Trả về DUY NHẤT 1 cụm từ tiếng Anh (3-6 từ) mô tả 1 cảnh thật, cụ thể, có thể chụp được bằng ảnh, minh hoạ đúng nội dung tiêu đề bài viết tiếng Việt được cung cấp — không phải khái niệm trừu tượng, không dùng tên thương hiệu/tên báo/tên đài/tên chương trình. Trừ khi tiêu đề thực sự nêu tên 1 chính khách, TUYỆT ĐỐI không mô tả kiểu "chân dung/khuôn mặt 1 người" (không dùng portrait, headshot, politician, president, leader...) vì rất dễ vô tình trúng ảnh 1 nguyên thủ quốc gia không liên quan — ưu tiên mô tả CẢNH/HOẠT ĐỘNG/ĐỒ VẬT. Nếu tiêu đề nói về 1 diễn viên/ca sĩ/người nổi tiếng showbiz cụ thể (không phải chính khách), Wikimedia hầu như không có ảnh tự do của họ nên ĐỪNG cố mô tả người đó — thay vào đó mô tả 1 khung cảnh giải trí chung phù hợp (VD: "red carpet event photography", "fashion runway show lights", "film festival crowd evening"). Không giải thích, không dấu ngoặc kép, chỉ trả về đúng cụm từ.',
        messages: [{ role: 'user', content: title }],
      }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join(' ')
      .trim();
    return text || null;
  } catch (err) {
    console.error('[newsFactory] suggestImageQuery failed', err.message);
    return null;
  }
}

module.exports = { createTrendingPost, pickTopic, generateArticle, fetchStockImage, suggestImageQuery, isImageRelevant };
