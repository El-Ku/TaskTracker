import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Task from "../models/taskModel.js";
import bcrypt from "bcryptjs";

// Load all users except the admin user
export const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const adminId = req.user._id; // current user's id from middleware
    const allUsers = await User.find({ _id: { $ne: adminId } }); // Exclude the current user);
    if (allUsers.length === 0) {
      res.json({ result: "error", message: "No users found in the database" });
    } else {
      res.json({ payload: allUsers });
    }
  } catch (error) {
    next(error);
  }
});

//delete one or more users from the database
export const deleteUsers = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

export const addUsers = asyncHandler(async (req, res, next) => {
  const newUsers = req.body;
  if (!Array.isArray(newUsers) || newUsers.length === 0) {
    return res.status(400).json({
      result: "error",
      message: "Please provide an array of users to add.",
    });
  }
  for (const user of newUsers) {
    if (!user.username || !user.email || !user.password) {
      return res.status(400).json({
        result: "error",
        message: "Each user must have name, email, and password.",
      });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10); //10 is salt
    const newUser = {
      username: user.username,
      password: hashedPassword,
      email: user.email,
    };
    try {
      await User.create(newUser);
    } catch (error) {
      return next(error);
    }
  }

  res.json({
    result: "success",
    message: `${newUsers.length} users were successfully added to the database`,
  });
});

export const updateUsers = asyncHandler(async (req, res, next) => {
  const modifiedUsers = req.body;
  const bulkOps = modifiedUsers.map((user) => ({
    updateOne: {
      filter: { _id: user._id },
      update: {
        $set: {
          username: user.username,
          role: user.role,
          email: user.email,
          "settings.fullName": user.settings.fullName,
        },
      },
    },
  }));
  try {
    await User.bulkWrite(bulkOps);
  } catch (error) {
    return next(error);
  }
  res.json({
    result: "success",
    message: "Users were successfully updated",
  });
});
