const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const BlogPost = require('../models/BlogPost');
const Order = require('../models/Order');
const User = require('../models/User');
const ContactMessage = require('../models/ContactMessage');
const CourseRegistration = require('../models/CourseRegistration');
const GalleryPhoto = require('../models/GalleryPhoto');
const ChatMessage = require('../models/ChatMessage');
const Tool = require('../models/Tool');
const GameInstall = require('../models/GameInstall');
const { BLOG_CATEGORIES } = require('../utils/blogCategories');
const PushSubscription = require('../models/PushSubscription');
const webpush = require('web-push');
const aaiAds = require('../services/aaiAdsService');
const aaiLicense = require('../services/aaiLicenseService');
const fbaiLicense = require('../services/fbaiLicenseService');
const vaiLicense = require('../services/vaiLicenseService');

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
  const [courseCount, studentCount, postCount, paidOrders, registrationCount] = await Promise.all([
    Course.count(),
    User.count({ where: { role: 'student' } }),
    BlogPost.count(),
    Order.findAll({ where: { status: 'paid' } }),
    CourseRegistration.count(),
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
  const recentRegistrations = await CourseRegistration.findAll({ order: [['createdAt', 'DESC']], limit: 8 });

  res.render('admin/index', {
    title: 'Bảng điều khiển quản trị',
    stats: { courseCount, studentCount, postCount, orderCount: paidOrders.length, revenue, registrationCount },
    recentOrders,
    recentRegistrations,
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
  res.render('admin/blog', { title: 'Quản lý bài viết', posts, categories: BLOG_CATEGORIES });
};

exports.blogNewForm = (req, res) => {
  res.render('admin/blog-form', { title: 'Thêm bài viết', post: {}, categories: BLOG_CATEGORIES });
};

exports.blogEditForm = async (req, res, next) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return next();
  res.render('admin/blog-form', { title: 'Sửa bài viết', post, categories: BLOG_CATEGORIES });
};

exports.blogCreate = async (req, res) => {
  const body = req.body;
  const files = req.files || {};
  const cover = files.cover && files.cover[0];
  const commentImages = files.commentImages || [];

  const post = await BlogPost.create({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    category: body.category || 'ai-cong-nghe',
    tags: (body.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    AuthorId: req.user.id,
    coverImageUrl: cover ? `/uploads/${cover.filename}` : undefined,
    commentImages: commentImages.map((f) => `/uploads/${f.filename}`),
  });

  req.flash('success', 'Đã đăng bài viết.');
  res.redirect('/admin/blog');
};

exports.blogUpdate = async (req, res, next) => {
  const post = await BlogPost.findByPk(req.params.id);
  if (!post) return next();

  const body = req.body;
  const files = req.files || {};
  const cover = files.cover && files.cover[0];
  const newCommentImages = files.commentImages || [];
  const toRemove = [].concat(body.removeCommentImages || []);
  const keptCommentImages = (post.commentImages || []).filter((url) => !toRemove.includes(url));

  post.set({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    category: body.category || 'ai-cong-nghe',
    tags: (body.tags || '').split(',').map((s) => s.trim()).filter(Boolean),
    isPublished: body.isPublished === 'on',
    commentImages: [...keptCommentImages, ...newCommentImages.map((f) => `/uploads/${f.filename}`)],
    ...(cover ? { coverImageUrl: `/uploads/${cover.filename}` } : {}),
  });
  await post.save();

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

exports.walletTransactionList = async (req, res) => {
  const { WalletTransaction } = require('../models');
  const wallet = require('../services/walletService');
  const transactions = await WalletTransaction.findAll({
    where: { type: 'topup' },
    include: [{ model: User, as: 'user', attributes: ['name', 'email', 'walletBalance'] }],
    order: [['createdAt', 'DESC']],
    limit: 200,
  });
  res.render('admin/wallet', {
    title: 'Ví — Nạp tiền',
    transactions,
    sanSang: wallet.sanSangNhanTien(),
  });
};

/** Duyệt tay 1 giao dịch nạp ví — giống hệt cơ chế duyệt tay gói Pro. */
exports.walletTransactionConfirm = async (req, res) => {
  const { WalletTransaction } = require('../models');
  const wallet = require('../services/walletService');
  const tx = await WalletTransaction.findByPk(req.params.id);
  if (tx && tx.status !== 'paid') {
    await wallet.ghiNhanNapVi(tx, { boi: 'tay:' + (res.locals.currentUser?.email || 'admin') });
  }
  res.redirect('/admin/wallet');
};

// --- Giới thiệu bạn bè (affiliate nội bộ 2 cấp) ---
exports.referralWithdrawList = async (req, res) => {
  const { WithdrawRequest } = require('../models');
  const commission = require('../services/commissionService');
  const [requests, baoCao] = await Promise.all([
    WithdrawRequest.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 200,
    }),
    commission.baoCaoTaiChinh(),
  ]);
  res.render('admin/referral-withdraws', { title: 'Rút hoa hồng giới thiệu', requests, baoCao });
};

exports.referralWithdrawApprove = async (req, res) => {
  const commission = require('../services/commissionService');
  try {
    await commission.duyetRutTien(req.params.id, 'tay:' + (res.locals.currentUser?.email || 'admin'));
    req.flash('success', 'Đã duyệt và trừ ví.');
  } catch (e) {
    req.flash('error', e.message);
  }
  res.redirect('/admin/gioi-thieu/rut-tien');
};

exports.referralWithdrawReject = async (req, res) => {
  const commission = require('../services/commissionService');
  await commission.tuChoiRutTien(req.params.id, 'tay:' + (res.locals.currentUser?.email || 'admin'), req.body.note);
  req.flash('success', 'Đã từ chối yêu cầu.');
  res.redirect('/admin/gioi-thieu/rut-tien');
};

exports.referralSettingsForm = async (req, res) => {
  const commission = require('../services/commissionService');
  const rates = await commission.getRates();
  res.render('admin/referral-settings', { title: 'Cấu hình hoa hồng giới thiệu', rates });
};

exports.referralSettingsUpdate = async (req, res) => {
  const commission = require('../services/commissionService');
  await commission.setRates({ l1Percent: Number(req.body.l1Percent) || 0, l2Percent: Number(req.body.l2Percent) || 0 });
  req.flash('success', 'Đã cập nhật tỷ lệ hoa hồng.');
  res.redirect('/admin/gioi-thieu/cau-hinh');
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

// --- Course registrations (đăng ký học miễn phí) ---
exports.courseRegistrationList = async (req, res) => {
  const registrations = await CourseRegistration.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/course-registrations', { title: 'Đăng ký học miễn phí', registrations });
};

exports.courseRegistrationMarkContacted = async (req, res) => {
  await CourseRegistration.update({ isContacted: true }, { where: { id: req.params.id } });
  res.redirect('/admin/course-registrations');
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
    price: Number(body.price) || 0,
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
    price: Number(body.price) || 0,
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

// Trang tạo/kiểm tra mã bản quyền cho tool A-AI-3dvietpro (Electron desktop app,
// không liên quan gì tới database/model của site này) — thuật toán chạy hoàn
// toàn ở trình duyệt (Web Crypto), phải khớp CHÍNH XÁC với license-core.js bên
// D:\CLAUDE CODE\fb-ads-manager để mã tạo ra dùng được thật với tool đó.
// Trang tạo mã cũ (offline hoàn toàn, JS chạy ngay trên trình duyệt) — từ
// 2026-09-16 tool desktop bắt buộc xác minh online, nên mã tạo ở trang này
// tuy ĐÚNG checksum nhưng KHÔNG có trong danh sách đã cấp ở server, sẽ bị
// isActiveLicense() từ chối. Giữ route cũ (tránh 404 nếu ai đã lưu link) và
// điều hướng sang trang cấp key mới, thật sự dùng được.
exports.aaiKeygenPage = (req, res) => {
  res.redirect('/admin/fbai-license-keys');
};

// ---------------- Key A-AI Ads (bản Web — cho khách clone tool lên web riêng) ----------------
// Khác trang trên (key desktop, tự sinh ở trình duyệt, không server nào theo
// dõi) — key này thầy CẤP và có thể THU HỒI, vì mỗi bản clone (thư mục
// aai-ads-module/) tự gọi về /api/aai-license/verify để hỏi trạng thái mới
// nhất, không chỉ tự kiểm tra checksum toán học — xem routes/aaiLicense.js.
exports.aaiLicenseKeysPage = (req, res) => {
  res.render('admin/aai-license-keys', { title: 'Key A-AI Ads (Web)', keys: aaiLicense.listKeys() });
};

exports.aaiLicenseKeyIssue = (req, res) => {
  try {
    const entry = aaiLicense.issueKey(req.body.note || '');
    req.flash('success', `Đã cấp key mới: ${entry.key}`);
  } catch (e) {
    req.flash('error', `Lỗi cấp key: ${e.message}`);
  }
  res.redirect('/admin/aai-license-keys');
};

exports.aaiLicenseKeyRevoke = (req, res) => {
  aaiLicense.revokeKey(req.params.key);
  req.flash('success', 'Đã thu hồi key.');
  res.redirect('/admin/aai-license-keys');
};

exports.aaiLicenseKeyReactivate = (req, res) => {
  aaiLicense.reactivateKey(req.params.key);
  req.flash('success', 'Đã kích hoạt lại key.');
  res.redirect('/admin/aai-license-keys');
};

exports.aaiLicenseKeyRenew = (req, res) => {
  aaiLicense.renewKey(req.params.key);
  req.flash('success', 'Đã gia hạn thêm 30 ngày.');
  res.redirect('/admin/aai-license-keys');
};

// ---------------- Key V-AI STUDIO (desktop, ký RS256, offline vĩnh viễn) ----------------
// Khác 2 hệ trên: key ký xong là TỰ ĐỦ, app xác minh chữ ký offline, KHÔNG
// hỏi lại đây nên KHÔNG thu hồi được sau khi đã gửi khách — xem ghi chú đầu
// services/vaiLicenseService.js. Trang này chỉ có Cấp key + sổ ghi lại.
exports.vaiLicenseKeysPage = (req, res) => {
  res.render('admin/vai-license-keys', { title: 'Key 3DVIETPRO AI STUDIO', keys: vaiLicense.listKeys() });
};

exports.vaiLicenseKeyIssue = (req, res) => {
  try {
    const entry = vaiLicense.issueKey(req.body.name || '', req.body.ngay || 0);
    req.flash('success', `Đã cấp key mới cho "${entry.name || '(không tên)'}" — copy ở dòng đầu danh sách bên dưới.`);
  } catch (e) {
    req.flash('error', `Lỗi cấp key: ${e.message}`);
  }
  res.redirect('/admin/vai-license-keys');
};

// ---------------- Key desktop AAi-3dvietpro (online, thu hồi được) ----------------

exports.fbaiLicenseKeysPage = (req, res) => {
  res.render('admin/fbai-license-keys', { title: 'Key SA-AI BOT (Desktop)', keys: fbaiLicense.listKeys() });
};

exports.fbaiLicenseKeyIssue = (req, res) => {
  try {
    const entry = fbaiLicense.issueKey(req.body.note || '');
    req.flash('success', `Đã cấp key mới: ${entry.key}`);
  } catch (e) {
    req.flash('error', `Lỗi cấp key: ${e.message}`);
  }
  res.redirect('/admin/fbai-license-keys');
};

exports.fbaiLicenseKeyRevoke = (req, res) => {
  fbaiLicense.revokeKey(req.params.key);
  req.flash('success', 'Đã thu hồi key.');
  res.redirect('/admin/fbai-license-keys');
};

exports.fbaiLicenseKeyReactivate = (req, res) => {
  fbaiLicense.reactivateKey(req.params.key);
  req.flash('success', 'Đã kích hoạt lại key.');
  res.redirect('/admin/fbai-license-keys');
};

exports.fbaiLicenseKeyRenew = (req, res) => {
  fbaiLicense.renewKey(req.params.key);
  req.flash('success', 'Đã gia hạn thêm 30 ngày.');
  res.redirect('/admin/fbai-license-keys');
};

exports.fbaiLicenseKeyResetDevice = (req, res) => {
  fbaiLicense.resetDevice(req.params.key);
  req.flash('success', 'Đã gỡ khoá thiết bị - lần kích hoạt/đồng bộ kế tiếp (từ máy bất kỳ) sẽ tự gắn thiết bị mới.');
  res.redirect('/admin/fbai-license-keys');
};

// ---------------- A-AI Ads (tạo chiến dịch Facebook Ads từ web) ----------------
// Port của phần tạo chiến dịch trong tool desktop fb-ads-manager — xem
// services/aaiAdsService.js để biết lý do kiến trúc + nhắc đồng bộ 2 bên.

exports.aaiAdsPage = async (req, res) => {
  const connected = aaiAds.isConnected();
  let adAccounts = [];
  let pages = [];
  let loadError = null;
  if (connected) {
    try {
      [adAccounts, pages] = await Promise.all([aaiAds.listAdAccounts(), aaiAds.listPages()]);
    } catch (e) {
      loadError = e.message;
    }
  }
  const websiteTargets = aaiAds.loadWebsiteTargets();
  const postingQueue = aaiAds.loadPostingQueue();
  const postingLog = aaiAds.loadPostingLog();
  const postingFreq = aaiAds.getPostingFreqSettings();
  const aiAutoPostConfig = aaiAds.getAiAutoPostConfig();
  const automationRules = aaiAds.loadAutomationRules();
  const automationLog = aaiAds.loadAutomationLog();
  const products = aaiAds.loadProducts();
  const orderSources = aaiAds.loadOrderSources();
  const orders = aaiAds.loadOrders();
  const leads = aaiAds.loadLeads();
  res.render('admin/aai-ads', {
    title: 'Tạo chiến dịch A-AI Ads',
    connected,
    adAccounts,
    pages,
    loadError,
    websiteTargets,
    postingQueue,
    postingLog,
    postingFreq,
    aiAutoPostConfig,
    automationRules,
    automationLog,
    products,
    orderSources,
    orders,
    leads,
  });
};

exports.aaiAdsConnect = (req, res) => {
  res.redirect(aaiAds.buildAuthUrl(req));
};

exports.aaiAdsCallback = async (req, res) => {
  const { code, error_description } = req.query;
  if (error_description) {
    req.flash('error', `Kết nối Facebook thất bại: ${error_description}`);
    return res.redirect('/admin/aai-ads');
  }
  if (!code) {
    req.flash('error', 'Không nhận được mã xác thực từ Facebook.');
    return res.redirect('/admin/aai-ads');
  }
  try {
    await aaiAds.exchangeCodeForToken(req, code);
    req.flash('success', 'Đã kết nối Facebook thành công.');
  } catch (e) {
    req.flash('error', `Lỗi kết nối: ${e.message}`);
  }
  res.redirect('/admin/aai-ads');
};

exports.aaiAdsSuggestPlan = async (req, res) => {
  try {
    const plan = await aaiAds.suggestCampaignPlan(req.body);
    res.json(plan);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsInterests = async (req, res) => {
  try {
    const results = await aaiAds.searchInterests(req.query.q || '');
    res.json(results);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsCreateCampaign = async (req, res) => {
  try {
    const body = req.body;
    // Không cần upload ảnh riêng cho Ad nữa — Ad giờ dùng CHÍNH bài viết công
    // khai đăng lên Page (link post), Facebook tự lấy ảnh preview từ thẻ OG
    // của link đích. Ảnh tải lên/imageUrl trong form chỉ còn mang tính tham
    // khảo cho thầy xem trước, không dùng để tạo Ad.
    let creative = null;
    if (body.pageId && body.linkUrl) {
      creative = {
        pageId: body.pageId,
        message: body.message || '',
        headline: body.headline || '',
        description: body.description || '',
        linkUrl: body.linkUrl || '',
        cta: body.cta || 'LEARN_MORE',
      };
    }

    const result = await aaiAds.createCampaignPlan({
      adAccountId: body.adAccountId,
      name: body.name,
      objective: body.objective,
      dailyBudget: parseFloat(body.dailyBudget),
      countries: (body.countries || 'VN').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean),
      ageMin: parseInt(body.ageMin, 10) || 18,
      ageMax: parseInt(body.ageMax, 10) || 65,
      gender: body.gender || 'all',
      pixelId: body.pixelId || null,
      interests: body.interests ? JSON.parse(body.interests) : [],
      lifetimeDays: body.lifetimeDays ? parseInt(body.lifetimeDays, 10) : null,
      creative,
    });
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ---------------- A-AI Ads — Đăng bài tự động ----------------
// Port từ tool desktop fb-ads-manager, chạy trên server luôn bật — xem ghi
// chú kiến trúc ở đầu services/aaiAdsService.js.

exports.aaiAdsWebsiteTargetAdd = (req, res) => {
  try {
    const { name, apiUrl, authToken, platform, wpUsername, wpAppPassword } = req.body;
    if (!name || !apiUrl) throw new Error('Vui lòng nhập tên và địa chỉ.');
    if (platform === 'wordpress' && (!wpUsername || !wpAppPassword)) {
      throw new Error('Web WordPress cần nhập Username và Application Password.');
    }
    const target = aaiAds.addWebsiteTarget({
      name,
      apiUrl,
      authToken: authToken || undefined,
      platform: platform === 'wordpress' ? 'wordpress' : 'node',
      wpUsername: platform === 'wordpress' ? wpUsername : undefined,
      wpAppPassword: platform === 'wordpress' ? wpAppPassword : undefined,
    });
    res.json(target);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsWebsiteTargetDelete = (req, res) => {
  aaiAds.deleteWebsiteTarget(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsSaveFrequency = (req, res) => {
  const { postsPerDay, minGapMinutes } = req.body;
  aaiAds.savePostingFreqSettings(parseInt(postsPerDay, 10) || 3, parseInt(minGapMinutes, 10) || 60);
  res.json({ ok: true });
};

exports.aaiAdsQueueAdd = (req, res) => {
  try {
    const item = aaiAds.addToPostingQueue(req.body);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsQueueDelete = (req, res) => {
  aaiAds.deleteFromPostingQueue(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsQueuePublishNow = async (req, res) => {
  try {
    const item = await aaiAds.publishQueueItemNow(req.params.id);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsGetPostingLog = (req, res) => {
  res.json(aaiAds.loadPostingLog());
};

exports.aaiAdsSaveAutoPostConfig = (req, res) => {
  try {
    aaiAds.saveAiAutoPostConfig(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// Điểm "cửa" chính để Claude (qua trình duyệt) hoặc thầy tự bấm — chạy NGAY cả
// hàng chờ thủ công đang tới hạn lẫn AI tự động đăng bài, không cần chờ bộ
// đếm giờ nền (5 phút/1 giờ).
exports.aaiAdsRunPostingNow = async (req, res) => {
  try {
    const result = await aaiAds.runAllPostingNow();
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ---------------- A-AI Ads — Tự động hóa (Automation rules) ----------------
// Port từ tool desktop fb-ads-manager — xem services/aaiAdsService.js.

exports.aaiAdsAutomationRules = (req, res) => {
  res.json(aaiAds.loadAutomationRules());
};

exports.aaiAdsAutomationSaveRule = (req, res) => {
  try {
    const body = req.body;
    const rule = aaiAds.saveAutomationRule({
      id: body.id || undefined,
      name: body.name,
      adAccountId: body.adAccountId,
      scope: body.scope || 'campaign',
      metric: body.metric,
      operator: body.operator,
      threshold: parseFloat(body.threshold),
      windowDays: parseInt(body.windowDays, 10) || 7,
      action: body.action,
      scalePercent: parseInt(body.scalePercent, 10) || 20,
      enabled: body.enabled !== false && body.enabled !== 'false',
    });
    res.json(rule);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsAutomationDeleteRule = (req, res) => {
  aaiAds.deleteAutomationRule(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsAutomationToggleRule = (req, res) => {
  try {
    const rules = aaiAds.loadAutomationRules();
    const existing = rules.find((r) => r.id === req.params.id);
    if (!existing) throw new Error('Không tìm thấy luật.');
    const rule = aaiAds.saveAutomationRule({ ...existing, enabled: !existing.enabled });
    res.json(rule);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsAutomationLog = (req, res) => {
  res.json(aaiAds.loadAutomationLog());
};

exports.aaiAdsAutomationRunNow = async (req, res) => {
  try {
    const result = await aaiAds.runAutomationCheck();
    res.json({ ok: true, triggered: result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ---------------- A-AI Ads — Lợi nhuận & CRM ----------------
// Port từ tool desktop fb-ads-manager — xem services/aaiAdsService.js.

exports.aaiAdsProductAdd = (req, res) => {
  try {
    const body = req.body;
    if (!body.name) throw new Error('Vui lòng nhập tên sản phẩm.');
    const product = aaiAds.addProduct({
      name: body.name,
      cost: parseFloat(body.cost) || 0,
      shippingCost: parseFloat(body.shippingCost) || 0,
      commissionPercent: parseFloat(body.commissionPercent) || 0,
    });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsProductDelete = (req, res) => {
  aaiAds.deleteProduct(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsOrderSourceAdd = (req, res) => {
  try {
    const { name, apiUrl, authToken } = req.body;
    if (!name || !apiUrl) throw new Error('Vui lòng nhập tên và địa chỉ API.');
    const source = aaiAds.addOrderSource({ name, apiUrl, authToken: authToken || undefined });
    res.json(source);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsOrderSourceDelete = (req, res) => {
  aaiAds.deleteOrderSource(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsOrderSourceSync = async (req, res) => {
  try {
    const result = await aaiAds.syncOrderSource(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsOrderAdd = (req, res) => {
  try {
    const body = req.body;
    if (!body.amount) throw new Error('Vui lòng nhập số tiền đơn hàng.');
    const order = aaiAds.addOrder({
      amount: parseFloat(body.amount),
      productId: body.productId || null,
      campaignName: body.campaignName || null,
      orderChannel: body.orderChannel || 'website',
      customerEmail: body.customerEmail || null,
      customerPhone: body.customerPhone || null,
      orderDate: body.orderDate || new Date().toISOString(),
    });
    res.json(order);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsOrderDelete = (req, res) => {
  aaiAds.deleteOrder(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsLeadAdd = (req, res) => {
  try {
    const body = req.body;
    if (!body.name) throw new Error('Vui lòng nhập tên khách hàng.');
    const lead = aaiAds.addLead({
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      source: body.source || 'manual',
      orderValue: parseFloat(body.orderValue) || 0,
    });
    res.json(lead);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsLeadAddBulk = (req, res) => {
  try {
    const added = aaiAds.addLeadsBulk(req.body.text || '');
    res.json({ added: added.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsLeadUpdateStatus = (req, res) => {
  const lead = aaiAds.updateLeadStatus(req.params.id, req.body.status);
  res.json(lead || { ok: false });
};

exports.aaiAdsLeadDelete = (req, res) => {
  aaiAds.deleteLead(req.params.id);
  res.json({ ok: true });
};

exports.aaiAdsProfitSummary = async (req, res) => {
  try {
    const { adAccountId, windowDays } = req.query;
    const summary = await aaiAds.computeProfitSummary(adAccountId, parseInt(windowDays, 10) || 30);
    res.json(summary);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ---------------- A-AI Ads — AI Decision Center + Learning Loop ----------------
// Port từ tool desktop fb-ads-manager — xem services/aaiAdsService.js.

exports.aaiAdsDecisionCenter = async (req, res) => {
  try {
    const { adAccountId, windowDays } = req.query;
    const result = await aaiAds.getDecisionCenter(adAccountId, parseInt(windowDays, 10) || 30);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsApplyRecommendation = async (req, res) => {
  try {
    const { adAccountId, campaignName, action } = req.body;
    const result = await aaiAds.applyDecisionRecommendation(adAccountId, campaignName, action);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.aaiAdsLearningInsights = async (req, res) => {
  try {
    const { adAccountId, windowDays } = req.query;
    const result = await aaiAds.getLearningInsights(adAccountId, parseInt(windowDays, 10) || 30);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
