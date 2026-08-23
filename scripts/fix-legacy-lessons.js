require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// Correction pass: the first import (import-legacy-lessons.js) mapped several
// real YouTube videos into more than one course at once (e.g. the same
// "chuyển động ngồi" clip was attached to both "Làm phim hoạt hình 3D" and
// "Khóa học hoạt hình nâng cao"), and one Photoshop color-editing tutorial
// ended up inside the 3D animation course by mistake. Thầy caught this while
// spot-checking — a video showing up identically under two different paid
// courses looks like a mistake, and a "basic interface" video didn't belong
// in an "advanced" course. This script wipes and rebuilds the 5 legacy
// courses' lessons so every video belongs to exactly one course, and
// "Khóa học hoạt hình nâng cao" (which had no unique content left once the
// duplicates were removed) is left without lessons rather than padded with
// reused material.
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
    { id: 'XXKxLSy4TEo', title: '3dsmax — Bài 1: Cơ bản về giao diện' },
    { id: 'aUbKHAc4hxs', title: 'Làm phim hoạt hình 3D khó hay dễ' },
    { id: 'yJ1TMeWPO0E', title: 'Modeling nhân vật từ ảnh 2D thành 3D' },
    { id: 'BA-He4ieOl8', title: 'Chỉnh cảnh phim 3D — học từ số 0 đến thành phẩm' },
    { id: 'Dtnv-16iTQM', title: 'Bài tập học viên: làm phim hoạt hình 3D' },
    { id: 'JdV57P5FUz0', title: 'Nên học làm phim hoạt hình ở đâu' },
  ],
  'Khóa học hoạt hình nâng cao': [],
  'Làm phim hoạt hình 3D': [
    { id: 'ZodP3SoxiCk', title: 'Animation test house' },
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

    const deleted = await Lesson.destroy({ where: { CourseId: course.id } });
    console.log('cleared', deleted, 'old lessons from', courseTitle);

    let order = 1;
    for (const l of lessons) {
      const lesson = await Lesson.create({
        CourseId: course.id,
        title: l.title,
        order,
        videoUrl: `https://www.youtube.com/embed/${l.id}`,
        isPreview: order === 1,
      });
      console.log('created:', courseTitle, '->', order, lesson.title);
      order += 1;
    }
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
