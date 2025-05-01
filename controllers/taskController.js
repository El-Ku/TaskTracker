import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

// Load all tasks. Called when webpage loads first
const loadAll = asyncHandler(async (req, res) => {
    const userId = req.user._id; // current user's id from middleware
    const tasks = await Task.find({ userId });
    if(tasks.length === 0) {
        res.status(404).json({result: "error", message: "Task not found"});
    } else {
        res.json({payload : tasks});
    }
});

// Add one or more tasks to the database
// remove duplicates from within what is received from client and what is already there in db
const addTasks = asyncHandler(async (req, res) => {
    const userId = req.user._id; // current user's id from middleware
    // remove duplicate entries from client
    const seen = new Set();
    const tasksReceived = req.body.filter(task => {
        if (seen.has(task.desc)) {
            return false;  // already exists, skip it
        }
        seen.add(task.desc);
        return true;  // first time seeing it, keep it
    });
    // create objects to save to db
    const newTasks = tasksReceived.map(task => ({  //from client
        desc: task.desc,
        userId: userId
    }));
    const tasks = await Task.find({ userId });  // find all current tasks of an user
    const taskDescs = tasks.map((task) => task.desc);  //get current task desc from database
    //remove duplicates from what is received from the client
    const newFilteredTasks = newTasks.filter(task => !taskDescs.includes(task.desc)); 
    const uniqueTasks = await Task.insertMany(newFilteredTasks);    // save to database after removing duplicates
    if(uniqueTasks.length === 0) {
        res.status(404).json({result: "error", message: "No unique tasks to save to the database", payload: uniqueTasks});
    } else {
        res.json({result: "success", message: "Tasks were saved to the database successfully", payload: uniqueTasks});
    }
});

// Delete all tasks in database
const deleteAll = asyncHandler(async (req, res) => {
    const userId = req.user._id; // current user's id from middleware
    const { acknowledged, deletedCount } = await Task.deleteMany({ userId });
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
    const task = await Task.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user._id 
    });
    if(task === null) {
        res.status(404).json({result: "error", message: "Task was not deleted because it was not found on our database"});
    } else {
        res.json({result: "success", message: "The selected task was deleted successfully"});
    }
});

// Modify a single task
const changeTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id }, // search conditions
        { $set: req.body },                           // updates to apply
        { new: true, runValidators: true }            // return the updated document
    );
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