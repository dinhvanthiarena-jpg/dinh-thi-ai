const ContactMessage = require('../models/ContactMessage');

exports.showForm = (req, res) => {
  res.render('contact', { title: 'Liên hệ tư vấn', old: {}, errors: [] });
};

exports.submit = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).render('contact', {
      title: 'Liên hệ tư vấn',
      old: req.body,
      errors: [{ msg: 'Vui lòng điền đầy đủ họ tên, email và nội dung.' }],
    });
  }

  await ContactMessage.create({ name, email, phone, subject, message });
  req.flash('success', 'Cảm ơn bạn đã liên hệ! Đội ngũ Đinh Thi Ai sẽ phản hồi trong 24h.');
  res.redirect('/lien-he');
};
