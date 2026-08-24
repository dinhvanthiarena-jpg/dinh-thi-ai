// Publishes scheduled blog posts once their publishedAt date arrives, so
// content can be queued in advance (for a steady SEO cadence) instead of
// dumping everything live at once. Runs on an interval inside the same
// long-lived Node process — no external cron needed on shared hosting.
const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');
const SocialPost = require('../models/SocialPost');
const facebookPostService = require('./facebookPostService');

async function publishDuePosts() {
  const [count] = await BlogPost.update(
    { isPublished: true },
    { where: { isPublished: false, publishedAt: { [Op.lte]: new Date() } } }
  );
  if (count > 0) {
    console.log(`[scheduler] Published ${count} scheduled post(s).`);
  }
}

// Posts up to DAILY_POST_TARGET times per calendar day to the Facebook Page —
// checked hourly (piggybacking on the same interval as publishDuePosts) rather
// than run-once-at-startup, so a server restart mid-day doesn't skip posts or
// double-post. MIN_GAP_MS spaces successive posts out through the day instead
// of firing all 5 back-to-back the moment the server starts.
const DAILY_POST_TARGET = 5;
const MIN_GAP_MS = 2.5 * 60 * 60 * 1000;

async function postDailySocialContent() {
  if (!process.env.FB_PAGE_ACCESS_TOKEN) return;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const postsToday = await SocialPost.count({ where: { postedAt: { [Op.gte]: startOfToday } } });
  if (postsToday >= DAILY_POST_TARGET) return;

  const lastPost = await SocialPost.findOne({ order: [['postedAt', 'DESC']] });
  if (lastPost && Date.now() - new Date(lastPost.postedAt).getTime() < MIN_GAP_MS) return;

  await facebookPostService.postDailyContent();
}

function startScheduler() {
  publishDuePosts().catch((err) => console.error('[scheduler] error', err));
  postDailySocialContent().catch((err) => console.error('[scheduler] facebook post error', err));
  setInterval(() => {
    publishDuePosts().catch((err) => console.error('[scheduler] error', err));
    postDailySocialContent().catch((err) => console.error('[scheduler] facebook post error', err));
  }, 60 * 60 * 1000);
}

module.exports = { startScheduler, publishDuePosts, postDailySocialContent };
