import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
    loadAll, 
    addTasks,
    deleteTask,
    deleteAll,
    changeTask
} from '../controllers/taskController.js';

// get request for the public tasks file.
router.get('/', (req, res) => {
    const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
    const __dirname = path.dirname(__filename); // get the name of the directory
    res.sendFile(path.join(__dirname, '..', 'public/tasks.html'));
});

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