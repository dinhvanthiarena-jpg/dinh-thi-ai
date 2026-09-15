// Web-based Facebook Ads campaign creator for /admin/aai-ads — a server-side
// port of the campaign-creation slice of the A-AI-3dvietpro Electron tool
// (D:\CLAUDE CODE\fb-ads-manager\main.js), so Claude can operate it directly
// via browser automation instead of only guiding thầy through the desktop UI.
//
// IMPORTANT: keep this in sync with fb-ads-manager/main.js whenever the
// campaign-creation logic changes there (objective mapping, targeting shape,
// UTM auto-tagging, naming) — thầy explicitly asked for the desktop tool and
// this web version to not drift apart.
//
// Security note (told to thầy before building this): the desktop tool keeps
// every credential local-only. This web version stores the Facebook access
// token server-side instead (data/aai-ads-config.json, admin-auth gated) —
// a deliberate trade-off so this page can be operated as a normal web page.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const GRAPH_VERSION = 'v21.0';
const CLAUDE_MODEL = 'claude-sonnet-5';
const CONFIG_PATH = path.join(__dirname, '..', 'data', 'aai-ads-config.json');

// Same Facebook Developer App thầy already uses for the desktop tool ("Ads
// Manager - DT") — reusing it means no new Facebook App to create, just an
// extra OAuth redirect URI registered on the existing one.
const FB_APP_ID = '918992840963509';
const FB_APP_SECRET = '90408a22c48a2f88e5cc4da769c54857';

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveConfig(partial) {
  const current = loadConfig();
  const next = { ...current, ...partial };
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2));
  return next;
}

async function graphRequest(pathAndQuery, method = 'GET', bodyParams = null) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}${pathAndQuery}`;
  const opts = { method };
  if (bodyParams) {
    opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    opts.body = new URLSearchParams(bodyParams).toString();
  }
  const res = await fetch(url, opts);
  const json = await res.json();
  if (json.error) {
    console.error('[aaiAdsService] Graph API error', pathAndQuery.split('?')[0], JSON.stringify(json.error));
    throw new Error(json.error.error_user_msg || json.error.message);
  }
  return json;
}

function oauthRedirectUri(req) {
  return `https://${req.get('host')}/admin/aai-ads/callback`;
}

