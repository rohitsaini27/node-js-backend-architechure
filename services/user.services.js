import crypto from "crypto";
import User from "../modals/user.modals.js";
// import sendEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import { NotFoundError, 
  UnauthorizedError,
  BadRequestError,
  InternalServerError,
 } from "../core/CustomError.js";
import { createTokens, validateTokenData } from "../auth/utils.js";
import KeyStore from "../modals/keyStore.model.js";
import { environment, tokenInfo } from "../config/config.js";
import JWT from "../core/JWT.js";
import { Types } from "mongoose";
import { getRole } from "../controller/role.controller.js";
import { RoleCode } from "../modals/role.model.js";

const authService = {};

// ✅ LOGIN
authService.login = async ({ email, password }, res) => {
  const result = await User.findOne({ email }).explain("executionStats");
console.log(result.queryPlanner.winningPlan);


  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  // Generate keys for access & refresh token
  const accessTokenKey = crypto.randomBytes(64).toString("hex");
  const refreshTokenKey = crypto.randomBytes(64).toString("hex");

  
  // Store keys in KeyStore (DB)
  await KeyStore.create({
    client: user._id,
    primaryKey: accessTokenKey,
    secondaryKey: refreshTokenKey,
    status: true,
  });

  const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

  
  // Set tokens in HttpOnly cookies
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: environment === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: environment === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });


  // generateToken(res, user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
};

// ✅ REGISTER
authService.register = async ({ name, email, password }, res) => {
  // check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new BadRequestError("User already exists")
  }
  

  // create user
  const user = await User.create({
    name,
    email,
    password,
    roles: [await getRole(RoleCode.USER)],
  })

  if (!user) {
    throw new InternalServerError("User creation failed")
  }

  // generate keys
  const accessTokenKey = crypto.randomBytes(64).toString("hex")
  const refreshTokenKey = crypto.randomBytes(64).toString("hex")

  // Store keys in KeyStore (DB)
  await KeyStore.create({
    client: user._id,
    primaryKey: accessTokenKey,
    secondaryKey: refreshTokenKey,
    status: true,
  });

  // create tokens
  const tokens = await createTokens(user, accessTokenKey, refreshTokenKey)

  // set cookies
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: environment === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  })
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: environment === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  }
}

// REFRESH
authService.refreshToken = async ({ accessToken, refreshToken }, res) => {
  // Decode access token (ignore expiration)
  const accessTokenPayload = await JWT.decode(accessToken);
  validateTokenData(accessTokenPayload);

  // Get user
  const user = await User.findById(new Types.ObjectId(accessTokenPayload.sub));
  console.log(user._id, "user  ki id")
  if (!user) throw new BadRequestError("User not registered");

  // Validate refresh token
  const refreshTokenPayload = await JWT.validate(refreshToken, tokenInfo.secret);
  validateTokenData(refreshTokenPayload);

  if (accessTokenPayload.sub !== refreshTokenPayload.sub)
    throw new BadRequestError("Token user mismatch");

  console.log("👉 AccessTokenPayload prm:", accessTokenPayload.prm);
console.log("👉 RefreshTokenPayload prm:", refreshTokenPayload.prm);

const keystores = await KeyStore.find({ client: user._id });
console.log("👉 Keystores in DB:", keystores);


  // Check keystore
  const keystore = await KeyStore.findOne({
    client: user._id,
    primaryKey: accessTokenPayload.prm,
    secondaryKey: refreshTokenPayload.prm,
    status: true,
  });
  if (!keystore) throw new BadRequestError("Invalid tokens");

  // Delete old keystore
  await KeyStore.deleteOne({ _id: keystore._id });

  // Generate new keys
  const accessTokenKey = crypto.randomBytes(64).toString("hex");
  const refreshTokenKey = crypto.randomBytes(64).toString("hex");

  // Store new keystore
  await KeyStore.create({
    client: user._id,
    primaryKey: accessTokenKey,
    secondaryKey: refreshTokenKey,
    status: true,
  });

  // Generate new tokens
  const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

  // Set new tokens in HttpOnly cookies
  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    message: "Access Token Refreshed",
  };
};

// ✅ FORGOT PASSWORD
authService.forgotPassword = async ({ email }, req) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
  const message = `Forgot Password? Click here to reset: ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: "Password Reset Token (valid for 10 minutes)",
    message,
  });

  return { message: "Token sent to email!" };
};

// ✅ RESET PASSWORD
authService.resetPassword = async (resetToken, password, res) => {
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new UnauthorizedError("Token is invalid or has expired");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  generateToken(res, user._id);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  };
};

// ✅ LOGOUT
authService.logout = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return { message: "Logged out successfully" };
};

export default authService;
