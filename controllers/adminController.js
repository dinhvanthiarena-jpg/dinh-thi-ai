const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const BlogPost = require('../models/BlogPost');
const Order = require('../models/Order');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');

// --- Dashboard ---
exports.dashboard = async (req, res) => {
  const [courseCount, studentCount, postCount, paidOrders] = await Promise.all([
    Course.count(),
    User.count({ where: { role: 'student' } }),
    BlogPost.count(),
    Order.findAll({ where: { status: 'paid' } }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const recentOrders = await Order.findAll({
    where: { status: 'paid' },
    include: [
      { model: User, as: 'user', attributes: ['name', 'email'] },
      { model: Course, as: 'course', attributes: ['title'] },
    ],
    order: [['createdAt', 'DESC']],
    limit: 8,
  });

  res.render('admin/index', {
    title: 'Bang dieu khien quan tri',
    stats: { courseCount, studentCount, postCount, orderCount: paidOrders.length, revenue },
    recentOrders,
  });
};

// --- Courses ---
exports.courseList = async (req, res) => {
  const courses = await Course.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/courses', { title: 'Quan ly khoa hoc', courses });
};

exports.courseNewForm = (req, res) => {
  res.render('admin/course-form', { title: 'Them khoa hoc', course: {}, lessons: [] });
};

exports.courseEditForm = async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return next();
  const lessons = await Lesson.findAll({ where: { CourseId: course.id }, order: [['order', 'ASC']] });
  res.render('admin/course-form', { title: 'Sua khoa hoc', course, lessons });
};

exports.courseCreate = async (req, res) => {
  const body = req.body;
  const course = await Course.create({
    title: body.title,
    subtitle: body.subtitle,
    description: body.description,
    category: body.category,
    level: body.level,
    price: Number(body.price) || 0,
    salePrice: body.salePrice ? Number(body.salePrice) : null,
    instructorName: body.instructorName || 'Dinh Thi Ai',
    durationHours: Number(body.durationHours) || 0,
    outcomes: (body.outcomes || '').split('\n').map((s) => s.trim()).filter(Boolean),
    requirements: (body.requirements || '').split('\n').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    isFeatured: body.isFeatured === 'on',
    thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  });

  req.flash('success', 'Da tao khoa hoc moi.');
  res.redirect(`/admin/courses/${course.id}/edit`);
};

exports.courseUpdate = async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return next();

  const body = req.body;
  await course.update({
    title: body.title,
    subtitle: body.subtitle,
    description: body.description,
    category: body.category,
    level: body.level,
    price: Number(body.price) || 0,
    salePrice: body.salePrice ? Number(body.salePrice) : null,
    instructorName: body.instructorName || 'Dinh Thi Ai',
    durationHours: Number(body.durationHours) || 0,
    outcomes: (body.outcomes || '').split('\n').map((s) => s.trim()).filter(Boolean),
    requirements: (body.requirements || '').split('\n').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    isFeatured: body.isFeatured === 'on',
    ...(req.file ? { thumbnailUrl: `/uploads/${req.file.filename}` } : {}),
  });

  req.flash('success', 'Da cap nhat khoa hoc.');
  res.redirect(`/admin/courses/${course.id}/edit`);
};

exports.courseDelete = async (req, res) => {
  await Lesson.destroy({ where: { CourseId: req.params.id } });
  await Course.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Da xoa khoa hoc.');
  res.redirect('/admin/courses');
};

// --- Lessons (nested under a course) ---
exports.lessonCreate = async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return next();

  const count = await Lesson.count({ where: { CourseId: course.id } });
  await Lesson.create({
    CourseId: course.id,
    title: req.body.title,
    order: count + 1,
    videoUrl: req.body.videoUrl,
    contentText: req.body.contentText,
    durationMinutes: Number(req.body.durationMinutes) || 0,
    isPreview: req.body.isPreview === 'on',
  });

  req.flash('success', 'Da them bai hoc.');
  res.redirect(`/admin/courses/${course.id}/edit`);
};

exports.lessonDelete = async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.lessonId);
  const courseId = lesson ? lesson.CourseId : req.params.id;
  if (lesson) await lesson.destroy();
  req.flash('success', 'Da xoa bai hoc.');
  res.redirect(`/admin/courses/${courseId}/edit`);
};

// --- Blog ---
exports.blogList = async (req, res) => {
  const posts = await BlogPost.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/blog', { title: 'Quan ly bai viet', posts });
};

exports.blogNewForm = (req, res) => {
  res.render('admin/blog-form', { title: 'Them bai viet', post: {} });
};

exports.blogEditForm = async (req, res, next) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return next();
  res.render('admin/blog-form', { title: 'Sua bai viet', post });
};

exports.blogCreate = async (req, res) => {
  const body = req.body;
  const post = await BlogPost.create({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    tags: (body.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    AuthorId: req.user.id,
    coverImageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  });

  req.flash('success', 'Da dang bai viet.');
  res.redirect('/admin/blog');
};

exports.blogUpdate = async (req, res, next) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return next();

  const body = req.body;
  await post.update({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    tags: (body.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    ...(req.file ? { coverImageUrl: `/uploads/${req.file.filename}` } : {}),
  });

  req.flash('success', 'Da cap nhat bai viet.');
  res.redirect('/admin/blog');
};

exports.blogDelete = async (req, res) => {
  await BlogPost.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Da xoa bai viet.');
  res.redirect('/admin/blog');
};

// --- Orders & Students ---
exports.orderList = async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User, as: 'user', attributes: ['name', 'email'] },
      { model: Course, as: 'course', attributes: ['title'] },
    ],
    order: [['createdAt', 'DESC']],
  });
  res.render('admin/orders', { title: 'Don hang', orders });
};

exports.studentList = async (req, res) => {
  const students = await User.findAll({ where: { role: 'student' }, order: [['createdAt', 'DESC']] });
  res.render('admin/students', { title: 'Hoc vien', students });
};

// --- Messages ---
exports.messageList = async (req, res) => {
  const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/messages', { title: 'Tin nhan lien he', messages });
};

exports.messageMarkRead = async (req, res) => {
  await ContactMessage.update({ isRead: true }, { where: { id: req.params.id } });
  res.redirect('/admin/messages');
};
