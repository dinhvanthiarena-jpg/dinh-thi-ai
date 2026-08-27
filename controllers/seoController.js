const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');
const Tool = require('../models/Tool');

// Explicitly named alongside the general "User-agent: *" allow-all so it's
// unambiguous to AI crawlers/answer engines (ChatGPT, Gemini, Perplexity,
// Google AI Overviews, Bing Copilot) that they're welcome here — some of
// these engines' operators say they respect their own named token even when
// a wildcard rule would already cover them.
const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bingbot',
  'Amazonbot',
];

exports.robots = (req, res) => {
  const appUrl = res.locals.appUrl;
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /dashboard',
      'Disallow: /checkout',
      '',
      ...AI_CRAWLER_AGENTS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
      `Sitemap: ${appUrl}/sitemap.xml`,
    ].join('\n')
  );
};

exports.sitemap = async (req, res) => {
  const appUrl = res.locals.appUrl;
  const [courses, posts, tools] = await Promise.all([
    Course.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] }),
    BlogPost.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] }),
    Tool.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] }),
  ]);

  const staticUrls = ['', '/courses', '/blog', '/kho-tai-nguyen', '/gioi-thieu', '/hoat-dong', '/lien-he', '/game/'];

  const urls = [
    ...staticUrls.map((p) => ({ loc: `${appUrl}${p}`, priority: p === '' ? '1.0' : '0.8' })),
    ...courses.map((c) => ({ loc: `${appUrl}/courses/${c.slug}`, lastmod: c.updatedAt, priority: '0.9' })),
    ...posts.map((p) => ({ loc: `${appUrl}/blog/${p.slug}`, lastmod: p.updatedAt, priority: '0.6' })),
    ...tools.map((t) => ({ loc: `${appUrl}/kho-tai-nguyen/${t.slug}`, lastmod: t.updatedAt, priority: '0.7' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
};
