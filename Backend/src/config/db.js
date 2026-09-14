const mongoose = require("mongoose");
const logger = require('../utils/Logger');

async function connectdb() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    if (!process.env.MONGO_URI) {
      logger.error("MONGO_URI is missing in environment variables.");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectdb;