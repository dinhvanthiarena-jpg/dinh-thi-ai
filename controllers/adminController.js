const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const BlogPost = require('../models/BlogPost');
const Order = require('../models/Order');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');
const GalleryPhoto = require('../models/GalleryPhoto');
const ChatMessage = require('../models/ChatMessage');
const Tool = require('../models/Tool');
const GameInstall = require('../models/GameInstall');
const PushSubscription = require('../models/PushSubscription');
const webpush = require('web-push');

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.ADMIN_EMAIL || 'admin@3dvietpro.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Admin pastes whatever YouTube link they copied (watch?v=, youtu.be/, shorts/,
// or already an /embed/ link) — normalize all of them to the /embed/ form the
// <iframe> on the lesson page needs. Anything that isn't a recognizable
// YouTube link (e.g. a Vimeo URL) is left untouched.
function normalizeVideoUrl(url) {
  if (!url) return url;
  const trimmed = url.trim();
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
  ];
  for (const re of patterns) {
    const match = trimmed.match(re);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  return trimmed;
}

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
    title: 'Bảng điều khiển quản trị',
    stats: { courseCount, studentCount, postCount, orderCount: paidOrders.length, revenue },
    recentOrders,
  });
};

// --- Courses ---
exports.courseList = async (req, res) => {
  const courses = await Course.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/courses', { title: 'Quản lý khóa học', courses });
};

exports.courseNewForm = (req, res) => {
  res.render('admin/course-form', { title: 'Thêm khóa học', course: {}, lessons: [] });
};

exports.courseEditForm = async (req, res, next) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) return next();
  const lessons = await Lesson.findAll({ where: { CourseId: course.id }, order: [['order', 'ASC']] });
  res.render('admin/course-form', { title: 'Sửa khóa học', course, lessons });
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
    instructorName: body.instructorName || 'Đinh Thi Ai',
    durationHours: Number(body.durationHours) || 0,
    outcomes: (body.outcomes || '').split('\n').map((s) => s.trim()).filter(Boolean),
    requirements: (body.requirements || '').split('\n').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    isFeatured: body.isFeatured === 'on',
    thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  });

  req.flash('success', 'Đã tạo khóa học mới.');
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
    instructorName: body.instructorName || 'Đinh Thi Ai',
    durationHours: Number(body.durationHours) || 0,
    outcomes: (body.outcomes || '').split('\n').map((s) => s.trim()).filter(Boolean),
    requirements: (body.requirements || '').split('\n').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    isFeatured: body.isFeatured === 'on',
    ...(req.file ? { thumbnailUrl: `/uploads/${req.file.filename}` } : {}),
  });

  req.flash('success', 'Đã cập nhật khóa học.');
  res.redirect(`/admin/courses/${course.id}/edit`);
};

exports.courseDelete = async (req, res) => {
  await Lesson.destroy({ where: { CourseId: req.params.id } });
  await Course.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Đã xóa khóa học.');
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
    videoUrl: normalizeVideoUrl(req.body.videoUrl),
    contentText: req.body.contentText,
    durationMinutes: Number(req.body.durationMinutes) || 0,
    isPreview: req.body.isPreview === 'on',
  });

  req.flash('success', 'Đã thêm bài học.');
  res.redirect(`/admin/courses/${course.id}/edit`);
};

exports.lessonDelete = async (req, res) => {
  const lesson = await Lesson.findByPk(req.params.lessonId);
  const courseId = lesson ? lesson.CourseId : req.params.id;
  if (lesson) await lesson.destroy();
  req.flash('success', 'Đã xóa bài học.');
  res.redirect(`/admin/courses/${courseId}/edit`);
};

// --- Blog ---
exports.blogList = async (req, res) => {
  const posts = await BlogPost.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/blog', { title: 'Quản lý bài viết', posts });
};

exports.blogNewForm = (req, res) => {
  res.render('admin/blog-form', { title: 'Thêm bài viết', post: {} });
};

exports.blogEditForm = async (req, res, next) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return next();
  res.render('admin/blog-form', { title: 'Sửa bài viết', post });
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

  req.flash('success', 'Đã đăng bài viết.');
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

  req.flash('success', 'Đã cập nhật bài viết.');
  res.redirect('/admin/blog');
};

exports.blogDelete = async (req, res) => {
  await BlogPost.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Đã xóa bài viết.');
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
  res.render('admin/orders', { title: 'Đơn hàng', orders });
};

exports.proOrderList = async (req, res) => {
  const { ProOrder } = require('../models');
  const pro = require('../services/proService');
  const orders = await ProOrder.findAll({
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'proUntil'] }],
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
  res.render('admin/pro-orders', {
    title: 'Gói Pro',
    orders,
    dangThuPhi: pro.dangThuPhi(),
    sanSang: pro.sanSangNhanTien(),
  });
};

/**
 * Duyệt tay một đơn. Dùng khi ngân hàng báo chậm, người mua ghi sai nội dung,
 * hoặc thầy nhận tiền theo cách khác. Ghi lại là ai duyệt để sau còn lần ra.
 */
