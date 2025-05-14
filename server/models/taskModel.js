import mongoose from "mongoose";
import { TaskStatus } from "../../CONSTANTS.js";

const taskSchema = mongoose.Schema(
  {
    desc: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    userId: {
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
