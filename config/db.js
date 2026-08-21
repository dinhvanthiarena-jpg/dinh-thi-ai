const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set in .env');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err.message);
  });
}

module.exports = connectDB;
