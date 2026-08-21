// One-off maintenance script: updates existing seeded rows (created before
// diacritics were added) so their Vietnamese text matches scripts/seed.js.
// Safe to re-run; matches rows by their original un-accented title/order.
require('dotenv').config();
const connectDB = require('../config/db');
const { User, Course, Lesson, BlogPost } = require('../models');

const courseUpdates = [
  {
    match: { title: 'Nhap mon AI ung dung cho nguoi di lam' },
    data: {
      title: 'Nhập môn AI ứng dụng cho người đi làm',
      subtitle: 'Hiểu và ứng dụng AI vào công việc hàng ngày, không cần biết lập trình',
      description:
        'Khóa học giúp bạn hiểu bản chất của AI, cách các công cụ như ChatGPT, Gemini hoạt động, và cách ứng dụng ngay vào công việc văn phòng: viết nội dung, tổng hợp dữ liệu, hỗ trợ ra quyết định.',
      category: 'AI cơ bản',
      level: 'Cơ bản',
      outcomes: [
        'Hiểu các khái niệm nền tảng về AI và Machine Learning',
        'Sử dụng thành thạo ChatGPT/Gemini cho công việc',
        'Xây dựng quy trình làm việc kết hợp AI',
        'Nhận biết giới hạn và rủi ro khi dùng AI',
      ],
      requirements: ['Có máy tính kết nối internet', 'Không cần kinh nghiệm lập trình'],
    },
    lessons: [
      'AI là gì và vì sao bạn cần quan tâm',
      'Các loại hình AI phổ biến hiện nay',
      'Thực hành với ChatGPT cơ bản',
      'Xây dựng workflow AI cho công việc',
    ],
  },
  {
    match: { title: 'Prompt Engineering thuc chien' },
    data: {
      title: 'Prompt Engineering thực chiến',
      subtitle: 'Kỹ thuật viết prompt hiệu quả để khai thác tối đa sức mạnh AI',
      description:
        'Từ các nguyên tắc cơ bản đến kỹ thuật nâng cao: chain-of-thought, few-shot prompting, bạn sẽ học cách thiết kế prompt chính xác cho từng mục đích công việc cụ thể.',
      category: 'Prompt Engineering',
      level: 'Trung cấp',
      outcomes: [
        'Nắm vững cấu trúc một prompt hiệu quả',
        'Áp dụng kỹ thuật few-shot và chain-of-thought',
        'Xây dựng thư viện prompt cho doanh nghiệp',
        'Tối ưu chi phí khi dùng AI API',
      ],
      requirements: ['Đã hoàn thành khóa Nhập môn AI hoặc tương đương'],
    },
    lessons: [
      'Nguyên tắc vàng của Prompt Engineering',
      'Kỹ thuật Few-shot Prompting',
      'Chain-of-Thought và reasoning prompts',
      'Xây dựng hệ thống prompt cho sản phẩm',
    ],
  },
  {
    match: { title: 'Generative AI: Tao noi dung va hinh anh chuyen nghiep' },
    data: {
      title: 'Generative AI: Tạo nội dung và hình ảnh chuyên nghiệp',
      subtitle: 'Ứng dụng Generative AI để tạo nội dung marketing, hình ảnh và video',
      description:
        'Khám phá các công cụ Generative AI hàng đầu (Midjourney, DALL-E, Sora) và cách tích hợp vào quy trình sáng tạo nội dung cho cá nhân và doanh nghiệp.',
      category: 'Generative AI',
      level: 'Trung cấp',
      outcomes: [
        'Tạo hình ảnh chuyên nghiệp bằng AI',
        'Sản xuất nội dung video ngắn với AI',
        'Xây dựng bộ nhận diện thương hiệu bằng AI',
        'Quy trình kiểm duyệt và bản quyền nội dung AI',
      ],
      requirements: ['Có kiến thức cơ bản về thiết kế là lợi thế'],
    },
    lessons: [
      'Tổng quan hệ sinh thái Generative AI',
      'Tạo hình ảnh với Midjourney',
      'Sản xuất video ngắn bằng AI',
      'Xây dựng bộ nhận diện thương hiệu',
    ],
  },
  {
    match: { title: 'Trien khai AI cho doanh nghiep vua va nho' },
    data: {
      title: 'Triển khai AI cho doanh nghiệp vừa và nhỏ',
      subtitle: 'Lộ trình từng bước để doanh nghiệp ứng dụng AI hiệu quả, tiết kiệm chi phí',
      description:
        'Dành cho chủ doanh nghiệp và quản lý: xây dựng chiến lược, đánh giá ROI, và triển khai các giải pháp AI thực tế như chatbot chăm sóc khách hàng, tự động hóa quy trình.',
      category: 'AI cho doanh nghiệp',
      level: 'Nâng cao',
      outcomes: [
        'Xây dựng chiến lược AI phù hợp quy mô doanh nghiệp',
        'Triển khai chatbot chăm sóc khách hàng bằng AI',
        'Tự động hóa quy trình văn phòng với AI',
        'Đo lường ROI của các dự án AI',
      ],
      requirements: ['Dành cho chủ doanh nghiệp, quản lý cấp trung và cao'],
    },
    lessons: [
      'Xây dựng chiến lược AI cho doanh nghiệp',
      'Triển khai chatbot chăm sóc khách hàng',
      'Tự động hóa quy trình bằng AI',
      'Đo lường hiệu quả và ROI',
    ],
  },
];

