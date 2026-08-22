require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// Real YouTube playlists from thầy's channel (youtube.com/@dinhvanthi), matched
// to the legacy courses migrated from the old WordPress/Tutor LMS site. The old
// site's lesson records were empty shells (no video ever attached), but the
// actual footage does exist on YouTube — just never linked back into the course.
const lessonsByCourseTitle = {
  'Photoshop từ cơ bản đến nâng cao': {
    playlistId: 'PLJUp6t5A2G61DEL6qjLz_pCnHhZNEDBma',
    lessonTitle: 'Trọn bộ video: Vẽ và thiết kế trên Photoshop',
  },
  'Khóa học miễn phí: Cơ bản giao diện và dựng hình trong Blender và 3Dsmax': {
    playlistId: 'PLJUp6t5A2G60YDW-O2hk9551-MVwb3H6M',
    lessonTitle: 'Trọn bộ video: Làm phim hoạt hình 3D bằng Blender',
  },
  'Khóa học hoạt hình nâng cao': {
    playlistId: 'PLJUp6t5A2G62K2rROWpubQgUa6xT9itqo',
    lessonTitle: 'Trọn bộ video: Khóa học 3D nâng cao',
  },
  'Làm phim hoạt hình 3D': {
    playlistId: 'PLJUp6t5A2G61OzbcwOv4pcaacQYAcO7Ag',
    lessonTitle: 'Trọn bộ video: Animation trong 3dsmax',
  },
  'Làm phim hoạt hình 3D 2024': {
    playlistId: 'PLJUp6t5A2G635iRscMs3vSsZjQUx4AfRv',
    lessonTitle: 'Trọn bộ video: Animation 3dsmax nâng cao',
  },
};

async function run() {
  await connectDB();

  for (const [courseTitle, data] of Object.entries(lessonsByCourseTitle)) {
    const course = await Course.findOne({ where: { title: courseTitle } });
    if (!course) {
      console.log('course not found, skipped:', courseTitle);
      continue;
    }

    const [lesson, created] = await Lesson.findOrCreate({
      where: { CourseId: course.id, title: data.lessonTitle },
      defaults: {
        CourseId: course.id,
        title: data.lessonTitle,
        order: 1,
        videoUrl: `https://www.youtube.com/embed/videoseries?list=${data.playlistId}`,
        contentText: 'Danh sách video bài giảng đầy đủ từ kênh YouTube của Đinh Thi Ai — bấm biểu tượng danh sách phát ở góc trên video để chuyển giữa các bài.',
        isPreview: true,
      },
    });
    console.log(created ? 'created lesson:' : 'already exists:', courseTitle, '->', lesson.title);
  }

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
