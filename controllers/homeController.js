const { Op } = require('sequelize');
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const Review = require('../models/Review');
const User = require('../models/User');

exports.index = async (req, res) => {
  const [featuredCourses, latestPosts, topReviews] = await Promise.all([
    Course.findAll({ where: { isPublished: true, isFeatured: true }, limit: 6 }),
    BlogPost.findAll({ where: { isPublished: true }, order: [['publishedAt', 'DESC']], limit: 3 }),
    Review.findAll({
      where: { rating: { [Op.gte]: 4 } },
      include: [
        { model: User, as: 'user', attributes: ['name', 'avatarUrl'] },
        { model: Course, as: 'course', attributes: ['title'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: 6,
    }),
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
