const { fn, col } = require('sequelize');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.index = async (req, res) => {
  const enrollments = await Enrollment.findAll({
    where: { UserId: req.user.id },
    include: [{ model: Course, as: 'course' }],
    order: [['createdAt', 'DESC']],
  });

  const orders = await Order.findAll({
    where: { UserId: req.user.id, status: 'paid' },
    include: [{ model: Course, as: 'course', attributes: ['title'] }],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  res.render('dashboard/index', {
    title: 'Khu vực học tập',
    enrollments,
    orders,
  });
};

exports.learn = async (req, res, next) => {
  const course = await Course.findOne({ where: { slug: req.params.slug } });
  if (!course) return next();

  const enrollment = await Enrollment.findOne({ where: { UserId: req.user.id, CourseId: course.id } });
  if (!enrollment) {
    req.flash('error', 'Bạn chưa sở hữu khóa học này.');
    return res.redirect(`/courses/${course.slug}`);
  }

  const lessons = await Lesson.findAll({ where: { CourseId: course.id }, order: [['order', 'ASC']] });
  const activeLessonId = req.query.lesson || (lessons[0] && lessons[0].id.toString());
  const activeLesson = lessons.find((l) => l.id.toString() === activeLessonId) || lessons[0];

  const existingReview = await Review.findOne({ where: { UserId: req.user.id, CourseId: course.id } });

  res.render('dashboard/learn', {
    title: course.title,
    course,
    lessons,
    activeLesson,
    enrollment,
    existingReview,
  });
};

exports.completeLesson = async (req, res, next) => {
  const course = await Course.findOne({ where: { slug: req.params.slug } });
  if (!course) return next();

  const enrollment = await Enrollment.findOne({ where: { UserId: req.user.id, CourseId: course.id } });
  if (!enrollment) return next();

  const lessonId = Number(req.params.lessonId);
  const completed = [...enrollment.completedLessons];
  if (!completed.some((id) => Number(id) === lessonId)) {
    completed.push(lessonId);
  }
  enrollment.completedLessons = completed;

  const totalLessons = await Lesson.count({ where: { CourseId: course.id } });
  enrollment.progressPercent = totalLessons ? Math.round((completed.length / totalLessons) * 100) : 0;

  if (enrollment.progressPercent >= 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
  }

  await enrollment.save();
  res.redirect(`/dashboard/learn/${course.slug}?lesson=${lessonId}`);
};

exports.submitReview = async (req, res, next) => {
  const course = await Course.findOne({ where: { slug: req.params.slug } });
  if (!course) return next();

  const { rating, comment } = req.body;

  const existing = await Review.findOne({ where: { UserId: req.user.id, CourseId: course.id } });
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    await existing.save();
  } else {
    await Review.create({ UserId: req.user.id, CourseId: course.id, rating, comment });
  }

  const stats = await Review.findOne({
    where: { CourseId: course.id },
    attributes: [
      [fn('AVG', col('rating')), 'avg'],
      [fn('COUNT', col('id')), 'count'],
    ],
    raw: true,
  });

  if (stats) {
    await course.update({
      ratingAverage: Math.round(Number(stats.avg) * 10) / 10,
      ratingCount: Number(stats.count),
    });
  }

  req.flash('success', 'Cảm ơn bạn đã đánh giá khóa học!');
  res.redirect(`/dashboard/learn/${course.slug}`);
};
