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
  const appUrl = res.locals.appUrl;
  res.render('about', {
    title: 'Về Đinh Thi Ai',
    description: 'Đinh Thi Ai - chuyên gia đào tạo công nghệ AI ứng dụng, đồng hành cùng hàng nghìn học viên đi làm.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Đinh Thi Ai',
      jobTitle: 'Chuyên gia đào tạo công nghệ AI ứng dụng',
      description:
        'Đinh Thi Ai là chuyên gia đào tạo công nghệ AI ứng dụng tại Việt Nam, đã đào tạo hơn 5.000 học viên với hơn 30 khóa học về Prompt Engineering, Generative AI và triển khai AI cho doanh nghiệp.',
      url: `${appUrl}/gioi-thieu`,
      image: `${appUrl}/images/about-illustration.svg`,
      worksFor: { '@type': 'EducationalOrganization', name: 'Đinh Thi Ai', url: appUrl },
      knowsAbout: ['Trí tuệ nhân tạo', 'Prompt Engineering', 'Generative AI', 'AI cho doanh nghiệp'],
      sameAs: ['https://www.facebook.com/dinhthi.daotao', 'https://www.youtube.com/@dinhvanthi'],
    },
  });
};
