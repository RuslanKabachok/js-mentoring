let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('description');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();

    if (!text) return;

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = '';
});

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li>Немає завдань</li>';
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

function getFilteredTasks() {

    if (currentFilter === 'all') {
        return tasks;
    } else if (currentFilter === 'completed') {
        return tasks.filter(task => task.completed === true);
    } else {
        return tasks.filter(task => task.completed === false);
    }
};

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);

    task.completed = !task.completed;

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);

    saveTasks();
    renderTasks();
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));

        e.target.classList.add('active');

        currentFilter = e.target.dataset.filter;

        renderTasks()
    });
});