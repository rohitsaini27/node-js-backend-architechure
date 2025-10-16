import { Types } from "mongoose";
import { tokenInfo } from "../config/config.js";
import { BadRequestError, InternalServerError } from "../core/CustomError.js";
import JWT from "../core/JWT.js";
// Note: JwtPayload bhi default import se use karenge: JWT.JwtPayload

// Optional: Header enum equivalent
export const Header = {
  API_KEY: "x-api-key",
};

/**
 * Create Access Token and Refresh Token for a user
 * @param {Object} user - user document from DB
 * @param {string} accessTokenKey - unique key for access token
 * @param {string} refreshTokenKey - unique key for refresh token
 * @returns {Object} { accessToken, refreshToken }
 */
export async function createTokens(user, accessTokenKey, refreshTokenKey) {
  // Create Access Token
  const accessToken = await JWT.encode(
    new JWT.JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidity
    ),
    tokenInfo.secret
  );

  if (!accessToken) throw new InternalServerError("Access token generation failed");

  // Create Refresh Token
  const refreshToken = await JWT.encode(
    new JWT.JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidity
    ),
    tokenInfo.secret
  );

  if (!refreshToken) throw new InternalServerError("Refresh token generation failed");

  return { accessToken, refreshToken };
}

/**
 * Extract Access Token from Authorization header
 * @param {string} authorization - e.g. "Bearer <token>"
 * @returns {string} token
 */
export function getAccessToken(authorization) {
  if (!authorization) throw new BadRequestError("Invalid Authorization");
  if (!authorization.startsWith("Bearer"))
    throw new BadRequestError("Invalid Authorization");

  return authorization.split(" ")[1]; // return token part
}

/**
 * Validate the structure and content of JWT payload
 * @param {Object} payload - decoded JWT payload
 * @returns {boolean} true if valid
 */
export function validateTokenData(payload) {
  // console.log("🚀 ~ validateTokenData ~ payload:", payload);

  if (
    !payload ||
    !payload.iss ||
    !payload.aud ||
    !payload.sub ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience ||
    !Types.ObjectId.isValid(payload.sub)
  ) {
    throw new BadRequestError("Invalid access/refresh token");
  }

  return true;
}