function buildAuthUrl(req) {
  const scope = ['ads_management', 'ads_read', 'business_management', 'pages_show_list', 'pages_read_engagement', 'pages_manage_posts'].join(',');
  return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(oauthRedirectUri(req))}&scope=${scope}&response_type=code`;
}

async function exchangeCodeForToken(req, code) {
  const redirectUri = oauthRedirectUri(req);
  const shortLived = await graphRequest(
    `/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${FB_APP_SECRET}&code=${code}`
  );
  const longLived = await graphRequest(
    `/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${shortLived.access_token}`
  );
  const expiresAt = Date.now() + (longLived.expires_in || 5184000) * 1000;
  saveConfig({ accessToken: longLived.access_token, tokenExpiresAt: expiresAt });
  return { connected: true, expiresAt };
}

function isConnected() {
  const config = loadConfig();
  return !!config.accessToken;
}

function requireToken() {
  const config = loadConfig();
  if (!config.accessToken) throw new Error('Chưa kết nối Facebook — bấm "Kết nối Facebook" trước.');
  return config.accessToken;
}

async function listAdAccounts() {
  const accessToken = requireToken();
  const result = await graphRequest(`/me/adaccounts?fields=id,name,account_status,currency&access_token=${accessToken}`);
  return result.data || [];
}

async function listPages() {
  const accessToken = requireToken();
  const result = await graphRequest(`/me/accounts?fields=id,name,fan_count&access_token=${accessToken}`);
  return result.data || [];
}

async function getPageAccessToken(pageId) {
  const accessToken = requireToken();
  const result = await graphRequest(`/me/accounts?fields=id,access_token&access_token=${accessToken}`);
  const page = (result.data || []).find((p) => p.id === pageId);
  if (!page) throw new Error('Không tìm thấy quyền quản trị Page này — có thể cần kết nối lại Facebook để cấp thêm quyền pages_manage_posts.');
  return page.access_token;
}

// Đăng 1 bài công khai (kèm link) lên Page thật, dùng bài đó làm Ad — né được
// hạn chế "bài viết ẩn (dark post) phải công khai" của Facebook khi App đang
// ở chế độ Đang phát triển (chưa qua App Review).
async function publishPageLinkPost(pageId, message, link) {
  const pageAccessToken = await getPageAccessToken(pageId);
  const result = await graphRequest(`/${pageId}/feed`, 'POST', {
    message,
    link,
    access_token: pageAccessToken,
  });
  return result.id; // dạng "{page_id}_{post_id}", dùng làm object_story_id cho Ad Creative
}

async function searchInterests(query) {
  const accessToken = requireToken();
  const result = await graphRequest(`/search?type=adinterest&q=${encodeURIComponent(query)}&limit=15&access_token=${accessToken}`);
  return result.data || [];
}

async function uploadImage(adAccountId, base64Data) {
  const accessToken = requireToken();
  const result = await graphRequest(`/${adAccountId}/adimages`, 'POST', { bytes: base64Data, access_token: accessToken });
  const images = result.images || {};
  const firstKey = Object.keys(images)[0];
  if (!firstKey) throw new Error('Không nhận được ảnh từ Facebook.');
  return { hash: images[firstKey].hash, url: images[firstKey].url };
}

// ---------------- Đăng bài tự động (port từ fb-ads-manager/main.js) ----------------
// Khác với tool desktop (phải mở app mới chạy tự động hóa nền), service này
// chạy TRONG server luôn bật của web dinh-thi-ai — nên bộ đếm giờ AI tự động
// đăng bài / xử lý hàng chờ chạy độc lập, không cần ai mở trang admin.
// Đây cũng là "cửa" để Claude (qua trình duyệt) tự vào đăng bài thay vì chỉ
// hướng dẫn thầy bấm trong app desktop — thầy yêu cầu đồng bộ 2026-09-12.

const WEBSITE_TARGETS_PATH = path.join(__dirname, '..', 'data', 'aai-ads-website-targets.json');
const POSTING_QUEUE_PATH = path.join(__dirname, '..', 'data', 'aai-ads-posting-queue.json');
const POSTING_LOG_PATH = path.join(__dirname, '..', 'data', 'aai-ads-posting-log.json');

function readJsonArray(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return [];
  }
}
function writeJsonArray(filePath, arr) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(arr, null, 2));
}

function loadWebsiteTargets() {
  return readJsonArray(WEBSITE_TARGETS_PATH);
}
function saveWebsiteTargets(list) {
  writeJsonArray(WEBSITE_TARGETS_PATH, list);
}
function addWebsiteTarget(target) {
  const list = loadWebsiteTargets();
  target.id = crypto.randomUUID();
  list.push(target);
  saveWebsiteTargets(list);
  return target;
}
function deleteWebsiteTarget(id) {
  saveWebsiteTargets(loadWebsiteTargets().filter((t) => t.id !== id));
}

function loadPostingQueue() {
  return readJsonArray(POSTING_QUEUE_PATH);
}
function savePostingQueue(list) {
  writeJsonArray(POSTING_QUEUE_PATH, list);
}
function loadPostingLog() {
  return readJsonArray(POSTING_LOG_PATH);
}
function appendPostingLog(entries) {
  const log = [...entries, ...loadPostingLog()].slice(0, 300);
  writeJsonArray(POSTING_LOG_PATH, log);
}

function getPostingFreqSettings() {
  const config = loadConfig();
  return { postsPerDay: config.postFreqPerDay || 3, minGapMinutes: config.postFreqGapMinutes || 60 };
}
function savePostingFreqSettings(postsPerDay, minGapMinutes) {
  saveConfig({ postFreqPerDay: postsPerDay, postFreqGapMinutes: minGapMinutes });
}

function targetPostCountToday(targetId) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return loadPostingLog().filter((e) => e.targetId === targetId && e.status === 'posted' && e.time >= startOfToday.getTime()).length;
}
function minutesSinceLastPost(targetId) {
  const last = loadPostingLog().find((e) => e.targetId === targetId && e.status === 'posted');
  if (!last) return Infinity;
  return (Date.now() - last.time) / 60000;
}
function canPostToTargetNow(targetId, freq) {
  if (targetPostCountToday(targetId) >= freq.postsPerDay) return false;
  if (minutesSinceLastPost(targetId) < freq.minGapMinutes) return false;
  return true;
}

// Đăng 1 bài (chữ + ảnh tùy chọn) lên Page/Group thật — khác publishPageLinkPost
// ở trên (dành riêng cho tạo Ad), hàm này dùng cho đăng bài thường.
async function publishToTarget(pageToken, targetId, targetType, item) {
  const caption = item.link ? `${item.message || ''}\n\n${item.link}` : item.message || '';
  try {
    let result;
    if (item.imageBase64) {
      const buffer = Buffer.from(item.imageBase64, 'base64');
      const form = new FormData();
      form.append('caption', caption);
      form.append('access_token', pageToken);
      form.append('source', new Blob([buffer]), 'image.jpg');
      const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${targetId}/photos`, { method: 'POST', body: form });
      result = await res.json();
      if (result.error) throw new Error(result.error.message);
    } else {
      result = await graphRequest(`/${targetId}/feed`, 'POST', { message: caption, access_token: pageToken });
    }
    return { ok: true, postId: result.post_id || result.id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// Đăng lên 1 website tùy ý qua API — cùng chuẩn payload JSON với tool desktop
// ({title, content, link, imageBase64}) để 1 website chỉ cần code 1 endpoint
// dùng chung được cho cả 2 nơi.
async function postToWebsite(target, item) {
  try {
    const res = await fetch(target.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(target.authToken ? { Authorization: `Bearer ${target.authToken}` } : {}),
      },
      body: JSON.stringify({
        title: item.headline || (item.message || '').slice(0, 60),
        content: item.message || '',
        link: item.link || null,
        imageBase64: item.imageBase64 || null,
      }),
    });
    if (res.ok) return { ok: true };
    const text = await res.text().catch(() => '');
    return { ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function downloadImageAsBase64(imgUrl) {
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`Tải ảnh thất bại: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString('base64');
}

// Tự tìm 1 ảnh stock miễn phí khớp chủ đề — dùng LẠI process.env.PIXABAY_API_KEY
// đã có sẵn trên server này cho newsFactoryService (xem
// project_dinh-thi-ai_newsfactory_images), KHÔNG cần thêm Pexels key riêng
// như bên tool desktop vì server đã có sẵn nguồn ảnh tương đương.
async function findStockPhotoBase64(query) {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return null;
  try {
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&safesearch=true&per_page=5`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const hit = (data.hits || [])[0];
    if (!hit) return null;
    return await downloadImageAsBase64(hit.largeImageURL || hit.webformatURL);
  } catch (e) {
    return null;
  }
}

// ---- Hàng chờ đăng bài thủ công ----

function addToPostingQueue(item) {
  const queue = loadPostingQueue();
  item.id = crypto.randomUUID();
  item.status = 'pending';
  item.createdAt = Date.now();
  item.targetResults = {};
  queue.unshift(item);
  savePostingQueue(queue);
  return item;
}
function deleteFromPostingQueue(id) {
  savePostingQueue(loadPostingQueue().filter((i) => i.id !== id));
}
async function publishQueueItemNow(id) {
  const queue = loadPostingQueue();
  const item = queue.find((i) => i.id === id);
  if (!item) throw new Error('Không tìm thấy bài trong hàng chờ.');
  item.scheduledTime = 0;
  savePostingQueue(queue);
  await processPostingQueue();
  return loadPostingQueue().find((i) => i.id === id);
}

async function processPostingQueue() {
  const config = loadConfig();
  if (!config.accessToken) return;
  const queue = loadPostingQueue();
  if (!queue.length) return;
  const freq = getPostingFreqSettings();
  const newLogEntries = [];
  let changed = false;

  for (const item of queue) {
    if (item.status === 'posted' || item.status === 'cancelled') continue;
    if (item.scheduledTime && item.scheduledTime > Date.now()) continue;

    item.targetResults = item.targetResults || {};
    let pageToken;
    try {
      pageToken = await getPageAccessToken(item.pageId);
    } catch (e) {
      continue; // thử lại lượt sau
    }

    const allTargets = [
      { id: item.pageId, name: item.pageName, type: 'page' },
      ...(item.groupTargets || []).map((g) => ({ ...g, type: 'group' })),
      ...(item.websiteTargets || []).map((w) => ({ ...w, type: 'website' })),
    ];

    for (const target of allTargets) {
      if (item.targetResults[target.id] && item.targetResults[target.id].status === 'posted') continue;
      if (!canPostToTargetNow(target.id, freq)) continue;
      const result = target.type === 'website' ? await postToWebsite(target, item) : await publishToTarget(pageToken, target.id, target.type, item);
      changed = true;
      if (result.ok) {
        item.targetResults[target.id] = { status: 'posted' };
        newLogEntries.push({ time: Date.now(), targetId: target.id, targetName: target.name, status: 'posted', source: 'manual-queue' });
      } else if (target.type === 'group') {
        item.targetResults[target.id] = { status: 'needs_manual', error: result.error };
        newLogEntries.push({ time: Date.now(), targetId: target.id, targetName: target.name, status: 'needs_manual', error: result.error, source: 'manual-queue' });
      } else {
        item.targetResults[target.id] = { status: 'error', error: result.error };
        newLogEntries.push({ time: Date.now(), targetId: target.id, targetName: target.name, status: 'error', error: result.error, source: 'manual-queue' });
      }
    }

    const allHandled = allTargets.every((t) => ['posted', 'needs_manual', 'error'].includes((item.targetResults[t.id] || {}).status));
    if (allHandled) item.status = 'posted';
  }

  if (changed) savePostingQueue(queue);
  if (newLogEntries.length) appendPostingLog(newLogEntries);
}

// ---- AI tự động đăng bài hàng ngày ----

function getAiAutoPostConfig() {
  const config = loadConfig();
  return {
    enabled: !!config.aiAutoPostEnabled,
    topic: config.aiAutoPostTopic || '',
    pageIds: config.aiAutoPostPageIds || [],
    pageNames: config.aiAutoPostPageNames || [],
    link: config.aiAutoPostLink || '',
    websiteTargetIds: config.aiAutoPostWebsiteTargetIds || [],
    groupIds: config.aiAutoPostGroupIds || [],
  };
}
function saveAiAutoPostConfig(partial) {
  saveConfig({
    aiAutoPostEnabled: !!partial.enabled,
    aiAutoPostTopic: partial.topic || '',
    aiAutoPostPageIds: partial.pageIds || [],
    aiAutoPostPageNames: partial.pageNames || [],
    aiAutoPostLink: partial.link || '',
    aiAutoPostWebsiteTargetIds: partial.websiteTargetIds || [],
    aiAutoPostGroupIds: partial.groupIds || [],
  });
}

async function runAiAutoPost() {
  const config = loadConfig();
  if (!config.aiAutoPostEnabled) return;
  if (!config.accessToken) return;
  const pageIds = config.aiAutoPostPageIds || [];
  const pageNames = config.aiAutoPostPageNames || [];
  if (!config.aiAutoPostTopic || !pageIds.length) return;

  const freq = getPostingFreqSettings();
  const websiteTargets = loadWebsiteTargets().filter((t) => (config.aiAutoPostWebsiteTargetIds || []).includes(t.id));
  const groupTargets = (config.aiAutoPostGroupIds || []).map((id) => ({ id, type: 'group', name: `Group ${id}` }));
  const pageTargets = pageIds.map((id, i) => ({ id, type: 'page', name: pageNames[i] || 'Fanpage' }));
  const allTargets = [...pageTargets, ...websiteTargets.map((w) => ({ ...w, type: 'website' })), ...groupTargets];

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const triedTodayIds = new Set(
    loadPostingLog()
      .filter((e) => e.source === 'ai-autopost' && e.status === 'needs_manual' && e.time >= startOfToday.getTime())
      .map((e) => e.targetId)
  );
  const dueTargets = allTargets.filter((t) => !triedTodayIds.has(t.id) && canPostToTargetNow(t.id, freq));
  if (!dueTargets.length) return;

  const recentTitles = loadPostingLog()
    .filter((e) => e.source === 'ai-autopost' && e.articleTitle)
    .slice(0, 5)
    .map((e) => `- ${e.articleTitle}`)
    .join('\n');

  // Tự tra cứu web (web_search tool của Claude API) để bài viết dựa trên tin
  // tức/xu hướng THẬT mới nhất — nhưng bắt buộc viết lại 100% văn phong riêng,
  // không copy nguyên câu của nguồn tìm được (tránh bản quyền + tránh bị
  // Google coi là nội dung "biên soạn lại" và hạ thứ hạng).
  let fbCaption, articleTitle, articleContent;
  try {
    const system = `Bạn là chuyên gia content marketing kiêm biên tập viên công nghệ. Dùng công cụ tìm kiếm web để tra cứu tin tức/bài viết MỚI NHẤT, nổi bật nhất về chủ đề được giao. Sau đó TỰ VIẾT một bài hoàn toàn mới bằng văn phong, cách diễn đạt của riêng bạn — dựa trên thông tin/xu hướng tìm được để bài viết cập nhật và có giá trị thật, nhưng TUYỆT ĐỐI không sao chép nguyên câu/đoạn văn từ bất kỳ nguồn nào.
Trả lời CHỈ bằng 1 khối JSON hợp lệ, không markdown, không code fence, không giải thích gì thêm, đúng format sau:
{"articleTitle": "tiêu đề bài viết cho website, hấp dẫn, tối đa 70 ký tự", "articleContent": "nội dung bài viết đầy đủ cho website, khoảng 400-600 chữ, chia đoạn bằng \\n\\n, văn phong tự nhiên và có thông tin thật", "fbCaption": "bản tóm tắt ngắn 3-5 câu để đăng Facebook, hấp dẫn, có thể dùng 1-2 emoji phù hợp, tối đa 2-3 hashtag"}`;
    const userMessage = `Chủ đề/sản phẩm/dịch vụ cần quảng bá: ${config.aiAutoPostTopic}${
      recentTitles ? `\n\nCác bài đã viết gần đây (viết theo góc độ khác, đừng lặp lại ý/tiêu đề):\n${recentTitles}` : ''
    }`;
    // maxTokens thấp (từng để 2000) khiến phần JSON cuối cùng bị cắt cụt giữa
    // chừng khi model dùng nhiều lượt web_search trước đó (tốn token cho kết
    // quả tìm kiếm) — JSON.parse lỗi, rơi vào nhánh dự phòng và từng đăng
    // NGUYÊN VĂN JSON thô lên Facebook (bug thật đã xảy ra, đã dọn các bài đó).
    // Tăng token + parser chịu lỗi tốt hơn, và QUAN TRỌNG: không còn đăng bài
    // khi không lấy được JSON hợp lệ.
    const raw = await callClaude(system, userMessage, {
      maxTokens: 10000,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 2 }],
    });
    const parsed = parseJsonLoose(raw);
    if (!parsed || !(parsed.articleContent || parsed.fbCaption)) {
      throw new Error('AI không trả về JSON hợp lệ (có thể do bị cắt giữa chừng) — đã hủy đăng để tránh đăng nội dung lỗi.');
    }
    articleTitle = (parsed.articleTitle || '').trim() || config.aiAutoPostTopic.slice(0, 60);
    articleContent = (parsed.articleContent || '').trim();
    fbCaption = (parsed.fbCaption || '').trim() || articleContent.slice(0, 300);
  } catch (e) {
    appendPostingLog([{ time: Date.now(), targetId: 'ai-autopost', targetName: 'AI tự động đăng bài', status: 'error', error: `Lỗi AI viết bài: ${e.message}`, source: 'ai-autopost' }]);
    return;
  }

  const pageTokens = {};
  const tokenErrorEntries = [];
  for (let i = 0; i < pageIds.length; i++) {
    try {
      pageTokens[pageIds[i]] = await getPageAccessToken(pageIds[i]);
    } catch (e) {
      tokenErrorEntries.push({ time: Date.now(), targetId: pageIds[i], targetName: pageNames[i], status: 'error', error: `Không lấy được token Page: ${e.message}`, source: 'ai-autopost' });
    }
  }
  if (tokenErrorEntries.length) appendPostingLog(tokenErrorEntries);
  if (!Object.keys(pageTokens).length) return;
  const primaryPageToken = pageTokens[pageIds[0]];

  let imageBase64 = null;
  try {
    imageBase64 = await findStockPhotoBase64(articleTitle || config.aiAutoPostTopic);
  } catch (e) {
    imageBase64 = null;
  }

  const fbItem = { message: fbCaption, link: config.aiAutoPostLink || null, imageBase64 };
  const websiteItem = { headline: articleTitle, message: articleContent, link: config.aiAutoPostLink || null, imageBase64 };
  const newLogEntries = [];
  for (const target of dueTargets) {
    let result;
    if (target.type === 'website') {
      result = await postToWebsite(target, websiteItem);
    } else if (target.type === 'group') {
      result = primaryPageToken
        ? await publishToTarget(primaryPageToken, target.id, target.type, fbItem)
        : { ok: false, error: 'Không có token Page để đăng chéo Group.' };
    } else {
      const token = pageTokens[target.id];
      result = token ? await publishToTarget(token, target.id, target.type, fbItem) : { ok: false, error: 'Không lấy được token cho Page này.' };
    }
    if (result.ok) {
      // FB trả postId dạng "{page_id}_{post_id}" cho cả /feed lẫn /photos — suy
      // ra thẳng link công khai của bài mà không cần gọi thêm Graph API.
      const permalink = target.type !== 'website' && result.postId && result.postId.includes('_')
        ? `https://www.facebook.com/${result.postId.replace('_', '/posts/')}`
        : null;
      newLogEntries.push({ time: Date.now(), targetId: target.id, targetName: target.name, status: 'posted', message: target.type === 'website' ? articleContent : fbCaption, articleTitle, permalink, source: 'ai-autopost' });
    } else if (target.type === 'group') {
      newLogEntries.push({ time: Date.now(), targetId: target.id, targetName: target.name, status: 'needs_manual', error: result.error, message: fbCaption, articleTitle, source: 'ai-autopost' });
    } else {
      newLogEntries.push({ time: Date.now(), targetId: target.id, targetName: target.name, status: 'error', error: result.error, source: 'ai-autopost' });
    }
  }
  appendPostingLog(newLogEntries);
}

