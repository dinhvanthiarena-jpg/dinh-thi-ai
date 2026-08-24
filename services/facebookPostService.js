const { Op } = require('sequelize');
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const SocialPost = require('../models/SocialPost');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001';
const GRAPH_API_VERSION = 'v21.0';
const PAGE_ID = process.env.FB_PAGE_ID || '484619608292305';

// Rotates through published courses first (they drive revenue) then blog
// posts, so the Page always has fresh, varied content to post about instead
// of the same item every day.
async function pickNextContent() {
  const postedCourseIds = (
    await SocialPost.findAll({ where: { sourceType: 'course' }, attributes: ['sourceId'] })
  ).map((p) => p.sourceId);

  const nextCourse = await Course.findOne({
    where: { isPublished: true, id: { [Op.notIn]: postedCourseIds.length ? postedCourseIds : [0] } },
    order: [['isFeatured', 'DESC'], ['createdAt', 'DESC']],
  });
  if (nextCourse) {
    return {
      sourceType: 'course',
      sourceId: nextCourse.id,
      title: nextCourse.title,
      description: nextCourse.subtitle || nextCourse.description,
      category: nextCourse.category,
      url: `${process.env.APP_URL}/courses/${nextCourse.slug}`,
    };
  }

  const postedBlogIds = (
    await SocialPost.findAll({ where: { sourceType: 'blog' }, attributes: ['sourceId'] })
  ).map((p) => p.sourceId);

  const nextBlog = await BlogPost.findOne({
    where: { isPublished: true, id: { [Op.notIn]: postedBlogIds.length ? postedBlogIds : [0] } },
    order: [['publishedAt', 'DESC']],
  });
  if (nextBlog) {
    return {
      sourceType: 'blog',
      sourceId: nextBlog.id,
      title: nextBlog.title,
      description: nextBlog.excerpt || nextBlog.content.slice(0, 300),
      category: (nextBlog.tags || []).join(', '),
      url: `${process.env.APP_URL}/blog/${nextBlog.slug}`,
    };
  }

  // Everything has been posted at least once — start the cycle over from the
  // oldest post so the Page keeps publishing daily instead of going silent.
  const oldest = await SocialPost.findOne({ order: [['postedAt', 'ASC']] });
  if (!oldest) return null;

  if (oldest.sourceType === 'course') {
    const course = await Course.findByPk(oldest.sourceId);
    if (!course) return null;
    return {
      sourceType: 'course',
      sourceId: course.id,
      title: course.title,
      description: course.subtitle || course.description,
      category: course.category,
      url: `${process.env.APP_URL}/courses/${course.slug}`,
    };
  }
  const blog = await BlogPost.findByPk(oldest.sourceId);
  if (!blog) return null;
  return {
    sourceType: 'blog',
    sourceId: blog.id,
    title: blog.title,
    description: blog.excerpt || blog.content.slice(0, 300),
    category: (blog.tags || []).join(', '),
    url: `${process.env.APP_URL}/blog/${blog.slug}`,
  };
}

async function generateCaption(content) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const fallback = `${content.title}\n\n${content.description}\n\nXem chi tiết: ${content.url}\n\n#DinhThiAi #DaoTaoAI #HocAI #PromptEngineering #AIchoDoanhNghiep`;
  if (!apiKey) return fallback;

  const systemPrompt = `Bạn là chuyên gia content marketing cho Fanpage Facebook "Đào Tạo Ứng dụng Ai x100" của Đinh Thi Ai — nền tảng đào tạo AI ứng dụng cho người đi làm và doanh nghiệp tại Việt Nam.

NHIỆM VỤ: Viết MỘT bài đăng Facebook hấp dẫn, chuẩn SEO, quảng bá nội dung được cung cấp bên dưới.

YÊU CẦU:
1. Mở đầu bằng một câu hook thật thu hút (câu hỏi, số liệu, hoặc insight gây tò mò) — không mở đầu nhàm chán kiểu "Hôm nay mình muốn giới thiệu...".
2. Nội dung ngắn gọn (120-200 từ), xuống dòng hợp lý, có thể dùng emoji phù hợp (vừa phải, không lạm dụng).
3. Nêu bật lợi ích cụ thể người đọc nhận được, tạo cảm giác cấp bách hoặc tò mò để họ bấm vào link.
4. Chèn đúng nguyên văn link được cung cấp ở cuối bài (không đổi link, không rút gọn).
5. Kết thúc bằng 6-10 hashtag tiếng Việt không dấu liền nhau, liên quan đến AI, khóa học, và chủ đề nội dung (ví dụ #DinhThiAi #DaoTaoAI #HocAI #PromptEngineering #AIchoDoanhNghiep #ChuyenDoiSo). Hashtag phải nằm ở cuối, sau 1 dòng trống.
6. Giọng văn nhiệt huyết, gần gũi, chuyên nghiệp, xưng "Đinh Thi Ai" hoặc "chúng tôi", KHÔNG bịa thông tin ngoài dữ liệu được cung cấp.
7. CHỈ trả về nội dung bài đăng, không thêm lời dẫn hay giải thích.`;

  const userMessage = `Tiêu đề: ${content.title}
Mô tả: ${content.description}
Chủ đề/danh mục: ${content.category || ''}
Link: ${content.url}`;

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      console.error('[facebookPostService] Anthropic API error', response.status, await response.text());
      return fallback;
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    return text || fallback;
  } catch (err) {
    console.error('[facebookPostService] Failed to generate caption', err);
    return fallback;
  }
}

async function publishToFacebook(message, link) {
  const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!pageToken) {
    console.error('[facebookPostService] Missing FB_PAGE_ACCESS_TOKEN, cannot post');
    return null;
  }

  const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${PAGE_ID}/feed`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message, link, access_token: pageToken }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('[facebookPostService] Graph API error', res.status, data);
    return null;
  }
  return data.id;
}

async function postDailyContent() {
  const content = await pickNextContent();
  if (!content) {
    console.log('[facebookPostService] No published courses or blog posts to promote yet.');
    return;
  }

  const message = await generateCaption(content);
  const fbPostId = await publishToFacebook(message, content.url);

  await SocialPost.create({
    sourceType: content.sourceType,
    sourceId: content.sourceId,
    sourceTitle: content.title,
    message,
    fbPostId,
  });

  console.log(`[facebookPostService] Posted "${content.title}" to Facebook Page${fbPostId ? ' (id ' + fbPostId + ')' : ' (FAILED, see log above)'}`);
}

module.exports = { postDailyContent, pickNextContent, generateCaption };
