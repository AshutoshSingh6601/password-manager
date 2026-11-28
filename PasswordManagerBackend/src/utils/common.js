import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Hash user master password using bcrypt with 12 salt rounds
 */
async function hashMasterPassword(password) {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password provided for hashing");
  }
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify user master password against stored bcrypt hash
 */
async function verifyMasterPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  return await bcrypt.compare(password, hash);
}

/**
 * Safely derive a 32-byte key buffer from the secret key string
 */
function deriveKey(secretKey) {
  if (!secretKey) {
    throw new Error("SECRET_KEY must be configured in environment variables");
  }
  // If the secret key string is already 32 bytes (UTF-8), use directly to preserve legacy key compatibility
  if (Buffer.byteLength(secretKey, "utf8") === 32) {
    return Buffer.from(secretKey, "utf8");
  }
  // Otherwise, derive a 32-byte key using SHA-256
  return crypto.createHash("sha256").update(String(secretKey)).digest();
}

/**
 * Authenticated Encryption (AES-256-GCM) for stored credentials
 * Provides confidentiality and cryptographic integrity verification (tamper resistance)
 */
function encryptSitePassword(secretKey, password) {
  if (typeof password !== "string") {
    throw new Error("Password to encrypt must be a string");
  }
  const key = deriveKey(secretKey);
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");

  return {
    iv: iv.toString("hex"),
    encrypted,
    tag,
    algorithm: "aes-256-gcm"
  };
}

/**
 * AES Decryption with backward compatibility:
 * - Uses AES-256-GCM with authentication tag verification when tag is present
 * - Gracefully falls back to legacy AES-256-CBC for existing database records without auth tag
 */
function decryptSitePassword(secretKey, encrypted, iv, tag) {
  if (!encrypted || !iv) {
    throw new Error("Missing encrypted password or IV");
  }

  const key = deriveKey(secretKey);

  // Authenticated decryption (AES-256-GCM)
  if (tag) {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(tag, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  // Backward compatibility: Legacy AES-256-CBC decryption
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export {
  hashMasterPassword,
  verifyMasterPassword,
  encryptSitePassword,
  decryptSitePassword
};
