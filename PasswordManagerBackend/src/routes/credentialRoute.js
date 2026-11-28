import express from "express";
import authToken from "../middlewares/authMiddleware.js";
import {
  createCred,
  decryptCred,
  deleteSpecificCred,
  getAllCreds,
  getCred,
  updateSpecificCred,
  verifyMasterPass
} from "../controllers/credentialController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// Encrypt and save new credential
router.post("/encryptPass", authToken, createCred);

// Verify master password (rate-limited)
router.post("/verifyMasterPass", authToken, authLimiter, verifyMasterPass);

// Single credential view, update, delete
router.get("/credView", authToken, decryptCred);
router.put("/credView", authToken, updateSpecificCred);
router.delete("/credView", authToken, deleteSpecificCred);

// Fetch all credentials
router.get("/getAllCreds", authToken, getAllCreds);
router.get("/", authToken, getCred);

export default router;