exports.proOrderConfirm = async (req, res) => {
  const { ProOrder } = require('../models');
  const pro = require('../services/proService');
  const order = await ProOrder.findByPk(req.params.id);
  if (order && order.status !== 'paid') {
    await pro.ghiNhanDaTra(order, { boi: 'tay:' + (res.locals.currentUser?.email || 'admin') });
  }
  res.redirect('/admin/pro-orders');
};

exports.studentList = async (req, res) => {
  const students = await User.findAll({ where: { role: 'student' }, order: [['createdAt', 'DESC']] });
  // Ai chỉ có số điện thoại là đăng ký từ trong app Mon.L, còn web thì bắt buộc email.
  const tuApp = students.filter((s) => s.phone && !s.email).length;
  const homNay = new Date().toDateString();
  const moiHomNay = students.filter((s) => new Date(s.createdAt).toDateString() === homNay).length;
  res.render('admin/students', { title: 'Học viên', students, tuApp, moiHomNay });
};

// --- Messages ---
exports.messageList = async (req, res) => {
  const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/messages', { title: 'Tin nhắn liên hệ', messages });
};

exports.messageMarkRead = async (req, res) => {
  await ContactMessage.update({ isRead: true }, { where: { id: req.params.id } });
  res.redirect('/admin/messages');
};

// --- Game installs (Toan Vui Cap 1) ---
exports.gameInstallList = async (req, res) => {
  const installs = await GameInstall.findAll({ order: [['lastSeenAt', 'DESC']] });
  const activatedCount = installs.filter((i) => i.licenseKey).length;
  res.render('admin/game-installs', {
    title: 'Cài đặt Toán Vui Cấp 1',
    installs,
    activatedCount,
    trialCount: installs.length - activatedCount,
  });
};

exports.pushBroadcastForm = async (req, res) => {
  const subscriberCount = await PushSubscription.count();
  res.render('admin/push-broadcast', {
    title: 'Thông báo cập nhật',
    subscriberCount,
    vapidConfigured: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY),
  });
};

// Sends one push notification to every subscribed device. Tapping it opens
// the game, which — thanks to the no-store Cache-Control on the game's
// static files — always fetches the latest deployed version, so this really
// does double as an "update available" nudge, not just a message.
exports.pushBroadcastSend = async (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    req.flash('error', 'Chưa cấu hình VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY trên server.');
    return res.redirect('/admin/push-broadcast');
  }
  const { title, body } = req.body || {};
  if (!title || !title.trim() || !body || !body.trim()) {
    req.flash('error', 'Vui lòng nhập đủ tiêu đề và nội dung thông báo.');
    return res.redirect('/admin/push-broadcast');
  }

  const subs = await PushSubscription.findAll();
  const payload = JSON.stringify({
    title: title.trim().slice(0, 100),
    body: body.trim().slice(0, 300),
    url: '/game/',
  });

  let sent = 0;
  let removed = 0;
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        sent++;
      } catch (e) {
        // 404/410 means the browser dropped this subscription (uninstalled,
        // cleared data, expired) — Facebook-style dead-link cleanup, not an
        // error worth logging.
        if (e.statusCode === 404 || e.statusCode === 410) {
          await sub.destroy();
          removed++;
        } else {
          console.error('[push-broadcast]', e.message);
        }
      }
    })
  );

  req.flash('success', `Đã gửi thông báo tới ${sent} thiết bị${removed ? `, dọn ${removed} đăng ký đã hết hạn` : ''}.`);
  res.redirect('/admin/push-broadcast');
};

// --- Chatbot conversations ---
exports.chatList = async (req, res) => {
  const rows = await ChatMessage.findAll({ order: [['createdAt', 'DESC']], limit: 500 });

  const conversations = new Map();
  for (const m of rows) {
    const key = `${m.channel}:${m.sessionId}`;
    if (!conversations.has(key)) {
      conversations.set(key, {
        channel: m.channel,
        sessionId: m.sessionId,
        customerName: m.customerName,
        lastMessage: m.content,
        lastAt: m.createdAt,
        handedOff: false,
        count: 0,
      });
    }
    const convo = conversations.get(key);
    convo.count += 1;
    if (m.handedOff) convo.handedOff = true;
    if (!convo.customerName && m.customerName) convo.customerName = m.customerName;
  }

  res.render('admin/chats', { title: 'Chat AI khách hàng', conversations: Array.from(conversations.values()) });
};

exports.chatDetail = async (req, res) => {
  const { channel, sessionId } = req.params;
  const messages = await ChatMessage.findAll({
    where: { channel, sessionId },
    order: [['createdAt', 'ASC']],
  });
  const customerName = (messages.find((m) => m.customerName) || {}).customerName || '';
  res.render('admin/chat-detail', { title: 'Chi tiết hội thoại', channel, sessionId, customerName, messages });
};

// --- Gallery ---
exports.galleryList = async (req, res) => {
  const photos = await GalleryPhoto.findAll({ order: [['eventDate', 'DESC']] });
  res.render('admin/gallery', { title: 'Ảnh hoạt động', photos });
};

exports.galleryNewForm = (req, res) => {
  res.render('admin/gallery-form', { title: 'Thêm ảnh hoạt động', photo: {} });
};

