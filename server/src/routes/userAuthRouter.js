import express from "express";
import validate from "../middleware/validateMiddleware.js";
import {
  loginLimiter,
  userRegLimiter,
} from "../middleware/rateLimitMiddleware.js";
import { userRegInfoSchema } from "../validation/joiSchema.js";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import { registerUser, loginUser } from "../controllers/userAuthController.js";

router
  .route("/register")
  .post(userRegLimiter, validate(userRegInfoSchema, "body"), registerUser);

router.route("/login").post(loginLimiter, loginUser); //doesnt need validation here

export default router;
