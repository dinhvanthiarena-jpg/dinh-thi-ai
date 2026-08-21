const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const BlogPost = require('../models/BlogPost');
const Order = require('../models/Order');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');

// --- Dashboard ---
exports.dashboard = async (req, res) => {
  const [courseCount, studentCount, postCount, paidOrders] = await Promise.all([
    Course.countDocuments(),
    User.countDocuments({ role: 'student' }),
    BlogPost.countDocuments(),
    Order.find({ status: 'paid' }).lean(),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const recentOrders = await Order.find({ status: 'paid' })
    .populate('user', 'name email')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  res.render('admin/index', {
    title: 'Bang dieu khien quan tri',
    stats: { courseCount, studentCount, postCount, orderCount: paidOrders.length, revenue },
    recentOrders,
  });
};

// --- Courses ---
exports.courseList = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 }).lean();
  res.render('admin/courses', { title: 'Quan ly khoa hoc', courses });
};

exports.courseNewForm = (req, res) => {
  res.render('admin/course-form', { title: 'Them khoa hoc', course: {}, lessons: [] });
};

exports.courseEditForm = async (req, res, next) => {
  const course = await Course.findById(req.params.id).lean();
  if (!course) return next();
  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
  res.render('admin/course-form', { title: 'Sua khoa hoc', course, lessons });
};

exports.courseCreate = async (req, res) => {
  const body = req.body;
  const course = new Course({
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
  });

  if (req.file) {
    course.thumbnailUrl = `/uploads/${req.file.filename}`;
  }

  await course.save();
  req.flash('success', 'Da tao khoa hoc moi.');
  res.redirect(`/admin/courses/${course._id}/edit`);
};

exports.courseUpdate = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next();

  const body = req.body;
  Object.assign(course, {
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
  });

  if (req.file) {
    course.thumbnailUrl = `/uploads/${req.file.filename}`;
  }

  await course.save();
  req.flash('success', 'Da cap nhat khoa hoc.');
  res.redirect(`/admin/courses/${course._id}/edit`);
};

exports.courseDelete = async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  await Lesson.deleteMany({ course: req.params.id });
  req.flash('success', 'Da xoa khoa hoc.');
  res.redirect('/admin/courses');
};

// --- Lessons (nested under a course) ---
exports.lessonCreate = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next();

  const count = await Lesson.countDocuments({ course: course._id });
  await Lesson.create({
    course: course._id,
    title: req.body.title,
    order: count + 1,
    videoUrl: req.body.videoUrl,
    contentText: req.body.contentText,
    durationMinutes: Number(req.body.durationMinutes) || 0,
    isPreview: req.body.isPreview === 'on',
  });

  req.flash('success', 'Da them bai hoc.');
  res.redirect(`/admin/courses/${course._id}/edit`);
};

exports.lessonDelete = async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);
  req.flash('success', 'Da xoa bai hoc.');
  res.redirect(`/admin/courses/${lesson ? lesson.course : req.params.id}/edit`);
};

// --- Blog ---
exports.blogList = async (req, res) => {
  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
  res.render('admin/blog', { title: 'Quan ly bai viet', posts });
};

exports.blogNewForm = (req, res) => {
  res.render('admin/blog-form', { title: 'Them bai viet', post: {} });
};

exports.blogEditForm = async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id).lean();
  if (!post) return next();
  res.render('admin/blog-form', { title: 'Sua bai viet', post });
};

exports.blogCreate = async (req, res) => {
  const body = req.body;
  const post = new BlogPost({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    tags: (body.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    author: req.user._id,
  });

  if (req.file) {
    post.coverImageUrl = `/uploads/${req.file.filename}`;
  }

  await post.save();
  req.flash('success', 'Da dang bai viet.');
  res.redirect('/admin/blog');
};

exports.blogUpdate = async (req, res, next) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return next();

  const body = req.body;
  Object.assign(post, {
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    tags: (body.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
  });

  if (req.file) {
    post.coverImageUrl = `/uploads/${req.file.filename}`;
  }

  await post.save();
  req.flash('success', 'Da cap nhat bai viet.');
  res.redirect('/admin/blog');
};

exports.blogDelete = async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  req.flash('success', 'Da xoa bai viet.');
  res.redirect('/admin/blog');
};

// --- Orders & Students ---
exports.orderList = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .lean();
  res.render('admin/orders', { title: 'Don hang', orders });
};

exports.studentList = async (req, res) => {
  const students = await User.find({ role: 'student' }).sort({ createdAt: -1 }).lean();
  res.render('admin/students', { title: 'Hoc vien', students });
};

// --- Messages ---
exports.messageList = async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  res.render('admin/messages', { title: 'Tin nhan lien he', messages });
};

exports.messageMarkRead = async (req, res) => {
  await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true });
  res.redirect('/admin/messages');
};
