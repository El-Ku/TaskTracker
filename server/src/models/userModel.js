import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  tags: [
    {
      tagId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
      tagName: { type: String },
      userRole: { type: String },
    },
  ],
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  existsSince: {
    type: Date,
    default: Date.now(),
  },
  settings: {
    fullName: { type: String },
  },
});

// Pre-save hook to default fullName to username if not provided
userSchema.pre("save", function (next) {
  if (!this.settings) {
    this.settings = {};
  }
  if (!this.settings.fullName) {
    this.settings.fullName = this.username;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
