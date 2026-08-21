const Course = require('../models/Course');
const Order = require('../models/Order');
const Enrollment = require('../models/Enrollment');
const paymentService = require('../services/paymentService');

exports.showCheckout = async (req, res, next) => {
  const course = await Course.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!course) return next();

  const alreadyEnrolled = await Enrollment.findOne({ where: { UserId: req.user.id, CourseId: course.id } });
  if (alreadyEnrolled) {
    req.flash('success', 'Ban da so huu khoa hoc nay.');
    return res.redirect(`/dashboard/learn/${course.slug}`);
  }

  res.render('courses/checkout', { title: `Thanh toan - ${course.title}`, course });
};

exports.startPayment = async (req, res, next) => {
  const course = await Course.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!course) return next();

  const amount = course.salePrice != null ? course.salePrice : course.price;

  const order = await Order.create({
    UserId: req.user.id,
    CourseId: course.id,
    amount,
    provider: paymentService.provider,
    transactionRef: paymentService.generateTransactionRef(),
  });

  const { redirectUrl } = await paymentService.createPayment({ order, req });
  res.redirect(redirectUrl);
};

// Mock provider: simulates a payment gateway confirmation page.
exports.mockPayPage = async (req, res, next) => {
  const order = await Order.findByPk(req.params.orderId, { include: [{ model: Course, as: 'course' }] });
  if (!order || order.UserId !== req.user.id) return next();
  if (order.status === 'paid') {
    return res.redirect(`/dashboard/learn/${order.course.slug}`);
  }
  res.render('courses/mock-pay', { title: 'Xac nhan thanh toan', order });
};

exports.mockPayConfirm = async (req, res, next) => {
  const order = await Order.findByPk(req.params.orderId, { include: [{ model: Course, as: 'course' }] });
  if (!order || order.UserId !== req.user.id) return next();

  if (order.status !== 'paid') {
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();

    await Enrollment.create({ UserId: req.user.id, CourseId: order.course.id, OrderId: order.id });
    await Course.increment('enrollmentCount', { by: 1, where: { id: order.course.id } });
  }

  req.flash('success', `Thanh toan thanh cong! Ban da co the hoc "${order.course.title}".`);
  res.redirect(`/dashboard/learn/${order.course.slug}`);
};
