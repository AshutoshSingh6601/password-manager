import express from "express";
import { createLogin, createRegister, getLogin } from "../controllers/userController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import authToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Safe authenticated profile route
router.get("/", authToken, getLogin);
router.get("/me", authToken, getLogin);

// Rate-limited auth routes
router.post("/register", authLimiter, createRegister);
router.post("/", authLimiter, createLogin);

export default router;