async function runAllPostingNow() {
  const results = { queue: null, aiAutoPost: null };
  try {
    await processPostingQueue();
    results.queue = 'ok';
  } catch (e) {
    results.queue = `Lỗi hàng chờ: ${e.message}`;
  }
  try {
    await runAiAutoPost();
    results.aiAutoPost = 'ok';
  } catch (e) {
    results.aiAutoPost = `Lỗi AI tự động: ${e.message}`;
  }
  return results;
}

// Server luôn bật (không như desktop phải mở app) — bộ đếm giờ chạy ngay khi
// module được require lần đầu lúc server khởi động. Cờ schedulerStarted tránh
// tạo interval nhân đôi nếu module vô tình bị require lại.
let schedulerStarted = false;
function startPostingScheduler() {
  if (schedulerStarted) return;
  schedulerStarted = true;
  // .unref() để các interval này không giữ tiến trình Node sống mãi nếu file
  // này lỡ bị require từ 1 script chạy-rồi-thoát (migration/seed...) — trên
  // server thật (luôn chạy sẵn vì có request tới) thì không ảnh hưởng gì.
  setInterval(() => {
    processPostingQueue().catch((e) => console.error('[aaiAdsService] processPostingQueue error', e.message));
  }, 5 * 60 * 1000).unref();
  setInterval(() => {
    runAiAutoPost().catch((e) => console.error('[aaiAdsService] runAiAutoPost error', e.message));
  }, 60 * 60 * 1000).unref();
  setInterval(() => {
    runAutomationCheck().catch((e) => console.error('[aaiAdsService] runAutomationCheck error', e.message));
  }, 15 * 60 * 1000).unref();
}
startPostingScheduler();

