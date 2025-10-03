# PolyTasks

PolyTasks is a lightweight task tracker that runs entirely in the browser and keeps your todos in sync across tabs using local storage.

## Features
- Fast task capture with a keyboard-friendly form
- Task persistence via `localStorage` so nothing is lost on refresh
- Completion toggle and delete controls with live counter updates
- Accessible, responsive UI built with modern semantics and CSS

## Getting Started
1. Serve the folder with any static web server (for example `npx serve` or `python -m http.server`).
2. Open `http://localhost:PORT/index.html` in a modern browser.
3. Add, complete, and delete tasks; changes are saved automatically.

## Project Structure
- `index.html` - Shell markup for the PolyTasks interface
- `styles.css` - Visual design and layout rules
- `app.js` - DOM wiring and event handling
- `taskManager.js` - In-memory task operations with persistence hooks
- `storage.js` - Thin wrapper around `localStorage`

## Development Notes
- The app uses ES modules, so it should be served over HTTP(S) rather than opened directly via the file system.
- Local storage is scoped per browser origin, allowing multiple independent task lists on different hosts.
