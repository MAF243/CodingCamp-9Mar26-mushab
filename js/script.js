/**
 * js/script.js — Todo Life Dashboard
 *
 * File structure (functions added in subsequent tasks):
 *   1. Module-level state and timer variables
 *   2. Storage module  (task 2)
 *   3. Clock / Greeting (task 3)
 *   4. Focus Timer      (task 4)
 *   5. Task Manager     (task 5)
 *   6. Quick Links      (task 6)
 *   7. Theme Manager    (task 7)
 *   8. Init + Event wiring (task 8)
 */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = {
    tasks: [],       // Task[]
    quickLinks: [],  // QuickLink[]
    userName: "",    // string
    theme: "light"   // "light" | "dark"
}

// ---------------------------------------------------------------------------
// Timer variables
// ---------------------------------------------------------------------------

let timerInterval = null
let timerSeconds = 25 * 60   // 1500

// ---------------------------------------------------------------------------
// Storage module
// ---------------------------------------------------------------------------

function getTasks() {
    try {
        const raw = localStorage.getItem("tasks")
        if (raw === null) return []
        return JSON.parse(raw)
    } catch (e) {
        return []
    }
}

function saveTasks(tasks) {
    try {
        localStorage.setItem("tasks", JSON.stringify(tasks))
    } catch (e) {
        // storage unavailable — silently ignore
    }
}

function getQuickLinks() {
    try {
        const raw = localStorage.getItem("quickLinks")
        if (raw === null) return []
        return JSON.parse(raw)
    } catch (e) {
        return []
    }
}

function saveQuickLinks(links) {
    try {
        localStorage.setItem("quickLinks", JSON.stringify(links))
    } catch (e) {
        // storage unavailable — silently ignore
    }
}

function getUserName() {
    try {
        const raw = localStorage.getItem("userName")
        return raw === null ? "" : raw
    } catch (e) {
        return ""
    }
}

function saveUserName(name) {
    try {
        localStorage.setItem("userName", name)
    } catch (e) {
        // storage unavailable — silently ignore
    }
}

function getTheme() {
    try {
        const raw = localStorage.getItem("theme")
        return raw === null ? "light" : raw
    } catch (e) {
        return "light"
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme)
    } catch (e) {
        // storage unavailable — silently ignore
    }
}

// ---------------------------------------------------------------------------
// Clock and Greeting
// ---------------------------------------------------------------------------

function formatTime(seconds) {
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
    const ss = String(seconds % 60).padStart(2, "0")
    return `${mm}:${ss}`
}

function updateClock() {
    const now = new Date()
    const clockEl = document.getElementById("clock")
    const dateEl = document.getElementById("date")
    if (clockEl) clockEl.textContent = now.toLocaleTimeString()
    if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

function startClock() {
    updateClock()
    updateGreeting()
    setInterval(() => {
        updateClock()
        updateGreeting()
    }, 1000)
}

function getGreeting(hour) {
    if (hour >= 5 && hour <= 11) return "Good Morning"
    if (hour >= 12 && hour <= 17) return "Good Afternoon"
    return "Good Evening"
}

function updateGreeting() {
    const hour = new Date().getHours()
    let greeting = getGreeting(hour)
    if (state.userName) greeting += ", " + state.userName
    const el = document.getElementById("greeting")
    if (el) el.textContent = greeting
}

// ---------------------------------------------------------------------------
// Focus Timer
// ---------------------------------------------------------------------------

function startTimer() {
    if (timerInterval !== null) return
    timerInterval = setInterval(tickTimer, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
    timerInterval = null
}

function resetTimer() {
    clearInterval(timerInterval)
    timerInterval = null
    timerSeconds = 1500
    const el = document.getElementById("timer")
    if (el) el.textContent = "25:00"
}

function tickTimer() {
    timerSeconds -= 1
    const el = document.getElementById("timer")
    if (el) el.textContent = formatTime(timerSeconds)
    if (timerSeconds <= 0) {
        clearInterval(timerInterval)
        timerInterval = null
        alert("Focus session complete! Time for a break.")
    }
}

// ---------------------------------------------------------------------------
// Task Manager
// ---------------------------------------------------------------------------

function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()
    const duplicate = state.tasks.some(t => t.text.toLowerCase() === lower)
    if (duplicate) {
        alert("Task already exists.")
        return
    }
    state.tasks.push({ id: Date.now(), text: trimmed, completed: false })
    saveTasks(state.tasks)
    renderTasks()
}

function toggleTask(id) {
    const task = state.tasks.find(t => t.id === id)
    if (!task) return
    task.completed = !task.completed
    saveTasks(state.tasks)
    renderTasks()
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id)
    saveTasks(state.tasks)
    renderTasks()
}

function startEditTask(id) {
    const li = document.querySelector(`#task-list [data-id="${id}"]`)
    if (!li) return
    const span = li.querySelector("span.task-text")
    if (!span) return
    const task = state.tasks.find(t => t.id === id)
    if (!task) return
    const input = document.createElement("input")
    input.type = "text"
    input.value = task.text
    input.dataset.id = id
    input.className = "task-edit-input"
    li.replaceChild(input, span)
    input.focus()
}

function confirmEditTask(id, newText) {
    const trimmed = newText.trim()
    if (!trimmed) {
        renderTasks()
        return
    }
    const task = state.tasks.find(t => t.id === id)
    if (task) {
        task.text = trimmed
        saveTasks(state.tasks)
    }
    renderTasks()
}

