# Tasks

## Task List

- [x] 1. Project scaffold
  - [x] 1.1 Create `index.html` with semantic structure: header, timer card, task card, quick-links card, and script/style link tags
  - [x] 1.2 Create `css/style.css` with CSS custom properties for light/dark themes, card grid layout, and responsive breakpoint at 768px
  - [x] 1.3 Create `js/script.js` with module-level `state` object and `DOMContentLoaded` init stub

- [x] 2. Storage module
  - [x] 2.1 Implement `getTasks`, `saveTasks`, `getQuickLinks`, `saveQuickLinks`, `getUserName`, `saveUserName`, `getTheme`, `saveTheme` with JSON serialization and null-safe defaults
  - [x] 2.2 Wrap all `localStorage` calls in `try/catch` to handle unavailable storage gracefully

- [x] 3. Clock and greeting
  - [x] 3.1 Implement `formatTime(seconds)` returning zero-padded `MM:SS` string
  - [x] 3.2 Implement `updateClock()` writing current time to `#clock` and human-readable date to `#date`
  - [x] 3.3 Implement `startClock()` using `setInterval` at 1000ms
  - [x] 3.4 Implement `getGreeting(hour)` returning the correct salutation for the three time ranges
  - [x] 3.5 Implement `updateGreeting()` composing salutation with optional user name suffix

- [x] 4. Focus timer
  - [x] 4.1 Implement `startTimer()` with guard against double-start
  - [x] 4.2 Implement `stopTimer()` clearing the interval without resetting seconds
  - [x] 4.3 Implement `resetTimer()` clearing the interval and restoring `timerSeconds` to 1500
  - [x] 4.4 Implement `tickTimer()` decrementing seconds, updating display, and firing `alert` at zero

- [x] 5. Task manager
  - [x] 5.1 Implement `addTask(text)` with whitespace trim, case-insensitive duplicate check, `Date.now()` ID assignment, storage save, and re-render
  - [x] 5.2 Implement `toggleTask(id)` flipping `completed`, saving, and re-rendering
  - [x] 5.3 Implement `deleteTask(id)` filtering the array, saving, and re-rendering
  - [x] 5.4 Implement `startEditTask(id)` swapping the text span for a pre-filled input inline
  - [x] 5.5 Implement `confirmEditTask(id, newText)` updating text (revert if empty), saving, and re-rendering
  - [x] 5.6 Implement `renderTasks()` building the task list DOM from `state.tasks`

- [x] 6. Quick links manager
  - [x] 6.1 Implement `normalizeUrl(url)` prepending `https://` when no `http(s)://` prefix is present
  - [x] 6.2 Implement `addQuickLink(name, url)` normalizing URL, assigning ID, saving, and re-rendering
  - [x] 6.3 Implement `deleteQuickLink(id)` filtering the array, saving, and re-rendering
  - [x] 6.4 Implement `renderQuickLinks()` building anchor elements with `target="_blank"` and `rel="noopener noreferrer"`

- [x] 7. Theme manager
  - [x] 7.1 Implement `applyTheme(theme)` setting `data-theme` on `<html>`
  - [x] 7.2 Implement `toggleTheme()` flipping between `"light"` and `"dark"`, saving, and applying

- [x] 8. Init and event wiring
  - [x] 8.1 In `DOMContentLoaded`: load all LS values into `state`, apply theme, render tasks and links, populate user name input, start clock
  - [x] 8.2 Attach event listeners for: user name input, timer start/stop/reset buttons, task add form, task list delegation (complete/delete/edit/confirm), quick link add form, quick link panel delegation (delete), theme toggle

- [x] 9. Styling
  - [x] 9.1 Style the header card with clock, date, greeting, and user name input
  - [x] 9.2 Style the timer card with large countdown display and control buttons
  - [x] 9.3 Style the task list card with task items, completion strikethrough, and action buttons
  - [x] 9.4 Style the quick links card with link tiles and delete controls
  - [x] 9.5 Implement light and dark theme CSS variable sets and `[data-theme="dark"]` overrides
  - [x] 9.6 Add responsive media query: single-column grid at `max-width: 768px`

- [x] 10. Tests
  - [x] 10.1 Write unit tests for DOM structure, LS key names, timer alert, theme application, and load-from-storage scenarios
  - [x] 10.2 Write property test for Property 1: `formatTime` round-trip (Feature: todo-life-dashboard, Property 1)
  - [x] 10.3 Write property test for Property 2: date display contains human-readable components (Feature: todo-life-dashboard, Property 2)
  - [x] 10.4 Write property test for Property 3: greeting maps correctly to hour range (Feature: todo-life-dashboard, Property 3)
  - [x] 10.5 Write property test for Property 4: greeting appends non-empty user name (Feature: todo-life-dashboard, Property 4)
  - [x] 10.6 Write property test for Property 5: task list storage round-trip (Feature: todo-life-dashboard, Property 5)
  - [x] 10.7 Write property test for Property 6: quick links storage round-trip (Feature: todo-life-dashboard, Property 6)
  - [x] 10.8 Write property test for Property 7: user name storage round-trip (Feature: todo-life-dashboard, Property 7)
  - [x] 10.9 Write property test for Property 8: theme storage round-trip (Feature: todo-life-dashboard, Property 8)
  - [x] 10.10 Write property test for Property 9: storage null defaults (Feature: todo-life-dashboard, Property 9)
  - [x] 10.11 Write property test for Property 10: task IDs are unique (Feature: todo-life-dashboard, Property 10)
  - [x] 10.12 Write property test for Property 11: duplicate task prevention (Feature: todo-life-dashboard, Property 11)
  - [x] 10.13 Write property test for Property 12: task completion toggle is an involution (Feature: todo-life-dashboard, Property 12)
  - [x] 10.14 Write property test for Property 13: task delete removes exactly the target task (Feature: todo-life-dashboard, Property 13)
  - [x] 10.15 Write property test for Property 14: task edit updates text (Feature: todo-life-dashboard, Property 14)
  - [x] 10.16 Write property test for Property 15: URL normalization (Feature: todo-life-dashboard, Property 15)
  - [x] 10.17 Write property test for Property 16: quick link anchors have correct security attributes (Feature: todo-life-dashboard, Property 16)
  - [x] 10.18 Write property test for Property 17: quick link delete removes exactly the target link (Feature: todo-life-dashboard, Property 17)
  - [x] 10.19 Write property test for Property 18: timer reset always returns to 1500 seconds (Feature: todo-life-dashboard, Property 18)
  - [x] 10.20 Write property test for Property 19: timer start is idempotent (Feature: todo-life-dashboard, Property 19)
