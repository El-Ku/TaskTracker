import coreJoi from "joi";
import joiDate from "@joi/date";
const Joi = coreJoi.extend(joiDate);

export const mongoObjectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

export const userNameSchema = Joi.string().min(3).required().messages({
  "string.min": "Username must be at least 3 characters long",
  "any.required": "Username is required",
});

export const emailSchema = Joi.string().email().required().messages({
  "string.email": "Invalid email",
  "any.required": "Email is required",
});

export const passwordSchema = Joi.string()
  .min(8)
  .max(32)
  .pattern(/[A-Z]/, "uppercase")
  .pattern(/[a-z]/, "lowercase")
  .pattern(/[0-9]/, "number")
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must be at most 32 characters long",
    "string.pattern.name": "Password must include at least one {#name} letter",
    "any.required": "Password is required",
  });

export const fullNameSchema = Joi.string().min(3).messages({
  "string.min": "Full name must be at least 3 characters",
});

export const roleSchema = Joi.string()
  .valid("user", "admin")
  .required()
  .messages({
    "any.only": "Role should be one of: user, admin",
    "any.required": "Role is required",
  });

export const statusSchema = Joi.string()
  .valid("pending", "done", "paused")
  .required()
  .messages({
    "any.only": "Status should be one of: pending, done, paused",
    "any.required": "Status is required",
  });

const descRule = Joi.string().min(3).max(500).required().messages({
  "string.min": "Description should be at least 3 characters",
  "string.max": "Description should not exceed 500 characters",
  "any.required": "Description is required",
});

export const descSchema = Joi.object({
  desc: descRule,
});

export const userRegInfoSchema = Joi.object({
  username: userNameSchema,
  password: passwordSchema,
  confirmPassword: passwordSchema,
  email: emailSchema,
});

export const userPassChgInfoSchema = Joi.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
});

export const userSchema = Joi.object({
  fullName: fullNameSchema,
  email: emailSchema,
});

export const taskSchema = Joi.object({
  _id: mongoObjectId,
  desc: descRule,
  status: statusSchema,
});
