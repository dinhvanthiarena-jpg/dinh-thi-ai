require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

async function run() {
  await connectDB();
  const user = await User.findOne({ where: { email: 'dinhvanthi.arena@gmail.com' } });
  const course = await Course.findOne({ where: { title: 'Làm phim hoạt hình 3D' } });
  if (!user || !course) {
    console.log('missing user or course', !!user, !!course);
    process.exit(1);
  }
  const [enrollment] = await Enrollment.findOrCreate({
    where: { UserId: user.id, CourseId: course.id },
    defaults: { UserId: user.id, CourseId: course.id },
  });
  console.log('enrolled:', user.email, '->', course.title, course.slug);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
