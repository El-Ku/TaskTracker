import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(["pending", "done", "paused"]),
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tagId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    tagName: {
      type: String,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
