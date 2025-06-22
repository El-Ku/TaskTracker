import asyncHandler from "express-async-handler";
import { Task } from "../models/taskModel.js";

const MAX_TASKS = 20;

// Load all tasks. Called when webpage loads first
export const loadAll = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user._id; // current user's id from middleware
    const tasks = await Task.find({ userId });
    if (tasks.length === 0) {
      res.json({ result: "error", message: "Tasks not found" });
    } else {
      res.json({ payload: tasks });
    }
  } catch (error) {
    next(error);
  }
});

// Add one or more tasks to the database
// remove duplicates from within what is received from client and what is already there in db
export const addTasks = asyncHandler(async (req, res, next) => {
  try {
    const newFilteredTasks = await tasksSanityCheck(
      req.user._id,
      req.body,
      false
    ); // sanity check on received tasks
    if (typeof newFilteredTasks === "string") {
      //ran out of tasks quota
      return res.status(400).json({
        result: "error",
        message: newFilteredTasks,
      });
    }
    const uniqueTasks = await Task.insertMany(newFilteredTasks); // save to database after removing duplicates
    if (uniqueTasks.length === 0) {
      res.status(404).json({
        result: "error",
        message: "No unique tasks to save to the database",
        payload: uniqueTasks,
      });
    } else {
      res.json({
        result: "success",
        message: "Tasks were saved to the database successfully",
        payload: uniqueTasks,
      });
    }
  } catch (error) {
    next(error);
  }
});

export const deleteTasks = asyncHandler(async (req, res, next) => {
  try {
    let acknowledged, deletedCount;
    if (req.body === undefined) {
      ({ acknowledged, deletedCount } = await Task.deleteMany({
        userId: req.user._id,
      }));
    } else {
      ({ acknowledged, deletedCount } = await Task.deleteMany({
        _id: { $in: req.body },
        userId: req.user._id,
      }));
    }
    if (acknowledged) {
      if (deletedCount > 0) {
        res.json({
          result: "success",
          message: `All ${deletedCount} tasks were deleted from the database`,
        });
      } else {
        res.status(404).json({
          result: "error",
          message: `There were no tasks in the database to delete`,
        });
      }
    } else {
      res.status(500).json({
        result: "error",
        message: `Couldn't delete any tasks from the database`,
      });
    }
  } catch (error) {
    next(error);
  }
});

// Modify a list of tasks
export const updateTasks = asyncHandler(async (req, res, next) => {
  const newFilteredTasks = await tasksSanityCheck(req.user._id, req.body, true); // sanity check on received tasks
  if (newFilteredTasks.length === 0) {
    return res.status(404).json({
      result: "error",
      message: "No unique tasks to update in the database",
    });
  }
  newFilteredTasks.forEach(async (task) => {
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: task._id, userId: req.user._id }, // search conditions
        { $set: task }, // updates to apply
        { new: true, runValidators: true } // return the updated document
      );
      if (updatedTask === null) {
        return res.status(404).json({
          result: "error",
          message:
            "Task ID not found on our server. Unable to update the task with id: " +
            task._id,
        });
      }
    } catch (error) {
      next(error);
    }
  });
  if (res.statusCode == 200) {
    res.json({ result: "success", message: "Tasks were updated successfully" });
  }
});

const tasksSanityCheck = async (userId, reqBody, patch = false) => {
  // remove duplicate entries from client
  const seen = new Set();
  const tasksReceived = reqBody.filter((task) => {
    const key = `${task.desc}||${task.status}`; // unique identifier for desc + status
    if (seen.has(key)) {
      return false; // already exists with same desc and status, skip
    }
    seen.add(key);
    return true; // first time seeing this desc+status pair, keep it
  });
  // create objects to save to db
  const newTasks = tasksReceived.map((task) => ({
    _id: task._id,
    desc: task.desc,
    userId,
    ...(patch && { status: task.status }),
    ...(!patch && { status: "pending" }),
  }));
  const tasks = await Task.find({ userId }); // find all current tasks of an user
  const taskKeys = new Set(tasks.map((task) => `${task.desc}||${task.status}`));
  const uniqueTasks = newTasks.filter(
    (task) => !taskKeys.has(`${task.desc}||${task.status}`)
  );
  if (uniqueTasks.length + tasks.length > MAX_TASKS) {
    return `You cannot save more than ${MAX_TASKS} tasks`;
  }
  return uniqueTasks;
};
