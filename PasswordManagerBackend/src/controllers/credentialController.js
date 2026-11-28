import {
  createCredService,
  decryptCredService,
  deleteSpecificCredService,
  getAllCredsService,
  getCredService,
  updateSpecificCredService,
  verifyMasterPassService
} from "../services/credentialServices.js";
import ApiResponse from "../utils/apiResponse.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

/**
 * Create a new credential
 */
export const createCred = asyncHandler(async (req, res) => {
  const { websiteURL, websiteName, email, username, password } = req.body;
  const userId = req.user?.userId;

  if (!username || !password) {
    return ApiResponse.error(res, "Please fill in all required fields (username, password)", 400);
  }

  const newCred = await createCredService({
    userId,
    websiteURL,
    websiteName,
    email,
    username,
    password
  });

  return ApiResponse.success(
    res,
    newCred,
    "Credential saved successfully 🤗",
    201
  );
});

/**
 * Verify master password
 */
export const verifyMasterPass = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const userId = req.user?.userId;

  if (!password) {
    return ApiResponse.error(res, "Master password is required", 400);
  }

  const result = await verifyMasterPassService({ userId, password });

  return ApiResponse.success(
    res,
    result,
    "Master password verified successfully 🤗",
    200,
    { isVerified: true }
  );
});

/**
 * Decrypt a single credential
 */
export const decryptCred = asyncHandler(async (req, res) => {
  const credId = req.query.credId || req.params.credId;
  const userId = req.user?.userId;

  if (!credId) {
    return ApiResponse.error(res, "Credential ID is required", 400);
  }

  const decryptedCred = await decryptCredService({ userId, credId });

  return ApiResponse.success(
    res,
    decryptedCred,
    "Password Decoded successfully 🤗",
    200
  );
});

/**
 * Update an existing credential
 */
export const updateSpecificCred = asyncHandler(async (req, res) => {
  const credId = req.query.credId || req.params.credId;
  const userId = req.user?.userId;
  const { websiteURL, websiteName, email, username, password } = req.body;

  if (!credId) {
    return ApiResponse.error(res, "Credential ID is required", 400);
  }

  const updatedCred = await updateSpecificCredService({
    userId,
    credId,
    websiteURL,
    websiteName,
    email,
    username,
    password
  });

  return ApiResponse.success(
    res,
    updatedCred,
    "Credential Updated successfully 🤗",
    200
  );
});

/**
 * Delete a credential
 */
export const deleteSpecificCred = asyncHandler(async (req, res) => {
  const credId = req.query.credId || req.params.credId;
  const userId = req.user?.userId;

  if (!credId) {
    return ApiResponse.error(res, "Credential ID is required", 400);
  }

  const result = await deleteSpecificCredService({ userId, credId });

  return ApiResponse.success(
    res,
    result,
    "Credential Deleted successfully 🤗",
    200
  );
});

/**
 * Get all credentials for the authenticated user (masked for security)
 */
export const getCred = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const username = req.user?.username;

  const result = await getCredService({ userId, username });

  return ApiResponse.success(
    res,
    result.data,
    "Credential fetched successfully 🤗",
    200,
    { masterUser: result.masterUser }
  );
});

/**
 * Get all credentials with decrypted passwords
 */
export const getAllCreds = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const username = req.user?.username;

  const result = await getAllCredsService({ userId, username });

  return ApiResponse.success(
    res,
    result.data,
    "Credentials fetched and decrypted successfully 🤗",
    200,
    { masterUser: result.masterUser }
  );
});
