const ContactMessage = require('../models/ContactMessage');

exports.showForm = (req, res) => {
  res.render('contact', { title: 'Lien he tu van', old: {}, errors: [] });
};

exports.submit = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).render('contact', {
      title: 'Lien he tu van',
      old: req.body,
      errors: [{ msg: 'Vui long dien day du ho ten, email va noi dung.' }],
    });
  }

  await ContactMessage.create({ name, email, phone, subject, message });
  req.flash('success', 'Cam on ban da lien he! Doi ngu Dinh Thi Ai se phan hoi trong 24h.');
  res.redirect('/lien-he');
};
