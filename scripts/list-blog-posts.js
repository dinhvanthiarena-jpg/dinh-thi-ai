require('dotenv').config();
const connectDB = require('../config/db');
const BlogPost = require('../models/BlogPost');

async function run() {
  await connectDB();
  const posts = await BlogPost.findAll({ attributes: ['id', 'title', 'slug', 'tags'], order: [['id', 'ASC']] });
  posts.forEach((p) => {
    console.log(`#${p.id} | ${p.title} | tags: ${JSON.stringify(p.tags)}`);
  });
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
