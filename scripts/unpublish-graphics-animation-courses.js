require('dotenv').config();
const connectDB = require('../config/db');
const Course = require('../models/Course');

// Thầy asked to temporarily hide the Graphics/Design and Animation
// Filmmaking courses (many still missing lesson content) until they're
// filled in properly — re-publish later via isPublished once ready.
const CATEGORIES = ['Đồ họa & Dựng hình', 'Làm phim hoạt hình'];

async function run() {
  await connectDB();

  const courses = await Course.findAll({ where: { category: CATEGORIES } });
  for (const course of courses) {
    await course.update({ isPublished: false });
    console.log('unpublished:', course.title);
  }

  console.log(`\nDone. Unpublished ${courses.length} course(s).`);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
