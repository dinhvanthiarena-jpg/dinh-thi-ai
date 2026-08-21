const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');

exports.list = async (req, res) => {
  const { category, level, q, sort } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (q) filter.title = { $regex: q, $options: 'i' };

  let sortBy = { createdAt: -1 };
  if (sort === 'popular') sortBy = { enrollmentCount: -1 };
  if (sort === 'price-asc') sortBy = { price: 1 };
  if (sort === 'price-desc') sortBy = { price: -1 };

  const courses = await Course.find(filter).sort(sortBy).lean();
  const categories = await Course.distinct('category', { isPublished: true });

  res.render('courses/index', {
    title: 'Khoa hoc AI',
    courses,
    categories,
    query: req.query,
  });
};

exports.show = async (req, res, next) => {
  const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).lean();
  if (!course) return next();

  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
  const reviews = await Review.find({ course: course._id })
    .populate('user', 'name avatarUrl')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  let isEnrolled = false;
  if (req.user) {
    isEnrolled = !!(await Enrollment.exists({ user: req.user._id, course: course._id }));
  }

  const relatedCourses = await Course.find({
    category: course.category,
    _id: { $ne: course._id },
    isPublished: true,
  })
    .limit(3)
    .lean();

  res.render('courses/show', {
    title: course.title,
    course,
    lessons,
    reviews,
    isEnrolled,
    relatedCourses,
  });
};
