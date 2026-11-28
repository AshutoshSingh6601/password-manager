import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

import userRouter from "./routes/userRoute.js";
import credentialRouter from "./routes/credentialRoute.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

// Validate essential environment configuration
const validateConfig = () => {
  const missing = [];
  if (!process.env.JWT_SECRET) missing.push("JWT_SECRET");
  if (!process.env.SECRET_KEY) missing.push("SECRET_KEY");

  if (missing.length > 0) {
    const errorMsg = `⚠️ Critical: Missing environment variables: ${missing.join(", ")}. Please configure them in .env`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(errorMsg);
    } else {
      console.warn(errorMsg);
    }
  }
};
validateConfig();

const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow frontend SPA consumption
    crossOriginEmbedderPolicy: false
  })
);

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000", "http://localhost:4002"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or same-origin in dev)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"]
  })
);

// Request body size limits to prevent Denial of Service via large payloads
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// General API rate limiting
app.use("/api", apiLimiter);

// API Routes
app.use("/api/v1/login", userRouter);
app.use("/api/v1/credential", credentialRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root welcome endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Password Manager API is running securely"
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

export default app;
