import express from "express";
// import validator from "../helpers/validator"; // if used elsewhere
// import schema from "./schema"; // if used elsewhere
import JWT from "../core/JWT.js";
import { validateTokenData } from "./utils.js";
import User from "../modals/user.modals.js";
import { BadRequestError, TokenExpiredError } from "../core/CustomError.js";
import { tokenInfo } from "../config/config.js";
import { Types } from "mongoose";
import KeyStore from "../modals/keyStore.model.js";
// import asyncHandler from "../helpers/asyncHandler.js";
import asyncHandler from "express-async-handler"

const router = express.Router();

export default router.use(
  asyncHandler(async (req, res, next) => {
    try {
      // 1️⃣ Validate JWT token from cookies
      const payload = await JWT.validate(req.cookies.accessToken, tokenInfo.secret);

      // 2️⃣ Validate payload structure
      validateTokenData(payload);

      // 3️⃣ Find user from DB
      const user = await User.findById(new Types.ObjectId(payload.sub));
      if (!user) throw new BadRequestError("User does not exist");

      // 4️⃣ Attach user to request
      req.user = user;

      // 5️⃣ Check keystore
      const keystore = await KeyStore.findOne({
        client: req.user,
        primaryKey: payload.prm,
        status: true,
      });

      if (!keystore) throw new BadRequestError("Invalid access token");

      // 6️⃣ Attach keystore to request
      req.keystore = keystore;

      // 7️⃣ Proceed to next middleware/controller
      next();
    } catch (error) {
      // 8️⃣ Handle token errors
      throw new TokenExpiredError("Token expired");
    }
  })
);
