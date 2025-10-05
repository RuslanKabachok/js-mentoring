const form = document.getElementById('form');
const sum = document.getElementById('sum');
const type = document.getElementById('transactionType');
const category = document.getElementById('category');
const date = document.getElementById('date');
const balance = document.getElementById('balance');
const expenses = document.getElementById('expenses');
const income = document.getElementById('income');
const totalExpensesEl = document.getElementById('totalExpenses');
const totalIncomeEl = document.getElementById('totalIncome');
const transactionBlock = document.querySelector('.lists');
let lastId = 0;
let entries = loadTransactions();
const reportType = document.getElementById('reportType');
const reportValue = document.getElementById('reportValue');
const reportList = document.getElementById('reportList');
const reportBtn = document.getElementById('generateReport');

renderEntries(entries);
calculateTotals(entries);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const result = createEntry(
        sum.value,
        type.value,
        category.value,
        date.value
    );

    entries.push(result);
    renderEntries(entries);
    calculateTotals(entries);
    saveTransactions();
    form.reset();
})

function renderEntries(entries) {
    expenses.innerHTML = '';
    income.innerHTML = '';

    entries.forEach(element => {
        const li = document.createElement('li');
        li.dataset.id = String(element.id);

        const span = document.createElement('span');
        span.textContent = `${element.amount} грн | ${element.category} | ${element.date}`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Редагувати';
        editBtn.className = 'edit-btn';

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Видалити';
        deleteBtn.className = 'delete-btn';

        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        if (element.type === 'витрати') {
            expenses.appendChild(li);
        } else {
            income.appendChild(li)
        }
    });
};

function calculateTotals(entries) {
    let totalIncome = 0;
    let totalExpenses = 0;

    entries.forEach(element => {

        if (element.type === 'дохід') {
            totalIncome += Number(element.amount);
        } else {
            totalExpenses += Number(element.amount);
        }
    });

    balance.textContent = `${totalIncome - totalExpenses} грн`;
    totalExpensesEl.textContent = `${totalExpenses} грн`;
    totalIncomeEl.textContent = `${totalIncome} грн`;
}

function saveTransactions() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem('entries');

    if (!savedTransactions) return [];
    try {
        const parsed = JSON.parse(savedTransactions);
        return parsed.map(obj => createEntry(obj.amount, obj.type, obj.category, obj.date, obj.id));
    } catch (err) {
        console.warn('Could not parse saved entries:', err);
        return [];
    }
}

function createEntry(amount, type, category, date, id = null) {

    if (id === null) {
        lastId++;
        id = lastId.toString();
    } else {
        const numId = parseInt(id);
        if (!isNaN(numId) && numId > lastId) {
            lastId = numId;
        }
    }

    return {
        id: id,
        amount: Number(amount) || 0,
        type: type,
        category: category,
        date: date,

        updateAmount(newAmount) {
            this.amount = Number(newAmount) || 0;
        },

        updateCategory(newCategory) {
            this.category = newCategory;
        }
    };
}

transactionBlock.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const id = e.target.closest('li').dataset.id;
        const entry = entries.find(el => el.id === id);
        if (!entry) {
            console.warn('Entry not found for id', id);
            return;
        }

        const newAmount = prompt("Введіть нову суму:", entry.amount);
        const newCategory = prompt("Введіть нову категорію:", entry.category);

        if (newAmount !== null) {
            const num = Number(newAmount);
            if (!isNaN(num) && num > 0) {
                entry.updateAmount(num);
            } else {
                alert("Сума має бути додатнім числом!");
            }
        }

        const allowedCategories = ["продукти", "квартплата", "комуналка", "підписки", "спортзал"];

        if (newCategory !== null) {
            if (allowedCategories.includes(newCategory)) {
                entry.updateCategory(newCategory);
            } else {
                alert("Категорія має бути з дозволеного списку: " + allowedCategories.join(", "));
            }
        }

        saveTransactions();
        renderEntries(entries);
        calculateTotals(entries);
    }

    if (e.target.classList.contains('delete-btn')) {
        const id = e.target.closest('li').dataset.id;
        const ok = confirm('Ви впевнені, що хочете видалити цей запис?');
        if (!ok) return;

        entries = entries.filter(el => el.id != id);
        saveTransactions();
        renderEntries(entries);
        calculateTotals(entries);
        return;
    }
});

reportBtn.addEventListener('click', (e) => {
    reportList.innerHTML = '';
    let filtered = []

    if (reportType.value === "category") {
        filtered = entries.filter(enrty => enrty.category.toLowerCase().trim() === reportValue.value.toLowerCase().trim());
    } else if (reportType.value === "month") {
        filtered = entries.filter(entry => entry.date.startsWith(reportValue.value));
    }

    if (filtered.length === 0) {
        reportList.innerHTML = '<li>Нічого не знайдено 😕</li>';
        return;
    }

    filtered.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.amount} грн | ${item.category} | ${item.date}`;
        reportList.appendChild(li);
    });


    const total = filtered.reduce((acc, item) => acc + Number(item.amount), 0);
    document.getElementById('reportTotal').textContent = `Загальна сума: ${total} грн`;

})