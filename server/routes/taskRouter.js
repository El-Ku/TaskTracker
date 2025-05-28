import express from "express";
import protect from "../middleware/protectMiddleware.js";
import { descSchema, taskSchema } from "../validation/joiSchema.js";
import validate from "../middleware/validateMiddleware.js";
import {
  taskRateLimiter,
  refreshLimiter,
} from "../middleware/rateLimitMiddleware";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
  loadAll,
  addTasks,
  deleteTasks,
  updateTasks,
} from "../controllers/taskController.js";

// Apply `protect` to _all_ subsequent routes
router.use(protect);

router
  .route("/")
  .get(refreshLimiter, loadAll) // load all tasks
  .post(taskRateLimiter, validate(descSchema, "body"), addTasks) // Add tasks
  .patch(taskRateLimiter, validate(taskSchema, "body"), updateTasks) // update task status
  .delete(taskRateLimiter, deleteTasks); // delete multiple or all tasks

export default router;