// ---------------- Campaign + Ad insights (dùng chung cho Automation / CRM / Decision Center) ----------------
// Port từ fb-ads-manager/main.js:726-800 (listCampaignsWithInsights, listAllAdsWithInsights).

const DATE_PRESET_BY_WINDOW = { 7: 'last_7d', 14: 'last_14d', 30: 'last_30d', 90: 'last_90d' };

function extractActionCount(actions, type) {
  if (!actions) return 0;
  const found = actions.find((a) => a.action_type === type);
  return found ? Number(found.value) : 0;
}
function extractActionValue(actionValues, type) {
  if (!actionValues) return 0;
  const found = actionValues.find((a) => a.action_type === type);
  return found ? Number(found.value) : 0;
}

async function listCampaignsWithInsights(adAccountId, windowDays) {
  const accessToken = requireToken();
  const preset = DATE_PRESET_BY_WINDOW[windowDays] || 'last_30d';
  const fields = `id,name,status,daily_budget,lifetime_budget,insights.date_preset(${preset}){spend,impressions,clicks,ctr,cpc,cpm,actions,action_values}`;
  const result = await graphRequest(`/${adAccountId}/campaigns?fields=${encodeURIComponent(fields)}&limit=200&access_token=${accessToken}`);
  return (result.data || []).map((c) => {
    const insight = (c.insights && c.insights.data && c.insights.data[0]) || {};
    const purchases = extractActionCount(insight.actions, 'purchase') || extractActionCount(insight.actions, 'offsite_conversion.fb_pixel_purchase');
    const purchaseValue = extractActionValue(insight.action_values, 'purchase') || extractActionValue(insight.action_values, 'offsite_conversion.fb_pixel_purchase');
    const spend = Number(insight.spend || 0);
    return {
      id: c.id,
      name: c.name,
      status: c.status,
      dailyBudget: c.daily_budget ? Number(c.daily_budget) : null,
      lifetimeBudget: c.lifetime_budget ? Number(c.lifetime_budget) : null,
      spend,
      impressions: Number(insight.impressions || 0),
      clicks: Number(insight.clicks || 0),
      ctr: Number(insight.ctr || 0),
      cpc: Number(insight.cpc || 0),
      cpm: Number(insight.cpm || 0),
      leads: extractActionCount(insight.actions, 'lead'),
      purchases,
      purchaseValue,
      cpa: purchases ? spend / purchases : null,
      roas: spend ? purchaseValue / spend : null,
    };
  });
}

async function listAllAdsWithInsights(adAccountId, windowDays) {
  const accessToken = requireToken();
  const preset = DATE_PRESET_BY_WINDOW[windowDays] || 'last_30d';
  const fields = `id,name,status,campaign{name},insights.date_preset(${preset}){spend,impressions,clicks,ctr,cpc,cpm,actions,action_values}`;
  const result = await graphRequest(`/${adAccountId}/ads?fields=${encodeURIComponent(fields)}&limit=200&access_token=${accessToken}`);
  return (result.data || []).map((a) => {
    const insight = (a.insights && a.insights.data && a.insights.data[0]) || {};
    const purchases = extractActionCount(insight.actions, 'purchase') || extractActionCount(insight.actions, 'offsite_conversion.fb_pixel_purchase');
    const purchaseValue = extractActionValue(insight.action_values, 'purchase') || extractActionValue(insight.action_values, 'offsite_conversion.fb_pixel_purchase');
    const spend = Number(insight.spend || 0);
    return {
      id: a.id,
      name: a.name,
      status: a.status,
      campaignName: a.campaign ? a.campaign.name : '',
      spend,
      ctr: Number(insight.ctr || 0),
      cpc: Number(insight.cpc || 0),
      cpm: Number(insight.cpm || 0),
      cpa: purchases ? spend / purchases : null,
      roas: spend ? purchaseValue / spend : null,
    };
  });
}

