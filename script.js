// ==========================================
//              1. TIMER LOGIC
// ==========================================

// Grab HTML Elements for Timer
const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

// Timer Variables
let timeLeft = 1500; // 1500 seconds = 25 minutes
let timer; 

// Update the Screen
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60); 
    let seconds = timeLeft % 60; 

    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }

    timeDisplay.innerText = minutes + ":" + seconds;
}

// Timer Controls
function startTimer() {
    if (timer) { clearInterval(timer); }
    timer = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--; 
            updateDisplay(); 
        } else {
            clearInterval(timer); 
            alert("Pomodoro complete! Time for a break. 🚀");
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timer); 
}

function resetTimer() {
    clearInterval(timer); 
    timeLeft = 1500; 
    updateDisplay(); 
}

// Connect Timer Buttons
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
// ==========================================
//        2. TASK LIST LOGIC (With Memory)
// ==========================================

const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

// NEW: When the app starts, immediately load saved tasks!
loadTasks();

function addTask() {
    const taskText = taskInput.value.trim(); 
    if (taskText === "") { return; }

    createTaskElement(taskText, false); // Draw it on the screen
    saveTasks(); // Save it to the browser's memory!
    
    taskInput.value = "";
}

// This function just draws the HTML for a task
function createTaskElement(text, isCompleted) {
    const li = document.createElement("li");
    li.className = "task-item"; 

    const span = document.createElement("span");
    span.innerText = text;
    span.className = "task-text";
    
    // If it was saved as completed, make sure it is crossed out!
    if (isCompleted) {
        span.classList.add("completed");
    }
    
    // Cross off logic
    span.addEventListener("click", function() {
        span.classList.toggle("completed");
        saveTasks(); // Update memory when crossed off
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.className = "delete-btn";
    
    // Delete logic
    deleteBtn.addEventListener("click", function() {
        li.remove();
        saveTasks(); // Update memory when deleted
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// --- THE MEMORY FUNCTIONS ---

function saveTasks() {
    const tasks = []; // Create an empty array
    const taskItems = document.querySelectorAll(".task-item"); // Find all tasks on screen
    
    // Loop through each task and get its text and whether it is crossed off
    taskItems.forEach(function(item) {
        const text = item.querySelector(".task-text").innerText;
        const isCompleted = item.querySelector(".task-text").classList.contains("completed");
        tasks.push({ text: text, completed: isCompleted }); // Push to array
    });
    
    // Convert the array to text and save it to the browser
    localStorage.setItem("pomodoroTasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedData = localStorage.getItem("pomodoroTasks"); // Get saved text
    if (savedData) {
        const tasks = JSON.parse(savedData); // Convert text back into an array
        // Loop through saved tasks and draw them on screen
        tasks.forEach(function(task) {
            createTaskElement(task.text, task.completed);
        });
    }
}

// Connect Task Buttons
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") { addTask(); }
});

