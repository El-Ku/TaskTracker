let tasks = [];
let latestIndex = 0;
const TaskStatus = require('../public/CONSTANTS').TaskStatus;

function loadAll() {
    return tasks;
}

function addTasks(taskNames) {
    const newTasks = [];
    taskNames.forEach(task => {
        newTasks.push({
            id: latestIndex++,
            name: task.name,
            time: Date.now(),
            status: TaskStatus.PENDING
        });
    });
    tasks.push(...newTasks);
    return newTasks;
}

function deleteTask(_taskId) {
    const {taskId} = _taskId;
    const index = tasks.findIndex((task) => task.id === taskId);
    if(index === -1)
        return -1;
    else {
        tasks.splice(index, 1);
        return 1;
    }
}

function changeTaskStatus(data) {
    const {taskId, status} = data;
    const index = tasks.findIndex((task) => task.id === taskId);
    if(index === -1)   // taskId doesnt exist
        return -1;   
    else {
        tasks[index].status = status;
        return 1;
    }
}

function changeTaskName(data) {
    const {taskId, name} = data;
    const index = tasks.findIndex((task) => task.id === taskId);
    if(index === -1)   // taskId doesnt exist
        return -1;   
    else {
        tasks[index].name = name;
        return 1;
    }
}

function deleteAllTasks() {
    tasks = [];
    latestIndex = 0;
    return 1;
}

module.exports = {
    loadAll,
    addTasks,
    deleteTask,
    changeTaskStatus,
    changeTaskName,
    deleteAllTasks
}