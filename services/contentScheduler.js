// Publishes scheduled blog posts once their publishedAt date arrives, so
// content can be queued in advance (for a steady SEO cadence) instead of
// dumping everything live at once. Runs on an interval inside the same
// long-lived Node process — no external cron needed on shared hosting.
const { Op } = require('sequelize');
const BlogPost = require('../models/BlogPost');

async function publishDuePosts() {
  const [count] = await BlogPost.update(
    { isPublished: true },
    { where: { isPublished: false, publishedAt: { [Op.lte]: new Date() } } }
  );
  if (count > 0) {
    console.log(`[scheduler] Published ${count} scheduled post(s).`);
  }
}

function startScheduler() {
  publishDuePosts().catch((err) => console.error('[scheduler] error', err));
  setInterval(() => {
    publishDuePosts().catch((err) => console.error('[scheduler] error', err));
  }, 60 * 60 * 1000);
}

module.exports = { startScheduler, publishDuePosts };
