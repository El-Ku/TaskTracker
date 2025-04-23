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
    const { taskId } = _taskId;
    if (taskId === -1) {
        tasks = [];
        latestIndex = 0;
        return 1;
    } else {
        const index = tasks.findIndex((task) => task.id === taskId);
        if (index === -1) return -1;
        else {
            tasks.splice(index, 1);
            return 1;
        }
    }
}

function changeTask(data) {
    const {taskId, name, status} = data;
    const index = tasks.findIndex((task) => task.id === taskId);
    if(index === -1)   // taskId doesnt exist
        return -1;   
    else {
        if(name !== undefined)
            tasks[index].name = name;
        else if(status !== undefined)
            tasks[index].status = status;
        return 1;
    }
}

module.exports = {
    loadAll,
    addTasks,
    deleteTask,
    changeTask
}