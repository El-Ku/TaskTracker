import express from "express";
import { protect } from "../middleware/protectMiddleware.js";
import { isAdmin } from "../middleware/isAdminMiddleware.js";
import {
  getAllUsers,
  deleteUsers,
  addUsers,
  updateUsers,
} from "../controllers/adminController.js";

const adminRouter = express.Router({ mergeParams: true });
adminRouter.use(express.json());

// Apply `protect` and `admin` to _all_ subsequent routes
adminRouter.use(protect, isAdmin);

adminRouter
  .route("/users")
  .get(getAllUsers)
  .delete(deleteUsers)
  .post(addUsers)
  .patch(updateUsers);

export { adminRouter };
