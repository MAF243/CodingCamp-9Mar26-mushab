# Requirements Document

## Introduction

A single-page productivity dashboard built with plain HTML, CSS, and Vanilla JavaScript. The dashboard runs entirely in the browser with no backend, persisting all user data via the Local Storage API. It provides a greeting section with a live clock, a focus (Pomodoro-style) timer, a to-do list, and a quick-links panel — all in a minimal, responsive layout with optional light/dark theming.

## Glossary

- **Dashboard**: The single HTML page (`index.html`) that hosts all features.
- **Clock**: The live time display that updates every second.
- **Greeting**: The time-sensitive salutation shown in the header.
- **Timer**: The countdown focus timer defaulting to 25 minutes.
- **Task**: A single to-do item with a unique ID, text, and completion state.
- **Task_List**: The collection of Tasks rendered from Local Storage.
- **Quick_Link**: A user-defined shortcut containing a display name and a URL.
- **Link_Panel**: The rendered collection of Quick_Links.
- **Storage**: The browser's Local Storage API used for all persistence.
- **Theme**: The active color scheme — either `light` or `dark`.
- **User_Name**: The custom name entered by the user for the greeting.

---

## Requirements

### Requirement 1: Live Clock and Date Display

**User Story:** As a user, I want to see the current time and date at all times, so that I can stay oriented throughout my day without switching apps.

#### Acceptance Criteria

1. THE Clock SHALL display the current time in HH:MM:SS format.
2. WHEN the Dashboard loads, THE Clock SHALL begin updating the displayed time once per second.
3. THE Dashboard SHALL display the current date in a human-readable format (e.g., "Monday, July 14, 2025").

---

### Requirement 2: Time-Based Greeting

**User Story:** As a user, I want a greeting that reflects the time of day, so that the dashboard feels personal and contextually aware.

#### Acceptance Criteria

1. WHEN the local hour is between 05:00 and 11:59, THE Greeting SHALL display "Good Morning".
2. WHEN the local hour is between 12:00 and 17:59, THE Greeting SHALL display "Good Afternoon".
3. WHEN the local hour is between 18:00 and 04:59, THE Greeting SHALL display "Good Evening".
4. WHERE a User_Name has been saved, THE Greeting SHALL append the User_Name to the salutation (e.g., "Good Morning, Alex").

---

### Requirement 3: Custom User Name

**User Story:** As a user, I want to set my name on the dashboard, so that the greeting feels personal.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field for the user to enter a User_Name.
2. WHEN the user submits a User_Name, THE Storage SHALL persist the User_Name under the key `userName`.
3. WHEN the Dashboard loads, THE Dashboard SHALL read the `userName` key from Storage and pre-populate the input field with the stored value.
4. WHEN the stored `userName` value is an empty string, THE Greeting SHALL display the salutation without a name suffix.

---

### Requirement 4: Focus Timer

**User Story:** As a user, I want a countdown timer defaulting to 25 minutes, so that I can time focused work sessions.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Timer SHALL display `25:00` in MM:SS format.
2. WHEN the user activates the Start control, THE Timer SHALL begin counting down one second per second.
3. WHILE the Timer is running, THE Timer SHALL prevent starting a second concurrent countdown interval when the Start control is activated again.
4. WHEN the user activates the Stop control, THE Timer SHALL pause the countdown at the current value.
5. WHEN the user activates the Reset control, THE Timer SHALL stop any active countdown and return the display to `25:00`.
6. WHEN the Timer countdown reaches `00:00`, THE Dashboard SHALL display a browser alert notifying the user that the session is complete.

---

### Requirement 5: To-Do List — Add and Display Tasks

**User Story:** As a user, I want to add tasks to a list, so that I can track what I need to accomplish.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an input field and a submit control for adding a new Task.
2. WHEN the user submits a new Task, THE Task_List SHALL assign the Task a unique ID (e.g., `Date.now()` timestamp).
3. WHEN the user submits a new Task, THE Storage SHALL persist the updated Task_List under the key `tasks`.
4. WHEN the Dashboard loads, THE Task_List SHALL render all Tasks retrieved from the `tasks` key in Storage.
5. IF the user submits a Task whose text matches an existing Task text (case-insensitive), THEN THE Dashboard SHALL display an alert informing the user that the task already exists and SHALL NOT add the duplicate.

