const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require('path');
router.use(express.json());
const taskController = require('../controllers/taskController');

// get request for the public tasks file.
router.get('/', (req, res) => {
    const userName = req.params.userName;
    res.sendFile(path.join(__dirname, '..', 'public','tasks.html'));
});

// data requests from the client through POST requests
router.post('/', (req, res) => {
    const action = req.query.action;
    const data = req.body;
    switch (action) {
        case 'loadAll': return res.send(taskController.loadAll());
        case 'add': return res.send(taskController.addTasks(data));
        case 'delete': return res.send(taskController.deleteTask(data));
        case 'statusChange': return res.send(taskController.changeTaskStatus(data));
        case 'taskChange': return res.send(taskController.changeTaskName(data));
        case 'deleteAll': return res.send(taskController.deleteAllTasks());
    }
});

module.exports = router;