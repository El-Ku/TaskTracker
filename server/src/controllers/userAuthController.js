import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import {
  resetLoginLimiter,
  resetRegLimiter,
} from "../middleware/rateLimitMiddleware.js";
import { sendWelcomeEmail } from "../utils/generateEmails.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  // check if user already exists in the database
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({
      result: "error",
      message: "User already exists. Choose a different username",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10); //10 is salt
  const newUser = {
    username,
    password: hashedPassword,
    email: email,
    ...(username === "admin" && { role: "admin" }),
  };
  const user = await User.create(newUser);
  sendWelcomeEmail(email, username);
  if (user) {
    resetRegLimiter(req.ip); //reset register rate limit
    return res.json({
      result: "success",
      message: "User was successfully registered on the system",
    });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({
      result: "error",
      message: "Both username and password are required",
    });
  }
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      result: "error",
      message: "Invalid username or password",
    });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return res
      .status(404)
      .json({ result: "error", message: "Invalid username or password" });
  }
  resetLoginLimiter(req.ip); //reset login rate limit
  res.json({
    result: "success",
    message: "User logged in successfully",
    token: generateToken(user._id),
    role: user.role,
  });
});
