import {
  loginUserService,
  registerUserService,
  getUserProfileService
} from "../services/userServices.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

/**
 * Handle user registration
 */
export const createRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return ApiResponse.error(res, "Please fill in all required fields", 400);
  }

  const result = await registerUserService({ username, email, password });
  return ApiResponse.success(
    res,
    result,
    "User Registered successfully 🤗",
    201
  );
});

/**
 * Handle user login
 */
export const createLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return ApiResponse.error(res, "Please provide username and password", 400);
  }

  const result = await loginUserService({ username, password });
  // Include token both at root level and inside data for frontend backward compatibility
  return ApiResponse.success(
    res,
    result,
    "User Logged in successfully 🤗",
    200,
    { token: result.token }
  );
});

/**
 * Safe authenticated profile endpoint
 * Replaces the previous insecure endpoint that leaked all users and password hashes
 */
export const getLogin = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.userId) {
    return ApiResponse.error(res, "Authentication required to view profile", 401);
  }

  const profile = await getUserProfileService(req.user.userId);
  return ApiResponse.success(
    res,
    profile,
    "Profile fetched successfully",
    200
  );
});
