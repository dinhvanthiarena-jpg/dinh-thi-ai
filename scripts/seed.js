require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const BlogPost = require('../models/BlogPost');

const courseSeeds = [
  {
    title: 'Nhập môn AI ứng dụng cho người đi làm',
    subtitle: 'Hiểu và ứng dụng AI vào công việc hàng ngày, không cần biết lập trình',
    description:
      'Khóa học giúp bạn hiểu bản chất của AI, cách các công cụ như ChatGPT, Gemini hoạt động, và cách ứng dụng ngay vào công việc văn phòng: viết nội dung, tổng hợp dữ liệu, hỗ trợ ra quyết định.',
    category: 'AI cơ bản',
    level: 'Cơ bản',
    price: 990000,
    salePrice: 490000,
    durationHours: 6,
    isFeatured: true,
    outcomes: [
      'Hiểu các khái niệm nền tảng về AI và Machine Learning',
      'Sử dụng thành thạo ChatGPT/Gemini cho công việc',
      'Xây dựng quy trình làm việc kết hợp AI',
      'Nhận biết giới hạn và rủi ro khi dùng AI',
    ],
    requirements: ['Có máy tính kết nối internet', 'Không cần kinh nghiệm lập trình'],
    lessons: [
      { title: 'AI là gì và vì sao bạn cần quan tâm', durationMinutes: 18, isPreview: true },
      { title: 'Các loại hình AI phổ biến hiện nay', durationMinutes: 22 },
      { title: 'Thực hành với ChatGPT cơ bản', durationMinutes: 30 },
      { title: 'Xây dựng workflow AI cho công việc', durationMinutes: 25 },
    ],
  },
  {
    title: 'Prompt Engineering thực chiến',
    subtitle: 'Kỹ thuật viết prompt hiệu quả để khai thác tối đa sức mạnh AI',
    description:
      'Từ các nguyên tắc cơ bản đến kỹ thuật nâng cao: chain-of-thought, few-shot prompting, bạn sẽ học cách thiết kế prompt chính xác cho từng mục đích công việc cụ thể.',
    category: 'Prompt Engineering',
    level: 'Trung cấp',
    price: 1490000,
    salePrice: null,
    durationHours: 8,
    isFeatured: true,
    outcomes: [
      'Nắm vững cấu trúc một prompt hiệu quả',
      'Áp dụng kỹ thuật few-shot và chain-of-thought',
      'Xây dựng thư viện prompt cho doanh nghiệp',
      'Tối ưu chi phí khi dùng AI API',
    ],
    requirements: ['Đã hoàn thành khóa Nhập môn AI hoặc tương đương'],
    lessons: [
      { title: 'Nguyên tắc vàng của Prompt Engineering', durationMinutes: 20, isPreview: true },
      { title: 'Kỹ thuật Few-shot Prompting', durationMinutes: 28 },
      { title: 'Chain-of-Thought và reasoning prompts', durationMinutes: 32 },
      { title: 'Xây dựng hệ thống prompt cho sản phẩm', durationMinutes: 26 },
    ],
  },
  {
    title: 'Generative AI: Tạo nội dung và hình ảnh chuyên nghiệp',
    subtitle: 'Ứng dụng Generative AI để tạo nội dung marketing, hình ảnh và video',
    description:
      'Khám phá các công cụ Generative AI hàng đầu (Midjourney, DALL-E, Sora) và cách tích hợp vào quy trình sáng tạo nội dung cho cá nhân và doanh nghiệp.',
    category: 'Generative AI',
    level: 'Trung cấp',
    price: 1990000,
    salePrice: 1490000,
    durationHours: 10,
    isFeatured: true,
    outcomes: [
      'Tạo hình ảnh chuyên nghiệp bằng AI',
      'Sản xuất nội dung video ngắn với AI',
      'Xây dựng bộ nhận diện thương hiệu bằng AI',
      'Quy trình kiểm duyệt và bản quyền nội dung AI',
    ],
    requirements: ['Có kiến thức cơ bản về thiết kế là lợi thế'],
    lessons: [
      { title: 'Tổng quan hệ sinh thái Generative AI', durationMinutes: 20, isPreview: true },
      { title: 'Tạo hình ảnh với Midjourney', durationMinutes: 35 },
      { title: 'Sản xuất video ngắn bằng AI', durationMinutes: 30 },
      { title: 'Xây dựng bộ nhận diện thương hiệu', durationMinutes: 25 },
    ],
  },
  {
    title: 'Triển khai AI cho doanh nghiệp vừa và nhỏ',
    subtitle: 'Lộ trình từng bước để doanh nghiệp ứng dụng AI hiệu quả, tiết kiệm chi phí',
    description:
      'Dành cho chủ doanh nghiệp và quản lý: xây dựng chiến lược, đánh giá ROI, và triển khai các giải pháp AI thực tế như chatbot chăm sóc khách hàng, tự động hóa quy trình.',
    category: 'AI cho doanh nghiệp',
    level: 'Nâng cao',
    price: 2990000,
    salePrice: null,
    durationHours: 12,
    isFeatured: true,
    outcomes: [
      'Xây dựng chiến lược AI phù hợp quy mô doanh nghiệp',
      'Triển khai chatbot chăm sóc khách hàng bằng AI',
      'Tự động hóa quy trình văn phòng với AI',
      'Đo lường ROI của các dự án AI',
    ],
    requirements: ['Dành cho chủ doanh nghiệp, quản lý cấp trung và cao'],
    lessons: [
      { title: 'Xây dựng chiến lược AI cho doanh nghiệp', durationMinutes: 30, isPreview: true },
      { title: 'Triển khai chatbot chăm sóc khách hàng', durationMinutes: 40 },
      { title: 'Tự động hóa quy trình bằng AI', durationMinutes: 35 },
      { title: 'Đo lường hiệu quả và ROI', durationMinutes: 22 },
    ],
  },
];

