const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    // Determine the database URI, fallback to local
    let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interview_agent';
    
    // Ensure that if using Atlas, a database is specified in the URI
    if (uri.includes('mongodb+srv://') && !uri.includes('/?')) {
      if (!uri.match(/\.net\/[a-zA-Z0-9_-]+\?/)) {
        uri = uri.replace('mongodb.net/?', 'mongodb.net/interview_agent?');
      }
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of hanging forever
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error(`Ensure your IP is whitelisted in MongoDB Atlas and credentials are correct.`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
