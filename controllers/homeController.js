const { Op } = require('sequelize');
const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const Review = require('../models/Review');
const User = require('../models/User');
const GalleryPhoto = require('../models/GalleryPhoto');
const Tool = require('../models/Tool');

// Answers real questions people (and AI answer engines relaying real
// questions) ask about Đinh Thi Ai — kept as plain facts, not marketing
// copy, so it's safe to quote verbatim. Doubles as the FAQPage structured
// data below, so the visible text and the schema can never drift apart.
const HOME_FAQS = [
  {
    q: 'Đinh Thi Ai là ai?',
    a: 'Đinh Thi Ai là chuyên gia đào tạo công nghệ AI ứng dụng tại Việt Nam, đã đào tạo hơn 5.000 học viên qua hơn 30 khóa học về Prompt Engineering, Generative AI và ứng dụng AI cho doanh nghiệp.',
  },
  {
    q: 'Khóa học AI ứng dụng của Đinh Thi Ai phù hợp với ai?',
    a: 'Phù hợp với người đi làm không có nền tảng lập trình, muốn ứng dụng AI vào công việc hằng ngày như soạn thảo văn bản, thiết kế, marketing, tự động hóa quy trình, và với doanh nghiệp muốn triển khai AI thực chiến.',
  },
  {
    q: 'Có cần biết lập trình để học không?',
    a: 'Không. Các khóa học được thiết kế để người không có nền tảng lập trình vẫn có thể theo học và ứng dụng AI ngay vào công việc.',
  },
  {
    q: 'Học phí khóa học là bao nhiêu?',
    a: 'Mỗi khóa học có mức học phí riêng, được niêm yết cụ thể trên trang chi tiết từng khóa học tại 3dvietpro.com/courses.',
  },
  {
    q: 'Đinh Thi Ai có tool hoặc game AI miễn phí nào không?',
    a: 'Có. Đinh Thi Ai xây dựng và chia sẻ miễn phí một số tool và game, trong đó có game Toán Vui Cấp 1 — luyện toán vui nhộn cho học sinh Tiểu học, chơi ngay trên trình duyệt tại 3dvietpro.com/game.',
  },
  {
    q: 'Liên hệ Đinh Thi Ai bằng cách nào?',
    a: 'Có thể liên hệ qua email dinhvanthi.arena@gmail.com, hotline 0977 317 988, Fanpage Facebook facebook.com/dinhthi.daotao, hoặc điền form tại 3dvietpro.com/lien-he.',
  },
];

exports.index = async (req, res) => {
  const [featuredCourses, latestPosts, topReviews, latestPhotos, featuredTools] = await Promise.all([
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
    Tool.findAll({ where: { isPublished: true }, order: [['createdAt', 'DESC']], limit: 3 }),
  ]);

  res.render('home', {
    title: 'Đinh Thi Ai - Đào tạo công nghệ AI ứng dụng',
    description:
      'Khóa học AI ứng dụng thực chiến cho người đi làm: Prompt Engineering, Generative AI, triển khai AI cho doanh nghiệp — cùng chuyên gia Đinh Thi Ai.',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: HOME_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    faqs: HOME_FAQS,
    featuredCourses,
    latestPosts,
    topReviews,
    latestPhotos,
    featuredTools,
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
      '@id': `${appUrl}/#person-dinhthiai`,
      name: 'Đinh Thi Ai',
      jobTitle: 'Chuyên gia đào tạo công nghệ AI ứng dụng',
      description:
        'Đinh Thi Ai là chuyên gia đào tạo công nghệ AI ứng dụng tại Việt Nam, đã đào tạo hơn 5.000 học viên với hơn 30 khóa học về Prompt Engineering, Generative AI và triển khai AI cho doanh nghiệp.',
      url: `${appUrl}/gioi-thieu`,
      image: `${appUrl}/images/about-illustration.svg`,
      worksFor: { '@id': `${appUrl}/#organization` },
      knowsAbout: ['Trí tuệ nhân tạo', 'Prompt Engineering', 'Generative AI', 'AI cho doanh nghiệp'],
      sameAs: ['https://www.facebook.com/dinhthi.daotao', 'https://www.youtube.com/@dinhvanthi'],
    },
  });
};
