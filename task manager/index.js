const taskList = document.getElementById('taskList');
const actionBtn = document.getElementById('actionBtn');
const form = document.querySelector('form');
const status = document.getElementById('status');
const priority = document.getElementById('priority');
const description = document.getElementById('description');
const sortSelect = document.getElementById('sort');
const sortContainer = document.querySelector('.sorting-btn-container')
const noTasksMsg = document.getElementById('noTasksMsg');
const listHeading = document.querySelector('h3');
let tasks = loadTasks();
const priorityOrder = {
    "високий": 1,
    "середній": 2,
    "низький": 3
};
let sortAsc = true;


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

    description.value = '';
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.parentElement.dataset.id;
        tasks = tasks.filter(task => task.id != id);
        saveTasks();
        renderTasks(tasks);
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
            <select class="priority-select" value="${task.priority}">
            <option value="високий" ${task.priority === 'високий' ? 'selected' : ''}>Високий</option>
            <option value="середній" ${task.priority === 'середній' ? 'selected' : ''}>Середній</option>
            <option value="низький" ${task.priority === 'низький' ? 'selected' : ''}>Низький</option>
            </select>     
            <button class="delete-btn">Видалити</button>`;
        taskList.appendChild(li);
    });

    if (taskList.children.length === 0) {
        sortContainer.classList.add('hide');
        noTasksMsg.classList.remove('hide');
        listHeading.classList.add('hide');
    } else {
        sortContainer.classList.remove('hide');
        noTasksMsg.classList.add('hide');
        listHeading.classList.remove('hide');
    }
}

taskList.addEventListener('change', (e) => {
    const id = e.target.closest('li').dataset.id;
    const task = tasks.find(task => task.id == id);

    if (!task) return;

    if (e.target.classList.contains('status-select')) {
        task.status = e.target.value;
    }

    if (e.target.classList.contains('priority-select')) {
        task.priority = e.target.value;
    }

    saveTasks();
});

sortSelect.addEventListener('change', () => {
    const order = sortAsc ? 1 : -1;

    tasks.sort((a, b) =>
        (priorityOrder[b.priority] - priorityOrder[a.priority]) * order
    );

    renderTasks(tasks);
    sortAsc = !sortAsc;
});