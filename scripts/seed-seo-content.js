// Seeds a queue of SEO-targeted "Kien thuc AI" articles, scheduled to publish
// gradually (via services/contentScheduler.js) instead of all at once — a
// steadier cadence of fresh content is better for both Google SEO and AI
// search/AI Overview visibility. Safe to re-run: skips posts that already
// exist (matched by title).
require('dotenv').config();
const connectDB = require('../config/db');
const { BlogPost, User } = require('../models');

const CTA = `
<div class="mt-8 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-6">
  <h3 class="text-lg font-bold text-ink mb-2">Muốn áp dụng AI vào công việc ngay hôm nay?</h3>
  <p class="mb-4">Tham gia khóa học AI ứng dụng cùng chuyên gia Đinh Thi Ai — thực chiến, dễ hiểu, không cần biết lập trình, đã đồng hành cùng hơn 5.000 học viên.</p>
  <a href="/courses" class="btn-primary inline-flex">Khám phá khóa học ngay</a>
</div>`;

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(8, 0, 0, 0);
  return d;
}

const posts = [
  {
    title: 'Học AI ở đâu tốt cho người đi làm tại Việt Nam?',
    excerpt: 'Tiêu chí chọn nơi học AI uy tín và lộ trình học AI ứng dụng hiệu quả nhất cho người đi làm, không cần biết lập trình.',
    coverImageUrl: '/images/blog/where-to-learn.svg',
    tags: ['hoc-ai', 'khoa-hoc-ai', 'nguoi-di-lam'],
    publishedAt: daysFromNow(3),
    content: `
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-2 mb-3">Vì sao người đi làm nên học AI ngay bây giờ</h2>
<p class="mb-4">AI không còn là công nghệ của tương lai — nó đã trở thành công cụ làm việc hàng ngày trong marketing, bán hàng, vận hành và quản lý. Người biết ứng dụng AI đúng cách có thể rút ngắn thời gian làm việc, nâng cao chất lượng đầu ra và tạo lợi thế cạnh tranh rõ rệt so với đồng nghiệp chưa bắt đầu.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Tiêu chí chọn nơi học AI uy tín</h2>
<p class="mb-4">Không phải khóa học AI nào cũng phù hợp với người đi làm. Khi lựa chọn, bạn nên ưu tiên những nơi đào tạo có: nội dung thực chiến gắn với công việc cụ thể (không chỉ lý thuyết), giảng viên có kinh nghiệm ứng dụng AI thực tế, lộ trình rõ ràng theo cấp độ, và có cộng đồng hoặc hỗ trợ sau khóa học để bạn không bị "học xong rồi quên".</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Gợi ý lộ trình học AI ứng dụng hiệu quả</h2>
<p class="mb-4">Một lộ trình hợp lý thường bắt đầu từ việc hiểu bản chất AI và làm quen với ChatGPT/Gemini, sau đó học kỹ thuật viết prompt (Prompt Engineering) để giao tiếp hiệu quả với AI, rồi tiến tới ứng dụng Generative AI cho nội dung/hình ảnh, và cuối cùng là triển khai AI vào quy trình làm việc hoặc quy mô doanh nghiệp.</p>
${CTA}`,
  },
  {
    title: 'AI Overview là gì? Cách tối ưu nội dung để xuất hiện trên kết quả tìm kiếm AI',
    excerpt: 'AI Overview và các công cụ tìm kiếm bằng AI đang thay đổi cách người dùng tìm thông tin. Đây là cách tối ưu nội dung để không bị bỏ lại phía sau.',
    coverImageUrl: '/images/blog/ai-overview-seo.svg',
    tags: ['seo', 'ai-search', 'ai-overview'],
    publishedAt: daysFromNow(7),
    content: `
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-2 mb-3">AI Overview là gì?</h2>
<p class="mb-4">AI Overview là tính năng tóm tắt câu trả lời bằng AI ngay trên đầu trang kết quả tìm kiếm, thay vì bắt người dùng phải click vào từng link để đọc. Các nền tảng tìm kiếm bằng AI (ChatGPT Search, Perplexity, Google AI Overview...) đều hoạt động theo cách tương tự: đọc, tổng hợp và trích dẫn nội dung từ nhiều nguồn để trả lời trực tiếp.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Vì sao doanh nghiệp cần quan tâm ngay từ bây giờ</h2>
<p class="mb-4">Khi AI trả lời trực tiếp câu hỏi của người dùng, lượng truy cập vào website có thể giảm — trừ khi nội dung của bạn được AI chọn để trích dẫn. Nói cách khác, "được AI nhắc tên" đang trở thành một kênh hiển thị thương hiệu quan trọng không kém thứ hạng Google truyền thống.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Cách tối ưu nội dung cho AI Search</h2>
<p class="mb-4">Một số nguyên tắc cốt lõi: viết câu trả lời rõ ràng ngay từ đầu bài (trả lời trực tiếp câu hỏi trước, giải thích sau), dùng tiêu đề dạng câu hỏi tự nhiên, cấu trúc nội dung theo từng mục nhỏ dễ trích dẫn, và luôn cập nhật thông tin chính xác — vì AI có xu hướng ưu tiên nguồn đáng tin cậy và mới nhất.</p>
${CTA}`,
  },
  {
    title: '10 công cụ AI miễn phí giúp tăng năng suất công việc văn phòng',
    excerpt: 'Danh sách công cụ AI miễn phí theo từng nhóm nhu cầu: viết nội dung, thiết kế hình ảnh và tự động hóa công việc lặp lại.',
    coverImageUrl: '/images/blog/free-ai-tools.svg',
    tags: ['cong-cu-ai', 'nang-suat'],
    publishedAt: daysFromNow(11),
    content: `
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-2 mb-3">Nhóm công cụ viết và tổng hợp nội dung</h2>
<p class="mb-4">ChatGPT, Gemini và Claude đều có bản miễn phí đủ mạnh để soạn email, tóm tắt tài liệu dài, hay lên dàn ý báo cáo chỉ trong vài phút — thay vì phải ngồi viết từ đầu.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Nhóm công cụ hình ảnh và thiết kế</h2>
<p class="mb-4">Canva AI và các công cụ tạo ảnh tích hợp sẵn giúp bạn tạo hình ảnh minh họa, banner marketing chuyên nghiệp mà không cần kỹ năng thiết kế chuyên sâu.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Nhóm công cụ tự động hóa và trợ lý công việc</h2>
<p class="mb-4">Các trợ lý AI tích hợp trong Google Workspace hay Notion AI giúp tự động hóa việc ghi chú cuộc họp, lên lịch và tổng hợp thông tin — giảm đáng kể thời gian làm việc thủ công lặp lại hàng ngày.</p>
<p class="mb-4">Điểm chung của các công cụ này là dễ dùng nhưng để khai thác đúng 100% hiệu quả, bạn cần biết cách viết prompt và xây dựng quy trình phù hợp với công việc cụ thể của mình.</p>
${CTA}`,
  },
  {
    title: 'Lộ trình học AI ứng dụng từ số 0 cho người không biết lập trình',
    excerpt: 'Bạn không biết code vẫn học AI ứng dụng được — đây là lộ trình 3 giai đoạn giúp bạn đi từ người mới đến thành thạo AI trong công việc.',
    coverImageUrl: '/images/blog/roadmap.svg',
    tags: ['lo-trinh-hoc-ai', 'nguoi-moi-bat-dau'],
    publishedAt: daysFromNow(15),
    content: `
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-2 mb-3">Giai đoạn 1: Làm quen với AI</h2>
<p class="mb-4">Bắt đầu bằng việc hiểu AI hoạt động như thế nào ở mức cơ bản, sự khác nhau giữa các công cụ phổ biến (ChatGPT, Gemini, Claude), và thực hành các thao tác đơn giản như hỏi đáp, tóm tắt văn bản.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Giai đoạn 2: Ứng dụng vào công việc hàng ngày</h2>
<p class="mb-4">Học cách viết prompt hiệu quả (Prompt Engineering) để AI hiểu đúng ý bạn, rồi áp dụng vào các đầu việc cụ thể: soạn nội dung, phân tích dữ liệu, hỗ trợ ra quyết định trong công việc văn phòng.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Giai đoạn 3: Chuyên sâu theo lĩnh vực</h2>
<p class="mb-4">Khi đã thành thạo nền tảng, bạn có thể đi sâu theo hướng phù hợp: Generative AI cho marketing/sáng tạo nội dung, hoặc triển khai AI ở quy mô quy trình/doanh nghiệp nếu bạn ở vai trò quản lý.</p>
<p class="mb-4">Không cần biết lập trình ở bất kỳ giai đoạn nào — điều quan trọng nhất là tư duy sử dụng AI đúng cách và thực hành đều đặn.</p>
${CTA}`,
  },
  {
    title: 'ChatGPT, Gemini hay Claude: Nên chọn công cụ AI nào cho công việc?',
    excerpt: 'So sánh điểm mạnh của ChatGPT, Gemini và Claude để chọn đúng công cụ AI phù hợp với nhu cầu công việc của bạn.',
    coverImageUrl: '/images/blog/compare-ai.svg',
    tags: ['so-sanh-ai', 'chatgpt', 'gemini', 'claude'],
    publishedAt: daysFromNow(19),
    content: `
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-2 mb-3">Điểm mạnh của từng công cụ</h2>
<p class="mb-4">ChatGPT phổ biến và mạnh về hệ sinh thái plugin/tool tích hợp. Gemini tích hợp sâu với Google Workspace, thuận tiện nếu bạn đã quen dùng Gmail, Docs, Sheets. Claude nổi bật ở khả năng xử lý văn bản dài, viết lách tự nhiên và tuân theo hướng dẫn phức tạp một cách nhất quán.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Nên chọn công cụ nào theo nhu cầu</h2>
<p class="mb-4">Nếu công việc chính là soạn thảo, biên tập nội dung dài hoặc phân tích tài liệu — Claude thường cho kết quả mượt và chính xác hơn. Nếu bạn làm việc nhiều trong Google Workspace, Gemini sẽ tiết kiệm thời gian chuyển đổi công cụ. ChatGPT phù hợp khi bạn cần một trợ lý đa năng cho nhiều loại tác vụ khác nhau.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Lời khuyên khi dùng nhiều công cụ AI cùng lúc</h2>
<p class="mb-4">Trên thực tế, nhiều người dùng thành thạo không chỉ trung thành với một công cụ mà kết hợp cả ba tùy theo tác vụ. Điều quan trọng hơn cả việc chọn đúng công cụ là kỹ năng viết prompt — vì kỹ năng này áp dụng được cho mọi nền tảng AI.</p>
${CTA}`,
  },
  {
    title: 'Doanh nghiệp vừa và nhỏ nên bắt đầu ứng dụng AI từ đâu?',
    excerpt: 'SME không cần ngân sách lớn vẫn có thể ứng dụng AI hiệu quả — bắt đầu từ 3 điểm mang lại ROI nhanh nhất và tránh những rủi ro phổ biến.',
    coverImageUrl: '/images/blog/sme-ai.svg',
    tags: ['ai-doanh-nghiep', 'sme'],
    publishedAt: daysFromNow(23),
    content: `
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-2 mb-3">Vì sao SME cần ứng dụng AI ngay</h2>
<p class="mb-4">Doanh nghiệp vừa và nhỏ thường bị giới hạn về nhân sự và ngân sách — đây chính là lý do AI đặc biệt phù hợp: giúp một đội ngũ nhỏ làm được khối lượng công việc lớn hơn mà không cần tuyển thêm người ngay lập tức.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">3 điểm bắt đầu ứng dụng AI có ROI cao nhất</h2>
<p class="mb-4">Ưu tiên triển khai AI ở: (1) chăm sóc khách hàng qua chatbot trả lời câu hỏi thường gặp, (2) tự động hóa nội dung marketing hàng ngày trên mạng xã hội, và (3) tổng hợp báo cáo/dữ liệu bán hàng để ra quyết định nhanh hơn.</p>

<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Rủi ro cần tránh khi triển khai AI</h2>
<p class="mb-4">Sai lầm phổ biến nhất là triển khai AI tràn lan mà không có chiến lược rõ ràng, hoặc giao toàn quyền cho AI xử lý dữ liệu nhạy cảm của khách hàng mà không kiểm soát. Nên bắt đầu từ quy mô nhỏ, đo lường hiệu quả, rồi mới mở rộng dần.</p>
${CTA}`,
  },
];

