// API Base URL
const API_URL = 'http://localhost:3000/api/tasks';

// DOM Elements
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

// Add task button click
addTaskBtn.addEventListener('click', addTask);

// Add task on Enter key in title field
taskTitle.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Fetch all tasks from API
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        
        if (response.ok) {
            renderTasks(tasks);
            updateStats(tasks);
        } else {
            showError('Failed to load tasks');
        }
    } catch (error) {
        showError('Error connecting to server: ' + error.message);
    }
}

// Render tasks to the DOM
function renderTasks(tasks) {
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksList.appendChild(taskElement);
    });
}

// Create task HTML element
function createTaskElement(task) {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''}`;
    div.dataset.id = task.id;
    
    const date = new Date(task.created_at).toLocaleDateString();
    
    div.innerHTML = `
        <div class="task-header">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id}, ${!task.completed})"
            />
            <span class="task-title">${escapeHtml(task.title)}</span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">
            <span>Created: ${date}</span>
            <div class="task-actions">
                <button class="btn btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `;
    
    return div;
}

// Add new task
async function addTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    if (!title) {
        alert('Please enter a task title');
        return;
    }
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description }),
        });
        
        if (response.ok) {
            taskTitle.value = '';
            taskDescription.value = '';
            loadTasks();
        } else {
            showError('Failed to add task');
        }
    } catch (error) {
        showError('Error adding task: ' + error.message);
    }
}

// Toggle task completion
async function toggleTask(id, completed) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const task = await response.json();
        
        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                completed: completed,
            }),
        });
        
        if (updateResponse.ok) {
            loadTasks();
        } else {
            showError('Failed to update task');
        }
    } catch (error) {
        showError('Error updating task: ' + error.message);
    }
}

// Edit task
async function editTask(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const task = await response.json();
        
        const newTitle = prompt('Edit task title:', task.title);
        if (newTitle === null) return;
        
        const newDescription = prompt('Edit task description:', task.description || '');
        if (newDescription === null) return;
        
        const updateResponse = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newTitle.trim() || task.title,
                description: newDescription.trim(),
                completed: task.completed,
            }),
        });
        
        if (updateResponse.ok) {
            loadTasks();
        } else {
            showError('Failed to update task');
        }
    } catch (error) {
        showError('Error editing task: ' + error.message);
    }
}

// Delete task
async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            loadTasks();
        } else {
            showError('Failed to delete task');
        }
    } catch (error) {
        showError('Error deleting task: ' + error.message);
    }
}

// Update statistics
function updateStats(tasks) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    alert(message);
    console.error(message);
}