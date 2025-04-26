import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

// Load all tasks. Called when webpage loads first
const loadAll = asyncHandler(async (req, res) => {
    const tasks = await Task.find();
    if(tasks.length === 0) {
        res.status(404).json({result: "error", message: "Task not found"});
    } else {
        res.json({payload : tasks});
    }
});

// Add one or more tasks to the database
const addTasks = asyncHandler(async (req, res) => {
    const newTasks = req.body.map(task => ({
        desc: task.desc
    }));
    const tasks = await Task.insertMany(newTasks);
    res.json({result: "success", message: "Tasks were saved to the database successfully", payload: tasks});
});

// Delete all tasks in database
const deleteAll = asyncHandler(async (req, res) => {
    const {acknowledged, deletedCount} = await Task.deleteMany({});
    if(acknowledged) {
        if(deletedCount > 0) {
            res.json({result: "success", message: `All ${deletedCount} tasks were deleted from the database`});
        } else {
            res.status(404).json({result: "error", message: `There were no tasks in the database to delete`});
        }
    } else {
        res.status(500).json({result: "error", message: `Couldnt delete any tasks from the database`});
    }
});

// Delete a single task
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id); 
    if(task === null) {
        res.status(404).json({result: "error", message: "Task was not deleted because it was not found on our database"});
    } else {
        res.json({result: "success", message: "The selected task was deleted successfully"});
    }
});

// Modify a single task
const changeTask = asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return the updated document
        runValidators: true, // validate according to schema
    });
    if(task === null) {
        res.status(404).json({result: "error", message: "Task ID not found on our server. Unable to update the task"});
    } else {
        res.json({result: "success", message: "Task was updated successfully"});
    }
}); 

export {
    loadAll,
    addTasks,
    deleteTask,
    deleteAll,
    changeTask
};