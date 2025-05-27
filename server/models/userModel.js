import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
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
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    settings: {
      fullName: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

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

const User = mongoose.model("User", userSchema);

export default User;
