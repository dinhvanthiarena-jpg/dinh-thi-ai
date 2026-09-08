// Danh sách chuyên mục cho blog — mở rộng từ "chỉ AI" sang nhiều chủ đề
// (kiểu Kênh14) để có chỗ chứa tin hot/trending nói chung, không riêng AI.
const BLOG_CATEGORIES = [
  { slug: 'ai-cong-nghe', label: 'AI & Công nghệ', emoji: '🤖' },
  { slug: 'xu-huong', label: 'Xu hướng - Tin hot', emoji: '🔥' },
  { slug: 'dao-tao-nghe-nghiep', label: 'Đào tạo & Nghề nghiệp', emoji: '🎓' },
  { slug: 'kinh-doanh', label: 'Kinh doanh & Chuyển đổi số', emoji: '💼' },
  { slug: 'doi-song', label: 'Đời sống & Kỹ năng', emoji: '🌿' },
  { slug: 'giai-tri', label: 'Giải trí & Mạng xã hội', emoji: '🎬' },
];

const DEFAULT_CATEGORY = 'ai-cong-nghe';

function getCategory(slug) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

module.exports = { BLOG_CATEGORIES, DEFAULT_CATEGORY, getCategory };
