import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import protect from '../middleware/protectMiddleware.js';

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
  .post(addTasks);         // Add tasks

router
  .route('/:id')
  .delete(deleteTask)     // Delete a single task
  .patch(changeTask);      // Modify a task

export default router;