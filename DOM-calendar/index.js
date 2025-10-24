let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('events')) || {};
const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
];

const calendarDays = document.getElementById('calendarDays');
const currentMonthEl = document.getElementById('currentMonth');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const textDate = document.getElementById('selectedDate');
const eventList = document.getElementById('eventsList');
const eventForm = document.getElementById('eventForm');
const eventInput = document.getElementById('eventInput');


function selectDate(d, m, y, e) {
    if (e.target.classList.contains('day')) {
        document.querySelectorAll('.day').forEach(day => day.classList.remove('selected'));
        e.target.classList.add('selected');

        selectedDate = new Date(y, m, d).toLocaleDateString('uk-UA');

        textDate.textContent = `Події для: ${selectedDate}`
    }

    renderEvents(selectedDate);
}

function renderCalendar(month, year) {
    calendarDays.innerHTML = '';

    currentMonthEl.textContent = `${monthNames[month]} ${year}`;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1).getDay();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calendarDays.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = day;

        const dateStr = new Date(year, month, day).toLocaleDateString('uk-UA');
        if (events[dateStr] && events[dateStr].length > 0) {
            dayDiv.classList.add('has-events');
        }

        dayDiv.addEventListener('click', (e) => selectDate(day, month, year, e));

        calendarDays.appendChild(dayDiv);
    }
}

renderCalendar(currentMonth, currentYear);

function renderEvents(date) {
    eventList.innerHTML = '';

    if (!events[date] || events[date].length === 0) {
        eventList.innerHTML = '<li>Подій немає</li>';
        return;
    }

    events[date].forEach((ev, index) => {
        const li = document.createElement('li');
        li.textContent = ev.description;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('delete-btn');

        deleteBtn.addEventListener('click', () => {
            deleteEvent(date, index);
        });

        li.appendChild(deleteBtn);
        eventList.appendChild(li);
    });
}

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!selectedDate) {
        alert('Оберіть дату перед додаванням події!');
        return
    }

    const result = {
        id: Date.now(),
        description: eventInput.value,
    }

    if (!events[selectedDate]) events[selectedDate] = [];
    events[selectedDate].push(result);
    localStorage.setItem('events', JSON.stringify(events));

    renderEvents(selectedDate);
    eventInput.value = '';
})

function deleteEvent(date, index) {
    events[date].splice(index, 1);

    if (events[date].length === 0) {
        delete events[date];
    }

    localStorage.setItem('events', JSON.stringify(events));

    renderEvents(date);
}

prevBtn.addEventListener('click', () => {
    currentMonth -= 1;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear -= 1;
    }

    renderCalendar(currentMonth, currentYear)
});

nextBtn.addEventListener('click', () => {
    currentMonth += 1;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear += 1;
    }

    renderCalendar(currentMonth, currentYear)
});