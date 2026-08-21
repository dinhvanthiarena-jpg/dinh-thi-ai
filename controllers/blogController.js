const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const perPage = 9;

  const { rows: posts, count: total } = await BlogPost.findAndCountAll({
    where: { isPublished: true },
    order: [['publishedAt', 'DESC']],
    offset: (page - 1) * perPage,
    limit: perPage,
  });

  res.render('blog/index', {
    title: 'Kiến thức AI',
    posts,
    page,
    totalPages: Math.ceil(total / perPage),
  });
};

exports.show = async (req, res, next) => {
  const post = await BlogPost.findOne({
    where: { slug: req.params.slug, isPublished: true },
    include: [{ model: User, as: 'author', attributes: ['name', 'avatarUrl'] }],
  });

  if (!post) return next();

  await post.increment('viewCount', { by: 1 });

  const candidates = await BlogPost.findAll({
    where: { id: { [Op.ne]: post.id }, isPublished: true },
    order: [['publishedAt', 'DESC']],
    limit: 20,
  });

  const postTags = post.tags || [];
  const relatedPosts = candidates
    .filter((p) => (p.tags || []).some((t) => postTags.includes(t)))
    .slice(0, 3);

  res.render('blog/show', { title: post.title, post, relatedPosts });
};
