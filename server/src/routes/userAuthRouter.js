import express from "express";
import { validate } from "../middleware/validateMiddleware.js";
import {
  loginLimiter,
  userRegLimiter,
} from "../middleware/rateLimitMiddleware.js";
import { userRegInfoSchema } from "../validation/joiSchema.js";

const userAuthRouter = express.Router({ mergeParams: true });
userAuthRouter.use(express.json());

import { registerUser, loginUser } from "../controllers/userAuthController.js";

userAuthRouter
  .route("/register")
  .post(userRegLimiter, validate(userRegInfoSchema, "body"), registerUser);

userAuthRouter.route("/login").post(loginLimiter, loginUser); //doesn't need validation here

export { userAuthRouter };
