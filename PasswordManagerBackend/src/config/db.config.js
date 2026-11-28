import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/passwordmanager";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn("⚠️ Warning: MONGO_URI not defined in environment variables. Falling back to mongodb://localhost:27017/passwordmanager");
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Don't crash immediately in dev to allow tests/build, but log error
  }
};

// Auto-connect on import to preserve backward compatibility with existing imports
connectDB();

const db = mongoose.connection;

db.on("error", (error) => console.error("❌ MongoDB connection error event:", error.message));
db.on("disconnected", () => console.warn("⚠️ MongoDB Disconnected!"));
db.on("reconnected", () => console.log("🔄 MongoDB Reconnected!"));

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

export default mongoose;
