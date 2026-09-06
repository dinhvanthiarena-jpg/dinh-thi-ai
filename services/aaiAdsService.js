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
  if (json.error) throw new Error(json.error.message);
  return json;
}

function oauthRedirectUri(req) {
  return `https://${req.get('host')}/admin/aai-ads/callback`;
}

function buildAuthUrl(req) {
  const scope = ['ads_management', 'ads_read', 'business_management', 'pages_show_list', 'pages_read_engagement'].join(',');
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

// ---------------- AI plan (Claude) ----------------

async function callClaude(system, userMessage) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Chưa cấu hình ANTHROPIC_API_KEY trên server.');
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return (data.content || []).map((b) => b.text).join('\n');
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
  const raw = await callClaude(system, userMessage);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI không trả về JSON hợp lệ. Thử lại.');
  return JSON.parse(jsonMatch[0]);
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
    creative, // { pageId, imageHash, message, headline, linkUrl, cta, instagramActorId }
  } = params;

  const campaign = await graphRequest(`/${adAccountId}/campaigns`, 'POST', {
    name,
    objective,
    status: 'PAUSED',
    special_ad_categories: JSON.stringify([]),
    access_token: accessToken,
  });

  const goalConfig = OBJECTIVE_MAP[objective] || OBJECTIVE_MAP.OUTCOME_TRAFFIC;
  const targeting = {
    geo_locations: { countries: countries && countries.length ? countries : ['VN'] },
    age_min: ageMin || 18,
    age_max: ageMax || 65,
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
    targeting: JSON.stringify(targeting),
    daily_budget: String(Math.round(dailyBudget)),
    status: 'PAUSED',
    access_token: accessToken,
  };
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

  if (creative && creative.pageId && creative.imageHash) {
    try {
      const objectStorySpec = {
        page_id: creative.pageId,
        link_data: {
          message: creative.message || '',
          link: applyAutoUtm(creative.linkUrl || 'https://facebook.com', name),
          image_hash: creative.imageHash,
          name: creative.headline || '',
          description: creative.description || '',
          call_to_action: { type: creative.cta || 'LEARN_MORE' },
        },
      };
      if (creative.instagramActorId) objectStorySpec.instagram_actor_id = creative.instagramActorId;
      const creativeObj = await graphRequest(`/${adAccountId}/adcreatives`, 'POST', {
        object_story_spec: JSON.stringify(objectStorySpec),
        access_token: accessToken,
      });
      const ad = await graphRequest(`/${adAccountId}/ads`, 'POST', {
        name: `${name} - Ad`,
        adset_id: adSet.id,
        creative: JSON.stringify({ creative_id: creativeObj.id }),
        status: 'PAUSED',
        access_token: accessToken,
      });
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
};
