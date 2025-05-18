import express from "express";
import validate from "../middleware/validateMiddleware.js";
import {
  loginLimiter,
  userRegLimiter,
} from "../middleware/rateLimitMiddleware";
import { userRegInfo } from "../validation/joiSchema.js";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import { registerUser, loginUser } from "../controllers/userAuthController.js";

router.route("/register").post(userRegLimiter, registerUser);
//.post(userRegLimiter, validate(userRegInfo, 'body'), registerUser);  //validate before registering the user

router.route("/login").post(loginLimiter, loginUser); //doesnt need validation here

export default router;