// ---------------- Tự động hóa (Automation rules, port từ fb-ads-manager/main.js:701-892) ----------------
// Khác desktop (chỉ chạy quy tắc khi app đang mở), ở đây bộ đếm giờ chạy nền
// trên server luôn bật — xem startPostingScheduler() bên dưới.

const AUTOMATION_RULES_PATH = path.join(__dirname, '..', 'data', 'aai-ads-automation-rules.json');
const AUTOMATION_LOG_PATH = path.join(__dirname, '..', 'data', 'aai-ads-automation-log.json');

function loadAutomationRules() {
  return readJsonArray(AUTOMATION_RULES_PATH);
}
function saveAutomationRule(rule) {
  const rules = loadAutomationRules();
  if (rule.id) {
    const idx = rules.findIndex((r) => r.id === rule.id);
    if (idx >= 0) rules[idx] = { ...rules[idx], ...rule };
    else rules.push(rule);
  } else {
    rule.id = crypto.randomUUID();
    rules.push(rule);
  }
  writeJsonArray(AUTOMATION_RULES_PATH, rules);
  return rule;
}
function deleteAutomationRule(id) {
  writeJsonArray(AUTOMATION_RULES_PATH, loadAutomationRules().filter((r) => r.id !== id));
}
function loadAutomationLog() {
  return readJsonArray(AUTOMATION_LOG_PATH);
}
function appendAutomationLog(entries) {
  const log = [...entries, ...loadAutomationLog()].slice(0, 200);
  writeJsonArray(AUTOMATION_LOG_PATH, log);
}

function metricValueFor(entity, metric) {
  if (metric === 'spend') return entity.spend;
  if (metric === 'cpc') return entity.cpc;
  if (metric === 'ctr') return entity.ctr;
  if (metric === 'cpm') return entity.cpm;
  if (metric === 'cpa') return entity.cpa;
  if (metric === 'roas') return entity.roas;
  return null;
}

// Quét toàn bộ rule đang bật, so khớp ngưỡng, và tự hành động (tạm dừng /
// tăng ngân sách / chỉ ghi log) trên chiến dịch hoặc quảng cáo thật — mục
// đích chính là tự bảo vệ ngân sách khỏi chạy lỗ khi không ai theo dõi.
async function runAutomationCheck() {
  const rules = loadAutomationRules().filter((r) => r.enabled);
  if (!rules.length || !isConnected()) return [];
  const accessToken = requireToken();
  const cache = {};
  const newLog = [];

  for (const rule of rules) {
    const cacheKey = `${rule.adAccountId}|${rule.scope}|${rule.windowDays}`;
    if (!cache[cacheKey]) {
      try {
        cache[cacheKey] = rule.scope === 'ad'
          ? await listAllAdsWithInsights(rule.adAccountId, rule.windowDays)
          : await listCampaignsWithInsights(rule.adAccountId, rule.windowDays);
      } catch (e) {
        cache[cacheKey] = [];
      }
    }
    for (const entity of cache[cacheKey]) {
      if (entity.status !== 'ACTIVE') continue;
      const value = metricValueFor(entity, rule.metric);
      if (value === null || value === undefined) continue;
      const triggered = rule.operator === '>' ? value > rule.threshold : value < rule.threshold;
      if (!triggered) continue;

      let actionResult = 'notify';
      try {
        if (rule.action === 'pause') {
          await graphRequest(`/${entity.id}`, 'POST', { status: 'PAUSED', access_token: accessToken });
          actionResult = 'paused';
        } else if (rule.action === 'scale_up') {
          const current = await graphRequest(`/${entity.id}?fields=daily_budget&access_token=${accessToken}`);
          if (current.daily_budget) {
            const newBudget = Math.round(Number(current.daily_budget) * (1 + (rule.scalePercent || 20) / 100));
            await graphRequest(`/${entity.id}`, 'POST', { daily_budget: String(newBudget), access_token: accessToken });
            actionResult = `Đã tăng ngân sách lên ${newBudget.toLocaleString('vi-VN')}đ`;
          }
        }
      } catch (e) {
        actionResult = `Lỗi: ${e.message}`;
      }
      newLog.push({
        time: Date.now(),
        ruleName: rule.name,
        campaignName: entity.name,
        metric: rule.metric,
        value,
        threshold: rule.threshold,
        action: rule.action,
        result: actionResult,
      });
    }
  }
  if (newLog.length) appendAutomationLog(newLog);
  return newLog;
}

// ---------------- Lợi nhuận & CRM (port từ fb-ads-manager/main.js:1791-2024) ----------------

const PRODUCTS_PATH = path.join(__dirname, '..', 'data', 'aai-ads-products.json');
const ORDERS_PATH = path.join(__dirname, '..', 'data', 'aai-ads-orders.json');
const LEADS_PATH = path.join(__dirname, '..', 'data', 'aai-ads-leads.json');
const ORDER_SOURCES_PATH = path.join(__dirname, '..', 'data', 'aai-ads-order-sources.json');

function loadProducts() {
  return readJsonArray(PRODUCTS_PATH);
}
function addProduct(p) {
  const list = loadProducts();
  p.id = crypto.randomUUID();
  list.push(p);
  writeJsonArray(PRODUCTS_PATH, list);
  return p;
}
function deleteProduct(id) {
  writeJsonArray(PRODUCTS_PATH, loadProducts().filter((p) => p.id !== id));
}

function loadOrderSources() {
  return readJsonArray(ORDER_SOURCES_PATH);
}
function addOrderSource(s) {
  const list = loadOrderSources();
  s.id = crypto.randomUUID();
  list.push(s);
  writeJsonArray(ORDER_SOURCES_PATH, list);
  return s;
}
function deleteOrderSource(id) {
  writeJsonArray(ORDER_SOURCES_PATH, loadOrderSources().filter((s) => s.id !== id));
}

function loadOrders() {
  return readJsonArray(ORDERS_PATH);
}
function addOrder(o) {
  const list = loadOrders();
  o.id = crypto.randomUUID();
  o.createdAt = Date.now();
  list.push(o);
  writeJsonArray(ORDERS_PATH, list);
  return o;
}
function deleteOrder(id) {
  writeJsonArray(ORDERS_PATH, loadOrders().filter((o) => o.id !== id));
}

