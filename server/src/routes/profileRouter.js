import express from "express";
import { protect } from "../middleware/protectMiddleware.js";
import { userPassChgInfoSchema, userSchema } from "../validation/joiSchema.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  refreshLimiter,
  profileUpdateLimiter,
} from "../middleware/rateLimitMiddleware.js";
import { updatePassword } from "../controllers/profileController.js";

const profileRouter = express.Router({ mergeParams: true });
profileRouter.use(express.json());

import {
  getUserInfo,
  updateProfile,
  deleteUser,
} from "../controllers/profileController.js";

// Apply `protect` to _all_ subsequent routes
profileRouter.use(protect);

profileRouter
  .route("/user-info")
  .get(refreshLimiter, getUserInfo) // load user info
  .patch(profileUpdateLimiter, validate(userSchema, "body"), updateProfile) // update profile info
  .delete(deleteUser); // delete user account

profileRouter
  .route("/update-password")
  .post(
    profileUpdateLimiter,
    validate(userPassChgInfoSchema, "body"),
    updatePassword
  );

export { profileRouter };
