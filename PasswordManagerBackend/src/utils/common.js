// bcrypt for master password
import bcrypt from "bcrypt";
import crypto from "crypto";
 
// Hash master password
async function hashMasterPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
 
// Verify master password
async function verifyMasterPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
 
// Advanced Encryption Standard (AES) encryption for site password
function encryptSitePassword(secretKey, password) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encrypted };
}
 
// AES decryption for site password
function decryptSitePassword(secretKey, encrypted, iv) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    secretKey,
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export { hashMasterPassword, verifyMasterPassword, encryptSitePassword, decryptSitePassword }