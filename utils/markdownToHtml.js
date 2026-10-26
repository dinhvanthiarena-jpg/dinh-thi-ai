// Chuyển nội dung bài viết dạng text thuần (đoạn cách nhau bằng \n\n, có thể
// có "## Heading", "### Heading phụ", "- gạch đầu dòng", "**in đậm**", "[link](url)")
// thành HTML để hiển thị đúng xuống dòng/đoạn trên trang blog — views/blog/show.ejs
// render thẳng `post.content` bằng `<%- %>` (không escape), nên nếu lưu text thuần thì
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

// "#" và "##" = tiêu đề chính (h2); "###" trở lên = tiêu đề phụ (h3);
// dòng bắt đầu bằng "- " hoặc "* " = danh sách; còn lại là đoạn văn.
function renderBlock(block) {
  const yt = block.match(YT_LINE);
  if (yt) return youtubeEmbed(yt[1]);
  const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
  const out = [];
  let para = [];
  let list = [];
  const flushPara = () => {
    if (para.length) out.push('<p>' + inlineMarkdown(para.join('\n')).replace(/\n/g, '<br>') + '</p>');
    para = [];
  };
  const flushList = () => {
    if (list.length) out.push('<ul>' + list.map((i) => '<li>' + inlineMarkdown(i) + '</li>').join('') + '</ul>');
    list = [];
  };
  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const item = line.match(/^[-*]\s+(.+)$/);
    if (heading) {
      flushPara();
      flushList();
      const tag = heading[1].length <= 2 ? 'h2' : 'h3';
      out.push('<' + tag + '>' + inlineMarkdown(heading[2]) + '</' + tag + '>');
    } else if (item) {
      flushPara();
      list.push(item[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return out.join('\n');
}

function markdownToHtml(markdown) {
  return String(markdown || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(renderBlock)
    .join('\n');
}

module.exports = { markdownToHtml, inlineMarkdown };
