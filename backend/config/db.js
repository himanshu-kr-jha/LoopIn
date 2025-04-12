// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Making connection to MongoDB...");
  try {
    await mongoose.connect("mongodb://localhost:27017/miniproject", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to local MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDB;
