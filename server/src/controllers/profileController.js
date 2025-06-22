import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { Task } from "../models/taskModel.js";
import bcrypt from "bcryptjs";

export const getUserInfo = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ result: "error", message: "User not found" });
    }
    res.json({
      result: "success",
      payload: { fullName: user.settings.fullName, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ result: "error", message: "User not found" });
    }
    user.settings.fullName = req.body.fullName;
    user.email = req.body.email;
    const savedUser = await user.save();
    if (String(savedUser._id) === String(req.user._id)) {
      res.json({ result: "success", message: "Profile updated successfully" });
    } else {
      res
        .status(500)
        .json({ result: "error", message: "Failed to update user settings" });
    }
  } catch (error) {
    next(error);
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // current user's id from auth middleware
    const { acknowledged } = await Task.deleteMany({ userId });
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ result: "error", message: "User not found" });
    }
    if (acknowledged) {
      res.json({
        result: "success",
        message: "User account deleted successfully",
      });
    }
  } catch (error) {
    next(error);
  }
});

export const updatePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        result: "error",
        message: "This user Id doesn't exist in our system",
      });
    }
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ result: "error", message: "Invalid current password" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    const savedUser = await user.save();
    if (String(savedUser._id) === String(req.user._id)) {
      res.json({ result: "success", message: "Password changed successfully" });
    } else {
      res
        .status(500)
        .json({ result: "error", message: "Failed to update the password" });
    }
  } catch (error) {
    next(error);
  }
});
