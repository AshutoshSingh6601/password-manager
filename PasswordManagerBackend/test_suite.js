import dotenv from "dotenv";
dotenv.config();

import http from "http";
import jwt from "jsonwebtoken";
import app from "./src/app.js";
import {
  hashMasterPassword,
  verifyMasterPassword,
  encryptSitePassword,
  decryptSitePassword
} from "./src/utils/common.js";

async function runAllTests() {
  console.log("==================================================");
  console.log("       PASSWORD MANAGER FULL TEST SUITE           ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // --- PART 1: Cryptography & Security Tests ---
  console.log("--- 1. Cryptography & Password Hashing Tests ---");
  try {
    const rawPass = "MySecureMasterPassword@2026!";
    const hash = await hashMasterPassword(rawPass);
    assert(hash && hash.startsWith("$2b$12$"), "Master password hashed with bcrypt (cost 12)");
    assert(await verifyMasterPassword(rawPass, hash), "Master password verifies successfully");
    assert(!(await verifyMasterPassword("WrongPassword", hash)), "Incorrect password fails verification");
  } catch (err) {
    assert(false, `Password hashing error: ${err.message}`);
  }

  console.log("\n--- 2. Authenticated Encryption (AES-256-GCM) Tests ---");
  try {
    const secretKey = process.env.SECRET_KEY;
    const plaintext = "DatabasePassword#1234!";
    const encrypted = encryptSitePassword(secretKey, plaintext);
    assert(encrypted.algorithm === "aes-256-gcm", "Encrypted with AES-256-GCM");
    assert(encrypted.iv && encrypted.iv.length === 24, "IV is 12 bytes hex (24 chars)");
    assert(encrypted.tag && encrypted.tag.length === 32, "Authentication tag is 16 bytes hex (32 chars)");
    assert(encrypted.encrypted && encrypted.encrypted.length > 0, "Ciphertext generated");

    const decrypted = decryptSitePassword(secretKey, encrypted.encrypted, encrypted.iv, encrypted.tag);
    assert(decrypted === plaintext, "AES-256-GCM successfully decrypts to original plaintext");

    // Tampering test: modify 1 character in ciphertext
    let tampered = encrypted.encrypted;
    tampered = (tampered[0] === "a" ? "b" : "a") + tampered.slice(1);
    let tamperedFailed = false;
    try {
      decryptSitePassword(secretKey, tampered, encrypted.iv, encrypted.tag);
    } catch {
      tamperedFailed = true;
    }
    assert(tamperedFailed, "AES-256-GCM detects ciphertext tampering and rejects it");
  } catch (err) {
    assert(false, `AES-256-GCM encryption error: ${err.message}`);
  }

  console.log("\n--- 3. Backward Compatibility: Legacy AES-256-CBC Decryption ---");
  try {
    const secretKey = process.env.SECRET_KEY;
    const legacyEnc = "e9658fd1e103284ad4e9cf608fcf4463";
    const legacyIv = "61ea90113244e95a43b00eb1623cd3e5";
    const legacyDecrypted = decryptSitePassword(secretKey, legacyEnc, legacyIv);
    assert(legacyDecrypted === "1234", "Legacy AES-256-CBC credentials decrypt cleanly without auth tag");
  } catch (err) {
    assert(false, `Legacy CBC decryption error: ${err.message}`);
  }

  // --- PART 2: HTTP API & Middleware Tests ---
  console.log("\n--- 4. HTTP API & Security Middleware Tests ---");
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(4099, resolve));

  const makeRequest = async (path, options = {}) => {
    const res = await fetch(`http://localhost:4099${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    const status = res.status;
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status, data, headers: res.headers };
  };

  try {
    // Health check
    const health = await makeRequest("/health");
    assert(health.status === 200 && health.data.status === "ok", "GET /health returns 200 OK");

    // Security headers (Helmet)
    assert(health.headers.get("x-content-type-options") === "nosniff", "Helmet nosniff header present");
    assert(health.headers.get("x-frame-options") === "SAMEORIGIN", "Helmet x-frame-options header present");

    // 404 handler
    const notFound = await makeRequest("/api/v1/nonexistent-route");
    assert(notFound.status === 404 && notFound.data.success === false, "404 handler returns standardized error");

    // Auth middleware - missing token
    const noToken = await makeRequest("/api/v1/credential");
    assert(noToken.status === 401 && noToken.data.success === false, "GET /api/v1/credential without token returns 401");

    // Auth middleware - invalid token
    const invalidToken = await makeRequest("/api/v1/credential", {
      headers: { Authorization: "Bearer invalid.jwt.token" }
    });
    assert(invalidToken.status === 401 && invalidToken.data.success === false, "GET /api/v1/credential with invalid token returns 401");

    // Auth middleware - expired token
    const expiredJwt = jwt.sign(
      { userId: "507f1f77bcf86cd799439011", username: "testuser" },
      process.env.JWT_SECRET,
      { expiresIn: "-1s" }
    );
    const expiredRes = await makeRequest("/api/v1/credential", {
      headers: { Authorization: `Bearer ${expiredJwt}` }
    });
    assert(expiredRes.status === 401 && expiredRes.data.message.includes("expired"), "Expired token returns 401 Session expired");

    // Register validation - missing fields
    const emptyRegister = await makeRequest("/api/v1/login/register", {
      method: "POST",
      body: JSON.stringify({})
    });
    assert(emptyRegister.status === 400 && emptyRegister.data.success === false, "POST /api/v1/login/register with empty body returns 400");

    // Login validation - missing fields
    const emptyLogin = await makeRequest("/api/v1/login", {
      method: "POST",
      body: JSON.stringify({})
    });
    assert(emptyLogin.status === 400 && emptyLogin.data.success === false, "POST /api/v1/login with empty body returns 400");

  } finally {
    server.close();
  }

  console.log("\n==================================================");
  console.log(`TOTAL PASSED: ${passed}`);
  console.log(`TOTAL FAILED: ${failed}`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAllTests();
