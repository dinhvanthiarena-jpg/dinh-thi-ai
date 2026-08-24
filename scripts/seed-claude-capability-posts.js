require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

// Loạt bài giới thiệu năng lực của Claude (giao việc, làm nhân viên ảo, lập
// trình web/ứng dụng...) — thầy yêu cầu đăng lên blog 3dvietpro.com trước,
// sau đó facebookPostService sẽ tự lấy các bài này để chia sẻ lên Fanpage
// (2 bài/ngày, xem services/contentScheduler.js).
const posts = [
  {
    title: 'Giao việc cho AI: Cách dùng Claude như một trợ lý đắc lực mỗi ngày',
    excerpt: 'Bạn không cần biết lập trình để "sai" AI làm việc. Đây là cách giao việc cho Claude hiệu quả nhất.',
    tags: ['Claude AI', 'Ung dung AI', 'Nang suat'],
    content: `
<p>Nếu bạn vẫn nghĩ AI chỉ để "hỏi cho vui" thì đã đến lúc thay đổi cách nhìn. Claude — trợ lý AI của Anthropic — có thể nhận việc, xử lý và trả lại kết quả gần như một nhân viên thực thụ, chỉ khác là không cần lương, không cần nghỉ phép, và làm việc 24/7.</p>

<h2>Giao việc cho Claude khác gì so với "hỏi Google"?</h2>
<p>Khi bạn tìm kiếm trên Google, bạn nhận về hàng chục đường link và phải tự tổng hợp. Khi bạn giao việc cho Claude, bạn mô tả kết quả mong muốn — Claude sẽ tự lên kế hoạch, thực hiện từng bước, và trả về đúng thứ bạn cần: một bản báo cáo, một email đã soạn sẵn, một bảng so sánh, hay một đoạn code chạy được.</p>

<h2>Những việc bạn có thể giao ngay hôm nay</h2>
<ul>
  <li><strong>Soạn thảo văn bản:</strong> email khách hàng, hợp đồng nháp, bài đăng mạng xã hội, kịch bản video.</li>
  <li><strong>Tổng hợp và phân tích:</strong> đọc hộ hàng chục trang tài liệu, tóm tắt báo cáo tài chính, so sánh sản phẩm đối thủ.</li>
  <li><strong>Lên kế hoạch:</strong> lịch trình dự án, checklist công việc, kịch bản marketing theo tuần.</li>
  <li><strong>Xử lý dữ liệu:</strong> làm sạch bảng Excel, tạo công thức, trực quan hóa số liệu.</li>
</ul>

<h2>Bí quyết giao việc hiệu quả</h2>
<p>Càng mô tả rõ bối cảnh, mục tiêu và định dạng đầu ra mong muốn, Claude càng trả về kết quả sát ý bạn. Thay vì nói "viết cho tôi một email", hãy nói "viết email cảm ơn khách hàng vừa mua khóa học, giọng văn thân thiện, có gợi ý khóa học tiếp theo, dài khoảng 100 từ". Sự khác biệt là rất lớn.</p>

<p>Đây chính là kỹ năng cốt lõi mà Đinh Thi Ai đào tạo trong các khóa Prompt Engineering — không phải để bạn trở thành lập trình viên, mà để bạn biến AI thành nhân sự làm việc hiệu quả nhất trong đội ngũ của mình.</p>
`,
  },
  {
    title: 'AI làm nhân viên: Khi Claude gánh vác công việc như một nhân sự thực thụ',
    excerpt: 'Từ chăm sóc khách hàng đến quản lý nội dung — Claude có thể đảm nhiệm vai trò của cả một vị trí nhân sự.',
    tags: ['Claude AI', 'Nhan vien ao', 'Doanh nghiep'],
    content: `
<p>Nhiều doanh nghiệp nhỏ không đủ ngân sách thuê nhân sự cho mọi vị trí. Đây là lúc Claude trở thành lựa chọn: một "nhân viên ảo" có thể đảm nhiệm nhiều vai trò cùng lúc, phản hồi tức thì và không giới hạn giờ làm.</p>

<h2>Những "vị trí" Claude có thể đảm nhiệm</h2>
<ul>
  <li><strong>Nhân viên chăm sóc khách hàng:</strong> trả lời tin nhắn, tư vấn sản phẩm, xử lý câu hỏi thường gặp 24/7 — đúng như hệ thống chatbot AI mà Đinh Thi Ai đã triển khai trên chính website và Fanpage Messenger.</li>
  <li><strong>Nhân viên content:</strong> viết bài blog, caption mạng xã hội, kịch bản video ngắn theo đúng giọng văn thương hiệu.</li>
  <li><strong>Trợ lý hành chính:</strong> soạn thảo tài liệu, tổng hợp email, chuẩn bị báo cáo cuối tuần.</li>
  <li><strong>Nhân viên phân tích:</strong> đọc dữ liệu bán hàng, đưa ra nhận định xu hướng, đề xuất hành động.</li>
</ul>

<h2>Vì sao doanh nghiệp Việt Nam nên bắt đầu ngay</h2>
<p>Không phải để thay thế con người hoàn toàn, mà để giải phóng thời gian cho những việc cần tư duy chiến lược. Một nhân viên biết dùng AI đúng cách có thể làm việc của 2-3 người — đó là lợi thế cạnh tranh thực sự trong thời đại này.</p>

<p>Khóa học "AI cho doanh nghiệp" của Đinh Thi Ai được thiết kế riêng để giúp chủ doanh nghiệp và quản lý biết cách xây dựng quy trình làm việc với AI, từ những việc đơn giản nhất đến tự động hóa toàn bộ phòng ban.</p>
`,
  },
  {
    title: 'Lập trình web với Claude: Từ ý tưởng đến sản phẩm hoàn chỉnh',
    excerpt: 'Không cần là lập trình viên chuyên nghiệp, bạn vẫn có thể xây dựng một website hoàn chỉnh cùng Claude.',
    tags: ['Claude AI', 'Lap trinh web', 'Cong nghe'],
    content: `
<p>Xây một website từng là công việc của riêng các lập trình viên. Giờ đây, với Claude, khoảng cách đó đang được thu hẹp lại đáng kể — không phải vì AI "code hộ" một cách máy móc, mà vì nó hiểu được ý tưởng và biến thành sản phẩm thật.</p>

<h2>Claude có thể làm gì trong một dự án web?</h2>
<ul>
  <li>Viết toàn bộ mã nguồn: giao diện (frontend), xử lý logic (backend), kết nối cơ sở dữ liệu.</li>
  <li>Thiết kế trải nghiệm người dùng hợp lý, tối ưu cho cả máy tính và điện thoại.</li>
  <li>Tối ưu SEO ngay từ khi viết code: thẻ meta, sitemap, dữ liệu có cấu trúc.</li>
  <li>Tìm và sửa lỗi, cải thiện hiệu năng, triển khai lên máy chủ thực tế.</li>
</ul>

<p>Trên thực tế, chính website 3dvietpro.com mà bạn đang đọc bài viết này cũng được xây dựng theo phương pháp đó — từ hệ thống quản lý khóa học, thanh toán, cho đến chatbot AI tích hợp Facebook Messenger.</p>

<h2>Bạn không cần biết code để bắt đầu</h2>
<p>Điều quan trọng nhất không phải là thuộc lòng cú pháp lập trình, mà là biết cách mô tả chính xác bạn muốn xây dựng cái gì, cho ai, và giải quyết vấn đề gì. Đó là kỹ năng mà bất kỳ ai — kể cả người chưa từng viết một dòng code — đều có thể học được.</p>

<p>Trong các khóa học Generative AI và AI ứng dụng của Đinh Thi Ai, học viên được thực hành xây dựng sản phẩm thật, từ landing page bán hàng cho đến hệ thống quản lý nội bộ, hoàn toàn cùng sự hỗ trợ của AI.</p>
`,
  },
  {
    title: 'Xây dựng ứng dụng với AI: Cơ hội cho người không chuyên công nghệ',
    excerpt: 'Ứng dụng di động, phần mềm quản lý, công cụ nội bộ — tất cả đều có thể bắt đầu chỉ bằng một ý tưởng và Claude.',
    tags: ['Claude AI', 'Phat trien ung dung', 'Khoi nghiep'],
    content: `
<p>Rào cản lớn nhất khi muốn xây một ứng dụng thường không phải là ý tưởng, mà là thiếu đội ngũ kỹ thuật. Claude đang thay đổi điều đó — biến những người không chuyên công nghệ thành người tạo ra sản phẩm số thực thụ.</p>

<h2>Từ ý tưởng đến ứng dụng chạy thật</h2>
<p>Một chủ shop online có thể nhờ Claude xây dựng công cụ quản lý đơn hàng riêng. Một giáo viên có thể tạo ứng dụng luyện tập từ vựng cho học sinh. Một quán ăn có thể có app đặt bàn của riêng mình — tất cả không cần thuê đội ngũ lập trình đắt đỏ.</p>

<h2>Quy trình xây dựng ứng dụng cùng AI</h2>
<ul>
  <li><strong>Bước 1 — Mô tả bài toán:</strong> ứng dụng giải quyết vấn đề gì, dành cho ai.</li>
  <li><strong>Bước 2 — Thiết kế luồng sử dụng:</strong> người dùng thao tác qua những màn hình nào.</li>
  <li><strong>Bước 3 — Xây dựng và kiểm thử:</strong> Claude viết mã, chạy thử, sửa lỗi liên tục.</li>
  <li><strong>Bước 4 — Triển khai thực tế:</strong> đưa ứng dụng lên môi trường thật để người dùng sử dụng.</li>
</ul>

<p>Điều thú vị là toàn bộ quy trình này có thể diễn ra trong vài ngày thay vì vài tháng như cách làm truyền thống — đây chính là lợi thế tốc độ mà doanh nghiệp nhỏ và startup cần để cạnh tranh.</p>

<p>Nếu bạn đang ấp ủ một ý tưởng ứng dụng nhưng chưa biết bắt đầu từ đâu, các khóa học AI ứng dụng của Đinh Thi Ai sẽ là điểm khởi đầu phù hợp — thực hành thật, sản phẩm thật, không lý thuyết suông.</p>
`,
  },
  {
    title: 'Tự động hóa công việc văn phòng: Claude giúp bạn tiết kiệm hàng giờ mỗi ngày',
    excerpt: 'Những công việc lặp đi lặp lại mỗi ngày hoàn toàn có thể giao cho AI xử lý tự động.',
    tags: ['Claude AI', 'Tu dong hoa', 'Nang suat'],
    content: `
<p>Bạn có để ý mỗi ngày mình dành bao nhiêu thời gian cho những việc lặp lại: sắp xếp email, tổng hợp báo cáo, nhập liệu, trả lời câu hỏi giống nhau từ khách hàng? Đó chính là những việc AI làm tốt nhất — và nhanh nhất.</p>

<h2>Những quy trình nên tự động hóa đầu tiên</h2>
<ul>
  <li>Trả lời tin nhắn và email thường gặp bằng chatbot AI được huấn luyện theo đúng dữ liệu doanh nghiệp.</li>
  <li>Tự động tạo và lên lịch đăng bài trên mạng xã hội thay vì làm thủ công mỗi ngày.</li>
  <li>Tổng hợp báo cáo định kỳ từ dữ liệu bán hàng, không cần copy-paste thủ công.</li>
  <li>Soạn hợp đồng, báo giá theo mẫu có sẵn chỉ trong vài giây.</li>
</ul>

<h2>Câu chuyện thực tế</h2>
<p>Ngay chính hệ thống của Đinh Thi Ai cũng đang vận hành theo cách này: chatbot AI tự trả lời khách hàng tư vấn khóa học suốt ngày đêm, và hệ thống tự động viết bài, đăng lên Fanpage mỗi ngày mà không cần ai ngồi soạn thủ công. Đây không phải là công nghệ tương lai — mà là thứ đang chạy thật, ngay lúc bạn đọc bài viết này.</p>

<p>Tự động hóa không có nghĩa là mất kiểm soát — bạn vẫn là người quyết định quy trình, AI chỉ là người thực thi không biết mệt mỏi. Đó là lý do ngày càng nhiều doanh nghiệp vừa và nhỏ tại Việt Nam bắt đầu đầu tư nghiêm túc vào kỹ năng này.</p>
`,
  },
  {
    title: 'Claude cho người mới bắt đầu: Không cần biết code vẫn dùng được AI ở trình độ cao',
    excerpt: 'Rào cản lớn nhất khi học AI không phải là công nghệ, mà là tâm lý e ngại. Đây là hướng dẫn để bạn bắt đầu tự tin.',
    tags: ['Claude AI', 'Hoc AI co ban', 'Nguoi moi bat dau'],
    content: `
<p>"Tôi không biết gì về công nghệ, liệu có học được AI không?" — đây là câu hỏi phổ biến nhất mà Đinh Thi Ai nhận được từ học viên. Câu trả lời luôn là: hoàn toàn có thể, và bạn không cần xuất phát điểm là dân kỹ thuật.</p>

<h2>Vì sao Claude phù hợp với người mới?</h2>
<p>Claude được thiết kế để giao tiếp bằng ngôn ngữ tự nhiên — bạn chỉ cần diễn đạt điều mình muốn như đang nói chuyện với một đồng nghiệp. Không cần cú pháp, không cần thuật ngữ kỹ thuật phức tạp.</p>

<h2>3 bước để bắt đầu ngay hôm nay</h2>
<ul>
  <li><strong>Bước 1:</strong> Bắt đầu với những việc quen thuộc — nhờ AI viết một email, tóm tắt một bài báo, lên ý tưởng cho bài đăng mạng xã hội.</li>
  <li><strong>Bước 2:</strong> Học cách mô tả yêu cầu rõ ràng hơn — càng cụ thể, kết quả càng chính xác.</li>
  <li><strong>Bước 3:</strong> Mở rộng dần sang những việc phức tạp hơn: phân tích dữ liệu, xây dựng công cụ nhỏ, tự động hóa quy trình.</li>
</ul>

<p>Rất nhiều học viên của Đinh Thi Ai xuất phát điểm là nhân viên văn phòng, chủ shop online, giáo viên — không một ai từng viết code trước khi đến lớp. Sau khóa học, họ tự tay xây dựng được chatbot, tự động hóa công việc, thậm chí tạo ra sản phẩm số của riêng mình.</p>

<p>Nếu bạn đang tìm một điểm khởi đầu an toàn, dễ hiểu và thực chiến để làm chủ AI, các khóa học AI cơ bản tại Đinh Thi Ai chính là nơi phù hợp nhất để bắt đầu.</p>
`,
  },
];

async function run() {
  await connectDB();

  for (const p of posts) {
    const existing = await BlogPost.findOne({ where: { title: p.title } });
    if (existing) {
      console.log('skipped (already exists):', p.title);
      continue;
    }
    const post = await BlogPost.create({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content.trim(),
      tags: p.tags,
      isPublished: true,
      publishedAt: new Date(),
    });
    console.log('created:', post.title, '->', post.slug);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