---

### Requirement 6: To-Do List — Complete and Delete Tasks

**User Story:** As a user, I want to mark tasks as done and remove them, so that I can manage my list as I work through it.

#### Acceptance Criteria

1. WHEN the user activates the complete control on a Task, THE Task_List SHALL toggle the Task's completion state and update the visual style to indicate completion.
2. WHEN a Task's completion state changes, THE Storage SHALL persist the updated Task_List under the key `tasks`.
3. WHEN the user activates the delete control on a Task, THE Task_List SHALL remove the Task from the list.
4. WHEN a Task is deleted, THE Storage SHALL persist the updated Task_List under the key `tasks`.

---

### Requirement 7: To-Do List — Edit Tasks

**User Story:** As a user, I want to edit an existing task's text, so that I can correct or update it without deleting and re-adding it.

#### Acceptance Criteria

1. WHEN the user activates the edit control on a Task, THE Dashboard SHALL replace the Task's text display with an editable input pre-filled with the current Task text.
2. WHEN the user confirms the edit, THE Task_List SHALL update the Task's text to the new value.
3. WHEN the Task text is updated, THE Storage SHALL persist the updated Task_List under the key `tasks`.

---

### Requirement 8: Quick Links — Add and Display

**User Story:** As a user, I want to save links to my favorite websites, so that I can open them quickly from the dashboard.

#### Acceptance Criteria

1. THE Dashboard SHALL provide input fields for a display name and a URL, and a submit control for adding a new Quick_Link.
2. WHEN the user submits a Quick_Link whose URL does not begin with `http://` or `https://`, THE Dashboard SHALL prepend `https://` to the URL before saving.
3. WHEN the user submits a Quick_Link, THE Storage SHALL persist the updated Link_Panel under the key `quickLinks`.
4. WHEN the Dashboard loads, THE Link_Panel SHALL render all Quick_Links retrieved from the `quickLinks` key in Storage.
5. WHEN the user activates a Quick_Link, THE Dashboard SHALL open the URL in a new browser tab with `target="_blank"` and `rel="noopener noreferrer"`.

---

### Requirement 9: Quick Links — Delete

**User Story:** As a user, I want to remove quick links I no longer need, so that the panel stays relevant.

#### Acceptance Criteria

1. WHEN the user activates the delete control on a Quick_Link, THE Link_Panel SHALL remove the Quick_Link from the panel.
2. WHEN a Quick_Link is deleted, THE Storage SHALL persist the updated Link_Panel under the key `quickLinks`.

---

### Requirement 10: Light/Dark Theme Toggle

**User Story:** As a user, I want to switch between light and dark modes, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle control to switch between `light` and `dark` themes.
2. WHEN the user activates the theme toggle, THE Dashboard SHALL apply the selected theme to the entire page immediately.
3. WHEN the theme changes, THE Storage SHALL persist the active theme under the key `theme`.
4. WHEN the Dashboard loads, THE Dashboard SHALL read the `theme` key from Storage and apply the stored theme before rendering content.
5. IF no theme value exists in Storage, THEN THE Dashboard SHALL default to the `light` theme.

---

### Requirement 11: Responsive Layout

**User Story:** As a user, I want the dashboard to be usable on different screen sizes, so that I can access it on any device.

#### Acceptance Criteria

1. THE Dashboard SHALL use a desktop-first layout with a multi-column card grid for viewports wider than 768px.
2. WHEN the viewport width is 768px or narrower, THE Dashboard SHALL reflow the card grid into a single-column layout.

---

### Requirement 12: Local Storage Persistence Contract

**User Story:** As a user, I want my data to survive page refreshes, so that I don't lose my tasks, links, or settings.

#### Acceptance Criteria

1. THE Storage SHALL use the key `tasks` to persist the Task_List as a JSON-serialized array.
2. THE Storage SHALL use the key `quickLinks` to persist the Link_Panel as a JSON-serialized array.
3. THE Storage SHALL use the key `userName` to persist the User_Name as a plain string.
4. THE Storage SHALL use the key `theme` to persist the active Theme as a plain string (`"light"` or `"dark"`).
5. IF a Storage read returns `null`, THEN THE Dashboard SHALL use the appropriate default value (empty array for lists, empty string for User_Name, `"light"` for Theme).