// Đồng bộ đơn hàng từ 1 website/API bên ngoài do thầy tự cấu hình — chuẩn
// payload JSON {orders:[{externalId, amount, utm_campaign|campaignName,
// productId, orderDate}]}, de-dupe theo externalId để chạy lại nhiều lần
// không bị trùng đơn.
async function syncOrderSource(id) {
  const source = loadOrderSources().find((s) => s.id === id);
  if (!source) throw new Error('Không tìm thấy nguồn đơn hàng.');
  const res = await fetch(source.apiUrl, {
    headers: source.authToken ? { Authorization: `Bearer ${source.authToken}` } : {},
  });
  if (!res.ok) throw new Error(`Đồng bộ lỗi: HTTP ${res.status}`);
  const data = await res.json();
  const incoming = data.orders || [];
  const orders = loadOrders();
  const existingExternalIds = new Set(orders.map((o) => o.externalId).filter(Boolean));
  let added = 0;
  for (const raw of incoming) {
    if (raw.externalId && existingExternalIds.has(raw.externalId)) continue;
    orders.push({
      id: crypto.randomUUID(),
      externalId: raw.externalId || null,
      amount: Number(raw.amount || 0),
      productId: raw.productId || null,
      campaignName: raw.utm_campaign || raw.campaignName || null,
      orderChannel: 'website',
      orderDate: raw.orderDate || new Date().toISOString(),
      createdAt: Date.now(),
      source: source.name,
    });
    added++;
  }
  writeJsonArray(ORDERS_PATH, orders);
  return { added, total: incoming.length };
}

function loadLeads() {
  return readJsonArray(LEADS_PATH);
}
function computeLeadScore(lead) {
  let score = 0;
  if (lead.email) score += 20;
  if (lead.phone) score += 20;
  if (lead.orderValue > 0) score += 40;
  if (lead.source === 'form' || lead.source === 'messenger') score += 20;
  return Math.min(score, 100);
}
function leadTier(score) {
  if (score >= 81) return 'HIGH';
  if (score >= 61) return 'GOOD';
  if (score >= 31) return 'MEDIUM';
  return 'LOW';
}
function addLead(lead) {
  const list = loadLeads();
  lead.id = crypto.randomUUID();
  lead.status = lead.status || 'LEAD';
  lead.score = computeLeadScore(lead);
  lead.tier = leadTier(lead.score);
  lead.createdAt = Date.now();
  list.push(lead);
  writeJsonArray(LEADS_PATH, list);
  return lead;
}
function addLeadsBulk(text) {
  const lines = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const added = [];
  for (const line of lines) {
    const [name, email, phone] = line.split(',').map((s) => (s || '').trim());
    if (!name) continue;
    added.push(addLead({ name, email, phone, source: 'bulk-paste', orderValue: 0 }));
  }
  return added;
}
function updateLeadStatus(id, status) {
  const list = loadLeads();
  const lead = list.find((l) => l.id === id);
  if (lead) {
    lead.status = status;
    writeJsonArray(LEADS_PATH, list);
  }
  return lead;
}
function deleteLead(id) {
  writeJsonArray(LEADS_PATH, loadLeads().filter((l) => l.id !== id));
}

async function computeProfitSummary(adAccountId, windowDays) {
  const campaigns = await listCampaignsWithInsights(adAccountId, windowDays);
  const cutoff = Date.now() - windowDays * 86400000;
  const orders = loadOrders().filter((o) => new Date(o.orderDate).getTime() >= cutoff);
  const products = loadProducts();
  const productById = Object.fromEntries(products.map((p) => [p.id, p]));

  function orderCost(order) {
    const product = productById[order.productId];
    if (!product) return 0;
    const commission = ((product.commissionPercent || 0) / 100) * (order.amount || 0);
    return (product.cost || 0) + (product.shippingCost || 0) + commission;
  }

  const revenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const cost = orders.reduce((sum, o) => sum + orderCost(o), 0);
  const adSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const profit = revenue - cost - adSpend;
  const aov = orders.length ? revenue / orders.length : 0;
  const roas = adSpend ? revenue / adSpend : 0;

  const byCampaign = campaigns
    .map((c) => {
      const campOrders = orders.filter((o) => o.campaignName === c.name);
      const campRevenue = campOrders.reduce((s, o) => s + (o.amount || 0), 0);
      const campCost = campOrders.reduce((s, o) => s + orderCost(o), 0);
      return {
        campaignName: c.name,
        spend: c.spend,
        revenue: campRevenue,
        orders: campOrders.length,
        profit: campRevenue - campCost - c.spend,
      };
    })
    .sort((a, b) => b.profit - a.profit);

  return { revenue, cost, adSpend, profit, orderCount: orders.length, aov, roas, byCampaign };
}

// ---------------- AI Decision Center + Learning Loop (port từ fb-ads-manager/main.js:2903-3122) ----------------

async function getDecisionCenter(adAccountId, windowDays) {
  const campaigns = await listCampaignsWithInsights(adAccountId, windowDays);
  const profitSummary = await computeProfitSummary(adAccountId, windowDays).catch(() => null);
  const system = `Bạn là chuyên gia tối ưu quảng cáo Facebook (media buyer). Phân tích dữ liệu chiến dịch JSON được cung cấp, đưa ra nhận định (findings) và đề xuất hành động cụ thể cho từng chiến dịch (recommendations). Trả lời CHỈ bằng JSON hợp lệ, không markdown, không giải thích thêm, đúng format:
{"findings": ["...", "..."], "recommendations": [{"campaignName": "...", "action": "scale_up"|"hold"|"reduce"|"pause", "reason": "..."}]}`;
  const userMessage = `Dữ liệu chiến dịch (${windowDays} ngày gần nhất):\n${JSON.stringify(campaigns, null, 2)}${
    profitSummary ? `\n\nLợi nhuận tổng quan:\n${JSON.stringify(profitSummary, null, 2)}` : ''
  }`;
  const raw = await callClaude(system, userMessage, { maxTokens: 4000 });
  const parsed = parseJsonLoose(raw) || {};
  return { campaigns, findings: parsed.findings || [], recommendations: parsed.recommendations || [] };
}

async function applyDecisionRecommendation(adAccountId, campaignName, action) {
  const accessToken = requireToken();
  const campaigns = await listCampaignsWithInsights(adAccountId, 30);
  const campaign = campaigns.find((c) => c.name === campaignName);
  if (!campaign) throw new Error('Không tìm thấy chiến dịch — có thể tên đã đổi, hãy chạy lại phân tích.');
  if (action === 'pause') {
    await graphRequest(`/${campaign.id}`, 'POST', { status: 'PAUSED', access_token: accessToken });
  } else if (action === 'scale_up') {
    const current = await graphRequest(`/${campaign.id}?fields=daily_budget&access_token=${accessToken}`);
    if (current.daily_budget) {
      const newBudget = Math.round(Number(current.daily_budget) * 1.2);
      await graphRequest(`/${campaign.id}`, 'POST', { daily_budget: String(newBudget), access_token: accessToken });
    }
  }
  return { ok: true };
}

