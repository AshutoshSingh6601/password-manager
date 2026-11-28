import mongoose from "mongoose";
import Credential from "../models/Credential.js";
import Users from "../models/Users.js";
import {
  decryptSitePassword,
  encryptSitePassword,
  verifyMasterPassword
} from "../utils/common.js";

/**
 * Validate MongoDB ObjectId format
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Create a new encrypted credential
 */
export const createCredService = async ({
  userId,
  websiteURL = "",
  websiteName = "",
  email = "",
  username,
  password
}) => {
  if (!userId) {
    const error = new Error("User identifier is required");
    error.statusCode = 400;
    throw error;
  }

  if (!username || !password) {
    const error = new Error("Username and password are required fields");
    error.statusCode = 400;
    throw error;
  }

  // Encrypt with authenticated AES-256-GCM
  const encryptedPassword = encryptSitePassword(
    process.env.SECRET_KEY,
    String(password)
  );

  const newCredential = await Credential.create({
    userId,
    websiteURL: websiteURL ? String(websiteURL).trim() : "",
    websiteName: websiteName ? String(websiteName).trim() : "",
    email: email ? String(email).trim() : "",
    username: String(username).trim(),
    password: encryptedPassword.encrypted,
    iv: encryptedPassword.iv,
    tag: encryptedPassword.tag,
    algorithm: encryptedPassword.algorithm
  });

  return newCredential;
};

/**
 * Verify user's master password before sensitive operations
 */
export const verifyMasterPassService = async ({ userId, password }) => {
  if (!password) {
    const error = new Error("Master password is required for verification");
    error.statusCode = 400;
    throw error;
  }

  const user = await Users.findById(userId);
  if (!user) {
    const error = new Error("User account not found");
    error.statusCode = 404;
    throw error;
  }

  const isValid = await verifyMasterPassword(password, user.password);
  if (!isValid) {
    const error = new Error("Invalid master password");
    error.statusCode = 400;
    throw error;
  }

  return { isVerified: true };
};

/**
 * Decrypt a specific credential with strict ownership check (IDOR protection)
 */
export const decryptCredService = async ({ userId, credId }) => {
  if (!credId || !isValidObjectId(credId)) {
    const error = new Error("Invalid credential ID format");
    error.statusCode = 400;
    throw error;
  }

  // Enforce ownership: query must match BOTH _id and userId
  const credDetail = await Credential.findOne({
    _id: credId,
    userId
  }).lean();

  if (!credDetail) {
    const error = new Error("Credential not found or unauthorized access");
    error.statusCode = 404;
    throw error;
  }

  const decryptedPassword = decryptSitePassword(
    process.env.SECRET_KEY,
    credDetail.password,
    credDetail.iv,
    credDetail.tag
  );

  return {
    ...credDetail,
    password: decryptedPassword
  };
};

/**
 * Update an existing credential with strict ownership check (IDOR protection)
 */
export const updateSpecificCredService = async ({
  userId,
  credId,
  websiteURL,
  websiteName,
  email,
  username,
  password
}) => {
  if (!credId || !isValidObjectId(credId)) {
    const error = new Error("Invalid credential ID format");
    error.statusCode = 400;
    throw error;
  }

  // Verify ownership before updating
  const existingCred = await Credential.findOne({ _id: credId, userId });
  if (!existingCred) {
    const error = new Error("Credential not found or unauthorized access");
    error.statusCode = 404;
    throw error;
  }

  const updateFields = {};
  if (websiteURL !== undefined) updateFields.websiteURL = String(websiteURL).trim();
  if (websiteName !== undefined) updateFields.websiteName = String(websiteName).trim();
  if (email !== undefined) updateFields.email = String(email).trim();
  if (username !== undefined) updateFields.username = String(username).trim();

  // If password is updated, re-encrypt with authenticated AES-256-GCM
  if (password) {
    const encrypted = encryptSitePassword(process.env.SECRET_KEY, String(password));
    updateFields.password = encrypted.encrypted;
    updateFields.iv = encrypted.iv;
    updateFields.tag = encrypted.tag;
    updateFields.algorithm = encrypted.algorithm;
  }

  const updatedCred = await Credential.findOneAndUpdate(
    { _id: credId, userId },
    { $set: updateFields },
    { new: true, runValidators: true }
  ).lean();

  return updatedCred;
};

/**
 * Delete a specific credential with strict ownership check (IDOR protection)
 */
export const deleteSpecificCredService = async ({ userId, credId }) => {
  if (!credId || !isValidObjectId(credId)) {
    const error = new Error("Invalid credential ID format");
    error.statusCode = 400;
    throw error;
  }

  // Enforce ownership check
  const deletedCred = await Credential.findOneAndDelete({
    _id: credId,
    userId
  });

  if (!deletedCred) {
    const error = new Error("Credential not found or unauthorized access");
    error.statusCode = 404;
    throw error;
  }

  return { id: credId, deleted: true };
};

/**
 * Fetch all credentials belonging to the authenticated user
 * Passwords are automatically masked in the list view for security
 */
export const getCredService = async ({ userId, username }) => {
  const allCred = await Credential.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  // Mask encrypted password in list view to prevent unnecessary exposure
  const sanitizedCreds = allCred.map((cred) => ({
    ...cred,
    password: "••••••••"
  }));

  return {
    masterUser: username,
    data: sanitizedCreds
  };
};

/**
 * Fetch all credentials with decryption (when authorized)
 */
export const getAllCredsService = async ({ userId, username }) => {
  const allCred = await Credential.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const decryptedCreds = allCred.map((cred) => {
    try {
      const decrypted = decryptSitePassword(
        process.env.SECRET_KEY,
        cred.password,
        cred.iv,
        cred.tag
      );
      return { ...cred, password: decrypted };
    } catch {
      return { ...cred, password: "[Decryption Failed]" };
    }
  });

  return {
    masterUser: username,
    data: decryptedCreds
  };
};
