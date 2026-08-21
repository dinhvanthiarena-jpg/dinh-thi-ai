// One-off: the `category`/`level` columns are MySQL ENUMs whose allowed
// values were originally defined without diacritics. Sequelize's default
// sync() never ALTERs existing enum columns, so widening the JS-side enum
// list in models/Course.js alone does not change the DB schema. This script
// alters the columns to the new accented values, then rewrites existing rows.
require('dotenv').config();
const connectDB = require('../config/db');
const { sequelize } = require('../config/db');
const { Course } = require('../models');

const categoryMap = {
  'AI co ban': 'AI cơ bản',
  'AI cho doanh nghiep': 'AI cho doanh nghiệp',
};
const levelMap = {
  'Co ban': 'Cơ bản',
  'Trung cap': 'Trung cấp',
  'Nang cao': 'Nâng cao',
};

async function run() {
  await connectDB();

  await sequelize.query(
    "ALTER TABLE `courses` MODIFY `category` ENUM('AI cơ bản','Machine Learning','Deep Learning','Generative AI','AI cho doanh nghiệp','Prompt Engineering') NOT NULL"
  );
  await sequelize.query(
    "ALTER TABLE `courses` MODIFY `level` ENUM('Cơ bản','Trung cấp','Nâng cao') DEFAULT 'Cơ bản'"
  );
  console.log('[ok] enum columns altered');

  const courses = await Course.findAll();
  for (const c of courses) {
    const newCategory = categoryMap[c.category] || c.category;
    const newLevel = levelMap[c.level] || c.level;
    if (newCategory !== c.category || newLevel !== c.level) {
      await c.update({ category: newCategory, level: newLevel });
      console.log('[ok]', c.title, '->', newCategory, newLevel);
    }
  }

  console.log('[done]');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
