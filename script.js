function updateClock() {
    const time_element = document.getElementById('time');
    const date_element = document.getElementById('date');
    const now = new Date();

    time_element.textContent = now.toLocaleTimeString();

    const options = {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'};
    date_element.textContent = now.toLocaleDateString(undefined, options);
}

updateClock();
setInterval(updateClock, 1000);

async function fetchContests() {
    const list_element = document.getElementById('contest-list');
    try {
        const response = await fetch('https://codeforces.com/api/contest.list');
        const data = await response.json();

        if (data.status === 'OK') {
            const upcoming = data.result.filter(contest => contest.phase === 'BEFORE').sort((a, b) => a.startTimeSeconds - b.startTimeSeconds).slice(0, 5);

            list_element.innerHTML = '';

            if (upcoming.length === 0) {
                list_element.innerHTML = '<li>No upcoming contests found :( </li>';
                return;
            }

            upcoming.forEach(contest => {
                const start_time = new Date(contest.startTimeSeconds * 1000);
                const li = document.createElement('li');

                const contest_date = startTime.toISOString().split('T')[0];
                li.setAttribute('data-contest-date', contest_date);

                li.innerHTML = `
                    <span class="contest-name">${contest.name}</span>
                    <span class="contest-time">${start_time.toLocaleDateString()} at ${start_time.toLocaleDateString([], {hour: '2-digit', minute: '2-digit'})}</span>
                `;

                li.addEventListener('mouseenter', () => {
                    const match_cell = document.querySelector(`.cal-day[data-date="${contest_date}"]`);
                    if (match_cell) {
                        match_cell.classList.add('contest-highlight');
                    }
                });

                li.addEventListener('mouseleave', () => {
                    const match_cell = document.querySelector(`.cal-day[data-date="${contest_date}"]`);
                    if (match_cell) {
                        match_cell.classList.remove('contest-highlight');
                    }
                });

                list_element.appendChild(li);
            });
        }
    } catch (err) {
        list_element.innerHTML = '<li>unable to load contests :(</li>';
    }
}

fetchContests();

let current_cal_date = new Date();

function renderCalendar() {
    const month_year_text = document.getElementById('calendar-month-year');
    const grid = document.getElementById('calendar-grid');
    grid.innerHtml = '';

    const year = current_cal_date.getFullYear();
    const month = current_cal_date.getMonth();

    const month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    month_year_text.textContent = `${month_names[month]} ${year}`;

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    days.forEach(d => {
        const head = document.createElement('div');
        head.className = 'cal-day-head';
        head.textContent = d;
        grid.appendChild(head);
    });

    const first_day = new Date(year, month, 1).getDay();
    const total_days = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < first_day; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        grid.appendChild(empty);
    }

    for (let day = 1; day <= total_days; day++) {
        const day_cell = document.createElement('div');
        day_cell.className = 'cal-day';
        day_cell.textContent = day;

        const month_formatted = String(month + 1).padStart(2, '0');
        const day_formatted = String(day).padStart(2, '0');
        const cell_date_string = `${year}-${month_formatted}-${day_formatted}`;

        day_cell.setAttribute('data-date', cell_date_string);

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day_cell.classList.add('today');
        }

        grid.appendChild(day_cell);
    }
}

document.getElementById('prev-month').addEventListener('click', () => {
    current_cal_date.setMonth(current_cal_date.getMonth() - 1);
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    current_cal_date.setMonth(current_cal_date.getMonth() + 1);
    renderCalendar();
});

renderCalendar();

const todo_form = document.getElementById('todo-form');
const todo_input = document.getElementById('todo-input');
const todo_list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('tab_todos')) || [];

function saveAndRenderTodo() {
    localStorage.setItem('tab_todos', JSON.stringify(todos));
    todo_list.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        if (todo.completed) li.classList.add('completed');

        li.innerHTML = `
            <span onclick="toggleTodo(${index})" style="cursor: pointer;">
                ${todo.completed ? '✓ ' : '○ '} ${todo.text}
            </span>
            <button class="delete-btn" onclick="deleteTodo(${index})">x</button>
        `;
        todo_list.appendChild(li);
    });
}

todo_form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todo_input.ariaValueMax.trim();
    if (text) {
        todos.push({text, completed: false});
        todo_input.value = '';
        saveAndRenderTodo();
    }
});

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveAndRenderTodo();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveAndRenderTodo();
}

saveAndRenderTodo();