import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse.js";

/**
 * Authentication Middleware:
 * Validates JSON Web Token from Authorization header (Bearer scheme)
 * Attaches authenticated user payload to req.user and req.MasterUsername
 */
const authToken = (req, res, next) => {
  const authHeader = req.header("Authorization") || req.header("auth-token");

  if (!authHeader) {
    return ApiResponse.error(res, "Authorization denied. No token provided", 401);
  }

  // Support both "Bearer <token>" and raw token
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  if (!token || token === "null" || token === "undefined") {
    return ApiResponse.error(res, "Authorization denied. Invalid token format", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || (!decoded.userId && !decoded.username)) {
      return ApiResponse.error(res, "Invalid token payload", 401);
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };
    req.MasterUsername = decoded.username; // Kept for backward compatibility

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return ApiResponse.error(res, "Session expired. Please log in again", 401);
    }
    return ApiResponse.error(res, "Token is not valid or has been tampered with", 401);
  }
};

export default authToken;