const blogSeeds = [
  {
    title: '5 xu hướng AI đáng chú ý năm 2026',
    excerpt: 'Điểm qua những xu hướng công nghệ AI nổi bật sẽ ảnh hưởng đến cách chúng ta làm việc.',
    content:
      'Năm 2026 chứng kiến sự bùng nổ của các AI agent tự hành, khả năng xử lý đa phương tiện (multimodal), và sự phổ biến của AI cá nhân hóa. Bài viết này điểm qua 5 xu hướng quan trọng nhất và cách doanh nghiệp có thể chuẩn bị để không bị bỏ lại phía sau.',
    tags: ['xu-huong', 'ai-2026'],
  },
  {
    title: 'Hướng dẫn viết prompt hiệu quả cho người mới bắt đầu',
    excerpt: 'Những nguyên tắc cơ bản giúp bạn giao tiếp hiệu quả hơn với AI.',
    content:
      'Một prompt tốt cần rõ ràng về ngữ cảnh, mục tiêu và định dạng mong muốn. Bài viết chia sẻ công thức CO-STAR để xây dựng prompt chất lượng cao, kèm theo ví dụ thực tế trong công việc văn phòng.',
    tags: ['prompt-engineering', 'huong-dan'],
  },
  {
    title: 'AI có thể thay thế công việc của bạn không?',
    excerpt: 'Góc nhìn thực tế về tác động của AI đến thị trường lao động.',
    content:
      'Thay vì lo lắng AI sẽ thay thế hoàn toàn con người, hãy tập trung vào cách kết hợp AI để nâng cao năng suất. Bài viết phân tích những kỹ năng cần thiết để thích nghi với thời đại AI.',
    tags: ['thi-truong-lao-dong', 'ky-nang'],
  },
];

async function seed() {
  await connectDB();

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@dinhthiai.com').toLowerCase();
  let admin = await User.findOne({ where: { email: adminEmail } });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || 'Dinh Thi Ai',
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
      role: 'admin',
    });
    console.log(`[seed] Da tao tai khoan admin: ${admin.email}`);
  } else {
    console.log(`[seed] Tai khoan admin da ton tai: ${admin.email}`);
  }

  const existingCourses = await Course.count();
  if (existingCourses === 0) {
    for (const seed of courseSeeds) {
      const { lessons, ...courseData } = seed;
      const course = await Course.create(courseData);
      const lessonDocs = lessons.map((l, i) => ({ ...l, CourseId: course.id, order: i + 1 }));
      await Lesson.bulkCreate(lessonDocs);
      console.log(`[seed] Da tao khoa hoc: ${course.title}`);
    }
  } else {
    console.log('[seed] Da co khoa hoc, bo qua seed khoa hoc.');
  }

  const existingPosts = await BlogPost.count();
  if (existingPosts === 0) {
    for (const post of blogSeeds) {
      await BlogPost.create({ ...post, AuthorId: admin.id });
      console.log(`[seed] Da tao bai viet: ${post.title}`);
    }
  } else {
    console.log('[seed] Da co bai viet, bo qua seed blog.');
  }

  console.log('[seed] Hoan tat.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Loi:', err);
  process.exit(1);
});
