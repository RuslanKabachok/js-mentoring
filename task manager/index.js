const taskList = document.getElementById('taskList');
const actionBtn = document.getElementById('actionBtn');
const form = document.querySelector('form');
const status = document.getElementById('status');
const priority = document.getElementById('priority');
const description = document.getElementById('description');


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const li = document.createElement('li');
    li.innerHTML = `
    <p>${description.value}</p>
    <span>Статус: ${status.value}</span>
    <span>Пріоритет: ${priority.value}</span>     
    <button class="delete-btn">Видалити</button>`;
    taskList.appendChild(li);

    description.value = '';
});

taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        e.target.parentElement.remove();
    }
});
