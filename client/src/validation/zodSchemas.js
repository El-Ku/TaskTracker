import { z } from "zod";

export const userNameSchema = z.string().min(3, "Username is required");
export const emailSchema = z.string().email("Invalid email");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must be at most 32 characters long")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number");
export const fullNameSchema = z
  .string()
  .min(3, "Full name must be at least 3 characters");
export const roleSchema = z.enum(["user", "admin"], {
  errorMap: () => ({
    message: "Role should be one of: user, admin",
  }),
});
export const schemaStatus = z.enum(["pending", "done", "paused"], {
  errorMap: () => ({
    message: "Status should be one of: pending, done, paused",
  }),
});
export const schemaDesc = z
  .string()
  .min(3, "Description should be at least 3 characters")
  .max(500, "Description should not exceed 500 characters");
