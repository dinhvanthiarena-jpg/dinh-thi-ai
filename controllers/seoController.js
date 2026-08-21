const Course = require('../models/Course');
const BlogPost = require('../models/BlogPost');

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
      `Sitemap: ${appUrl}/sitemap.xml`,
    ].join('\n')
  );
};

exports.sitemap = async (req, res) => {
  const appUrl = res.locals.appUrl;
  const [courses, posts] = await Promise.all([
    Course.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] }),
    BlogPost.findAll({ where: { isPublished: true }, attributes: ['slug', 'updatedAt'] }),
  ]);

  const staticUrls = ['', '/courses', '/blog', '/gioi-thieu', '/lien-he'];

  const urls = [
    ...staticUrls.map((p) => ({ loc: `${appUrl}${p}`, priority: p === '' ? '1.0' : '0.8' })),
    ...courses.map((c) => ({ loc: `${appUrl}/courses/${c.slug}`, lastmod: c.updatedAt, priority: '0.9' })),
    ...posts.map((p) => ({ loc: `${appUrl}/blog/${p.slug}`, lastmod: p.updatedAt, priority: '0.6' })),
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
