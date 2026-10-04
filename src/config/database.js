const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ash_admin:jVRXChQ4kquR1y3S@dev-tinder.r4o4xjl.mongodb.net/dev-tinder",
  );
};

module.exports = connectDB;
