require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');

const legacyCourses = [
  {
    title: 'Khóa học hoạt hình nâng cao',
    subtitle: 'Nâng tầm kỹ năng, tạo ra những thước phim hoạt hình chuyên nghiệp',
    description:
      'Dành cho học viên đã có nền tảng, khóa học giúp bạn hoàn thiện kỹ thuật dựng và diễn hoạt nâng cao, xây dựng phong cách riêng và tạo ra sản phẩm đạt chất lượng thương mại.',
    category: 'Làm phim hoạt hình',
    level: 'Nâng cao',
    price: 8000000,
    salePrice: null,
    thumbnailUrl: '/images/course-placeholder.svg',
  },
  {
    title: 'Photoshop từ cơ bản đến nâng cao',
    subtitle: 'Làm chủ Photoshop — công cụ không thể thiếu của mọi nhà thiết kế',
    description:
      'Từ những thao tác đầu tiên đến kỹ thuật chỉnh sửa, ghép ảnh và thiết kế chuyên sâu, khóa học trang bị cho bạn nền tảng Photoshop vững chắc để tự tin ứng dụng vào công việc thiết kế, marketing hay sáng tạo nội dung.',
    category: 'Đồ họa & Dựng hình',
    level: 'Cơ bản',
    price: 6500000,
    salePrice: 4500000,
    thumbnailUrl: '/uploads/legacy/photoshop-co-ban-den-nang-cao.png',
  },
  {
    title: 'Làm video xây kênh TikTok triệu view bằng công nghệ AI',
    subtitle: 'Xây kênh TikTok triệu view — nhanh hơn, thông minh hơn với AI',
    description:
      'Lộ trình thực chiến từ lập kênh chuẩn SEO, lên ý tưởng nội dung đến sản xuất video bằng công nghệ AI, giúp bạn rút ngắn thời gian sản xuất và tối đa hóa lượt xem, mở ra cơ hội kiếm tiền bền vững trên TikTok.',
    category: 'Sáng tạo nội dung & Kênh video',
    level: 'Cơ bản',
    price: 7000000,
    salePrice: null,
    thumbnailUrl: '/images/course-placeholder.svg',
  },
  {
    title: 'Khóa học miễn phí: Cơ bản giao diện và dựng hình trong Blender và 3Dsmax',
    subtitle: 'Miễn phí — Bước đầu tiên vào thế giới đồ họa 3D',
    description:
      'Khóa học miễn phí giúp bạn làm quen giao diện và các thao tác dựng hình cơ bản trong Blender và 3Dsmax — nền tảng vững chắc trước khi bước vào các khóa chuyên sâu về hoạt hình 3D.',
    category: 'Đồ họa & Dựng hình',
    level: 'Cơ bản',
    price: 0,
    salePrice: null,
    thumbnailUrl: '/uploads/legacy/blender-3dsmax-mien-phi.jpg',
  },
  {
    title: 'Làm phim hoạt hình 2D từ cơ bản đến nâng cao',
    subtitle: 'Biến ý tưởng thành những thước phim hoạt hình 2D sống động',
    description:
      'Khóa học đồng hành cùng bạn từ những nguyên lý cơ bản đến kỹ thuật nâng cao, giúp tạo ra các thước phim hoạt hình 2D mượt mà, cuốn hút — phù hợp cho cá nhân và tổ chức sản xuất nội dung trên YouTube, TikTok hay các kênh hoạt hình thiếu nhi.',
    category: 'Làm phim hoạt hình',
    level: 'Cơ bản',
    price: 8500000,
    salePrice: 6500000,
    thumbnailUrl: '/uploads/legacy/phim-hoat-hinh-2d.png',
  },
  {
    title: 'Quái vật hình hộp 3D',
    subtitle: 'Dự án thực chiến: thổi hồn cho nhân vật 3D từ những khối hình cơ bản',
    description:
      'Thông qua một dự án cụ thể, bạn sẽ rèn luyện kỹ năng tạo hình, rigging và diễn hoạt nhân vật 3D — nền tảng quan trọng để tiến xa hơn trong lĩnh vực animation.',
    category: 'Làm phim hoạt hình',
    level: 'Cơ bản',
    price: 8000000,
    salePrice: 6000000,
    thumbnailUrl: '/uploads/legacy/quai-vat-hinh-hop-3d.png',
  },
  {
    title: 'Khoai Art English',
    subtitle: 'Phiên bản tiếng Anh — Làm phim hoạt hình 3D cùng Khoai Art',
    description:
      'Khóa học làm phim hoạt hình 3D được giảng dạy bằng tiếng Anh, phù hợp với học viên quốc tế hoặc mong muốn nâng cao khả năng làm việc trong môi trường toàn cầu.',
    category: 'Làm phim hoạt hình',
    level: 'Trung cấp',
    price: 9000000,
    salePrice: 7000000,
    thumbnailUrl: '/uploads/legacy/khoai-art-english.png',
  },
  {
    title: 'Làm phim 3D music ball',
    subtitle: 'Dự án thực chiến: thổi nhịp điệu vào chuyển động 3D',
    description:
      'Khóa học thực hành dựng hoạt hình 3D theo nhịp nhạc, giúp bạn rèn luyện tư duy animation giàu cảm xúc và tạo ra những chuyển động sống động, cuốn hút người xem.',
    category: 'Làm phim hoạt hình',
    level: 'Trung cấp',
    price: 9000000,
    salePrice: 6000000,
    thumbnailUrl: '/uploads/legacy/lam-phim-3d-music-ball.jpg',
  },
  {
    title: 'Làm phim hoạt hình 3D',
    subtitle: 'Chương trình đào tạo chuyên viên phim hoạt hình 3D theo chuẩn quốc tế',
    description:
      'Được biên soạn theo chương trình đào tạo quốc tế, khóa học trang bị đầy đủ kiến thức và kỹ năng để trở thành chuyên viên thiết kế phim hoạt hình và phim quảng cáo 3D chuyên nghiệp.',
    category: 'Làm phim hoạt hình',
    level: 'Nâng cao',
    price: 15000000,
    salePrice: 8000000,
    thumbnailUrl: '/uploads/legacy/lam-phim-hoat-hinh-3d.png',
  },
  {
    title: 'Làm phim hoạt hình 3D 2024',
    subtitle: 'Chương trình đào tạo chuyên viên phim hoạt hình 3D — phiên bản cập nhật 2024',
    description:
      'Phiên bản mới nhất của chương trình đào tạo chuyên viên phim hoạt hình 3D theo chuẩn quốc tế, cập nhật công nghệ và quy trình sản xuất mới nhất trong ngành.',
    category: 'Làm phim hoạt hình',
    level: 'Nâng cao',
    price: 18000000,
    salePrice: 9500000,
    thumbnailUrl: '/uploads/legacy/lam-phim-hoat-hinh-3d-2024.jpg',
  },
  {
    title: 'Làm phim hoạt hình với iClone 8 - kết hợp 3Dsmax',
    subtitle: 'Tối ưu quy trình sản xuất phim hoạt hình với iClone 8 và 3Dsmax',
    description:
      'Khóa học hướng dẫn quy trình làm phim hoạt hình chuyên nghiệp bằng cách kết hợp sức mạnh của iClone 8 và 3Dsmax, giúp rút ngắn thời gian sản xuất và nâng cao chất lượng chuyển động nhân vật.',
    category: 'Làm phim hoạt hình',
    level: 'Trung cấp',
    price: 10000000,
    salePrice: 7800000,
    thumbnailUrl: '/uploads/legacy/iclone8-3dsmax.jpg',
  },
  {
    title: 'Bí quyết SEO kênh YouTube 2025',
    subtitle: 'Chiến lược SEO YouTube 2025 — bứt phá lượt xem và tăng trưởng bền vững',
    description:
      'Khóa học chuyên sâu giúp bạn nắm vững chiến lược SEO YouTube mới nhất năm 2025: tối ưu tiêu đề, mô tả, thẻ tag và ứng dụng AI trong sản xuất nội dung để phát triển kênh một cách bền vững.',
    category: 'Sáng tạo nội dung & Kênh video',
    level: 'Trung cấp',
    price: 28000000,
    salePrice: 15000000,
    thumbnailUrl: '/uploads/legacy/seo-kenh-youtube-2025.jpg',
  },
];

async function run() {
  await connectDB();

  for (const data of legacyCourses) {
    const [course, created] = await Course.findOrCreate({
      where: { title: data.title },
      defaults: { ...data, instructorName: 'Đinh Thi Ai', isPublished: true, isFeatured: false },
    });
    console.log(created ? 'created:' : 'already exists:', course.title, course.slug);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
