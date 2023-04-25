const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const mongUri = "mongodb://localhost:27017/facebook";

const connectMongodb = async () => {
  try {
    await mongoose.connect(mongUri);
  } catch (error) {
    console.log(error?.message);
  }
};

module.exports = connectMongodb;
