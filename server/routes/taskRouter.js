import express from "express";
import protect from "../middleware/protectMiddleware.js";
import { mongoObjectId, taskSchema } from "../validation/joiSchema.js";
import validate from "../middleware/validateMiddleware.js";
import {
  taskAddDeleteAllLimiter,
  taskDeleteEditLimiter,
  refreshLimiter,
} from "../middleware/rateLimitMiddleware";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
  loadAll,
  addTasks,
  deleteTask,
  deleteAll,
  changeTask,
} from "../controllers/taskController.js";

// Apply `protect` to _all_ subsequent routes
router.use(protect);

router
  .route("/allTasks")
  .get(refreshLimiter, loadAll) // load all tasks
  .delete(taskAddDeleteAllLimiter, deleteAll); // delete all tasks

router
  .route("/")
  .post(taskAddDeleteAllLimiter, validate(taskSchema, "body"), addTasks); // Add tasks

router
  .route("/:id")
  .all(taskDeleteEditLimiter, validate(mongoObjectId, "params")) // applies to all methods on this route
  .delete(taskDeleteEditLimiter, deleteTask) // Delete a single task
  .patch(taskDeleteEditLimiter, validate(taskSchema, "body"), changeTask); // Modify a task

export default router;
