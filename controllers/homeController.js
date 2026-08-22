const { Op } = require('sequelize');
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const Review = require('../models/Review');
const User = require('../models/User');
const GalleryPhoto = require('../models/GalleryPhoto');

exports.index = async (req, res) => {
  const [featuredCourses, latestPosts, topReviews, latestPhotos] = await Promise.all([
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
    GalleryPhoto.findAll({ where: { isPublished: true }, order: [['eventDate', 'DESC']], limit: 6 }),
  ]);

  res.render('home', {
    title: 'Đinh Thi Ai - Đào tạo công nghệ AI ứng dụng',
    description:
      'Khóa học AI ứng dụng thực chiến cho người đi làm: Prompt Engineering, Generative AI, triển khai AI cho doanh nghiệp — cùng chuyên gia Đinh Thi Ai.',
    featuredCourses,
    latestPosts,
    topReviews,
    latestPhotos,
  });
};

exports.about = (req, res) => {
  res.render('about', {
    title: 'Về Đinh Thi Ai',
    description: 'Đinh Thi Ai - chuyên gia đào tạo công nghệ AI ứng dụng, đồng hành cùng hàng nghìn học viên đi làm.',
  });
};
