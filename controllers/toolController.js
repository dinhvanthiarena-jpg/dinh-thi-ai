const Tool = require('../models/Tool');
const ToolLicense = require('../models/ToolLicense');
const wallet = require('../services/walletService');

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

  // "Công cụ" tách riêng lên đầu trang, đứng 1 mình giữa màn hình — khác hẳn
  // Ứng dụng/Game (đám học tập cho học viên) nên cần nổi bật riêng, không
  // trộn chung lưới (yêu cầu 2026-09-24).
  const congCu = tools.filter((t) => t.category === 'Công cụ');
  const conLai = tools.filter((t) => t.category !== 'Công cụ');

  res.render('tools/index', {
    title: 'Tool & Game',
    description: 'Kho ứng dụng, tool và game do Vietpro xây dựng — tải miễn phí, dùng ngay.',
    congCu,
    conLai,
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

  let license = null;
  if (tool.price > 0 && req.user) {
    license = await ToolLicense.findOne({ where: { UserId: req.user.id, ToolId: tool.id } });
  }

  res.render('tools/show', {
    title: tool.title,
    description: tool.shortDescription || tool.title,
    ogImage: tool.coverImageUrl,
    tool,
    downloadUrl: buildDownloadUrl(tool),
    relatedTools: related.filter((t) => t.id !== tool.id).slice(0, 3),
    license,
    soDu: req.user ? wallet.soDu(req.user) : 0,
  });
};

exports.download = async (req, res, next) => {
  const tool = await Tool.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!tool) return next();

  if (tool.price > 0) {
    if (!req.user) {
      req.flash('error', 'Đăng nhập để mua tool này.');
      return res.redirect(`/auth/login?next=${encodeURIComponent(`/kho-tai-nguyen/${tool.slug}`)}`);
    }
    const owned = await ToolLicense.findOne({ where: { UserId: req.user.id, ToolId: tool.id } });
    if (!owned) {
      req.flash('error', 'Bạn cần mua tool này trước khi tải về.');
      return res.redirect(`/kho-tai-nguyen/${tool.slug}`);
    }
  }

  await tool.increment('downloadCount', { by: 1 });
  res.redirect(buildDownloadUrl(tool));
};

exports.buy = async (req, res, next) => {
  const tool = await Tool.findOne({ where: { slug: req.params.slug, isPublished: true } });
  if (!tool) return next();

  try {
    const { license, daSoHuu } = await wallet.muaTool(req.user, tool);
    req.flash('success', daSoHuu ? 'Bạn đã sở hữu tool này rồi.' : `Mua thành công! Key của bạn: ${license.licenseKey}`);
  } catch (err) {
    req.flash('error', err.message);
  }
  res.redirect(`/kho-tai-nguyen/${tool.slug}`);
};
