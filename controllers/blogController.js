const BlogPost = require('../models/BlogPost');

exports.list = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const perPage = 9;

  const [posts, total] = await Promise.all([
    BlogPost.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean(),
    BlogPost.countDocuments({ isPublished: true }),
  ]);

  res.render('blog/index', {
    title: 'Kien thuc AI',
    posts,
    page,
    totalPages: Math.ceil(total / perPage),
  });
};

exports.show = async (req, res, next) => {
  const post = await BlogPost.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate('author', 'name avatarUrl')
    .lean();

  if (!post) return next();

  const relatedPosts = await BlogPost.find({
    _id: { $ne: post._id },
    isPublished: true,
    tags: { $in: post.tags || [] },
  })
    .limit(3)
    .lean();

  res.render('blog/show', { title: post.title, post, relatedPosts });
};
