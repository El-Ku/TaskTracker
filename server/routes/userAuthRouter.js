import express from "express";
import validate from "../middleware/validateMiddleware.js";
import {
  loginLimiter,
  userRegLimiter,
} from "../middleware/rateLimitMiddleware";
import { userAuthInfo } from "../validation/joiSchema.js";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import { registerUser, loginUser } from "../controllers/userAuthController.js";

router.route("/register").post(registerUser);
//.post(userRegLimiter, validate(userAuthInfo, 'body'), registerUser);  //validate before registering the user

router.route("/login").post(loginLimiter, loginUser); //doesnt need validation here

router
  .route("/updatePassword")
  .post(loginLimiter, validate(userAuthInfo, "body"));

export default router;
