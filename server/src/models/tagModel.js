import mongoose from "mongoose";

const tagSchema = mongoose.Schema({
  superManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  managers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      email: {
        type: String,
      },
      confirmed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      email: {
        type: String,
      },
      confirmed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  tagName: {
    type: String,
    minLength: 3,
    maxLength: 20,
    match: [
      /^[a-zA-Z0-9_-]+$/,
      "Tag name can only contain letters, numbers, underscores, and hyphens",
    ],
    required: true,
  },
  settings: {
    membersCanJoinOwn: {
      type: Boolean,
      default: false,
    },
    membersCanChooseTasks: {
      type: Boolean,
      default: false,
    },
  },
  existsSince: {
    type: Date,
    default: Date.now(),
  },
});

export const Tag = mongoose.model("Tag", tagSchema);
