const CourseRegistration = require('../models/CourseRegistration');

function nextSundayLabel() {
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  return sunday.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
}

exports.showForm = (req, res) => {
  res.render('dang-ky-hoc-mien-phi', {
    title: 'Đăng ký học miễn phí — Kiếm Tiền AFF với AI Tự Động Hoá',
    old: {},
    errors: [],
    success: false,
    eventDate: nextSundayLabel(),
  });
};

exports.submit = async (req, res) => {
  const { name, phone, email, zalo, note } = req.body;

  if (!name || !phone) {
    return res.status(400).render('dang-ky-hoc-mien-phi', {
      title: 'Đăng ký học miễn phí — Kiếm Tiền AFF với AI Tự Động Hoá',
      old: req.body,
      errors: [{ msg: 'Vui lòng điền đầy đủ họ tên và số điện thoại.' }],
      success: false,
      eventDate: nextSundayLabel(),
    });
  }

  await CourseRegistration.create({ name, phone, email, zalo, note });
  res.render('dang-ky-hoc-mien-phi', {
    title: 'Đăng ký học miễn phí — Kiếm Tiền AFF với AI Tự Động Hoá',
    old: {},
    errors: [],
    success: true,
    eventDate: nextSundayLabel(),
  });
};
