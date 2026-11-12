
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "All";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const category = document.getElementById("category").value;
    const dueDate = document.getElementById("dueDate").value;

    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        title: title,
        category: category,
        dueDate: dueDate,
        completed: false
    });

    input.value = "";
    document.getElementById("dueDate").value = "";

    saveTasks();
    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "Active") return !task.completed;
        if (currentFilter === "Completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            '<p class="empty">No tasks found. Add a new task!</p>';
        return;
    }

    filteredTasks.forEach(task => {
        const item = document.createElement("div");
        item.className = `task-item ${task.completed ? "completed" : ""}`;

        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("strong");
        title.className = "task-title";
        title.textContent = task.title;

        const details = document.createElement("p");
        details.textContent =
            `Category: ${task.category} | Due: ${task.dueDate || "Not set"}`;

        info.append(title, details);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.onclick = () => toggleTask(task.id);

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.append(completeBtn, editBtn, deleteBtn);
        item.append(info, actions);
        taskList.appendChild(item);
    });
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle === null) return;

    if (newTitle.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.title = newTitle.trim();

    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

function filterTasks(filter) {
    currentFilter = filter;
    displayTasks();
}

displayTasks();
