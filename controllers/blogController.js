const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const PageView = require('../models/PageView');
const { detectTrafficSource } = require('../utils/trafficSource');
const { BLOG_CATEGORIES, getCategory } = require('../utils/blogCategories');

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const perPage = 9;
  const categorySlug = req.query.category || '';
  const activeCategory = categorySlug ? getCategory(categorySlug) : null;

  const where = { isPublished: true };
  if (activeCategory) where.category = activeCategory.slug;

  const { rows: posts, count: total } = await BlogPost.findAndCountAll({
    where,
    order: [['publishedAt', 'DESC']],
    offset: (page - 1) * perPage,
    limit: perPage,
  });

  res.render('blog/index', {
    title: activeCategory
      ? `${activeCategory.label} — Vietpro`
      : 'Tin tức tổng hợp - Vietpro',
    description: activeCategory
      ? `Tin tức tổng hợp chuyên mục ${activeCategory.label} — cập nhật thường xuyên bởi Vietpro.`
      : 'Tin tức tổng hợp mới nhất về AI, công nghệ, xu hướng và nhiều chủ đề khác — cập nhật thường xuyên bởi Vietpro.',
    posts,
    page,
    totalPages: Math.ceil(total / perPage),
    categories: BLOG_CATEGORIES,
    activeCategory,
  });
};

// "Bám đuổi tự nhiên" (organic retargeting) — không dùng cookie/quảng cáo
// trả phí: trình duyệt khách tự lưu lịch sử chuyên mục đã đọc vào
// localStorage (xem public/js/blog-personalize.js), rồi gọi API này để lấy
// bài mới nhất CÙNG chuyên mục họ hay đọc. Server không lưu/nhận diện danh
// tính gì — chỉ nhận lại đúng những category slug mà chính trình duyệt đó
// đã tự ghi nhớ, khớp với BLOG_CATEGORIES để chặn giá trị rác/injection.
exports.recommended = async (req, res) => {
  const requested = String(req.query.categories || '')
    .split(',')
    .map((s) => s.trim())
    .filter((slug) => BLOG_CATEGORIES.some((c) => c.slug === slug));

  if (!requested.length) return res.json({ posts: [] });

  const excludeId = Number(req.query.exclude) || 0;
  const posts = await BlogPost.findAll({
    where: {
      category: { [Op.in]: requested },
      isPublished: true,
      ...(excludeId ? { id: { [Op.ne]: excludeId } } : {}),
    },
    order: [['publishedAt', 'DESC']],
    limit: 6,
    attributes: ['title', 'slug', 'coverImageUrl', 'category'],
  });

  res.json({ posts });
};

exports.show = async (req, res, next) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, isPublished: true },
    include: [{ model: User, as: 'author', attributes: ['name', 'avatarUrl'] }],
  });

  if (!post) return next();

  // silent: true — tăng lượt xem KHÔNG được tính là "cập nhật nội dung".
  // Nếu để updatedAt nhảy theo mỗi lượt xem, JSON-LD dateModified bên dưới
  // sẽ báo sai là bài "vừa mới sửa" liên tục dù nội dung không đổi gì —
  // đúng kiểu hành vi Google Search Central cảnh báo là spam tín hiệu mới
  // (có thể bị phạt thay vì được ưu tiên).
  await post.increment('viewCount', { by: 1, silent: true });
  await PageView.create({
    path: `/blog/${post.slug}`,
    postSlug: post.slug,
    source: detectTrafficSource(req),
  });

  const candidates = await BlogPost.findAll({
    where: { id: { [Op.ne]: post.id }, isPublished: true },
    order: [['publishedAt', 'DESC']],
    limit: 20,
  });

  const postTags = post.tags || [];
  const relatedPosts = candidates
    .filter((p) => (p.tags || []).some((t) => postTags.includes(t)))
    .slice(0, 3);

  // Bấm vào ảnh bìa đi thẳng ra 1 link Shopee — 2 nguồn có thể có:
  // (1) marker "hero-shopee" model tự gắn cho MỌI bài (models/BlogPost.js
  //     hook beforeCreate, dùng data/heroShopeeLinks.js) — áp dụng chung.
  // (2) marker "shopee-picks-ai-16-9" cũ, riêng cho đợt 7 bài AI & Công
  //     nghệ ngày 16/9 (scripts/insert-shopee-picks-ai-posts.js) — giữ lại
  //     để không đổi hành vi của các bài đó.
  let heroShopeeLink = null;
  const heroMatch = post.content && post.content.match(/<!-- hero-shopee:(https:\/\/s\.shopee\.vn\/\S+) -->/);
  if (heroMatch) {
    heroShopeeLink = `/go/shopee?url=${encodeURIComponent(heroMatch[1])}&name=${encodeURIComponent(post.title)}`;
  } else if (post.content && post.content.includes('<!-- shopee-picks-ai-16-9 -->')) {
    const match = post.content.match(/href="(\/go\/shopee\?url=[^"]+)"/);
    if (match) heroShopeeLink = match[1];
  }

  res.render('blog/show', {
    title: post.title,
    description: post.excerpt,
    ogImage: post.coverImageUrl,
    ogType: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      // dateModified khác datePublished (kể cả khi chưa từng sửa nội dung,
      // updatedAt vẫn nhích lên mỗi lần viewCount tăng) — đây chính là tín
      // hiệu "mới cập nhật" Google dùng để ưu tiên hiển thị trên SERP so
      // với bài cũ hơn cùng chủ đề. Không giả mạo bằng cách set = now mỗi
      // lần render — dùng đúng giá trị DB.
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      image: [/^https?:\/\//.test(post.coverImageUrl) ? post.coverImageUrl : `${res.locals.appUrl}${post.coverImageUrl}`],
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${res.locals.appUrl}/blog/${post.slug}` },
      author: { '@type': 'Person', name: post.author ? post.author.name : 'Đinh Thi Ai' },
      publisher: {
        '@type': 'Organization',
        name: 'Vietpro',
        logo: { '@type': 'ImageObject', url: `${res.locals.appUrl}/images/logo.jpg` },
      },
    },
    post,
    relatedPosts,
    heroShopeeLink,
  });
};
