import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
import { hashMasterPassword, verifyMasterPassword } from "../utils/common.js";

/**
 * Register a new user with hashed master password
 */
export const registerUserService = async ({ username, email, password }) => {
  if (!username || !email || !password) {
    const error = new Error("All fields (username, email, password) are required");
    error.statusCode = 400;
    throw error;
  }

  const cleanUsername = String(username).trim();
  const cleanEmail = String(email).trim().toLowerCase();

  if (cleanUsername.length < 3) {
    const error = new Error("Username must be at least 3 characters long");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    error.statusCode = 400;
    throw error;
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(cleanEmail)) {
    const error = new Error("Please provide a valid email address");
    error.statusCode = 400;
    throw error;
  }

  // Check for existing user
  const existingUser = await Users.findOne({
    $or: [{ username: cleanUsername }, { email: cleanEmail }]
  });

  if (existingUser) {
    const error = new Error(
      existingUser.username === cleanUsername
        ? "Username is already taken"
        : "Email is already registered"
    );
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashMasterPassword(password);

  const newUser = await Users.create({
    username: cleanUsername,
    email: cleanEmail,
    password: hashedPassword
  });

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email
  };
};

/**
 * Authenticate user and generate JWT token
 */
export const loginUserService = async ({ username, password }) => {
  if (!username || !password) {
    const error = new Error("Username and password are required");
    error.statusCode = 400;
    throw error;
  }

  const cleanUsername = String(username).trim();

  // Find user by username or email
  const user = await Users.findOne({
    $or: [{ username: cleanUsername }, { email: cleanUsername.toLowerCase() }]
  });

  if (!user) {
    const error = new Error("Invalid username or password");
    error.statusCode = 400;
    throw error;
  }

  const isPasswordValid = await verifyMasterPassword(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid username or password");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    userId: user._id,
    username: user.username
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  };
};

/**
 * Get profile for authenticated user
 */
export const getUserProfileService = async (userId) => {
  const user = await Users.findById(userId).select("-password -__v");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};
