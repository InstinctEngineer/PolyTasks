// Provides task CRUD operations and keeps local state synced with storage.
import { loadTasks, saveTasks } from "./storage.js";

let tasks = loadTasks();

// Generates a unique id for each task.
function generateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Saves the in-memory task list to localStorage.
function persist() {
    saveTasks(tasks);
}

// Returns a defensive copy of the current tasks.
export function getTasks() {
    return tasks.map((task) => ({ ...task }));
}

// Adds a new task when the provided text is not empty.
export function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) {
        return null;
    }

    const newTask = {
        id: generateId(),
        text: trimmed,
        completed: false,
    };

    tasks.push(newTask);
    persist();
    return { ...newTask };
}

// Updates the completion flag for the matching task.
export function setTaskCompletion(id, completed) {
    const task = tasks.find((item) => item.id === id);
    if (!task) {
        return null;
    }

    task.completed = Boolean(completed);
    persist();
    return { ...task };
}

// Removes a task from the list by id.
export function removeTask(id) {
    const originalLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== id);

    if (tasks.length === originalLength) {
        return false;
    }

    persist();
    return true;
}

// Reloads tasks from storage, useful when the page regains focus.
export function reloadTasks() {
    tasks = loadTasks();
    return getTasks();
}

// Counts how many tasks remain incomplete.
export function remainingCount() {
    return tasks.reduce((count, task) => count + (task.completed ? 0 : 1), 0);
}
