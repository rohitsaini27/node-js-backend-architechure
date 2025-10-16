import mongoose from "mongoose";

const { Schema } = mongoose;

export const DOCUMENT_NAME = "Role";
export const COLLECTION_NAME = "roles";

export const RoleCode = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const roleSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      enum: Object.values(RoleCode),
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// 🔹 Indexes for optimized lookup
roleSchema.index({ code: 1, status: 1 });

const Role = mongoose.model(DOCUMENT_NAME, roleSchema, COLLECTION_NAME);

export default Role;
