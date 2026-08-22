require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// Real lecture videos pulled directly from thầy's YouTube channel
// (youtube.com/@dinhvanthi, "Đào tạo làm phim hoạt hình"), matched one-by-one
// to the legacy courses migrated from the old WordPress/Tutor LMS site. The old
// site's lesson records were empty shells (no video ever attached there), but
// the real footage exists on YouTube — it just never got linked back in.
// A few videos with titles unrelated to the course topic (e.g. a wildlife clip
// that ended up in a course playlist by mistake) were deliberately excluded.
const lessonsByCourseTitle = {
  'Photoshop từ cơ bản đến nâng cao': [
    { id: 'eRWnljvqwmI', title: 'Dạy thiết kế trên Photoshop từ số 0' },
    { id: 'sF2Mj1oDf1g', title: 'Vẽ trên Photoshop' },
    { id: 'kclV0xhrUx4', title: 'Vẽ trên Photoshop full chuột' },
    { id: 'N_eC_AxDwnc', title: 'Học vẽ phong cảnh trên Photoshop' },
    { id: 'vo-l6i53-eU', title: 'Vẽ bọ cạp trên Photoshop' },
    { id: 'sHDJOn47Uio', title: 'Vẽ nhân vật 100% bằng chuột trên Photoshop (Phần 1)' },
    { id: '3vtee5SdRNc', title: 'Vẽ trên Photoshop' },
    { id: 'NTZUZvVOXbI', title: 'Vẽ baby bằng chuột trên Photoshop' },
    { id: 'yZMh_stKBGE', title: 'Vẽ chuột 100% tác phẩm phong cảnh (Phần 1)' },
  ],
  'Khóa học miễn phí: Cơ bản giao diện và dựng hình trong Blender và 3Dsmax': [
    { id: 'aUbKHAc4hxs', title: 'Làm phim hoạt hình 3D khó hay dễ' },
    { id: 'yJ1TMeWPO0E', title: 'Modeling nhân vật từ ảnh 2D thành 3D' },
    { id: 'BA-He4ieOl8', title: 'Chỉnh cảnh phim 3D — học từ số 0 đến thành phẩm' },
    { id: 'Dtnv-16iTQM', title: 'Bài tập học viên: làm phim hoạt hình 3D' },
    { id: 'JdV57P5FUz0', title: 'Nên học làm phim hoạt hình ở đâu' },
  ],
  'Khóa học hoạt hình nâng cao': [
    { id: 'XXKxLSy4TEo', title: '3dsmax — Bài 1: Cơ bản về giao diện' },
    { id: 'Y4SkOrYS21I', title: 'Chuyển động ngồi của nhân vật' },
    { id: '2eADs-eYzFI', title: 'Diễn hoạt khớp nhân vật 3D' },
    { id: 'uOLWEDEAJ5c', title: 'Chuyển đổi animation kéo thả dễ dàng' },
    { id: 'yJ1TMeWPO0E', title: 'Modeling nhân vật từ ảnh 2D thành 3D' },
    { id: 'zQP4wYfMUTU', title: 'Gắn xương cho nhân vật Minecraft' },
  ],
  'Làm phim hoạt hình 3D': [
    { id: 'ZodP3SoxiCk', title: 'Animation test house' },
    { id: 'QoNN31zawYY', title: 'Chỉnh màu và xử lý ảnh trên Photoshop' },
    { id: '4x1zIHVe3vQ', title: 'Animation Lufy (Phần 2)' },
    { id: 'hIhq61_Hg7U', title: 'Hướng dẫn làm chuyển động nhân vật trong 3dsmax (Phần 1)' },
    { id: '9yjv957jnzg', title: 'Hướng dẫn làm chuyển động nhân vật trong 3dsmax (Phần 2)' },
    { id: 'vUA-Thfmpi8', title: 'Animation Lufy' },
    { id: 'guzW7oCvZwA', title: 'Animation tutorial' },
    { id: 'Wr2FT44kYRc', title: 'Animation trong 3dsmax' },
    { id: 'Xfa7_pU_hQ4', title: 'Animation: con mồi' },
    { id: 'y436adVPiIU', title: 'Tạo cỏ trong 3dsmax' },
    { id: 'A5dq6enplEA', title: 'Hiệu ứng ăn mòn (corrosion) trong 3dsmax' },
    { id: 'uPM8WDz8Q7o', title: 'Animation cầm nắm đồ vật và Run Cycle' },
    { id: 'Y4SkOrYS21I', title: 'Chuyển động ngồi của nhân vật' },
    { id: 'uOLWEDEAJ5c', title: 'Chuyển đổi animation kéo thả dễ dàng' },
    { id: 'zQP4wYfMUTU', title: 'Gắn xương cho nhân vật Minecraft' },
  ],
  'Làm phim hoạt hình 3D 2024': [
    { id: 'Jo5VGYsyCX8', title: 'Animation 3dsmax — Attack (bản hoàn chỉnh)' },
    { id: 'w7k4qL5p66c', title: 'Animation Attack trong 3dsmax (Phần 2)' },
    { id: 'TI05nDO5X74', title: 'Animation Attack trong 3dsmax (Phần 1)' },
    { id: '2eADs-eYzFI', title: 'Diễn hoạt khớp nhân vật 3D' },
  ],
};

async function run() {
  await connectDB();

  for (const [courseTitle, lessons] of Object.entries(lessonsByCourseTitle)) {
    const course = await Course.findOne({ where: { title: courseTitle } });
    if (!course) {
      console.log('course not found, skipped:', courseTitle);
      continue;
    }

    let order = 1;
    for (const l of lessons) {
      const [lesson, created] = await Lesson.findOrCreate({
        where: { CourseId: course.id, videoUrl: `https://www.youtube.com/embed/${l.id}` },
        defaults: {
          CourseId: course.id,
          title: l.title,
          order,
          videoUrl: `https://www.youtube.com/embed/${l.id}`,
          isPreview: order === 1,
        },
      });
      console.log(created ? 'created:' : 'exists:', courseTitle, '->', order, lesson.title);
      order += 1;
    }
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
