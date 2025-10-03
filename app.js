// Wires the UI to the task manager and keeps the display in sync.
import {
    addTask,
    getTasks,
    reloadTasks,
    remainingCount,
    removeTask,
    setTaskCompletion,
} from "./taskManager.js";

const elements = {
    taskForm: null,
    taskInput: null,
    taskList: null,
    taskCounter: null,
};

// Grabs references to the DOM nodes the app needs.
function cacheElements() {
    elements.taskForm = document.getElementById("taskForm");
    elements.taskInput = document.getElementById("taskInput");
    elements.taskList = document.getElementById("taskList");
    elements.taskCounter = document.getElementById("taskCounter");
}

// Makes sure all required elements exist before wiring up listeners.
function ensureElements() {
    return (
        elements.taskForm instanceof HTMLFormElement &&
        elements.taskInput instanceof HTMLInputElement &&
        elements.taskList instanceof HTMLUListElement &&
        elements.taskCounter instanceof HTMLElement
    );
}

// Sets up event listeners and renders the initial task list.
function init() {
    cacheElements();

    if (!ensureElements()) {
        console.error("PolyTasks: required DOM elements are missing.");
        return;
    }

    renderTasks(getTasks());
    elements.taskForm.addEventListener("submit", handleAddTask);
    elements.taskList.addEventListener("change", handleTaskToggle);
    elements.taskList.addEventListener("click", handleTaskDelete);
    window.addEventListener("storage", handleExternalChange);
}

// Handles task creation from the form submission.
function handleAddTask(event) {
    event.preventDefault();
    const created = addTask(elements.taskInput.value || "");

    elements.taskInput.value = "";
    elements.taskInput.focus();

    if (!created) {
        return;
    }

    renderTasks(getTasks());
}

// Responds to checkbox state changes in the task list.
function handleTaskToggle(event) {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== "checkbox") {
        return;
    }

    const taskItem = checkbox.closest("li");
    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.taskId;
    setTaskCompletion(taskId, checkbox.checked);
    renderTasks(getTasks());
}

// Handles clicks on delete buttons within the task list.
function handleTaskDelete(event) {
    const button = event.target;
    if (!(button instanceof HTMLElement) || !button.classList.contains("delete-button")) {
        return;
    }

    const taskItem = button.closest("li");
    if (!taskItem) {
        return;
    }

    const taskId = taskItem.dataset.taskId;
    removeTask(taskId);
    renderTasks(getTasks());
}

// Keeps the UI up to date when storage changes in another tab.
function handleExternalChange() {
    renderTasks(reloadTasks());
}

// Renders the entire list of task elements.
function renderTasks(tasks) {
    elements.taskList.innerHTML = "";
    tasks.forEach((task) => {
        elements.taskList.appendChild(createTaskElement(task));
    });
    updateCounter();
}

// Builds the DOM structure for a single task row.
function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.className = "task-item";
    listItem.dataset.taskId = task.id;
    if (task.completed) {
        listItem.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";

    listItem.appendChild(checkbox);
    listItem.appendChild(text);
    listItem.appendChild(deleteButton);

    return listItem;
}

// Updates the counter that shows how many tasks remain.
function updateCounter() {
    const remaining = remainingCount();
    elements.taskCounter.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
