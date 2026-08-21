const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.index = async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course')
    .sort({ createdAt: -1 })
    .lean();

  const orders = await Order.find({ user: req.user._id, status: 'paid' })
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  res.render('dashboard/index', {
    title: 'Khu vuc hoc tap',
    enrollments,
    orders,
  });
};

exports.learn = async (req, res, next) => {
  const course = await Course.findOne({ slug: req.params.slug }).lean();
  if (!course) return next();

  const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (!enrollment) {
    req.flash('error', 'Ban chua so huu khoa hoc nay.');
    return res.redirect(`/courses/${course.slug}`);
  }

  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
  const activeLessonId = req.query.lesson || (lessons[0] && lessons[0]._id.toString());
  const activeLesson = lessons.find((l) => l._id.toString() === activeLessonId) || lessons[0];

  const existingReview = await Review.findOne({ user: req.user._id, course: course._id }).lean();

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
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) return next();

  const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (!enrollment) return next();

  const lessonId = req.params.lessonId;
  if (!enrollment.completedLessons.some((id) => id.toString() === lessonId)) {
    enrollment.completedLessons.push(lessonId);
  }

  const totalLessons = await Lesson.countDocuments({ course: course._id });
  enrollment.progressPercent = totalLessons
    ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    : 0;

  if (enrollment.progressPercent >= 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
  }

  await enrollment.save();
  res.redirect(`/dashboard/learn/${course.slug}?lesson=${lessonId}`);
};

exports.submitReview = async (req, res, next) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) return next();

  const { rating, comment } = req.body;

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, course: course._id },
    { rating, comment },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const stats = await Review.aggregate([
    { $match: { course: course._id } },
    { $group: { _id: '$course', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats[0]) {
    await Course.findByIdAndUpdate(course._id, {
      ratingAverage: Math.round(stats[0].avg * 10) / 10,
      ratingCount: stats[0].count,
    });
  }

  req.flash('success', 'Cam on ban da danh gia khoa hoc!');
  res.redirect(`/dashboard/learn/${course.slug}`);
};
