import jwt from "jsonwebtoken";
const { sign, decode: jwtDecode, verify } = jwt;
import {
  BadRequestError,
  BadTokenError,
  InternalServerError,
  TokenExpiredError,
} from "./CustomError.js";

export class JwtPayload {
  constructor(issuer, audience, subject, param, validity) {
    this.iss = issuer;   // Token issuer
    this.aud = audience; // Token audience
    this.sub = subject;  // Subject (usually userId)
    this.iat = Math.floor(Date.now() / 1000); // Issued at
    this.exp = this.iat + validity; // Expiry timestamp
    this.prm = param;    // Extra param (e.g., keyId / refreshKey)
  }
}

// 🔹 Encode JWT
export function encode(payload, secret) {
  if (!secret) throw new InternalServerError("Token generation failure");
  const options = { algorithm: "HS256" };

  return new Promise((resolve, reject) => {
    sign({ ...payload }, secret, options, (err, token) => {
      if (err) return reject(new InternalServerError("Token generation failure"));
      resolve(token);
    });
  });
}

// 🔹 Decode JWT (without verifying signature)
export async function decode(token) {
  if (!token) throw new InternalServerError("Token decoding failure");

  try {
    const decoded = jwtDecode(token);
    console.log("🚀 ~ decode ~ decoded:", decoded);

    if (!decoded || typeof decoded === "string") throw new BadTokenError();
    return decoded;
  } catch (error) {
    throw new BadTokenError();
  }
}

// 🔹 Validate JWT (with signature verification)
export async function validate(token, secret) {
  console.log("🔑 Validating token with secret:", secret);
  console.log("📌 Token received:", token);

  if (!token) throw new InternalServerError("Token validation failure");

  return new Promise((resolve, reject) => {
    verify(token, secret, (err, decoded) => {
      if (err) {
        console.error("❌ JWT validation failed:", err);
        if (err?.name === "TokenExpiredError") {
          return reject(new TokenExpiredError());
        }
        return reject(new BadRequestError("Invalid token format or signature"));
      }
      console.log("✅ Token decoded:", decoded);
      resolve(decoded);
    });
  });
}


export default {
  JwtPayload,
  encode,
  decode,
  validate,
};