const blogUpdates = [
  {
    match: { title: '5 xu huong AI dang chu y nam 2026' },
    data: {
      title: '5 xu hướng AI đáng chú ý năm 2026',
      excerpt: 'Điểm qua những xu hướng công nghệ AI nổi bật sẽ ảnh hưởng đến cách chúng ta làm việc.',
      content:
        'Năm 2026 chứng kiến sự bùng nổ của các AI agent tự hành, khả năng xử lý đa phương tiện (multimodal), và sự phổ biến của AI cá nhân hóa. Bài viết này điểm qua 5 xu hướng quan trọng nhất và cách doanh nghiệp có thể chuẩn bị để không bị bỏ lại phía sau.',
    },
  },
  {
    match: { title: 'Huong dan viet prompt hieu qua cho nguoi moi bat dau' },
    data: {
      title: 'Hướng dẫn viết prompt hiệu quả cho người mới bắt đầu',
      excerpt: 'Những nguyên tắc cơ bản giúp bạn giao tiếp hiệu quả hơn với AI.',
      content:
        'Một prompt tốt cần rõ ràng về ngữ cảnh, mục tiêu và định dạng mong muốn. Bài viết chia sẻ công thức CO-STAR để xây dựng prompt chất lượng cao, kèm theo ví dụ thực tế trong công việc văn phòng.',
    },
  },
  {
    match: { title: 'AI co the thay the cong viec cua ban khong?' },
    data: {
      title: 'AI có thể thay thế công việc của bạn không?',
      excerpt: 'Góc nhìn thực tế về tác động của AI đến thị trường lao động.',
      content:
        'Thay vì lo lắng AI sẽ thay thế hoàn toàn con người, hãy tập trung vào cách kết hợp AI để nâng cao năng suất. Bài viết phân tích những kỹ năng cần thiết để thích nghi với thời đại AI.',
    },
  },
];

async function run() {
  await connectDB();

  for (const { match, data, lessons } of courseUpdates) {
    const course = await Course.findOne({ where: match });
    if (!course) {
      console.log('[skip] course not found:', match.title);
      continue;
    }
    await course.update(data);
    console.log('[ok] course ->', data.title);

    if (lessons) {
      const rows = await Lesson.findAll({ where: { CourseId: course.id }, order: [['order', 'ASC']] });
      for (let i = 0; i < rows.length && i < lessons.length; i++) {
        await rows[i].update({ title: lessons[i] });
      }
      console.log('    lessons updated:', rows.length);
    }
  }

  for (const { match, data } of blogUpdates) {
    const post = await BlogPost.findOne({ where: match });
    if (!post) {
      console.log('[skip] blog post not found:', match.title);
      continue;
    }
    await post.update(data);
    console.log('[ok] blog ->', data.title);
  }

  const admin = await User.findOne({ where: { role: 'admin' } });
  if (admin && admin.name === 'Dinh Thi Ai') {
    await admin.update({ name: 'Đinh Thi Ai' });
    console.log('[ok] admin name -> Đinh Thi Ai');
  }

  console.log('[done]');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
