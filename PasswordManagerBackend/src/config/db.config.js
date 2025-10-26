import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const mongoURI = process.env.MONGO_URI;

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
//   connectTimeoutMS: 45000, // Increase connection timeout to 45 seconds
// });

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const db = mongoose.connection;

db.on("error", (error) => console.error("❌ MongoDB Connection Error:", error));
db.once("open", () => console.log("✅ MongoDB connected successfully!"));
db.on("disconnected", () => console.log("⚠️ MongoDB Disconnected!"));
db.on("reconnected", () => console.log("🔄 MongoDB Reconnected!"));

export default mongoose;
