import express from "express";
// import validator from "../helpers/validator.js";
// import apiKeySchema from "./schema.js";
import { Header } from "./utils.js";
import { ForbiddenError } from "../core/CustomError.js";
import { findByKey } from "../controller/apiKey.controller.js";

const router = express.Router();

export default router.use(
  // Validate request header
//   validator(apiKeySchema.apiKey, "header"),

  // Check API Key in database
  async (req, res, next) => {
    const key = req.headers[Header.API_KEY]?.toString();
    if (!key) return next(new ForbiddenError());

    const apiKey = await findByKey(key);
    // console.log("🚀 ~ apiKey:", apiKey);

    if (!apiKey) return next(new ForbiddenError());

    // Attach valid API key to request object
    req.apiKey = apiKey;
    return next();
  }
);
