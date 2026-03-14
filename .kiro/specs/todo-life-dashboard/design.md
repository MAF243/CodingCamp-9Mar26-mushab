# Design Document: Todo Life Dashboard

## Overview

A single-page productivity dashboard delivered as three static files (`index.html`, `css/style.css`, `js/script.js`) with zero dependencies. All state lives in the browser's Local Storage API; there is no backend, no build step, and no module bundler.

The page is divided into four functional cards:
- **Header** — live clock/date, time-based greeting, user name input, theme toggle
- **Focus Timer** — 25-minute countdown with start/stop/reset controls
- **To-Do List** — add/edit/complete/delete tasks with duplicate prevention
- **Quick Links** — add/delete URL shortcuts that open in a new tab

The design follows a progressive-enhancement philosophy: semantic HTML first, CSS layout second, JavaScript behavior last. This keeps the file structure flat and the code easy to audit.

---

## Architecture

The entire application is a single JavaScript module (`js/script.js`) that runs after the DOM is ready. It is organized into five logical layers:

```
┌─────────────────────────────────────────────────────┐
│                     index.html                      │
│  (static markup, semantic structure, no JS inline)  │
└──────────────────────┬──────────────────────────────┘
                       │ DOM
┌──────────────────────▼──────────────────────────────┐
│                   js/script.js                      │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  Storage    │  │  State       │  │  Render   │  │
│  │  (read/     │  │  (in-memory  │  │  (DOM     │  │
│  │   write LS) │  │   objects)   │  │   update) │  │
│  └──────┬──────┘  └──────┬───────┘  └─────┬─────┘  │
│         │                │                │         │
│  ┌──────▼────────────────▼────────────────▼─────┐   │
│  │              Event Handlers                  │   │
│  │  (user interactions → state → render → LS)   │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │              Init (DOMContentLoaded)         │   │
│  │  (load LS → populate state → render all)     │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                       │ CSS custom properties
┌──────────────────────▼──────────────────────────────┐
│                  css/style.css                      │
│  (CSS variables for themes, grid layout, cards)     │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action
    │
    ▼
Event Handler
    │
    ├─► Validate input
    │
    ├─► Mutate in-memory state
    │
    ├─► Persist to Local Storage
    │
    └─► Re-render affected DOM section
```

No framework, no virtual DOM — direct DOM manipulation is fine at this scale.

---

## Components and Interfaces

### 1. Storage Module

Thin wrappers around `localStorage` that handle JSON serialization and null-safe defaults.

```js
// Read helpers
function getTasks()      // → Task[]       (default: [])
function getQuickLinks() // → QuickLink[]  (default: [])
function getUserName()   // → string       (default: "")
function getTheme()      // → "light"|"dark" (default: "light")

// Write helpers
function saveTasks(tasks)           // → void
function saveQuickLinks(links)      // → void
function saveUserName(name)         // → void
function saveTheme(theme)           // → void
```

### 2. Clock / Greeting

Runs on a `setInterval` (1 second). Reads `Date` on each tick.

```js
function startClock()        // sets up interval, calls updateClock each tick
function updateClock()       // writes time string to #clock, date to #date
function getGreeting(hour)   // → "Good Morning" | "Good Afternoon" | "Good Evening"
function updateGreeting()    // reads userName from state, writes to #greeting
```

### 3. Focus Timer

Manages a single `setInterval` reference stored in a module-level variable.

```js
let timerInterval = null
let timerSeconds = 25 * 60   // mutable, reset to 1500 on Reset

function startTimer()   // guards against double-start; sets interval
function stopTimer()    // clears interval, keeps timerSeconds
function resetTimer()   // clears interval, resets timerSeconds, updates display
function tickTimer()    // decrements timerSeconds, updates display, fires alert at 0
function formatTime(s)  // → "MM:SS" string from total seconds
```

### 4. Task Manager

```js
function addTask(text)         // validates, deduplicates, assigns ID, saves, renders
function toggleTask(id)        // flips completed flag, saves, renders
function deleteTask(id)        // filters array, saves, renders
function startEditTask(id)     // swaps text span for input element inline
function confirmEditTask(id, newText) // updates text, saves, renders
function renderTasks()         // full re-render of #task-list from state.tasks
```

### 5. Quick Links Manager

```js
function normalizeUrl(url)     // prepends "https://" if no http(s) prefix
function addQuickLink(name, url) // normalizes, saves, renders
function deleteQuickLink(id)   // filters array, saves, renders
function renderQuickLinks()    // full re-render of #link-panel from state.quickLinks
```

### 6. Theme Manager

