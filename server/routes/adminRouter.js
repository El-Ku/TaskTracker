import express from "express";
import protect from "../middleware/protectMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware.js";
import { getAllUsers, deleteUsers } from "../controllers/adminController.js";

const router = express.Router({ mergeParams: true });
router.use(express.json());

// Apply `protect` and `admin` to _all_ subsequent routes
router.use(protect, isAdmin);

router.route("/users").get(getAllUsers).delete(deleteUsers);
//.patch(updateUsers);

export default router;
