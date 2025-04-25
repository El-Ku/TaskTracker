const asyncHandler = require('express-async-handler');
const Tasks = require('../models/taskModel');

// Load all tasks. Called when webpage loads first
const loadAll = asyncHandler(async (req, res) => {
    const tasks = await Tasks.find();
    res.json(tasks);
}) 

// Add one or more tasks to the database
const addTasks = asyncHandler(async (req, res) => {
    const newTasks = req.body.map(task => ({
        desc: task.desc
    }));
    const tasks = await Tasks.insertMany(newTasks);
    res.json(tasks);
});

// Delete all tasks in database
const deleteAll = asyncHandler(async (req, res) => {
    const {acknowledged, deletedCount} = await Tasks.deleteMany({});
    if(acknowledged) {
        if(deletedCount > 0) {
            res.send(`All ${deletedCount} tasks were deleted from the database`);
        } else {
            res.send(`There were no tasks in the database to delete`);
        }
    } else {
        res.status(404);
        throw new Error("Couldnt delete any tasks from the database");
    }
});

// Delete a single task
const deleteTask = asyncHandler(async (req, res) => {
    await Tasks.findByIdAndDelete(req.params.id); //
    res.send("The selected task was deleted successfully");
});

// Modify a single task
const changeTask = asyncHandler(async (req, res) => {
    const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return the updated document
        runValidators: true, // validate according to schema
    });
    if(!task) {
        res.status(404);
        throw new Error("Task ID not found on our server. Unable to update the task");
    }
    res.json(task);
});

module.exports = {
    loadAll,
    addTasks,
    deleteTask,
    deleteAll,
    changeTask
}