```js
function applyTheme(theme)     // sets data-theme attribute on <html>
function toggleTheme()         // flips between light/dark, saves, applies
```

### 7. Init

```js
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load all LS values into state
  // 2. Apply theme (before paint to avoid flash)
  // 3. Render tasks, links, userName
  // 4. Start clock
  // 5. Attach all event listeners
})
```

---

## Data Models

### Task

```js
{
  id: number,          // Date.now() at creation time — unique within session
  text: string,        // user-supplied description, trimmed
  completed: boolean   // toggled by complete control
}
```

Persisted as JSON array under key `"tasks"`.

### QuickLink

```js
{
  id: number,    // Date.now() at creation time
  name: string,  // display label
  url: string    // normalized URL (always starts with http:// or https://)
}
```

Persisted as JSON array under key `"quickLinks"`.

### Theme

Plain string: `"light"` or `"dark"`. Persisted under key `"theme"`.

### UserName

Plain string. Persisted under key `"userName"`.

### In-Memory State Object

```js
const state = {
  tasks: [],       // Task[]
  quickLinks: [],  // QuickLink[]
  userName: "",    // string
  theme: "light"   // "light" | "dark"
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Time format correctness

*For any* total number of seconds in [0, 5999], `formatTime(seconds)` should return a string matching the pattern `MM:SS` where MM and SS are zero-padded two-digit numbers and the decoded value equals the input.

**Validates: Requirements 1.1, 4.1**

---

### Property 2: Date display contains human-readable components

*For any* valid `Date` object, the date formatting function should return a string that contains a recognizable day name, month name, day number, and four-digit year.

**Validates: Requirements 1.3**

---

### Property 3: Greeting maps correctly to hour range

*For any* integer hour in [0, 23], `getGreeting(hour)` should return exactly "Good Morning" for hours in [5, 11], "Good Afternoon" for hours in [12, 17], and "Good Evening" for hours in [18, 23] or [0, 4].

**Validates: Requirements 2.1, 2.2, 2.3**

---

### Property 4: Greeting appends non-empty user name

*For any* non-empty string `name`, the full greeting string should contain `name` as a suffix. For an empty string, the greeting should not contain a trailing comma or extra whitespace.

**Validates: Requirements 2.4, 3.4**

---

### Property 5: Task list storage round-trip

*For any* array of Task objects, calling `saveTasks(tasks)` followed by `getTasks()` should return an array deeply equal to the original, and the raw `localStorage.getItem("tasks")` value should be valid JSON that parses to the same array.

**Validates: Requirements 5.3, 12.1**

---

### Property 6: Quick links storage round-trip

*For any* array of QuickLink objects, calling `saveQuickLinks(links)` followed by `getQuickLinks()` should return an array deeply equal to the original, and the raw `localStorage.getItem("quickLinks")` value should be valid JSON.

**Validates: Requirements 8.3, 12.2**

---

### Property 7: User name storage round-trip

*For any* string `name`, calling `saveUserName(name)` followed by `getUserName()` should return the same string, and `localStorage.getItem("userName")` should equal that string directly (not JSON-encoded).

**Validates: Requirements 3.2, 12.3**

---

### Property 8: Theme storage round-trip

*For any* theme value in `{"light", "dark"}`, calling `saveTheme(theme)` followed by `getTheme()` should return the same value, and `localStorage.getItem("theme")` should equal that string directly.

**Validates: Requirements 10.3, 12.4**

---

### Property 9: Storage null defaults

*For any* empty Local Storage state, `getTasks()` returns `[]`, `getQuickLinks()` returns `[]`, `getUserName()` returns `""`, and `getTheme()` returns `"light"`.

**Validates: Requirements 12.5, 10.5**

---

### Property 10: Task IDs are unique

*For any* sequence of `addTask` calls with distinct texts, all resulting task IDs in the list should be unique (no two tasks share the same ID).

**Validates: Requirements 5.2**

---

### Property 11: Duplicate task prevention

*For any* task list containing a task with text T, attempting to add a task whose text matches T case-insensitively should leave the task list length unchanged.

**Validates: Requirements 5.5**

---

### Property 12: Task completion toggle is an involution

*For any* task, toggling its completion state twice should return it to its original `completed` value (toggle is its own inverse).

**Validates: Requirements 6.1**

---

### Property 13: Task delete removes exactly the target task

*For any* task list and any task ID present in that list, calling `deleteTask(id)` should produce a list that does not contain a task with that ID, and all other tasks remain unchanged.

**Validates: Requirements 6.3**

---

### Property 14: Task edit updates text

*For any* task and any non-empty new text string, calling `confirmEditTask(id, newText)` should result in the task with that ID having `text === newText`, with all other task fields unchanged.

**Validates: Requirements 7.2**

---

### Property 15: URL normalization

*For any* URL string that does not start with `http://` or `https://`, `normalizeUrl(url)` should return a string that starts with `https://` and ends with the original URL. For URLs already starting with `http://` or `https://`, the function should return them unchanged.

