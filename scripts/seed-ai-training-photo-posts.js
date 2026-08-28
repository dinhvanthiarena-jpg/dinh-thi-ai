require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

// Loạt 10 bài viết mới dùng ảnh thật từ các buổi đào tạo/hội thảo/khai giảng
// mà thầy Đinh Thi Ai đã tham gia, xoay quanh chủ đề đào tạo AI cho doanh
// nghiệp và trường học, và "AI x100" (thương hiệu khóa học của thầy). Xếp
// lịch isPublished:false + publishedAt tăng dần 1 ngày/bài — scheduler
// (services/contentScheduler.js publishDuePosts, chạy mỗi giờ) sẽ tự động
// bật isPublished khi đến ngày, sau đó facebookPostService sẽ tự lấy bài
// mới nhất để chia sẻ lên Fanpage (tối đa 2 bài/ngày) — không cần đăng tay.
const posts = [
  {
    title: 'Đinh Thi Ai đồng hành cùng doanh nghiệp trên hành trình chuyển đổi AI',
    excerpt: 'Không chỉ dạy lý thuyết, Đinh Thi Ai trực tiếp đào tạo AI ứng dụng ngay tại doanh nghiệp — từ lãnh đạo đến từng phòng ban.',
    coverImageUrl: '/images/blog/ai-training-conference-speech-photo.jpg',
    tags: ['dao-tao-ai', 'dao-tao-ung-dung-ai', 'doanh-nghiep'],
    content: `
<p>Chuyển đổi AI không bắt đầu từ việc mua phần mềm, mà bắt đầu từ việc con người trong doanh nghiệp biết cách dùng AI đúng việc, đúng lúc. Đó là lý do Đinh Thi Ai không chỉ đào tạo online, mà trực tiếp có mặt tại các doanh nghiệp, hội thảo để đồng hành cùng đội ngũ.</p>

<h2>Đào tạo AI tại doanh nghiệp khác gì một khóa học online?</h2>
<p>Khi đào tạo trực tiếp tại doanh nghiệp, nội dung được thiết kế bám sát bài toán thực tế của chính đội ngũ đó — từ quy trình bán hàng, chăm sóc khách hàng, đến vận hành nội bộ. Học viên không chỉ học "AI là gì" mà học cách áp dụng ngay vào công việc đang làm mỗi ngày.</p>

<h2>Ba nhóm được ưu tiên trong mỗi chương trình</h2>
<ul>
  <li><strong>Lãnh đạo, quản lý:</strong> hiểu đúng năng lực và giới hạn của AI để ra quyết định đầu tư, phân bổ nguồn lực hợp lý.</li>
  <li><strong>Nhân sự vận hành:</strong> biết dùng AI để rút ngắn thời gian xử lý công việc lặp lại hằng ngày.</li>
  <li><strong>Đội ngũ sáng tạo, marketing:</strong> ứng dụng AI để tạo nội dung nhanh hơn mà vẫn giữ bản sắc thương hiệu.</li>
</ul>

<p>Đây chính là tinh thần của chương trình <strong>Đào Tạo Ứng dụng AI x100</strong> — không dừng ở việc biết dùng AI, mà giúp từng phòng ban nhân hiệu suất công việc lên gấp nhiều lần.</p>
`,
  },
  {
    title: 'AI x100: Nhân hiệu suất công việc cho đội ngũ doanh nghiệp',
    excerpt: 'AI x100 không phải một con số phóng đại — đó là mục tiêu thực tế khi cả đội ngũ cùng biết ứng dụng AI đúng cách.',
    coverImageUrl: '/images/blog/ai-training-team-photo-1.jpg',
    tags: ['ai-x100', 'dao-tao-ung-dung-ai', 'nang-suat'],
    content: `
<p>"AI x100" nghe có vẻ như một khẩu hiệu marketing, nhưng thực chất phản ánh đúng những gì xảy ra khi một đội ngũ chuyển từ "biết AI tồn tại" sang "biết dùng AI mỗi ngày". Một nhân viên biết ứng dụng AI đúng cách có thể xử lý khối lượng công việc mà trước đây cần cả một nhóm.</p>

<h2>x100 đến từ đâu?</h2>
<p>Không phải từ một công cụ thần kỳ duy nhất, mà từ việc cộng dồn hàng chục tác vụ nhỏ được AI hỗ trợ: soạn email nhanh hơn, tổng hợp báo cáo trong vài phút thay vì vài giờ, lên ý tưởng nội dung tức thì, xử lý dữ liệu tự động thay vì làm thủ công. Từng việc nhỏ tiết kiệm vài chục phút, nhân lên cho cả đội ngũ mỗi ngày, con số cộng dồn là rất lớn.</p>

<h2>Bắt đầu từ đâu để đạt được x100?</h2>
<ul>
  <li>Xác định 3-5 công việc lặp lại tốn thời gian nhất trong đội ngũ.</li>
  <li>Đào tạo AI đúng vào những công việc đó trước, thay vì học lan man.</li>
  <li>Xây dựng quy trình chuẩn để cả đội cùng áp dụng, không chỉ một vài cá nhân.</li>
</ul>

<p>Đây là cách tiếp cận mà Đinh Thi Ai áp dụng trong mọi chương trình đào tạo AI cho doanh nghiệp — thực chiến, đo lường được, không lý thuyết suông.</p>
`,
  },
  {
    title: 'Vì sao doanh nghiệp cần đào tạo AI bài bản thay vì để nhân viên tự học',
    excerpt: 'Tự học AI qua video ngắn dễ khiến nhân viên dùng sai cách, sai ngữ cảnh. Đào tạo bài bản giúp cả đội ngũ đi đúng hướng ngay từ đầu.',
    coverImageUrl: '/images/blog/ai-training-team-awards-photo.jpg',
    tags: ['dao-tao-ai', 'dao-tao-ung-dung-ai', 'doanh-nghiep'],
    content: `
<p>Rất nhiều doanh nghiệp nghĩ rằng chỉ cần cho nhân viên "tự mày mò" ChatGPT, Gemini hay Claude là đủ. Thực tế, cách học tự phát này thường dừng lại ở mức dùng AI để "hỏi cho vui", chứ chưa tạo ra thay đổi thực sự trong hiệu suất công việc.</p>

<h2>Rủi ro khi để nhân viên tự học AI</h2>
<ul>
  <li>Mỗi người dùng một cách khác nhau, không có quy trình thống nhất.</li>
  <li>Dễ nhập thông tin nhạy cảm của công ty vào công cụ AI mà không biết rủi ro bảo mật.</li>
  <li>Chỉ dùng AI cho việc nhỏ lẻ, bỏ lỡ những tác vụ có thể tiết kiệm nhiều thời gian nhất.</li>
</ul>

<h2>Đào tạo bài bản mang lại gì?</h2>
<p>Một chương trình đào tạo AI được thiết kế riêng cho doanh nghiệp sẽ giúp toàn đội ngũ dùng chung một quy trình, hiểu rõ giới hạn và rủi ro của AI, đồng thời tập trung vào đúng những công việc mang lại hiệu quả cao nhất. Đó là lý do Đinh Thi Ai luôn ưu tiên đào tạo theo nhóm, theo phòng ban, thay vì chỉ dạy cá nhân đơn lẻ.</p>

<p>Một đội ngũ được đào tạo đúng cách sẽ tạo ra khác biệt rõ rệt so với một đội ngũ chỉ "biết AI tồn tại" — đó là khoảng cách giữa ứng dụng AI thật sự và chỉ dùng thử cho vui.</p>
`,
  },
  {
    title: 'Chia sẻ tại hội thảo: AI đang thay đổi cách doanh nghiệp vận hành như thế nào',
    excerpt: 'Từ các buổi hội thảo, tọa đàm doanh nghiệp, Đinh Thi Ai chia sẻ góc nhìn thực tế về cách AI đang thay đổi vận hành doanh nghiệp Việt Nam.',
    coverImageUrl: '/images/blog/ai-training-youtube-award-panel-photo.jpg',
    tags: ['dao-tao-ung-dung-ai', 'hoi-thao', 'doanh-nghiep'],
    content: `
<p>Tại nhiều hội thảo, tọa đàm dành cho doanh nghiệp, một câu hỏi luôn được đặt ra: "Doanh nghiệp của tôi nên bắt đầu ứng dụng AI từ đâu?". Không có một câu trả lời chung cho tất cả, nhưng có một nguyên tắc chung: bắt đầu từ vấn đề thực tế, không bắt đầu từ công cụ.</p>

<h2>Ba xu hướng được nhắc đến nhiều nhất</h2>
<ul>
  <li><strong>AI hỗ trợ ra quyết định:</strong> tổng hợp và phân tích dữ liệu nhanh hơn để lãnh đạo quyết định kịp thời.</li>
  <li><strong>AI tự động hóa quy trình:</strong> giảm thời gian xử lý các tác vụ hành chính, báo cáo lặp lại.</li>
  <li><strong>AI hỗ trợ sáng tạo nội dung:</strong> giúp đội ngũ marketing sản xuất nội dung nhanh hơn mà vẫn đảm bảo chất lượng.</li>
</ul>

<h2>Bài học thực tế từ các buổi chia sẻ</h2>
<p>Doanh nghiệp thành công với AI thường không phải doanh nghiệp có ngân sách lớn nhất, mà là doanh nghiệp có đội ngũ được đào tạo bài bản và kiên trì áp dụng. Đây cũng là thông điệp xuyên suốt mà Đinh Thi Ai mang đến trong mỗi buổi đào tạo AI cho doanh nghiệp.</p>
`,
  },
  {
    title: 'Ứng dụng AI trong từng phòng ban: Marketing, Kinh doanh, Vận hành, Nhân sự',
    excerpt: 'Mỗi phòng ban có một cách ứng dụng AI khác nhau — đây là cách Đinh Thi Ai thiết kế nội dung đào tạo riêng cho từng bộ phận.',
    coverImageUrl: '/images/blog/ai-training-roundtable-discussion-photo.jpg',
    tags: ['dao-tao-ung-dung-ai', 'ai-doanh-nghiep', 'phong-ban'],
    content: `
<p>Không có một bài giảng AI nào phù hợp cho tất cả các phòng ban. Đội marketing cần AI để sáng tạo nội dung, đội kinh doanh cần AI để soạn báo giá và chăm sóc khách hàng nhanh hơn, đội vận hành cần AI để xử lý dữ liệu và quy trình. Đó là lý do các chương trình đào tạo AI hiệu quả nhất luôn được thiết kế riêng theo từng bộ phận.</p>

<h2>Gợi ý ứng dụng theo từng phòng ban</h2>
<ul>
  <li><strong>Marketing:</strong> lên ý tưởng chiến dịch, viết nội dung đa nền tảng, tạo hình ảnh minh họa nhanh.</li>
  <li><strong>Kinh doanh:</strong> soạn email, báo giá, kịch bản tư vấn khách hàng theo từng tình huống.</li>
  <li><strong>Vận hành:</strong> tổng hợp báo cáo, xử lý dữ liệu, tự động hóa các bước lặp lại.</li>
  <li><strong>Nhân sự:</strong> soạn thảo tài liệu nội bộ, hỗ trợ sàng lọc hồ sơ, xây dựng chương trình đào tạo.</li>
</ul>

<p>Khi mỗi phòng ban đều biết ứng dụng AI đúng vào công việc của mình, hiệu quả sẽ cộng dồn trên toàn doanh nghiệp — đúng tinh thần "Đào Tạo Ứng dụng AI x100" mà Đinh Thi Ai theo đuổi.</p>
`,
  },
  {
    title: 'Đào tạo AI cho giảng viên, giáo viên: Công cụ mới cho lớp học hiện đại',
    excerpt: 'AI có thể giúp giảng viên, giáo viên soạn giáo án nhanh hơn, cá nhân hóa bài giảng và tương tác với học sinh hiệu quả hơn.',
    coverImageUrl: '/images/blog/ai-training-classroom-presentation-photo.jpg',
    tags: ['dao-tao-ai', 'ai-giao-duc', 'giao-vien'],
    content: `
<p>Giảng viên, giáo viên là một trong những nhóm hưởng lợi rõ rệt nhất từ AI — nhưng cũng là nhóm ít được đào tạo bài bản nhất về cách ứng dụng. Phần lớn thời gian của người dạy học không phải trên bục giảng, mà là soạn giáo án, chấm bài, chuẩn bị tài liệu — những việc AI có thể hỗ trợ rất tốt.</p>

<h2>AI có thể hỗ trợ giảng viên, giáo viên ở đâu?</h2>
<ul>
  <li>Soạn giáo án, đề cương bài giảng nhanh hơn theo đúng khung chương trình.</li>
  <li>Tạo câu hỏi ôn tập, đề kiểm tra với nhiều mức độ khó khác nhau.</li>
  <li>Tóm tắt tài liệu chuyên môn dài thành nội dung dễ truyền đạt.</li>
  <li>Gợi ý cách giải thích một khái niệm khó theo nhiều cách tiếp cận khác nhau cho học sinh.</li>
</ul>

<h2>Vì sao cần đào tạo thay vì để tự mày mò?</h2>
<p>Không phải giảng viên nào cũng có thời gian tự tìm hiểu cách viết yêu cầu (prompt) hiệu quả cho AI. Một buổi đào tạo bài bản giúp rút ngắn thời gian làm quen, tránh những sai lầm phổ biến, và giúp giáo viên tự tin ứng dụng AI ngay vào công việc giảng dạy hằng ngày.</p>
`,
  },
  {
    title: 'Lễ khai giảng và câu chuyện đưa AI vào chương trình đào tạo của các trường',
    excerpt: 'Ngày càng nhiều trường học, học viện chủ động đưa AI vào chương trình đào tạo ngay từ lễ khai giảng đầu năm học.',
    coverImageUrl: '/images/blog/ai-training-opening-ceremony-group-photo.jpg',
    tags: ['dao-tao-ai', 'ai-giao-duc', 'truong-hoc'],
    content: `
<p>Tại nhiều lễ khai giảng năm học gần đây, AI không còn là một chủ đề "nói cho vui" mà đã trở thành một phần trong định hướng đào tạo chính thức. Các trường, học viện hiểu rằng sinh viên tốt nghiệp trong vài năm tới bắt buộc phải biết ứng dụng AI để cạnh tranh trên thị trường lao động.</p>

<h2>Vì sao các trường chủ động đưa AI vào chương trình học</h2>
<ul>
  <li>Doanh nghiệp tuyển dụng ngày càng ưu tiên ứng viên biết ứng dụng AI vào công việc thực tế.</li>
  <li>AI giúp sinh viên rút ngắn thời gian cho các công việc nghiên cứu, làm đồ án, xử lý dữ liệu.</li>
  <li>Việc làm quen sớm với AI giúp sinh viên thích nghi nhanh hơn khi bước vào môi trường doanh nghiệp.</li>
</ul>

<h2>Đào tạo AI ứng dụng ngay từ năm nhất</h2>
<p>Thay vì chờ đến năm cuối mới tiếp cận công nghệ mới, nhiều trường đã mời chuyên gia đào tạo AI ứng dụng ngay từ những buổi sinh hoạt đầu khóa — giúp sinh viên có tư duy đúng về AI ngay từ ngày đầu tiên bước chân vào trường.</p>
`,
  },
  {
    title: 'Sinh viên năm nhất học AI ứng dụng ngay từ ngày đầu nhập học',
    excerpt: 'Thay vì chờ đến năm cuối, nhiều tân sinh viên đã được làm quen với AI ứng dụng ngay trong tuần sinh hoạt công dân đầu khóa.',
    coverImageUrl: '/images/blog/ai-training-college-orientation-photo.jpg',
    tags: ['dao-tao-ung-dung-ai', 'ai-giao-duc', 'sinh-vien'],
    content: `
<p>Tuần sinh hoạt công dân đầu khóa thường dành để giới thiệu quy chế, nội quy, các hoạt động ngoại khóa. Nhưng tại một số trường, nội dung này giờ đây có thêm một buổi: đào tạo AI ứng dụng cơ bản cho tân sinh viên.</p>

<h2>Vì sao nên học AI ngay từ năm nhất?</h2>
<ul>
  <li>AI sẽ đồng hành cùng sinh viên trong suốt 4 năm học — càng biết sớm, càng tận dụng được nhiều.</li>
  <li>Giúp việc học các môn đại cương, viết tiểu luận, tìm tài liệu trở nên hiệu quả hơn.</li>
  <li>Tạo nền tảng tư duy đúng về AI trước khi bước vào các môn chuyên ngành.</li>
</ul>

<h2>Không cần nền tảng công nghệ để bắt đầu</h2>
<p>Điều thú vị là sinh viên không cần biết lập trình để học ứng dụng AI — chỉ cần biết cách đặt câu hỏi và giao việc đúng cách. Đây cũng chính là triết lý đào tạo mà Đinh Thi Ai áp dụng: AI ứng dụng phải dễ tiếp cận với tất cả mọi người, không riêng dân công nghệ.</p>
`,
  },
  {
    title: 'AI trong lớp học: Học sinh, sinh viên ứng dụng AI vào bài tập thực tế ra sao',
    excerpt: 'Từ làm bài tập nhóm đến thuyết trình, học sinh sinh viên đang dùng AI như một công cụ hỗ trợ học tập hằng ngày.',
    coverImageUrl: '/images/blog/ai-training-students-classroom-photo.jpg',
    tags: ['ai-giao-duc', 'dao-tao-ung-dung-ai', 'hoc-sinh'],
    content: `
<p>Trong các buổi thực hành tại lớp học, không khó để bắt gặp hình ảnh học sinh, sinh viên mở song song một công cụ AI bên cạnh phần mềm chuyên ngành đang học — từ chỉnh sửa hình ảnh, dựng video, đến xử lý dữ liệu.</p>

<h2>Những cách học sinh, sinh viên đang dùng AI</h2>
<ul>
  <li>Tìm ý tưởng và dàn ý cho bài thuyết trình, tiểu luận.</li>
  <li>Hỗ trợ chỉnh sửa, hoàn thiện sản phẩm thiết kế, hình ảnh trong bài tập thực hành.</li>
  <li>Giải thích lại một khái niệm khó theo cách dễ hiểu hơn khi tự học ở nhà.</li>
  <li>Luyện tập phản biện bằng cách để AI đóng vai người hỏi ngược lại.</li>
</ul>

<h2>Vai trò của người hướng dẫn</h2>
<p>AI hỗ trợ tốt nhất khi có người hướng dẫn đúng cách sử dụng — tránh để học sinh, sinh viên lệ thuộc hoàn toàn hoặc dùng sai mục đích. Đây là lý do các buổi đào tạo AI ứng dụng tại trường học luôn đi kèm hướng dẫn về cách dùng AI có trách nhiệm, đúng mực.</p>
`,
  },
  {
    title: 'Hỏi đáp cùng Đinh Thi Ai: Học AI có khó không, bắt đầu từ đâu?',
    excerpt: 'Những câu hỏi được đặt ra nhiều nhất trong các buổi đào tạo AI tại doanh nghiệp và trường học — và câu trả lời thực tế nhất.',
    coverImageUrl: '/images/blog/ai-training-students-questions-photo.jpg',
    tags: ['dao-tao-ai', 'hoc-ai', 'nguoi-moi-bat-dau'],
    content: `
<p>Sau mỗi buổi đào tạo AI tại doanh nghiệp hay trường học, phần hỏi đáp thường là phần sôi nổi nhất. Dưới đây là những câu hỏi lặp lại nhiều nhất, và câu trả lời thực tế nhất dành cho người mới bắt đầu.</p>

<h2>Học AI có cần biết lập trình không?</h2>
<p>Không. Phần lớn việc ứng dụng AI vào công việc hằng ngày chỉ cần biết cách đặt câu hỏi (prompt) rõ ràng, không cần viết một dòng code nào.</p>

<h2>Bắt đầu từ đâu nếu chưa biết gì về AI?</h2>
<p>Bắt đầu từ chính công việc đang làm mỗi ngày: chọn một việc lặp lại, tốn thời gian, rồi thử giao việc đó cho AI. Học từ tình huống thực tế luôn hiệu quả hơn học lý thuyết dàn trải.</p>

<h2>Mất bao lâu để thấy hiệu quả?</h2>
<p>Với cách tiếp cận đúng, phần lớn học viên đã có thể tiết kiệm thời gian ngay trong buổi học đầu tiên. Hiệu quả lớn hơn (đúng tinh thần AI x100) đến khi cả đội ngũ hoặc cả lớp học cùng áp dụng nhất quán theo thời gian.</p>

<p>Đây cũng là lý do Đinh Thi Ai luôn nhấn mạnh: đào tạo AI hiệu quả nhất là đào tạo thực chiến, gắn với công việc thật, không phải lý thuyết suông.</p>
`,
  },
];

async function run() {
  await connectDB();

  const startDate = new Date();
  startDate.setHours(9, 0, 0, 0); // publish at 9AM each day

  for (let i = 0; i < posts.length; i += 1) {
    const publishedAt = new Date(startDate);
    publishedAt.setDate(publishedAt.getDate() + i);

    const p = posts[i];
    const existing = await BlogPost.findOne({ where: { title: p.title } });
    if (existing) {
      console.log('skipped (already exists):', p.title);
      continue;
    }

    const post = await BlogPost.create({
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImageUrl: p.coverImageUrl,
      tags: p.tags,
      isPublished: i === 0, // first post goes live immediately, rest wait for their scheduled day
      publishedAt,
    });
    console.log(`created: "${post.title}" -> publishedAt ${publishedAt.toISOString()} (isPublished=${i === 0})`);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