// The 3 originally-seeded posts predate HTML-formatted content (blog/show.ejs
// used to render them as escaped plain text with CSS white-space handling
// line breaks). Now that content renders as real HTML, give them the same
// heading/paragraph structure and a matching designed cover image.
const legacyUpdates = [
  {
    match: { title: '5 xu hướng AI đáng chú ý năm 2026' },
    coverImageUrl: '/images/blog/trend-2026.svg',
    content: `
<p class="mb-4">Năm 2026 chứng kiến sự bùng nổ của các AI agent tự hành, khả năng xử lý đa phương tiện (multimodal), và sự phổ biến của AI cá nhân hóa.</p>
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">5 xu hướng đáng chú ý nhất</h2>
<p class="mb-4">AI agent có thể tự thực hiện chuỗi tác vụ thay vì chỉ trả lời từng câu hỏi; AI multimodal hiểu đồng thời văn bản, hình ảnh và giọng nói; AI cá nhân hóa theo thói quen từng người dùng; AI tích hợp sâu vào công cụ làm việc hàng ngày; và chi phí sử dụng AI tiếp tục giảm, giúp doanh nghiệp nhỏ dễ tiếp cận hơn.</p>
<p class="mb-4">Doanh nghiệp và cá nhân nên chủ động cập nhật kỹ năng ứng dụng AI ngay từ bây giờ để không bị bỏ lại phía sau.</p>
${CTA}`,
  },
  {
    match: { title: 'Hướng dẫn viết prompt hiệu quả cho người mới bắt đầu' },
    coverImageUrl: '/images/blog/prompt-guide.svg',
    content: `
<p class="mb-4">Một prompt tốt cần rõ ràng về ngữ cảnh, mục tiêu và định dạng mong muốn — đây là 3 yếu tố quyết định chất lượng câu trả lời của AI.</p>
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Công thức CO-STAR</h2>
<p class="mb-4">CO-STAR là công thức viết prompt gồm: Context (bối cảnh), Objective (mục tiêu), Style (phong cách), Tone (giọng điệu), Audience (đối tượng) và Response format (định dạng phản hồi). Áp dụng đủ 6 yếu tố này giúp AI hiểu đúng ý bạn ngay từ lần hỏi đầu tiên, thay vì phải chỉnh sửa nhiều lần.</p>
<p class="mb-4">Ví dụ thực tế: thay vì hỏi "viết bài về sản phẩm", hãy hỏi "viết bài đăng Facebook (định dạng) giới thiệu sản phẩm X cho khách hàng trẻ (đối tượng) với giọng điệu gần gũi, hài hước (phong cách/giọng điệu), mục tiêu tăng tương tác (mục tiêu)".</p>
${CTA}`,
  },
  {
    match: { title: 'AI có thể thay thế công việc của bạn không?' },
    coverImageUrl: '/images/blog/ai-jobs.svg',
    content: `
<p class="mb-4">Thay vì lo lắng AI sẽ thay thế hoàn toàn con người, hãy tập trung vào cách kết hợp AI để nâng cao năng suất.</p>
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">AI thay thế công việc, hay thay thế người không dùng AI?</h2>
<p class="mb-4">Thực tế cho thấy AI chủ yếu thay thế các tác vụ lặp lại, tốn thời gian — chứ không thay thế toàn bộ vai trò con người. Người biết kết hợp AI vào công việc sẽ có năng suất vượt trội so với người không sử dụng, và đó mới là khoảng cách thực sự đáng lo ngại.</p>
<h2 class="text-xl sm:text-2xl font-bold text-ink mt-8 mb-3">Kỹ năng cần thiết để thích nghi</h2>
<p class="mb-4">Ba kỹ năng quan trọng nhất trong thời đại AI: tư duy phản biện để đánh giá kết quả AI đưa ra, kỹ năng giao tiếp với AI (prompt engineering), và khả năng học hỏi liên tục khi công cụ AI thay đổi nhanh chóng.</p>
${CTA}`,
  },
];

async function run() {
  await connectDB();
  const admin = await User.findOne({ where: { role: 'admin' } });

  for (const u of legacyUpdates) {
    const post = await BlogPost.findOne({ where: u.match });
    if (!post) {
      console.log('[skip] legacy post not found:', u.match.title);
      continue;
    }
    await post.update({ content: u.content, coverImageUrl: u.coverImageUrl });
    console.log('[ok] legacy content updated ->', u.match.title);
  }

  for (const p of posts) {
    const existing = await BlogPost.findOne({ where: { title: p.title } });
    if (existing) {
      console.log('[skip] already exists:', p.title);
      continue;
    }
    await BlogPost.create({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImageUrl: p.coverImageUrl,
      tags: p.tags,
      isPublished: false,
      publishedAt: p.publishedAt,
      AuthorId: admin.id,
    });
    console.log('[ok] scheduled ->', p.title, '@', p.publishedAt.toISOString());
  }

  console.log('[done]');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