**Validates: Requirements 8.2**

---

### Property 16: Quick link anchors have correct security attributes

*For any* rendered Quick_Link anchor element, it should have `target="_blank"` and `rel="noopener noreferrer"` attributes.

**Validates: Requirements 8.5**

---

### Property 17: Quick link delete removes exactly the target link

*For any* link list and any link ID present in that list, calling `deleteQuickLink(id)` should produce a list that does not contain a link with that ID, and all other links remain unchanged.

**Validates: Requirements 9.1**

---

### Property 18: Timer reset always returns to 1500 seconds

*For any* timer state (running, stopped, or mid-countdown), calling `resetTimer()` should set `timerSeconds` to 1500 and the display to `"25:00"`.

**Validates: Requirements 4.5**

---

### Property 19: Timer start is idempotent

*For any* running timer, calling `startTimer()` again should not create an additional interval — the `timerInterval` reference should remain the same single interval.

**Validates: Requirements 4.3**

---

## Error Handling

| Scenario | Behavior |
|---|---|
| `localStorage` unavailable (private browsing, quota exceeded) | Wrap all LS reads/writes in `try/catch`; fall back to in-memory state silently |
| Task add with empty/whitespace-only text | Ignore submission; optionally shake the input field |
| Quick link add with empty name or URL | Ignore submission |
| Task edit confirmed with empty text | Revert to original text; do not save |
| `JSON.parse` fails on corrupted LS value | Return the default value for that key (empty array / empty string / "light") |
| Timer reaches 0 | Fire `alert()`, clear interval, leave display at `00:00` |
| Duplicate task submission | Fire `alert()` informing user; do not add |

---

## Testing Strategy

### Dual Testing Approach

Both unit tests and property-based tests are required. They are complementary:

- **Unit tests** catch concrete bugs at specific inputs and verify integration points (DOM structure, event wiring, LS key names).
- **Property tests** verify universal correctness across the full input space, catching edge cases that hand-written examples miss.

### Property-Based Testing Library

Use **[fast-check](https://github.com/dubzzz/fast-check)** (JavaScript/TypeScript). It is the most mature PBT library for the JS ecosystem, supports arbitrary generators, and runs in Node.js without a browser.

Each property test must run a minimum of **100 iterations**.

Tag format for each test:
```
// Feature: todo-life-dashboard, Property N: <property text>
```

### Unit Tests (Jest or Vitest)

Focus on:
- DOM structure: input fields, buttons, and panels exist on load
- LS key names: verify `localStorage.setItem` is called with the exact keys `"tasks"`, `"quickLinks"`, `"userName"`, `"theme"`
- Timer alert: mock `window.alert`, tick to 0, verify it was called
- Theme application: verify `document.documentElement.dataset.theme` is set correctly
- Load from storage: seed LS, call init, verify DOM reflects seeded data

### Property Tests (fast-check)

One property-based test per correctness property listed above. Each test:
1. Uses `fc.assert(fc.property(...))` with at least 100 runs
2. Generates random inputs using fast-check arbitraries
3. Calls the pure function under test
4. Asserts the universal condition

Example structure:
```js
// Feature: todo-life-dashboard, Property 3: Greeting maps correctly to hour range
test('getGreeting returns correct salutation for any hour', () => {
  fc.assert(fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
    const result = getGreeting(hour)
    if (hour >= 5 && hour <= 11) return result === 'Good Morning'
    if (hour >= 12 && hour <= 17) return result === 'Good Afternoon'
    return result === 'Good Evening'
  }), { numRuns: 100 })
})
```

### Test File Layout

```
tests/
  unit/
    dom.test.js        — structural DOM checks
    storage.test.js    — LS key names and defaults
    timer.test.js      — alert, start/stop/reset examples
    theme.test.js      — applyTheme, load from storage
  property/
    formatTime.test.js   — Property 1
    dateDisplay.test.js  — Property 2
    greeting.test.js     — Properties 3, 4
    storage.test.js      — Properties 5–9
    tasks.test.js        — Properties 10–14
    quickLinks.test.js   — Properties 15–17
    timer.test.js        — Properties 18–19
```