function renderTasks() {
    const list = document.getElementById("task-list")
    if (!list) return
    list.innerHTML = ""
    state.tasks.forEach(task => {
        const li = document.createElement("li")
        li.className = "task-item" + (task.completed ? " completed" : "")
        li.dataset.id = task.id

        const span = document.createElement("span")
        span.className = "task-text"
        span.textContent = task.text

        const btnComplete = document.createElement("button")
        btnComplete.className = "btn-complete"
        btnComplete.textContent = "✓"
        btnComplete.dataset.action = "complete"
        btnComplete.dataset.id = task.id

        const btnEdit = document.createElement("button")
        btnEdit.className = "btn-edit"
        btnEdit.textContent = "✏"
        btnEdit.dataset.action = "edit"
        btnEdit.dataset.id = task.id

        const btnDelete = document.createElement("button")
        btnDelete.className = "btn-delete"
        btnDelete.textContent = "✕"
        btnDelete.dataset.action = "delete"
        btnDelete.dataset.id = task.id

        li.appendChild(span)
        li.appendChild(btnComplete)
        li.appendChild(btnEdit)
        li.appendChild(btnDelete)
        list.appendChild(li)
    })
}

// ---------------------------------------------------------------------------
// Quick Links Manager
// ---------------------------------------------------------------------------

function normalizeUrl(url) {
    if (url.startsWith("http://") || url.startsWith("https://")) return url
    return "https://" + url
}

function addQuickLink(name, url) {
    if (!name.trim() || !url.trim()) return
    const normalized = normalizeUrl(url.trim())
    state.quickLinks.push({ id: Date.now(), name: name.trim(), url: normalized })
    saveQuickLinks(state.quickLinks)
    renderQuickLinks()
}

function deleteQuickLink(id) {
    state.quickLinks = state.quickLinks.filter(link => link.id !== id)
    saveQuickLinks(state.quickLinks)
    renderQuickLinks()
}

function renderQuickLinks() {
    const panel = document.getElementById("link-panel")
    if (!panel) return
    panel.innerHTML = ""
    state.quickLinks.forEach(link => {
        const div = document.createElement("div")
        div.className = "link-tile"

        const a = document.createElement("a")
        a.href = link.url
        a.textContent = link.name
        a.target = "_blank"
        a.rel = "noopener noreferrer"

        const btnDelete = document.createElement("button")
        btnDelete.className = "btn-delete-link"
        btnDelete.textContent = "✕"
        btnDelete.dataset.action = "delete-link"
        btnDelete.dataset.id = link.id

        div.appendChild(a)
        div.appendChild(btnDelete)
        panel.appendChild(div)
    })
}

// ---------------------------------------------------------------------------
// Theme Manager
// ---------------------------------------------------------------------------

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme
    state.theme = theme
}

function toggleTheme() {
    state.theme = state.theme === "light" ? "dark" : "light"
    saveTheme(state.theme)
    applyTheme(state.theme)
    const btn = document.getElementById("theme-toggle")
    if (btn) btn.textContent = state.theme === "dark" ? "☀" : "🌙"
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    // --- 8.1: Load state from localStorage ---
    state.tasks = getTasks()
    state.quickLinks = getQuickLinks()
    state.userName = getUserName()
    state.theme = getTheme()

    // Apply theme before render to avoid flash
    applyTheme(state.theme)
    const themeToggleBtn = document.getElementById("theme-toggle")
    if (themeToggleBtn) themeToggleBtn.textContent = state.theme === "dark" ? "☀" : "🌙"

    renderTasks()
    renderQuickLinks()

    const userNameInput = document.getElementById("user-name")
    if (userNameInput) userNameInput.value = state.userName

    startClock()

    // --- 8.2: Event listeners ---

    // User name input
    if (userNameInput) {
        userNameInput.addEventListener("input", e => {
            state.userName = e.target.value.trim()
            saveUserName(state.userName)
            updateGreeting()
        })
    }

    // Timer controls
    const timerStart = document.getElementById("timer-start")
    const timerStop = document.getElementById("timer-stop")
    const timerReset = document.getElementById("timer-reset")
    if (timerStart) timerStart.addEventListener("click", startTimer)
    if (timerStop) timerStop.addEventListener("click", stopTimer)
    if (timerReset) timerReset.addEventListener("click", resetTimer)

    // Task add form
    const taskForm = document.getElementById("task-form")
    if (taskForm) {
        taskForm.addEventListener("submit", e => {
            e.preventDefault()
            const taskInput = document.getElementById("task-input")
            addTask(taskInput.value)
            taskInput.value = ""
        })
    }

    // Task list delegation (click: complete / delete / edit)
    const taskList = document.getElementById("task-list")
    if (taskList) {
        taskList.addEventListener("click", e => {
            const action = e.target.dataset.action
            const id = Number(e.target.dataset.id)
            if (action === "complete") toggleTask(id)
            else if (action === "delete") deleteTask(id)
            else if (action === "edit") startEditTask(id)
        })

        // Task list delegation (keydown: confirm edit on Enter)
        taskList.addEventListener("keydown", e => {
            if (e.key === "Enter" && e.target.classList.contains("task-edit-input")) {
                confirmEditTask(Number(e.target.dataset.id), e.target.value)
            }
        })
    }

    // Quick link add form
    const linkForm = document.getElementById("link-form")
    if (linkForm) {
        linkForm.addEventListener("submit", e => {
            e.preventDefault()
            const linkName = document.getElementById("link-name")
            const linkUrl = document.getElementById("link-url")
            addQuickLink(linkName.value, linkUrl.value)
            linkName.value = ""
            linkUrl.value = ""
        })
    }

    // Quick link panel delegation (delete)
    const linkPanel = document.getElementById("link-panel")
    if (linkPanel) {
        linkPanel.addEventListener("click", e => {
            if (e.target.dataset.action === "delete-link") {
                deleteQuickLink(Number(e.target.dataset.id))
            }
        })
    }

    // Theme toggle
    if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme)
})
