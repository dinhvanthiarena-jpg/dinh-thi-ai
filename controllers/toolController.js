const Tool = require('../models/Tool');

function buildDownloadUrl(tool) {
  return tool.driveFileId
    ? `https://drive.google.com/uc?export=download&id=${tool.driveFileId}`
    : tool.driveUrl;
}

exports.list = async (req, res) => {
  const tools = await Tool.findAll({
    where: { isPublished: true },
    order: [['createdAt', 'DESC']],
  });

  res.render('tools/index', {
    title: 'Tool & Game',
    description: 'Kho ứng dụng, tool và game do Đinh Thi Ai xây dựng — tải miễn phí, dùng ngay.',
    tools,
  });
};

exports.show = async (req, res, next) => {
  const tool = await Tool.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!tool) return next();

  const related = await Tool.findAll({
    where: { isPublished: true },
    order: [['createdAt', 'DESC']],
    limit: 4,
  });

  res.render('tools/show', {
    title: tool.title,
    description: tool.shortDescription || tool.title,
    ogImage: tool.coverImageUrl,
    tool,
    downloadUrl: buildDownloadUrl(tool),
    relatedTools: related.filter((t) => t.id !== tool.id).slice(0, 3),
  });
};

exports.download = async (req, res, next) => {
  const tool = await Tool.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!tool) return next();

  await tool.increment('downloadCount', { by: 1 });
  res.redirect(buildDownloadUrl(tool));
};