exports.galleryEditForm = async (req, res, next) => {
  const photo = await GalleryPhoto.findByPk(req.params.id);
  if (!photo) return next();
  res.render('admin/gallery-form', { title: 'Sửa ảnh hoạt động', photo });
};

exports.galleryCreate = async (req, res) => {
  const body = req.body;
  const files = req.files || [];
  if (!files.length) {
    req.flash('error', 'Vui lòng chọn ít nhất một ảnh để tải lên.');
    return res.redirect('/admin/gallery/new');
  }

  await GalleryPhoto.bulkCreate(
    files.map((file, i) => ({
      title: files.length > 1 ? `${body.title} (${i + 1})` : body.title,
      description: body.description,
      eventDate: body.eventDate || undefined,
      isPublished: body.isPublished === 'on',
      imageUrl: `/uploads/${file.filename}`,
    }))
  );

  req.flash('success', files.length > 1 ? `Đã thêm ${files.length} ảnh hoạt động.` : 'Đã thêm ảnh hoạt động.');
  res.redirect('/admin/gallery');
};

exports.galleryUpdate = async (req, res, next) => {
  const photo = await GalleryPhoto.findByPk(req.params.id);
  if (!photo) return next();

  const body = req.body;
  await photo.update({
    title: body.title,
    description: body.description,
    eventDate: body.eventDate || undefined,
    isPublished: body.isPublished === 'on',
    ...(req.file ? { imageUrl: `/uploads/${req.file.filename}` } : {}),
  });

  req.flash('success', 'Đã cập nhật ảnh hoạt động.');
  res.redirect('/admin/gallery');
};

exports.galleryDelete = async (req, res) => {
  await GalleryPhoto.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Đã xóa ảnh hoạt động.');
  res.redirect('/admin/gallery');
};

// --- Tools & Games ---
exports.toolList = async (req, res) => {
  const tools = await Tool.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/tools', { title: 'Tool & Game', tools });
};

exports.toolNewForm = (req, res) => {
  res.render('admin/tool-form', { title: 'Thêm tool / game', tool: {} });
};

exports.toolEditForm = async (req, res, next) => {
  const tool = await Tool.findByPk(req.params.id);
  if (!tool) return next();
  res.render('admin/tool-form', { title: 'Sửa tool / game', tool });
};

// Parses the Google Drive file id (if any) straight out of the pasted URL.
// Computed explicitly here rather than left to the model's beforeValidate
// hook, since a stale driveFileId from an earlier Drive link must be
// overwritten with null the moment an admin switches driveUrl to a
// non-Drive link (e.g. the game's own domain) — see git history for the
// Sequelize update()-fields-restriction bug this used to hit.
function parseDriveFileId(driveUrl) {
  if (!driveUrl) return null;
  const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

exports.toolCreate = async (req, res) => {
  const body = req.body;
  const files = req.files || {};
  const cover = files.cover && files.cover[0];
  const gallery = files.gallery || [];

  await Tool.create({
    title: body.title,
    category: body.category,
    shortDescription: body.shortDescription,
    description: body.description,
    driveUrl: body.driveUrl,
    driveFileId: parseDriveFileId(body.driveUrl),
    webAppUrl: body.webAppUrl || null,
    isPublished: body.isPublished === 'on',
    coverImageUrl: cover ? `/uploads/${cover.filename}` : undefined,
    galleryImages: gallery.map((f) => `/uploads/${f.filename}`),
  });

  req.flash('success', 'Đã thêm tool / game.');
  res.redirect('/admin/tools');
};

exports.toolUpdate = async (req, res, next) => {
  const tool = await Tool.findByPk(req.params.id);
  if (!tool) return next();

  const body = req.body;
  const files = req.files || {};
  const cover = files.cover && files.cover[0];
  const gallery = files.gallery || [];
  const keepExisting = body.keepGallery === 'on';

  // tool.update(data) restricts the SQL UPDATE to exactly Object.keys(data),
  // so a field not in that list never reaches the database even if a hook
  // derives it in memory. set()+save() saves every changed field. driveFileId
  // is also computed explicitly here (not left to the hook alone) so it's
  // unambiguous and covered by the same Object.keys(data) set either way.
  tool.set({
    title: body.title,
    category: body.category,
    shortDescription: body.shortDescription,
    description: body.description,
    driveUrl: body.driveUrl,
    driveFileId: parseDriveFileId(body.driveUrl),
    webAppUrl: body.webAppUrl || null,
    isPublished: body.isPublished === 'on',
    ...(cover ? { coverImageUrl: `/uploads/${cover.filename}` } : {}),
    ...(gallery.length
      ? { galleryImages: [...(keepExisting ? tool.galleryImages || [] : []), ...gallery.map((f) => `/uploads/${f.filename}`)] }
      : {}),
  });
  await tool.save();

  req.flash('success', 'Đã cập nhật tool / game.');
  res.redirect('/admin/tools');
};

exports.toolDelete = async (req, res) => {
  await Tool.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Đã xóa tool / game.');
  res.redirect('/admin/tools');
};
