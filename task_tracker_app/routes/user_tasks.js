const express = require('express');
const router = express.Router({ mergeParams: true });
const path = require('path');
router.use(express.json());
const taskController = require('../controllers/taskController');

// get request for the public tasks file.
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/tasks.html'));
});

// Retrieve all tasks via a GET request
router.get('/allTasks', (req, res) => {
    try {
        res.send(taskController.loadAll());
    } catch (err) {
        console.error('Server encountered an error while retrieving your tasks:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// add tasks via  a POST request
router.post('/', (req, res) => {
    const data = req.body;
    try {
        res.send(taskController.addTasks(data));
    } catch (err) {
        console.error('Server encountered an error while adding your tasks to the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete tasks via a DELETE request
router.delete('/', (req, res) => {
    const data = req.body;
    try {
        res.send(taskController.deleteTask(data));
    } catch (err) {
        console.error('Server encountered an error while deleting selected tasks from the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit a task via a PUT request
router.put('/', (req, res) => {
    const data = req.body;
    try {
        res.send(taskController.changeTask(data));
    } catch (err) {
        console.error('Server encountered an error while editing the selected task in our database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;