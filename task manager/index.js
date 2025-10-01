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
        li.dataset.id = String(task.id);

        const p = document.createElement('p');
        p.textContent = task.description;

        const select = document.createElement('select');
        select.className = 'status-select';

        const statuses = ['нове', 'в процесі', 'виконано'];
        statuses.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s === 'нове' ? 'Нове' : (s === 'в процесі' ? 'В процесі' : 'Виконано');
            if (task.status === s) opt.selected = true;
            select.appendChild(opt);
        });

        const priority = document.createElement('select');
        priority.className = 'status-select';

        const priorityStatuses = ['високий', 'середній', 'низький'];
        priorityStatuses.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s === 'високий' ? 'Високий' : s === 'середній' ? 'Середній' : 'Низький';
            if (task.priority === s) opt.selected = true;
            priority.appendChild(opt);
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.type = 'button';
        delBtn.textContent = 'Видалити';

        li.appendChild(p);
        li.appendChild(select);
        li.appendChild(priority);
        li.appendChild(delBtn);

        taskList.appendChild(li);
    });

    if (tasks.length === 0) {
        sortSelect.classList.add('hide');
        noTasksMsg.classList.remove('hide');
    } else {
        sortSelect.classList.remove('hide');
        noTasksMsg.classList.add('hide');
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