async function getLearningInsights(adAccountId, windowDays) {
  const campaigns = await listCampaignsWithInsights(adAccountId, windowDays);
  const orders = loadOrders();
  const leads = loadLeads();
  const system = `Bạn là chuyên gia phân tích quảng cáo Facebook. Dựa trên dữ liệu chiến dịch, đơn hàng, lead được cung cấp, hãy tìm ra pattern/xu hướng đáng chú ý, cảnh báo mỏi quảng cáo (ad fatigue — CTR giảm dần), nguồn lead/kênh tốt nhất, và lời khuyên cụ thể cho chiến dịch tiếp theo. Trả lời CHỈ bằng JSON hợp lệ, không markdown:
{"patterns": ["..."], "fatigueWarnings": ["..."], "bestSources": ["..."], "nextCampaignAdvice": ["..."]}`;
  const userMessage = `Chiến dịch (${windowDays} ngày gần nhất):\n${JSON.stringify(campaigns, null, 2)}\n\nĐơn hàng (tổng ${orders.length}, mẫu gần nhất):\n${JSON.stringify(orders.slice(-50), null, 2)}\n\nLead (tổng ${leads.length}, mẫu gần nhất):\n${JSON.stringify(leads.slice(-50), null, 2)}`;
  const raw = await callClaude(system, userMessage, { maxTokens: 4000 });
  const parsed = parseJsonLoose(raw) || {};
  return {
    patterns: parsed.patterns || [],
    fatigueWarnings: parsed.fatigueWarnings || [],
    bestSources: parsed.bestSources || [],
    nextCampaignAdvice: parsed.nextCampaignAdvice || [],
  };
}

// ---------------- AI plan (Claude) ----------------

// Trích JSON đầu tiên trong text bằng cách đếm dấu ngoặc nhọn cân bằng (bỏ
// qua ngoặc nằm trong chuỗi) — đáng tin hơn regex tham lam /\{[\s\S]*\}/ khi
// model lỡ in thêm chữ trước/sau JSON, hoặc nội dung bài viết chứa dấu {}.
function extractJsonObjectString(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') inString = false;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null; // JSON bị cắt cụt giữa chừng (vd hết max_tokens) — không đóng hết ngoặc
}

// Parse JSON "khoan dung": thử parse thẳng, nếu lỗi (thường do model quên
// escape xuống dòng/tab thật bên trong chuỗi) thì escape lại các ký tự điều
// khiển bên trong chuỗi rồi parse lại. Trả về null nếu vẫn không parse được —
// gọi nơi dùng phải coi null là "AI trả lời lỗi", KHÔNG dùng text thô làm dự phòng.
function parseJsonLoose(text) {
  const jsonStr = extractJsonObjectString(text);
  if (!jsonStr) return null;
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    let fixed = '';
    let inString = false;
    let escape = false;
    for (const ch of jsonStr) {
      if (inString) {
        if (escape) { fixed += ch; escape = false; }
        else if (ch === '\\') { fixed += ch; escape = true; }
        else if (ch === '"') { inString = false; fixed += ch; }
        else if (ch === '\n') fixed += '\\n';
        else if (ch === '\r') fixed += '\\r';
        else if (ch === '\t') fixed += '\\t';
        else fixed += ch;
      } else {
        if (ch === '"') inString = true;
        fixed += ch;
      }
    }
    try {
      return JSON.parse(fixed);
    } catch (e2) {
      return null;
    }
  }
}

async function callClaude(system, userMessage, options = {}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình ANTHROPIC_API_KEY trên server.');
  const body = {
    model: CLAUDE_MODEL,
    max_tokens: options.maxTokens || 1500,
    system,
    messages: [{ role: 'user', content: userMessage }],
  };
  // options.tools cho phép truyền tool phía server của Claude (vd: web_search)
  // — dùng khi cần AI tự tra cứu tin tức thay vì chỉ dựa kiến thức tĩnh.
  if (options.tools) body.tools = options.tools;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  // Khi dùng tool (vd web_search), content còn có block không phải "text"
  // (server_tool_use, web_search_tool_result...) — chỉ lấy block text.
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n');
}

async function suggestCampaignPlan({ product, monthlyBudget, goal, audience }) {
  const system = `Bạn là chuyên gia media buyer Facebook Ads. Trả lời CHỈ bằng một JSON object hợp lệ, không thêm text nào khác, không dùng markdown code fence. Cấu trúc JSON bắt buộc:
{
  "objective": "OUTCOME_AWARENESS" | "OUTCOME_TRAFFIC" | "OUTCOME_ENGAGEMENT" | "OUTCOME_SALES" | "OUTCOME_LEADS",
  "dailyBudget": <số nguyên VND>,
  "ageMin": <số>,
  "ageMax": <số>,
  "gender": "all" | "male" | "female",
  "reasoning": "<giải thích ngắn gọn lý do chọn objective/targeting/ngân sách này>",
  "headlines": ["...", "...", "..."],
  "primaryText": "...",
  "description": "...",
  "cta": "..."
}`;
  const userMessage = `Sản phẩm/dịch vụ: ${product}\nĐối tượng khách hàng dự kiến: ${audience || 'chưa xác định, hãy tự đề xuất'}\nMục tiêu kinh doanh: ${goal || 'tăng khách hàng/đơn hàng'}\nTổng ngân sách khả dụng trong tháng: ${monthlyBudget} VND\n\nHãy đề xuất kế hoạch chiến dịch tối ưu nhất (ngân sách/ngày = tổng ngân sách / 30, làm tròn hợp lý).`;
  const raw = await callClaude(system, userMessage, { maxTokens: 2000 });
  const parsed = parseJsonLoose(raw);
  if (!parsed) throw new Error('AI không trả về JSON hợp lệ. Thử lại.');
  return parsed;
}

// ---------------- Campaign creation (giữ đúng logic main.js) ----------------

const OBJECTIVE_MAP = {
  OUTCOME_AWARENESS: { optimization_goal: 'REACH', billing_event: 'IMPRESSIONS' },
  OUTCOME_TRAFFIC: { optimization_goal: 'LINK_CLICKS', billing_event: 'LINK_CLICKS' },
  OUTCOME_ENGAGEMENT: { optimization_goal: 'POST_ENGAGEMENT', billing_event: 'IMPRESSIONS' },
  OUTCOME_SALES: { optimization_goal: 'OFFSITE_CONVERSIONS', billing_event: 'IMPRESSIONS' },
  OUTCOME_LEADS: { optimization_goal: 'OFFSITE_CONVERSIONS', billing_event: 'IMPRESSIONS' },
};

function slugify(str) {
  return (
    String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) || 'chien-dich'
  );
}

function applyAutoUtm(rawLink, campaignName) {
  if (!rawLink) return rawLink;
  try {
    const url = new URL(rawLink);
    if (url.searchParams.has('utm_source')) return rawLink;
    url.searchParams.set('utm_source', 'facebook');
    url.searchParams.set('utm_medium', 'cpc');
    url.searchParams.set('utm_campaign', slugify(campaignName || 'chien-dich'));
    return url.href;
  } catch {
    return rawLink;
  }
}

