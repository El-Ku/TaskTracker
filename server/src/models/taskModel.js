import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  desc: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(["pending", "done", "paused"]),
    default: "pending",
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  tagId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
  },
  assigneeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  assignorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  deadline: {
    type: Date,
  },
  existsSince: {
    type: Date,
    default: Date.now(),
  },
});

export const Task = mongoose.model("Task", taskSchema);
