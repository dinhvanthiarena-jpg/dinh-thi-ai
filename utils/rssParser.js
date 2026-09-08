// Parser RSS tối giản, tự viết (không thêm thư viện ngoài) — chỉ cần lấy
// title/link/description/pubDate của từng <item>, cấu trúc RSS 2.0 chuẩn
// nên regex là đủ, không cần một trình phân tích XML đầy đủ.
function decodeEntities(str) {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? decodeEntities(m[1]) : '';
}

function parseRss(xml) {
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  return itemBlocks.map((block) => ({
    title: extractTag(block, 'title'),
    link: extractTag(block, 'link'),
    description: extractTag(block, 'description').replace(/<[^>]+>/g, '').slice(0, 500),
    pubDate: extractTag(block, 'pubDate'),
  }));
}

module.exports = { parseRss };
