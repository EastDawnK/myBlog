const dns = require("dns");
const mongoose = require("mongoose");

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
  const mongoUri =
    process.env.NODE_ENV === "production"
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn("MongoDB URI is not set. Database routes will not work.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }

    console.warn("Running without MongoDB. Public pages will use local demo data.");
  }
};

module.exports = connectDB;
