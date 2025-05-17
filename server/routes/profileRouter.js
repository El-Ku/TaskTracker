import express from "express";
import protect from "../middleware/protectMiddleware.js";
import { userSchema } from "../validation/joiSchema.js";
import validate from "../middleware/validateMiddleware.js";
import {
  refreshLimiter,
  profileUpdateLimiter,
} from "../middleware/rateLimitMiddleware";
import { updatePassword } from "../controllers/profileController.js";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
  getUserInfo,
  updateProfile,
  deleteUser,
} from "../controllers/profileController.js";

// Apply `protect` to _all_ subsequent routes
router.use(protect);

router
  .route("/user-info")
  .get(refreshLimiter, getUserInfo) // load user info
  .patch(profileUpdateLimiter, validate(userSchema, "body"), updateProfile) // update profile info
  .delete(deleteUser); // delete user account

router.route("/update-password").post(updatePassword);
//.post(loginLimiter, validate(userAuthInfo, "body"), updatePassword); //validate before updating the password

export default router;
