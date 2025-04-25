import {TaskStatus, ButtonText, CSS_PROP} from './CONSTANTS.js';

document.documentElement.style.setProperty('--btn-font-size', CSS_PROP['--btn-font-size']);

let tasks = [];  //contains all the individual task objects
const addTaskBtn = document.getElementById("addBtn");
const clearAllBtn = document.getElementById("clearBtn");

document.addEventListener("DOMContentLoaded", () => {
    //get table data from the server
    fetch(window.location.pathname + '/allTasks')
        .then((res) => res.json())
        // Add all the retrieved tasks to the table as rows
        .then((data) => {
            tasks = data;
            console.log(tasks)
            addRows(data);
        })
        .catch((err) => console.error("Error in Loading all Tasks:", err));
});

// what happens when you click the add Task button is specified here.
addTaskBtn.addEventListener("click", () => {
    // Get input value and store it in an array called new Tasks
    let taskItems = document.getElementById("taskInput").value;
    taskItems = taskItems.split(","); //get an array of tasks if entered as comma separated
    const newTasks = [];
    taskItems.forEach((taskItem) => {
        if (taskItem === "") {
            alert("Task description cannot be empty");
            return;
        }
        newTasks.push({
            desc: taskItem
        });
    });

    // Send newTasks to server and wait for acknowledgement and task details
    fetch(window.location.pathname, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newTasks),
    })
        .then((res) => res.json())
        .then((data) => {
            tasks.push(...data); // Append newTasks into tasks array
            addRows(data);  // Populate the table with newTasks.
        })
        .catch((err) => console.error("Error in Adding a Task:", err));
    //clear the input text box.
    document.getElementById("taskInput").value = "";
});


// remove a row from the table and delete the property from the tasks object
const deleteTask = (rowElement, id) => {
    // Send taskId to server for validation
    fetch(`${window.location.pathname}/${id}`, {
        method: "DELETE",
    })
        .then((res) => res.text())
        .then((data) => {
            const arrIndex = tasks.findIndex((task) => task._id === id);
            tasks.splice(arrIndex, 1); //remove from array
            rowElement.remove(); //remove the row from the table
        })
        .catch((err) =>
            console.error("Error in Deleting the selected Task:", err)
        );
};

// mark a task as "done" and change its backgroundcolor to green
const setTaskStatus = (rowElement, status, id) => {
    fetch(`${window.location.pathname}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: status }),
    })
        .then((res) => res.json())
        .then((data) => {
            const arrIndex = tasks.findIndex((task) => task._id === id);
            tasks[arrIndex].status = status; //change status in local memory
            redoTableRows();
        })
        .catch((err) => console.error("Error in Updating the Task:", err));
};

// edit a task right from the table. 
// Press "Enter" key to save the change or "Escape" to cancel the edit
const editTask = (rowElement, id) => {
    const taskCell = rowElement.cells[0]; //2nd cell holds task name
    const currentTask = taskCell.textContent;
    // Create input box
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentTask;
    taskCell.textContent = ""; // clear existing text
    taskCell.appendChild(input);
    // Focus and select text
    input.focus();
    input.select();
    // Save change on Enter key
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            // get taskID and new task name and send to server
            const newDesc = input.value;
            if (newDesc === "") {
                alert("Task description cannot be empty");
                taskCell.textContent = currentTask;
                return;
            }
            taskCell.textContent = newDesc;
            fetch(`${window.location.pathname}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({desc: newDesc}),
            })
                .then((res) => {
                    if(res.status == 200) {
                        const arrIndex = tasks.findIndex((task) => task._id === id);
                        tasks[arrIndex].desc = newDesc;  //change name in local memory
                    } else {
                        throw new Error(res.status);
                    }
                })
                .catch((err) => {
                    taskCell.textContent = currentTask;
                    console.error("Error in updating the Task:", err);
                });
        } else if (e.key === "Escape") {
            taskCell.textContent = currentTask;
        }
    });
};

// Delete all tasks
clearAllBtn.addEventListener("click", () => {
    // let the server know
    fetch(window.location.pathname + "/allTasks", {
        method: "DELETE",
    })
        .then((res) => res.text())
        .then((data) => {
            tasks = [];
            document.getElementById("taskTableBody").innerHTML = ""; // clear the table
        })
        .catch((err) => console.error("Error in Clearing all Tasks:", err));
});

const redoTableRows = () => {
    document.getElementById("taskTableBody").innerHTML = ""; 
    addRows(tasks);
}

// Function to add multiple rows
const addRows = (tasks) => {
    tasks.forEach((task) => {
        addRow(task);
    })
}

// Function for adding a single row to the table.
const addRow = (task) => {
    let tbody = document.getElementById("taskTableBody");
    let row = tbody.insertRow();
    // add text cells to the row
    let cell; 
    let text;
    // add task name to the table
    cell = row.insertCell();
    text = document.createTextNode(task.desc);
    cell.appendChild(text);
    // add date to the table
    cell = row.insertCell();
    text = document.createTextNode(formatDate(task.time));
    cell.appendChild(text);
    // Add buttons in actions cell
    addButtons(row, task.status, task._id)
};

const addButtons = (row, status, id) => {
    let cell = row.insertCell();
    // Add Done button
    addEventListenersToButton(row, cell, TaskStatus.DONE, "Done", "doneBtn", status, id);
    // Add Pause button
    addEventListenersToButton(row, cell, TaskStatus.PAUSED, "Pause", "pauseBtn", status, id);
    // Add Undone button (don/paused to pending)
    addEventListenersToButton(row, cell, TaskStatus.PENDING, "toDo", "undoneBtn", status, id);
    // add delete button
    addEventListenersToButton(undefined, cell, "Delete", "Delete", "deleteBtn", undefined, id);
    // add Edit button
    addEventListenersToButton(undefined, cell, "Edit", "Edit", "editBtn", undefined, id);
}

const addEventListenersToButton = (row, cell, statusText, hoverText, className, status, id) => {
    let btn = document.createElement("button");
    btn.textContent = ButtonText[statusText];
    btn.addEventListener("click", () => {
        if(statusText == "Delete") {
            deleteTask(btn.parentElement.parentElement, id);
        } else if(statusText == "Edit") {
            editTask(btn.parentElement.parentElement, id);
        } else {
            setTaskStatus(btn.parentElement.parentElement, statusText, id);
            redoTableRows();
        }
    })
    btn.addEventListener("mouseover", () => {
        btn.textContent = hoverText;
        btn.style.fontSize = CSS_PROP['--btn-small-font-size'];
    })
    btn.addEventListener("mouseleave", () => {
        btn.textContent = ButtonText[statusText];
        btn.style.fontSize = CSS_PROP['--btn-font-size'];
    })
    btn.className = className;
    if (status == TaskStatus.DONE && statusText == TaskStatus.DONE) {
        row.style.backgroundColor = "green";
        btn.disabled = true;
    } else if (status == TaskStatus.PAUSED && statusText == TaskStatus.PAUSED) {
        row.style.backgroundColor = "yellow";
        btn.disabled = true;
    } else if (status == TaskStatus.PENDING && statusText == TaskStatus.PENDING) {
        row.style.backgroundColor = "white";
        btn.disabled = true;
    }
    cell.appendChild(btn);
}

// format the date number to display on the table in a human readable format
const formatDate = (timestamp) => {
    const formatted = new Date(timestamp).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    });
    return formatted;
};

