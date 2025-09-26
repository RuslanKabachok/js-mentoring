const taskList = document.getElementById('taskList');
const actionBtn = document.getElementById('actionBtn');
const form = document.querySelector('form');
const status = document.getElementById('status');
const priority = document.getElementById('priority');
const description = document.getElementById('description');
let tasks = loadTasks();

renderTasks(tasks);


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newTask = {
        id: Date.now(),
        description: description.value,
        status: status.value,
        priority: priority.value
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks(tasks);
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
    }
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
};

function renderTasks(tasks) {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `
            <p>${task.description}</p>
            <select class="status-select" value="${task.value}">
            <option value="нове" ${task.status === 'нове' ? 'selected' : ''}>Нове</option>
            <option value="в процесі" ${task.status === 'в процесі' ? 'selected' : ''}>В процесі</option>
            <option value="виконано" ${task.status === 'виконано' ? 'selected' : ''}>Виконано</option>
            </select>
            <span>Пріоритет: ${task.priority}</span>     
            <button class="delete-btn">Видалити</button>`;
        taskList.appendChild(li);
    });
}