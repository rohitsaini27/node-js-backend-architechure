import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const DOCUMENT_NAME = "KeyStore";
export const COLLECTION_NAME = "keystores";

const keyStoreSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // Relation with User collection
    },
    primaryKey: {
      type: String,
      required: true,
      trim: true,
    },
    secondaryKey: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
    versionKey: false, // removes "__v" field
  }
);

// 🔹 Indexes for fast lookup
keyStoreSchema.index({ client: 1 });
keyStoreSchema.index({ client: 1, primaryKey: 1, status: 1 });
keyStoreSchema.index({ client: 1, primaryKey: 1, secondaryKey: 1 });

const KeyStore = model(DOCUMENT_NAME, keyStoreSchema, COLLECTION_NAME);

export default KeyStore;
