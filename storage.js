// Handles all persistence logic for tasks in localStorage.
const STORAGE_KEY = 'polyTasks.todoList';

// Loads tasks array from localStorage or returns an empty array when none exist.
export function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
        return [];
    }
}

// Persists the given tasks array into localStorage.
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Clears all stored tasks from localStorage.
export function clearTasks() {
    localStorage.removeItem(STORAGE_KEY);
}
