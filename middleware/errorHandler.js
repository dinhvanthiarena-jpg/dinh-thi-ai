function notFound(req, res) {
  res.status(404).render('errors/404', { title: 'Không tìm thấy trang' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).render('errors/500', {
    title: 'Đã có lỗi xảy ra',
    message: process.env.NODE_ENV === 'production' ? 'Vui lòng thử lại sau.' : err.message,
  });
}

module.exports = { notFound, errorHandler };
