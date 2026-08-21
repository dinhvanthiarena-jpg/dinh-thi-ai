const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const Review = require('../models/Review');

exports.index = async (req, res) => {
  const [featuredCourses, latestPosts, topReviews] = await Promise.all([
    Course.find({ isPublished: true, isFeatured: true }).limit(6).lean(),
    BlogPost.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    Review.find({ rating: { $gte: 4 } })
      .populate('user', 'name avatarUrl')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
  ]);

  res.render('home', {
    title: 'Dinh Thi Ai - Dao tao cong nghe AI ung dung',
    featuredCourses,
    latestPosts,
    topReviews,
  });
};

exports.about = (req, res) => {
  res.render('about', { title: 'Ve Dinh Thi Ai' });
};
