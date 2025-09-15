// TODO List Application Logic
// Array to store all todos
let todolist = [];

// DOM Elements
const nameInput = document.querySelector('.js-name-input');
const dateInput = document.querySelector('.js-date-input');
const timeInput = document.querySelector('.js-time-input');
const addButton = document.querySelector('.js-add-todo');
const deleteAllButton = document.querySelector('.js-delete-todo');
const todoListContainer = document.querySelector('.js-todo-list');

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadTodosFromStorage();
    renderTodoList();
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Add task button
    addButton.addEventListener('click', addTodo);
    
    // Delete all tasks button
    deleteAllButton.addEventListener('click', deleteAllTodos);
    
    // Allow Enter key to add task
    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    dateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    timeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
}

// Add a new todo item
function addTodo() {
    const name = nameInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;
    
    // Validate required fields
    if (name === '') {
        alert('Please enter a task name!');
        nameInput.focus();
        return;
    }
    
    if (date === '') {
        alert('Please select a date!');
        dateInput.focus();
        return;
    }
    
    // Create new todo object
    const newTodo = {
        id: generateId(),
        name: name,
        date: date,
        time: time || null,
        createdAt: new Date().toISOString()
    };
    
    // Add to todolist array
    todolist.push(newTodo);
    
    // Save to localStorage
    saveTodosToStorage();
    
    // Re-render the list
    renderTodoList();
    
    // Clear input fields
    clearInputs();
    
    // Focus back to name input for easy adding
    nameInput.focus();
}

// Delete a specific todo by ID
function deleteTodo(todoId) {
    todolist = todolist.filter(todo => todo.id !== todoId);
    saveTodosToStorage();
    renderTodoList();
}

// Delete all todos
function deleteAllTodos() {
    if (todolist.length === 0) {
        alert('No tasks to delete!');
        return;
    }
    
    if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
        todolist = [];
        saveTodosToStorage();
        renderTodoList();
    }
}

// Generate unique ID for todos
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Clear all input fields
function clearInputs() {
    nameInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
}

// Save todos to localStorage
function saveTodosToStorage() {
    try {
        localStorage.setItem('todolist', JSON.stringify(todolist));
    } catch (error) {
        console.error('Failed to save todos to localStorage:', error);
        alert('Failed to save tasks. Please check your browser storage settings.');
    }
}

// Load todos from localStorage
function loadTodosFromStorage() {
    try {
        const stored = localStorage.getItem('todolist');
        if (stored) {
            todolist = JSON.parse(stored);
            // Ensure todolist is always an array
            if (!Array.isArray(todolist)) {
                todolist = [];
            }
        }
    } catch (error) {
        console.error('Failed to load todos from localStorage:', error);
        todolist = [];
        alert('Failed to load saved tasks. Starting with an empty list.');
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${hour12}:${minutes} ${ampm}`;
}

// Render the complete todo list
function renderTodoList() {
    // Clear the container
    todoListContainer.innerHTML = '';
    
    // Check if list is empty
    if (todolist.length === 0) {
        todoListContainer.innerHTML = `
            <div class="empty-state">
                No tasks yet. Add one above!
            </div>
        `;
        return;
    }
    
    // Sort todos by date and time
    const sortedTodos = [...todolist].sort((a, b) => {
        const dateA = new Date(a.date + (a.time ? ` ${a.time}` : ' 00:00'));
        const dateB = new Date(b.date + (b.time ? ` ${b.time}` : ' 00:00'));
        return dateA - dateB;
    });
    
    // Generate HTML for each todo
    sortedTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoListContainer.appendChild(todoElement);
    });
}

// Create a single todo element
function createTodoElement(todo) {
    const todoDiv = document.createElement('div');
    todoDiv.className = 'todo-item';
    todoDiv.dataset.todoId = todo.id;
    
    const formattedDate = formatDate(todo.date);
    const formattedTime = formatTime(todo.time);
    const dateTimeDisplay = formattedTime 
        ? `${formattedDate} at ${formattedTime}` 
        : formattedDate;
    
    todoDiv.innerHTML = `
        <div class="todo-content">
            <div class="todo-text">
                <div class="todo-name">${escapeHtml(todo.name)}</div>
                <div class="todo-datetime">${dateTimeDisplay}</div>
            </div>
            <button class="todo-delete" onclick="deleteTodo('${todo.id}')">Delete</button>
        </div>
    `;
    
    return todoDiv;
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions for potential testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addTodo,
        deleteTodo,
        deleteAllTodos,
        saveTodosToStorage,
        loadTodosFromStorage,
        renderTodoList,
        todolist
    };
}