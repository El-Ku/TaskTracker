import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";

// Load all users except the admin user
export const getAllUsers = asyncHandler(async (req, res) => {
  const adminId = req.user._id; // current user's id from middleware
  const allUsers = await User.find({ _id: { $ne: adminId } }); // Exclude the current user);
  if (allUsers.length === 0) {
    res.json({ result: "error", message: "No users found in the database" });
  } else {
    res.json({ payload: allUsers });
  }
});

//delete one or more users from the database
export const deleteUsers = asyncHandler(async (req, res) => {
  let acknowledged, deletedCount;
  if (req.body === undefined) {
    ({ acknowledged, deletedCount } = await User.deleteMany({
      _id: { $ne: req.user._id }, // Exclude the current user
    }));
    await Task.deleteMany({ userId: { $ne: req.user._id } }); // Delete tasks associated with the deleted users
  } else {
    ({ acknowledged, deletedCount } = await User.deleteMany({
      _id: { $in: req.body, $ne: req.user._id }, // Exclude the current user
    }));
    await Task.deleteMany({ userId: { $in: req.body, $ne: req.user._id } }); // Delete tasks associated with the deleted users
  }

  if (acknowledged) {
    if (deletedCount > 0) {
      res.json({
        result: "success",
        message: `All ${deletedCount} users were deleted from the database`,
      });
    } else {
      res.status(404).json({
        result: "error",
        message: `There were no users in the database to delete`,
      });
    }
  } else {
    res.status(500).json({
      result: "error",
      message: "Failed to delete users from the database",
    });
  }
});
