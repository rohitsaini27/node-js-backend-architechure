import mongoose from "mongoose";

const { Schema } = mongoose;

export const DOCUMENT_NAME = "Todo";
export const COLLECTION_NAME = "todos";

export const Status = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
};

const todoSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: Status.NOT_STARTED,
      enum: Object.values(Status),
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model(DOCUMENT_NAME, todoSchema, COLLECTION_NAME);

export default Todo;
