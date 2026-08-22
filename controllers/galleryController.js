const GalleryPhoto = require('../models/GalleryPhoto');

exports.list = async (req, res) => {
  const photos = await GalleryPhoto.findAll({
    where: { isPublished: true },
    order: [['eventDate', 'DESC']],
  });

  res.render('gallery', {
    title: 'Hoạt động',
    description: 'Hình ảnh các buổi giảng dạy, sự kiện và hoạt động thực tế cùng chuyên gia Đinh Thi Ai.',
    photos,
  });
};
