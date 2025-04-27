// Simple token check
let token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/login.html";
} else {
    document.getElementById("username").textContent =
        localStorage.getItem("username") || "User";
}

// View My Tasks
document.getElementById("viewTasksButton").addEventListener("click", () => {
    window.location.href = "/task.html"; // change the URL if your tasks page has a different name
});

// Logout
document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login.html";
});
