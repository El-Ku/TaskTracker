import coreJoi from "joi";
import joiDate from "@joi/date";
const Joi = coreJoi.extend(joiDate);
import { TaskStatus } from "../../CONSTANTS.js";

export const mongoObjectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const passwordSchema = Joi.string()
  .min(8)
  .max(25)
  .pattern(/^[A-Za-z0-9]{8,25}/) // Pattern for letters, numbers, and special chars
  .regex(/[A-Z]/) // At least one uppercase letter
  .regex(/[0-9]/) // At least one number
  .required();

const usernameSchema = Joi.string()
  .pattern(/^[a-zA-Z0-9_-]+$/) // Allows only alphanumeric, underscores and hyphens
  .min(3) // Minimum length of 3 characters
  .max(30) // Maximum length of 30 characters
  .regex(/[a-zA-Z]/) // Ensure at least one letter (case insensitive)
  .required(); // Make it a required field

export const userRegInfo = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const userPassChgInfo = Joi.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});

const dobSchema = Joi.object({
  dob: Joi.date()
    .format("YYYY-MM-DD")
    .messages({
      "date.format": "Invalid date format.  Must be YYYY-MM-DD",
      "any.required": "Date of birth is required",
    })
    .greater("1940-01-01")
    .less("2000-01-01"),
});

export const userSchema = Joi.object({
  fullName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  dob: dobSchema,
  email: Joi.string().email(),
});

const taskDescSchema = Joi.string()
  .min(3) // Minimum 3 characters
  .max(500) // Maxumum 500 characters
  .pattern(/^[a-zA-Z0-9 _-]+$/); // Only letters, numbers, underscores, hyphens, spaces

const taskStatusSchema = Joi.string().valid(...Object.values(TaskStatus));

export const taskSchema = Joi.object({
  _id: mongoObjectId,
  desc: taskDescSchema,
  status: taskStatusSchema,
});
