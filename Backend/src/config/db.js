const mongoose = require("mongoose");
const logger = require('../utils/Logger');

async function connectdb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

module.exports = connectdb;