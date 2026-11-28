import rateLimit from "express-rate-limit";
import ApiResponse from "../utils/apiResponse.js";

/**
 * Strict Rate Limiter for Authentication & Master Password verification
 * Protects against brute-force password guessing and credential stuffing
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 authentication attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      "Too many login/registration attempts. Please try again after 15 minutes.",
      429
    );
  }
});

/**
 * General API Rate Limiter
 * Protects against Denial of Service and API scraping
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      "Too many requests from this IP. Please try again later.",
      429
    );
  }
});
