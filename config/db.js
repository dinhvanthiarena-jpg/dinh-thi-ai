const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
  }
);

async function connectDB() {
  if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    throw new Error('DB_NAME, DB_USER, DB_PASSWORD must be set in .env');
  }

  await sequelize.authenticate();
  console.log(`[db] MySQL connected: ${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME}`);

  require('../models');
  await sequelize.sync();
}

module.exports = connectDB;
module.exports.sequelize = sequelize;
