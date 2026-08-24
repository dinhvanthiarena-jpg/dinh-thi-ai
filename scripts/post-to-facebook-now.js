require('dotenv').config();
const connectDB = require('../config/db');
const facebookPostService = require('../services/facebookPostService');

async function run() {
  await connectDB();
  await facebookPostService.postDailyContent();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
