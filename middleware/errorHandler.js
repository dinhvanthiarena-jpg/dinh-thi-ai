function notFound(req, res) {
  res.status(404).render('errors/404', { title: 'Khong tim thay trang' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('[error]', err);
  const status = err.status || 500;
  res.status(status).render('errors/500', {
    title: 'Da co loi xay ra',
    message: process.env.NODE_ENV === 'production' ? 'Vui long thu lai sau.' : err.message,
  });
}

module.exports = { notFound, errorHandler };
