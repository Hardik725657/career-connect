// config/db.js
// This file handles the connection to our MongoDB database.
// We use Mongoose (an ODM - Object Document Mapper) to connect.
// An ODM lets us interact with MongoDB using JavaScript objects instead of raw queries.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we await it
    // MONGO_URI comes from our .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If connection is successful, log a message
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and stop the process
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
