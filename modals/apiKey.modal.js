import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Enum for permissions
export const Permission = {
  GENERAL: "GENERAL",
  // Add more permissions here if needed
};

// Schema definition
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      maxlength: 1024,
      trim: true,
    },
    version: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    permissions: {
      type: [
        {
          type: String,
          required: true,
          enum: Object.values(Permission),
        },
      ],
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // disable __v
  }
);

// Compound index for key + status
apiKeySchema.index({ key: 1, status: 1 });

// Export model
export const ApiKeyModel = model("ApiKey", apiKeySchema);