async function createCampaignPlan(params) {
  const accessToken = requireToken();
  const {
    adAccountId,
    name,
    objective,
    dailyBudget,
    countries,
    ageMin,
    ageMax,
    gender,
    pixelId,
    interests,
    customConversionId,
    lifetimeDays, // tùy chọn — VD "chạy thử 10 ngày" thay vì chạy liên tục tới khi tự tay dừng
    creative, // { pageId, imageHash, message, headline, linkUrl, cta, instagramActorId }
  } = params;

  const campaign = await graphRequest(`/${adAccountId}/campaigns`, 'POST', {
    name,
    objective,
    status: 'PAUSED',
    special_ad_categories: JSON.stringify([]),
    // Meta hiện bắt buộc trường này khi KHÔNG dùng ngân sách cấp Chiến dịch
    // (CBO) — false = ngân sách quản lý ở từng Ad Set như bình thường.
    is_adset_budget_sharing_enabled: 'false',
    access_token: accessToken,
  });

  const goalConfig = OBJECTIVE_MAP[objective] || OBJECTIVE_MAP.OUTCOME_TRAFFIC;
  const targeting = {
    geo_locations: { countries: countries && countries.length ? countries : ['VN'] },
    age_min: ageMin || 18,
    age_max: ageMax || 65,
    // Meta hiện bắt buộc chọn rõ có bật Advantage+ Audience (Meta tự mở rộng
    // đối tượng bằng AI) hay không — 0 = tắt, giữ đúng đối tượng đã chọn thủ công.
    targeting_automation: { advantage_audience: 0 },
  };
  if (gender === 'male') targeting.genders = [1];
  if (gender === 'female') targeting.genders = [2];
  if (interests && interests.length) {
    targeting.flexible_spec = [{ interests: interests.map((i) => ({ id: i.id, name: i.name })) }];
  }

  const adSetBody = {
    name: `${name} - Ad Set`,
    campaign_id: campaign.id,
    billing_event: goalConfig.billing_event,
    optimization_goal: goalConfig.optimization_goal,
    // Meta hiện bắt buộc 1 chiến lược giá thầu rõ ràng ở Ad Set — auto-bid,
    // không giới hạn giá thầu (đơn giản, an toàn nhất cho người mới).
    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    targeting: JSON.stringify(targeting),
    status: 'PAUSED',
    access_token: accessToken,
  };
  // "Chạy thử N ngày" — dùng lifetime_budget + start/end_time để Facebook TỰ
  // dừng sau N ngày, thay vì daily_budget chạy liên tục tới khi tự tay dừng.
  if (lifetimeDays) {
    // start_time phải nằm trong tương lai — cộng thêm vài phút đệm để tránh
    // bị Facebook coi là "đã ở quá khứ" ngay lúc request tới server.
    const startTime = new Date(Date.now() + 5 * 60000);
    adSetBody.lifetime_budget = String(Math.round(dailyBudget) * Number(lifetimeDays));
    adSetBody.start_time = startTime.toISOString();
    adSetBody.end_time = new Date(startTime.getTime() + Number(lifetimeDays) * 86400000).toISOString();
  } else {
    adSetBody.daily_budget = String(Math.round(dailyBudget));
  }
  if (customConversionId) {
    adSetBody.promoted_object = JSON.stringify({ custom_conversion_id: customConversionId });
  } else if (pixelId && (objective === 'OUTCOME_SALES' || objective === 'OUTCOME_LEADS')) {
    adSetBody.promoted_object = JSON.stringify({ pixel_id: pixelId, custom_event_type: 'PURCHASE' });
  }

  let adSet;
  try {
    adSet = await graphRequest(`/${adAccountId}/adsets`, 'POST', adSetBody);
  } catch (e) {
    throw new Error(`Tạo Campaign thành công (${campaign.id}) nhưng tạo Ad Set lỗi: ${e.message}. Vào Meta Ads Manager để hoàn thiện Ad Set thủ công.`);
  }

  const result = { campaignId: campaign.id, adSetId: adSet.id };

  if (creative && creative.pageId && creative.linkUrl) {
    try {
      // Đăng bài công khai thật lên Page trước (né hạn chế "dark post phải
      // công khai" của App đang ở chế độ Đang phát triển), rồi dùng CHÍNH bài
      // đó làm Ad qua object_story_id — thay vì tạo bài viết ẩn qua object_story_spec.
      const postId = await publishPageLinkPost(
        creative.pageId,
        creative.message || creative.headline || name,
        applyAutoUtm(creative.linkUrl, name)
      );
      const creativeObj = await graphRequest(`/${adAccountId}/adcreatives`, 'POST', {
        object_story_id: postId,
        call_to_action: JSON.stringify({ type: creative.cta || 'LEARN_MORE' }),
        access_token: accessToken,
      });
      const ad = await graphRequest(`/${adAccountId}/ads`, 'POST', {
        name: `${name} - Ad`,
        adset_id: adSet.id,
        creative: JSON.stringify({ creative_id: creativeObj.id }),
        status: 'PAUSED',
        access_token: accessToken,
      });
      result.postId = postId;
      result.creativeId = creativeObj.id;
      result.adId = ad.id;
    } catch (e) {
      result.adError = `Tạo Ad lỗi: ${e.message}. Campaign/Ad Set vẫn tạo thành công, vào Meta Ads Manager để thêm Ad thủ công.`;
    }
  }

  return result;
}

module.exports = {
  loadConfig,
  isConnected,
  buildAuthUrl,
  exchangeCodeForToken,
  listAdAccounts,
  listPages,
  searchInterests,
  uploadImage,
  suggestCampaignPlan,
  createCampaignPlan,
  // Đăng bài tự động
  loadWebsiteTargets,
  addWebsiteTarget,
  deleteWebsiteTarget,
  getPostingFreqSettings,
  savePostingFreqSettings,
  loadPostingQueue,
  addToPostingQueue,
  deleteFromPostingQueue,
  publishQueueItemNow,
  processPostingQueue,
  loadPostingLog,
  getAiAutoPostConfig,
  saveAiAutoPostConfig,
  runAiAutoPost,
  runAllPostingNow,
  // Chia sẻ insights
  listCampaignsWithInsights,
  listAllAdsWithInsights,
  // Tự động hóa
  loadAutomationRules,
  saveAutomationRule,
  deleteAutomationRule,
  loadAutomationLog,
  runAutomationCheck,
  // Lợi nhuận & CRM
  loadProducts,
  addProduct,
  deleteProduct,
  loadOrderSources,
  addOrderSource,
  deleteOrderSource,
  syncOrderSource,
  loadOrders,
  addOrder,
  deleteOrder,
  loadLeads,
  addLead,
  addLeadsBulk,
  updateLeadStatus,
  deleteLead,
  computeProfitSummary,
  // AI Decision Center + Learning Loop
  getDecisionCenter,
  applyDecisionRecommendation,
  getLearningInsights,
};
