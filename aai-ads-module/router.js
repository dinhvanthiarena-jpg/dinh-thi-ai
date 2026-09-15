// A-AI Ads — module clone-able, portable version.
//
// CÁCH DÙNG (xem README.md để biết chi tiết đầy đủ):
//   const aaiAdsModule = require('./aai-ads-module');
//   app.use(aaiAdsModule());
//
// Module tự mount các route ở đúng đường dẫn /aai-ads/... (đã cố định trong
// view + code, KHÔNG đổi được qua tham số — nếu cần đường dẫn khác thì sửa
// trực tiếp views/aai-ads.ejs + router.js, tìm/thay toàn bộ '/aai-ads').
//
// Yêu cầu môi trường của HOST APP (server Express đang chạy app.use() này):
//   - Đã cài package 'ejs' (npm install ejs) — module tự require + renderFile,
//     KHÔNG phụ thuộc app.set('view engine', ...) của host, nên dùng được dù
//     host là EJS/Pug/không dùng template engine nào cả.
//   - express.json() và express.urlencoded() đã bật cho toàn app (hoặc ít
//     nhất cho đường dẫn /aai-ads) — cần để đọc req.body của các form/API.
//
// Biến môi trường CẦN THIẾT (đặt trong Setup Node.js App -> Environment
// variables của hosting, hoặc .env khi chạy local):
//   AAI_FB_APP_ID, AAI_FB_APP_SECRET  — Facebook Developer App CỦA RIÊNG
//     khách hàng này (mỗi khách tự tạo App riêng trên developers.facebook.com,
//     tự chịu trách nhiệm Fanpage/quảng cáo của họ — đúng mô hình tự phục vụ
//     thầy đã chốt, KHÔNG dùng chung App với thầy hay khách khác).
//   ANTHROPIC_API_KEY                — key Claude API (bắt buộc, dùng để viết
//     bài + phân tích AI Decision Center).
//   PIXABAY_API_KEY                  — (tùy chọn) để tự tìm ảnh minh họa; nếu
//     bỏ trống, tính năng đăng bài vẫn chạy nhưng không tự kèm ảnh.
//   AAI_LICENSE_VERIFY_URL           — (tùy chọn) mặc định trỏ về server của
//     thầy để xác thực key kích hoạt; chỉ đổi nếu thầy chuyển server trung tâm.
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const aaiAds = require('./service');
const activation = require('./activation');

const VIEW_PATH = path.join(__dirname, 'views', 'aai-ads.ejs');

function renderAaiAdsPage(res, data) {
  ejs
    .renderFile(VIEW_PATH, data)
    .then((html) => res.send(html))
    .catch((err) => {
      console.error('[aai-ads-module] render error', err);
      res.status(500).send('Lỗi hiển thị trang A-AI Ads: ' + err.message);
    });
}

