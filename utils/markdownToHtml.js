// Chuyển nội dung bài viết dạng text thuần (đoạn cách nhau bằng \n\n, có thể
// có "## Heading", "**in đậm**", "[link](url)") thành HTML để hiển thị đúng
// xuống dòng/đoạn trên trang blog — views/blog/show.ejs render thẳng
// `post.content` bằng `<%- %>` (không escape), nên nếu lưu text thuần thì
// trình duyệt sẽ gộp hết \n thành khoảng trắng, ra 1 khối chữ dính liền
// (bug thầy Đinh Thi Ai báo ngày 16/9/2026 với bài đăng qua A-AI Ads).
function inlineMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer nofollow">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(markdown) {
  return String(markdown || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const heading = block.match(/^#{1,3}\s+(.+)$/);
      if (heading) return `<h2>${inlineMarkdown(heading[1])}</h2>`;
      return `<p>${inlineMarkdown(block).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

module.exports = { markdownToHtml, inlineMarkdown };
