import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ result: "error", message: "User not found" });
  }
  res.json({ result: "success", payload: user.settings });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ result: "error", message: "User not found" });
  }
  user.settings = req.body;
  const savedUser = await user.save();
  if (String(savedUser._id) === String(req.user._id)) {
    res.json({ result: "success" });
  } else {
    res
      .status(500)
      .json({ result: "error", message: "Failed to update user settings" });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    return res.status(404).json({ result: "error", message: "User not found" });
  }

  res.json({ result: "success", message: "User account deleted successfully" });
});
