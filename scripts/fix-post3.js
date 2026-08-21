require('dotenv').config();
const connectDB = require('../config/db');
const { BlogPost } = require('../models');

async function run() {
  await connectDB();
  const post = await BlogPost.findByPk(3);
  await post.update({
    title: 'AI có thể thay thế công việc của bạn không?',
    excerpt: 'Góc nhìn thực tế về tác động của AI đến thị trường lao động.',
  });
  console.log('fixed ->', post.title, '|', post.excerpt);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
