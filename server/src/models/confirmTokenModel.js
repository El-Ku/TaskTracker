import mongoose from "mongoose";

const confirmTokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiryDate: {
    type: Date,
    default: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
  },
});

export const ConfirmToken = mongoose.model("ConfirmToken", confirmTokenSchema);
