const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    return;
  }

  // Set reliable public DNS fallback for Windows Node SRV record resolution
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (dnsErr) {
    console.warn("Custom DNS fallback not set:", dnsErr.message);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    console.warn("⚠️  Please check:");
    console.warn("   1. Your current IP is added to Network Access in MongoDB Atlas (Allow access from anywhere: 0.0.0.0/0)");
    console.warn("   2. Your MongoDB Atlas cluster 'DocumentVerificationDB' is active (not paused)");
  }
};

module.exports = connectDB;
