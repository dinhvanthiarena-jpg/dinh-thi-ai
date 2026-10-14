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

// Khối chỉ có link YouTube -> khung phát video (chỉ nhận ID 11 ký tự đúng chuẩn nên không chèn được HTML lạ).
const YT_LINE = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^\s#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})[^\s]*$/i;
const youtubeEmbed = (id) => '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;margin:20px 0;background:#000"><iframe src="https://www.youtube.com/embed/' + id + '" title="Video" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';

function markdownToHtml(markdown) {
  return String(markdown || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const yt = block.match(YT_LINE);
      if (yt) return youtubeEmbed(yt[1]);
      const heading = block.match(/^#{1,3}\s+(.+)$/);
      if (heading) return `<h2>${inlineMarkdown(heading[1])}</h2>`;
      return `<p>${inlineMarkdown(block).replace(/\n/g, '<br>')}</p>`;
    })
    .join('\n');
}

module.exports = { markdownToHtml, inlineMarkdown };
