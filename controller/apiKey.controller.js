// controllers/apiKey.controller.js
import { ApiKeyModel } from "../modals/apiKey.modal.js";

export const findByKey = async (key) => {
  return await ApiKeyModel.findOne({ key, status: true });
};
