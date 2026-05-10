// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active-tab'));
        btn.classList.add('active');
        document.getElementById(btn.getAttribute('data-target')).classList.add('active-tab');
    });
});


// ПОГОДА (API Open-Meteo)
const btnWeather = document.getElementById('btn-weather');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

btnWeather.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) return alert('Введите город!');

    weatherResult.innerHTML = '<div class="spinner-border text-primary"></div><p>Поиск...</p>';

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
        const geoData = await geoRes.json();
        
        if (!geoData.results) {
            weatherResult.innerHTML = '<p class="text-danger">Город не найден.</p>';
            return;
        }
        
        const { latitude, longitude, name } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        const temp = weatherData.current_weather.temperature;

        weatherResult.innerHTML = `
            <h3>${name}</h3>
            <div style="font-size: 3rem; font-weight: bold; color: #0d6efd;">${temp}°C</div>
            <p class="text-muted">Ветер: ${weatherData.current_weather.windspeed} км/ч</p>
        `;
    } catch (error) {
        weatherResult.innerHTML = '<p class="text-danger">Ошибка сети.</p>';
    }
});


// РЫНОК (API Binance)
const btnMarket = document.getElementById('btn-market');
const marketResult = document.getElementById('market-result');

btnMarket.addEventListener('click', async () => {
    marketResult.innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-success"></div></div>';

    try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22%5D');
        const data = await res.json();

        const btc = parseFloat(data.find(c => c.symbol === 'BTCUSDT').price).toFixed(2);
        const eth = parseFloat(data.find(c => c.symbol === 'ETHUSDT').price).toFixed(2);
        const sol = parseFloat(data.find(c => c.symbol === 'SOLUSDT').price).toFixed(2);

        marketResult.innerHTML = `
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm border-warning">
                    <div class="card-body text-center">
                        <h5 class="card-title">Bitcoin (BTC)</h5>
                        <p class="fs-3 fw-bold text-warning">$${btc}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm border-primary">
                    <div class="card-body text-center">
                        <h5 class="card-title">Ethereum (ETH)</h5>
                        <p class="fs-3 fw-bold text-primary">$${eth}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm border-info">
                    <div class="card-body text-center">
                        <h5 class="card-title">Solana (SOL)</h5>
                        <p class="fs-3 fw-bold text-info">$${sol}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        marketResult.innerHTML = '<p class="text-danger ms-2">Не удалось загрузить курсы валют.</p>';
    }
});


// 4. ЗАМЕТКИ (CRUD)
const notesList = document.getElementById('notes-list');
const btnAddNote = document.getElementById('btn-add-note');
const noteTitleInput = document.getElementById('note-title');
const noteBodyInput = document.getElementById('note-body');
const notesLoading = document.getElementById('notes-loading');

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Загрузка заметок
async function fetchNotes() {
    notesLoading.style.display = 'block';
    notesList.innerHTML = '';
    try {
        const res = await fetch(`${API_URL}?_limit=2`); // берем только 2 штуки
        const notes = await res.json();
        
        // Меняем дурацкий латинский текст из API на наш нормальный
        if(notes[0]) {
            notes[0].title = 'Вторая заметка';
            notes[0].body = 'Вторая заметка';
        }
        if(notes[1]) {
            notes[1].title = 'Первая заметка';
            notes[1].body = 'Первая заметка';
        }

        notes.forEach(note => renderNote(note));
    } catch (error) {
        notesList.innerHTML = '<li class="list-group-item text-danger">Ошибка загрузки</li>';
    } finally {
        notesLoading.style.display = 'none';
    }
}

// Добавление
btnAddNote.addEventListener('click', async () => {
    const title = noteTitleInput.value.trim();
    const body = noteBodyInput.value.trim();
    if (!title || !body) return alert('Заполните название и текст!');

    btnAddNote.disabled = true;
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, body, userId: 1 })
        });
        const newNote = await res.json();
        newNote.id = Date.now(); // фейковый ID для фронта
        
        renderNote(newNote); 
        noteTitleInput.value = ''; 
        noteBodyInput.value = '';
    } catch (error) {
        alert('Ошибка добавления');
    } finally {
        btnAddNote.disabled = false;
    }
});

// Редактирование названия
async function editNote(note, liElement) {
    const newTitle = prompt('Введите новое название заметки:', note.title);
    if (!newTitle || newTitle === note.title) return;

    try {
        const res = await fetch(`${API_URL}/${note.id > 100 ? 1 : note.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...note, title: newTitle })
        });
        if (res.ok) {
            note.title = newTitle;
            liElement.querySelector('.note-title-text').textContent = newTitle;
            alert('Обновлено успешно (PUT)!');
        }
    } catch (error) {
        alert('Ошибка редактирования');
    }
}

// Удаление
async function deleteNote(id, liElement) {
    if (!confirm('Точно удалить эту заметку?')) return;
    try {
        const res = await fetch(`${API_URL}/${id > 100 ? 1 : id}`, { method: 'DELETE' });
        if (res.ok) liElement.remove();
    } catch (error) {
        alert('Ошибка удаления');
    }
}

// Отрисовка одной заметки в список
function renderNote(note) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    
    // Структура: видимая шапка + скрытый текст
    li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <strong class="note-title-text text-primary" style="cursor: pointer; flex-grow: 1;">
                ${note.title}
            </strong>
            <div class="text-nowrap ms-3">
                <button class="btn btn-sm btn-outline-secondary btn-edit">✎</button>
                <button class="btn btn-sm btn-outline-danger btn-delete">✕</button>
            </div>
        </div>
        <div class="note-body-text mt-2 text-muted" style="display: none; border-top: 1px dashed #ccc; padding-top: 8px;">
            ${note.body}
        </div>
    `;

    // 1. Клик по названию -> показать/скрыть текст
    li.querySelector('.note-title-text').addEventListener('click', () => {
        const bodyDiv = li.querySelector('.note-body-text');
        bodyDiv.style.display = bodyDiv.style.display === 'none' ? 'block' : 'none';
    });
    
    // 2. Кнопка редактирования
    li.querySelector('.btn-edit').addEventListener('click', () => editNote(note, li));

    // 3. Кнопка удаления
    li.querySelector('.btn-delete').addEventListener('click', () => deleteNote(note.id, li));

    notesList.prepend(li);
}

// Первоначальная загрузка
fetchNotes();