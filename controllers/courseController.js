const { Op } = require('sequelize');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Review = require('../models/Review');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

exports.list = async (req, res) => {
  const { category, level, q, sort } = req.query;
  const where = { isPublished: true };
  if (category) where.category = category;
  if (level) where.level = level;
  if (q) where.title = { [Op.like]: `%${q}%` };

  let order = [['createdAt', 'DESC']];
  if (sort === 'popular') order = [['enrollmentCount', 'DESC']];
  if (sort === 'price-asc') order = [['price', 'ASC']];
  if (sort === 'price-desc') order = [['price', 'DESC']];

  const courses = await Course.findAll({ where, order });
  const categoryRows = await Course.findAll({
    where: { isPublished: true },
    attributes: ['category'],
    group: ['category'],
  });
  const categories = categoryRows.map((c) => c.category);

  res.render('courses/index', {
    title: 'Khoa hoc AI',
    courses,
    categories,
    query: req.query,
  });
};

exports.show = async (req, res, next) => {
  const course = await Course.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!course) return next();

  const lessons = await Lesson.findAll({ where: { CourseId: course.id }, order: [['order', 'ASC']] });
  const reviews = await Review.findAll({
    where: { CourseId: course.id },
    include: [{ model: User, as: 'user', attributes: ['name', 'avatarUrl'] }],
    order: [['createdAt', 'DESC']],
    limit: 10,
  });

  let isEnrolled = false;
  if (req.user) {
    isEnrolled = !!(await Enrollment.findOne({ where: { UserId: req.user.id, CourseId: course.id } }));
  }

  const relatedCourses = await Course.findAll({
    where: {
      category: course.category,
      id: { [Op.ne]: course.id },
      isPublished: true,
    },
    limit: 3,
  });

  res.render('courses/show', {
    title: course.title,
    course,
    lessons,
    reviews,
    isEnrolled,
    relatedCourses,
  });
};
