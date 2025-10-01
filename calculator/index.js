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

let entries = loadTransactions();

renderEntries(entries);
calculateTotals(entries);

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const result = {
        amount: sum.value,
        type: type.value,
        category: category.value,
        date: date.value
    }

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
        li.textContent = `${element.amount} грн | ${element.category} | ${element.date}`;

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
    return savedTransactions ? JSON.parse(savedTransactions) : [];
}