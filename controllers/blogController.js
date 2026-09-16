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

exports.show = async (req, res, next) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, isPublished: true },
    include: [{ model: User, as: 'author', attributes: ['name', 'avatarUrl'] }],
  });

  if (!post) return next();

  await post.increment('viewCount', { by: 1 });
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
      datePublished: post.publishedAt,
      author: { '@type': 'Person', name: post.author ? post.author.name : 'Đinh Thi Ai' },
      publisher: { '@type': 'Organization', name: 'Vietpro' },
    },
    post,
    relatedPosts,
    heroShopeeLink,
  });
};
