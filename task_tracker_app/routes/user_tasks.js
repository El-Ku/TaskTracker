const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require('path');
router.use(express.json());

const {
    loadAll, 
    addTasks,
    deleteTask,
    deleteAll,
    changeTask
} = require('../controllers/taskController');

// get request for the public tasks file.
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/tasks.html'));
});

router
    .route("/allTasks")
    .get(loadAll)         // load all tasks
    .delete(deleteAll);   // delete all tasks

router
  .route("/")
  .post(addTasks)         // Add tasks

router
  .route('/:id')
  .delete(deleteTask)     // Delete a single task
  .patch(changeTask)      // Modify a task

module.exports = router;