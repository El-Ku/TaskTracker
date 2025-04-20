let tasks = [];  //contains all the individual task objects
const addTaskBtn = document.getElementById("addBtn");
const taskTable = document.getElementById("taskTable");
let latestIndex = 0; //indicates the next property name to which new task willsl be added.
const clearAllBtn = document.getElementById("clearBtn");

document.addEventListener("DOMContentLoaded", () => {
    const tasksObject = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasksObject.tasks;
    if(tasksObject == undefined || tasks == undefined) {
        console.log("No tasks in memory. Create something fresh");
        tasks = [];
    }
    else {  //some tasks found in localstorage. Show them in a table format
        if(tasks.length == 0) {
            latestIndex = 0;
            console.log("No tasks in memory. Create something fresh");
        } else { 
            latestIndex = Number(localStorage.getItem("latestIndex"));
            tasks.forEach((task) => {
                addRow(task); //add a row to the table
            });
        }
    }
});

// what happens when you click the add Task button is specified here.
addTaskBtn.addEventListener("click", () => {
    let taskItems = document.getElementById("taskInput").value;
    taskItems = taskItems.split(",");  //get an array of tasks if entered as comma separated
    // Add each task into separate rows. one by one.
    taskItems.forEach((taskItem) => {
        const task = {
            id: latestIndex++,
            name: taskItem,
            timeAdded: Date.now(),
            status: false
        };
        tasks.push(task);
        addRow(task); //add a row to the table
    });
    localStorage.setItem("tasks", JSON.stringify({tasks}));  //save the tasks object in localstorage
    localStorage.setItem("latestIndex", latestIndex);
    document.getElementById("taskInput").value = "";  //clear the input text box.
});

// Function for adding a single row to the table.
const addRow = (task) => {
    let tbody = document.getElementById("taskTableBody");
    let row = tbody.insertRow();
    // add text cells to the row
    let cell; //val = 
    let text;
    // add id to the table
    cell = row.insertCell();
    text = document.createTextNode(task.id);
    cell.appendChild(text);
    // add task name to the table
    cell = row.insertCell();
    text = document.createTextNode(task.name);
    cell.appendChild(text);
    // add date to the table
    cell = row.insertCell();
    text = document.createTextNode(formatDate(task.timeAdded));
    cell.appendChild(text);
    // Add Done button
    cell = row.insertCell();
    let doneBtn = document.createElement("button");
    toggleDoneTodo(task.status, doneBtn, row);
    doneBtn.className = "doneBtn";
    doneBtn.addEventListener("click", () => {
        setTaskDone(doneBtn.parentElement.parentElement);
        toggleDoneTodo(task.status, doneBtn, row);
    });
    // add cancel button
    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "❌";
    cancelBtn.style.backgroundColor = "white";
    cancelBtn.className = "cancelBtn";
    cancelBtn.addEventListener("click", () => {
        removeTaskFromArray(cancelBtn.parentElement.parentElement);
    });
    // add Edit button
    let editBtn = document.createElement("button");
    editBtn.textContent = "✍";
    editBtn.style.backgroundColor = "white";
    editBtn.className = "editBtn";
    editBtn.addEventListener("click", () => {
        editTask(editBtn.parentElement.parentElement);
    });
    // Append all the buttons
    cell.appendChild(doneBtn);
    cell.appendChild(cancelBtn);
    cell.appendChild(editBtn);
};

// remove a row from the table and delete the property from the tasks object
const removeTaskFromArray = (rowElement) => {
    const taskId = Number(rowElement.cells[0].textContent);  //get the task ID.
    const arrIndex = tasks.findIndex((task) => task.id === taskId);
    tasks.splice(arrIndex, 1);
    localStorage.setItem("tasks", JSON.stringify({tasks}));  // update localstorage
    rowElement.remove();  //remove the row from the table
};

// mark a task as "done" and change its backgroundcolor to green
const setTaskDone = (rowElement) => {   
    const taskId = Number(rowElement.cells[0].textContent);  //get the task ID.
    const arrIndex = tasks.findIndex((task) => task.id === taskId);
    tasks[arrIndex].status = !tasks[arrIndex].status;  //remove the task item from the tasks object.
    localStorage.setItem("tasks", JSON.stringify({tasks}));   // update localstorage
};

// edit a task right from the table. 
// Press "Enter" key to save the change or "Escape" to cancel the edit
const editTask = (rowElement) => {
    const taskCell = rowElement.cells[1]; //2nd cell holds task name
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
            taskCell.textContent = input.value;
            const taskId = Number(rowElement.cells[0].textContent);  //get the task ID.
            const arrIndex = tasks.findIndex((task) => task.id === taskId);
            tasks[arrIndex].name = input.value;  //update task name on tasks object
            localStorage.setItem("tasks", JSON.stringify({tasks}));    // update localstorage
        } else if (e.key === "Escape") {
            taskCell.textContent = currentTask;
        }
    });
};

// Toggle colors of buttons and row and change button text.
const toggleDoneTodo = (done, doneBtn, row) => {
    if(done) {
        doneBtn.textContent = "toDo";
        doneBtn.style.backgroundColor = "yellow";
        row.style.backgroundColor = "green";
    } else {
        doneBtn.textContent = "✅";
        doneBtn.style.backgroundColor = "white";
        row.style.backgroundColor = "white";
    }
}


// format the date number to display on the table in a human readable format
const formatDate = (timestamp) => {
    const formatted = new Date(timestamp).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    });
    return formatted;
};

clearAllBtn.addEventListener("click", () => {
    tasks = [];
    latestIndex = 0;  //reset max index value
    localStorage.setItem("tasks", JSON.stringify({tasks}));    // update localstorage
    document.getElementById("taskTableBody").innerHTML = "";  //clear table
});
