require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const BlogPost = require('../models/BlogPost');

const courseSeeds = [
  {
    title: 'Nhap mon AI ung dung cho nguoi di lam',
    subtitle: 'Hieu va ung dung AI vao cong viec hang ngay, khong can biet lap trinh',
    description:
      'Khoa hoc giup ban hieu ban chat cua AI, cach cac cong cu nhu ChatGPT, Gemini hoat dong, va cach ung dung ngay vao cong viec van phong: viet noi dung, tong hop du lieu, ho tro ra quyet dinh.',
    category: 'AI co ban',
    level: 'Co ban',
    price: 990000,
    salePrice: 490000,
    durationHours: 6,
    isFeatured: true,
    outcomes: [
      'Hieu cac khai niem nen tang ve AI va Machine Learning',
      'Su dung thanh thao ChatGPT/Gemini cho cong viec',
      'Xay dung quy trinh lam viec ket hop AI',
      'Nhan biet gioi han va rui ro khi dung AI',
    ],
    requirements: ['Co may tinh ket noi internet', 'Khong can kinh nghiem lap trinh'],
    lessons: [
      { title: 'AI la gi va vi sao ban can quan tam', durationMinutes: 18, isPreview: true },
      { title: 'Cac loai hinh AI pho bien hien nay', durationMinutes: 22 },
      { title: 'Thuc hanh voi ChatGPT co ban', durationMinutes: 30 },
      { title: 'Xay dung workflow AI cho cong viec', durationMinutes: 25 },
    ],
  },
  {
    title: 'Prompt Engineering thuc chien',
    subtitle: 'Ky thuat viet prompt hieu qua de khai thac toi da suc manh AI',
    description:
      'Tu cac nguyen tac co ban den ky thuat nang cao: chain-of-thought, few-shot prompting, ban se hoc cach thiet ke prompt chinh xac cho tung muc dich cong viec cu the.',
    category: 'Prompt Engineering',
    level: 'Trung cap',
    price: 1490000,
    salePrice: null,
    durationHours: 8,
    isFeatured: true,
    outcomes: [
      'Nam vung cau truc mot prompt hieu qua',
      'Ap dung ky thuat few-shot va chain-of-thought',
      'Xay dung thu vien prompt cho doanh nghiep',
      'Toi uu chi phi khi dung AI API',
    ],
    requirements: ['Da hoan thanh khoa Nhap mon AI hoac tuong duong'],
    lessons: [
      { title: 'Nguyen tac vang cua Prompt Engineering', durationMinutes: 20, isPreview: true },
      { title: 'Ky thuat Few-shot Prompting', durationMinutes: 28 },
      { title: 'Chain-of-Thought va reasoning prompts', durationMinutes: 32 },
      { title: 'Xay dung he thong prompt cho san pham', durationMinutes: 26 },
    ],
  },
  {
    title: 'Generative AI: Tao noi dung va hinh anh chuyen nghiep',
    subtitle: 'Ung dung Generative AI de tao noi dung marketing, hinh anh va video',
    description:
      'Kham pha cac cong cu Generative AI hang dau (Midjourney, DALL-E, Sora) va cach tich hop vao quy trinh sang tao noi dung cho ca nhan va doanh nghiep.',
    category: 'Generative AI',
    level: 'Trung cap',
    price: 1990000,
    salePrice: 1490000,
    durationHours: 10,
    isFeatured: true,
    outcomes: [
      'Tao hinh anh chuyen nghiep bang AI',
      'San xuat noi dung video ngan voi AI',
      'Xay dung bo nhan dien thuong hieu bang AI',
      'Quy trinh kiem duyet va ban quyen noi dung AI',
    ],
    requirements: ['Co kien thuc co ban ve thiet ke la loi the'],
    lessons: [
      { title: 'Tong quan he sinh thai Generative AI', durationMinutes: 20, isPreview: true },
      { title: 'Tao hinh anh voi Midjourney', durationMinutes: 35 },
      { title: 'San xuat video ngan bang AI', durationMinutes: 30 },
      { title: 'Xay dung bo nhan dien thuong hieu', durationMinutes: 25 },
    ],
  },
  {
    title: 'Trien khai AI cho doanh nghiep vua va nho',
    subtitle: 'Lo trinh tung buoc de doanh nghiep ung dung AI hieu qua, tiet kiem chi phi',
    description:
      'Danh cho chu doanh nghiep va quan ly: xay dung chien luoc, danh gia ROI, va trien khai cac giai phap AI thuc te nhu chatbot cham soc khach hang, tu dong hoa quy trinh.',
    category: 'AI cho doanh nghiep',
    level: 'Nang cao',
    price: 2990000,
    salePrice: null,
    durationHours: 12,
    isFeatured: true,
    outcomes: [
      'Xay dung chien luoc AI phu hop quy mo doanh nghiep',
      'Trien khai chatbot cham soc khach hang bang AI',
      'Tu dong hoa quy trinh van phong voi AI',
      'Do luong ROI cua cac du an AI',
    ],
    requirements: ['Danh cho chu doanh nghiep, quan ly cap trung va cao'],
    lessons: [
      { title: 'Xay dung chien luoc AI cho doanh nghiep', durationMinutes: 30, isPreview: true },
      { title: 'Trien khai chatbot cham soc khach hang', durationMinutes: 40 },
      { title: 'Tu dong hoa quy trinh bang AI', durationMinutes: 35 },
      { title: 'Do luong hieu qua va ROI', durationMinutes: 22 },
    ],
  },
];

const blogSeeds = [
  {
    title: '5 xu huong AI dang chu y nam 2026',
    excerpt: 'Diem qua nhung xu huong cong nghe AI noi bat se anh huong den cach chung ta lam viec.',
    content:
      'Nam 2026 chung kien su bung no cua cac AI agent tu hanh, kha nang xu ly da phuong tien (multimodal), va su pho bien cua AI ca nhan hoa. Bai viet nay diem qua 5 xu huong quan trong nhat va cach doanh nghiep co the chuan bi de khong bi bo lai phia sau.',
    tags: ['xu-huong', 'ai-2026'],
  },
  {
    title: 'Huong dan viet prompt hieu qua cho nguoi moi bat dau',
    excerpt: 'Nhung nguyen tac co ban giup ban giao tiep hieu qua hon voi AI.',
    content:
      'Mot prompt tot can ro rang ve ngu canh, muc tieu va dinh dang mong muon. Bai viet chia se cong thuc CO-STAR de xay dung prompt chat luong cao, kem theo vi du thuc te trong cong viec van phong.',
    tags: ['prompt-engineering', 'huong-dan'],
  },
  {
    title: 'AI co the thay the cong viec cua ban khong?',
    excerpt: 'Goc nhin thuc te ve tac dong cua AI den thi truong lao dong.',
    content:
      'Thay vi lo lang AI se thay the hoan toan con nguoi, hay tap trung vao cach ket hop AI de nang cao nang suat. Bai viet phan tich nhung ky nang can thiet de thich nghi voi thoi dai AI.',
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