const aaiAdsPage = async (req, res) => {
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
  renderAaiAdsPage(res, {
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

const aaiAdsConnect = (req, res) => {
  res.redirect(aaiAds.buildAuthUrl(req));
};

const aaiAdsCallback = async (req, res) => {
  const { code, error_description } = req.query;
  if (error_description) {
    if (typeof req.flash === 'function') req.flash('error', `Kết nối Facebook thất bại: ${error_description}`);
    return res.redirect('/aai-ads');
  }
  if (!code) {
    if (typeof req.flash === 'function') req.flash('error', 'Không nhận được mã xác thực từ Facebook.');
    return res.redirect('/aai-ads');
  }
  try {
    await aaiAds.exchangeCodeForToken(req, code);
    if (typeof req.flash === 'function') req.flash('success', 'Đã kết nối Facebook thành công.');
  } catch (e) {
    if (typeof req.flash === 'function') req.flash('error', `Lỗi kết nối: ${e.message}`);
  }
  res.redirect('/aai-ads');
};

const aaiAdsSuggestPlan = async (req, res) => {
  try {
    const plan = await aaiAds.suggestCampaignPlan(req.body);
    res.json(plan);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsInterests = async (req, res) => {
  try {
    const results = await aaiAds.searchInterests(req.query.q || '');
    res.json(results);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsCreateCampaign = async (req, res) => {
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

const aaiAdsWebsiteTargetAdd = (req, res) => {
  try {
    const { name, apiUrl, authToken } = req.body;
    if (!name || !apiUrl) throw new Error('Vui lòng nhập tên và địa chỉ API.');
    const target = aaiAds.addWebsiteTarget({ name, apiUrl, authToken: authToken || undefined });
    res.json(target);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsWebsiteTargetDelete = (req, res) => {
  aaiAds.deleteWebsiteTarget(req.params.id);
  res.json({ ok: true });
};

const aaiAdsSaveFrequency = (req, res) => {
  const { postsPerDay, minGapMinutes } = req.body;
  aaiAds.savePostingFreqSettings(parseInt(postsPerDay, 10) || 3, parseInt(minGapMinutes, 10) || 60);
  res.json({ ok: true });
};

const aaiAdsQueueAdd = (req, res) => {
  try {
    const item = aaiAds.addToPostingQueue(req.body);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsQueueDelete = (req, res) => {
  aaiAds.deleteFromPostingQueue(req.params.id);
  res.json({ ok: true });
};

const aaiAdsQueuePublishNow = async (req, res) => {
  try {
    const item = await aaiAds.publishQueueItemNow(req.params.id);
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsGetPostingLog = (req, res) => {
  res.json(aaiAds.loadPostingLog());
};

const aaiAdsSaveAutoPostConfig = (req, res) => {
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
const aaiAdsRunPostingNow = async (req, res) => {
  try {
    const result = await aaiAds.runAllPostingNow();
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ---------------- A-AI Ads — Tự động hóa (Automation rules) ----------------
// Port từ tool desktop fb-ads-manager — xem services/aaiAdsService.js.

const aaiAdsAutomationRules = (req, res) => {
  res.json(aaiAds.loadAutomationRules());
};

const aaiAdsAutomationSaveRule = (req, res) => {
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

const aaiAdsAutomationDeleteRule = (req, res) => {
  aaiAds.deleteAutomationRule(req.params.id);
  res.json({ ok: true });
};

const aaiAdsAutomationToggleRule = (req, res) => {
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

const aaiAdsAutomationLog = (req, res) => {
  res.json(aaiAds.loadAutomationLog());
};

const aaiAdsAutomationRunNow = async (req, res) => {
  try {
    const result = await aaiAds.runAutomationCheck();
    res.json({ ok: true, triggered: result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ---------------- A-AI Ads — Lợi nhuận & CRM ----------------
// Port từ tool desktop fb-ads-manager — xem services/aaiAdsService.js.

const aaiAdsProductAdd = (req, res) => {
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

const aaiAdsProductDelete = (req, res) => {
  aaiAds.deleteProduct(req.params.id);
  res.json({ ok: true });
};

const aaiAdsOrderSourceAdd = (req, res) => {
  try {
    const { name, apiUrl, authToken } = req.body;
    if (!name || !apiUrl) throw new Error('Vui lòng nhập tên và địa chỉ API.');
    const source = aaiAds.addOrderSource({ name, apiUrl, authToken: authToken || undefined });
    res.json(source);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsOrderSourceDelete = (req, res) => {
  aaiAds.deleteOrderSource(req.params.id);
  res.json({ ok: true });
};

const aaiAdsOrderSourceSync = async (req, res) => {
  try {
    const result = await aaiAds.syncOrderSource(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsOrderAdd = (req, res) => {
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

const aaiAdsOrderDelete = (req, res) => {
  aaiAds.deleteOrder(req.params.id);
  res.json({ ok: true });
};

const aaiAdsLeadAdd = (req, res) => {
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

const aaiAdsLeadAddBulk = (req, res) => {
  try {
    const added = aaiAds.addLeadsBulk(req.body.text || '');
    res.json({ added: added.length });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsLeadUpdateStatus = (req, res) => {
  const lead = aaiAds.updateLeadStatus(req.params.id, req.body.status);
  res.json(lead || { ok: false });
};

const aaiAdsLeadDelete = (req, res) => {
  aaiAds.deleteLead(req.params.id);
  res.json({ ok: true });
};

const aaiAdsProfitSummary = async (req, res) => {
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

const aaiAdsDecisionCenter = async (req, res) => {
  try {
    const { adAccountId, windowDays } = req.query;
    const result = await aaiAds.getDecisionCenter(adAccountId, parseInt(windowDays, 10) || 30);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsApplyRecommendation = async (req, res) => {
  try {
    const { adAccountId, campaignName, action } = req.body;
    const result = await aaiAds.applyDecisionRecommendation(adAccountId, campaignName, action);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const aaiAdsLearningInsights = async (req, res) => {
  try {
    const { adAccountId, windowDays } = req.query;
    const result = await aaiAds.getLearningInsights(adAccountId, parseInt(windowDays, 10) || 30);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = function createAaiAdsRouter() {
  const router = express.Router();

  // Route kích hoạt — KHÔNG qua gate (chính nó là cửa kích hoạt).
  router.get('/aai-ads/activate', (req, res) => {
    res.send(activation.renderActivationPage());
  });
  router.post('/aai-ads/activate', express.urlencoded({ extended: true }), async (req, res) => {
    const result = await activation.activate((req.body.key || '').trim());
    if (result.ok) return res.redirect('/aai-ads');
    res.status(400).send(activation.renderActivationPage(result.error));
  });

  // Mọi route A-AI Ads khác đều qua gate license trước.
  router.use('/aai-ads', activation.requireActivation());

  router.get('/aai-ads', aaiAdsPage);
  router.get('/aai-ads/connect', aaiAdsConnect);
  router.get('/aai-ads/callback', aaiAdsCallback);
  router.post('/aai-ads/suggest-plan', aaiAdsSuggestPlan);
  router.get('/aai-ads/interests', aaiAdsInterests);
  router.post('/aai-ads/create-campaign', aaiAdsCreateCampaign);

  router.post('/aai-ads/website-targets', aaiAdsWebsiteTargetAdd);
  router.post('/aai-ads/website-targets/:id/delete', aaiAdsWebsiteTargetDelete);
  router.post('/aai-ads/frequency', aaiAdsSaveFrequency);
  router.post('/aai-ads/queue', aaiAdsQueueAdd);
  router.post('/aai-ads/queue/:id/delete', aaiAdsQueueDelete);
  router.post('/aai-ads/queue/:id/publish-now', aaiAdsQueuePublishNow);
  router.get('/aai-ads/posting-log', aaiAdsGetPostingLog);
  router.post('/aai-ads/autopost-config', aaiAdsSaveAutoPostConfig);
  router.post('/aai-ads/run-now', aaiAdsRunPostingNow);

  router.get('/aai-ads/automation/rules', aaiAdsAutomationRules);
  router.post('/aai-ads/automation/rules', aaiAdsAutomationSaveRule);
  router.post('/aai-ads/automation/rules/:id/delete', aaiAdsAutomationDeleteRule);
  router.post('/aai-ads/automation/rules/:id/toggle', aaiAdsAutomationToggleRule);
  router.get('/aai-ads/automation/log', aaiAdsAutomationLog);
  router.post('/aai-ads/automation/run-now', aaiAdsAutomationRunNow);

  router.post('/aai-ads/crm/products', aaiAdsProductAdd);
  router.post('/aai-ads/crm/products/:id/delete', aaiAdsProductDelete);
  router.post('/aai-ads/crm/order-sources', aaiAdsOrderSourceAdd);
  router.post('/aai-ads/crm/order-sources/:id/delete', aaiAdsOrderSourceDelete);
  router.post('/aai-ads/crm/order-sources/:id/sync', aaiAdsOrderSourceSync);
  router.post('/aai-ads/crm/orders', aaiAdsOrderAdd);
  router.post('/aai-ads/crm/orders/:id/delete', aaiAdsOrderDelete);
  router.post('/aai-ads/crm/leads', aaiAdsLeadAdd);
  router.post('/aai-ads/crm/leads/bulk', aaiAdsLeadAddBulk);
  router.post('/aai-ads/crm/leads/:id/status', aaiAdsLeadUpdateStatus);
  router.post('/aai-ads/crm/leads/:id/delete', aaiAdsLeadDelete);
  router.get('/aai-ads/crm/profit-summary', aaiAdsProfitSummary);

  router.get('/aai-ads/decision-center', aaiAdsDecisionCenter);
  router.post('/aai-ads/decision-center/apply', aaiAdsApplyRecommendation);
  router.get('/aai-ads/learning-insights', aaiAdsLearningInsights);

  return router;
};
