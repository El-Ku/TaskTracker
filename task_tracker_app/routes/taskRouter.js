import express from 'express';
import protect from '../middleware/protectMiddleware.js';
import { mongoObjectId, taskSchema } from '../validation/joiSchema.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
    loadAll, 
    addTasks,
    deleteTask,
    deleteAll,
    changeTask
} from '../controllers/taskController.js';

// Apply `protect` to _all_ subsequent routes
router.use(protect);

router
    .route("/allTasks")
    .get(loadAll)         // load all tasks
    .delete(deleteAll);   // delete all tasks

router
  .route("/")
  .post(validate(taskSchema, 'body'), addTasks);         // Add tasks

router
  .route('/:id')
  .all(validate(mongoObjectId, 'params')) // applies to all methods on this route
  .delete(deleteTask)     // Delete a single task
  .patch(validate(taskSchema, 'body'), changeTask);      // Modify a task

export default router;