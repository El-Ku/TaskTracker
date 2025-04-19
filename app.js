let tasks = {};  //contains all the individual task objects
const addTaskBtn = document.getElementById("addBtn");
const taskTable = document.getElementById("taskTable");
let latestIndex = 0; //indicates the next property name to which new task willsl be added.


document.addEventListener("DOMContentLoaded", () => {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    if(tasks == undefined) {
        console.log("No tasks in memory. Create something fresh");
        tasks = {};
    }
    else {  //some tasks found in localstorage. Show them in a table format
        latestIndex = Number(localStorage.getItem("latestIndex"));
        for (const index in tasks) {
            updateTable(Number(index)); 
        }
    }
});

// what happens when you click the add Task button is specified here.
addTaskBtn.addEventListener("click", () => {
    let taskItems = document.getElementById("taskInput").value;
    taskItems = taskItems.split(",");  //get an array of tasks if entered as comma separated
    // Add each task into separate rows. one by one.
    taskItems.forEach((taskItem) => {
        tasks[String(++latestIndex)] = {
            taskId: latestIndex,
            taskName: taskItem,
            timeAdded: Date.now(),
            done: false
        };
        updateTable(latestIndex);  // add a new row to the table with the new task.
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));  //save the tasks object in localstorage
    localStorage.setItem("latestIndex", latestIndex);
    document.getElementById("taskInput").value = "";  //clear the input text box.
});

// Add one row to the table(which is the latest added task)
const updateTable = (index) => {
    let item = tasks[String(index)]; //get the task pointed by index from the tasks object
    addRow(item); //add a row
};

// Function for adding a single row to the table.
const addRow = (item) => {
    let thead = taskTable.createTHead();
    let row = thead.insertRow();
    // add text cells to the row
    Object.values(item).slice(0,3).forEach((val) => {
        let cell = row.insertCell();
        if(val > 1745057913897)  //19th April 2025
            val = formatDate(Number(val));
        let text = document.createTextNode(val);
        cell.appendChild(text);
    });
    // Add Done button
    let cell = row.insertCell();
    let doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.className = "doneBtn";
    doneBtn.addEventListener("click", () => {
        setTaskDone(doneBtn.parentElement.parentElement);
    });
    // add cancel button
    let cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "cancelBtn";
    cancelBtn.addEventListener("click", () => {
        removeTaskFromArray(cancelBtn.parentElement.parentElement);
    });
    // add Edit button
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "editBtn";
    editBtn.addEventListener("click", () => {
        editTask(editBtn.parentElement.parentElement);
    });
    // Append all the buttons
    cell.appendChild(doneBtn);
    cell.appendChild(cancelBtn);
    cell.appendChild(editBtn);
    // useful when read from localstorage
    if(item.done) {
        row.style.backgroundColor = "green";
    }
};

// remove a row from the table and delete the property from the tasks object
const removeTaskFromArray = (rowElement) => {
    const taskId = rowElement.cells[0].textContent;  //get the task ID.
    delete tasks[taskId];
    localStorage.setItem("tasks", JSON.stringify(tasks));  // update localstorage
    rowElement.remove();  //remove the row from the table
};

// mark a task as "done" and change its backgroundcolor to green
const setTaskDone = (rowElement) => {
    const taskId = rowElement.cells[0].textContent; //get the task ID.
    tasks[taskId].done = true;  //remove the task item from the tasks object.
    localStorage.setItem("tasks", JSON.stringify(tasks));   // update localstorage
    rowElement.style.backgroundColor = "green";
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
            const taskId = rowElement.cells[0].textContent; //get the task ID.
            tasks[taskId].taskName = input.value;  //update task name on tasks object
            localStorage.setItem("tasks", JSON.stringify(tasks));    // update localstorage
        } else if (e.key === "Escape") {
            taskCell.textContent = currentTask;
        }
    });
};

// format the date number to display on the table in a human readable format
const formatDate = (timestamp) => {
    const formatted = new Date(timestamp).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
    });
    return formatted;
};
