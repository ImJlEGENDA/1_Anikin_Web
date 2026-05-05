class Card {
    #id;
    #name;
    #cost;
    #description;
    #image;

    constructor(id, name, cost, description, image) {
        this.#id = id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
        this.#name = name;
        this.#cost = cost;
        this.#description = description;
        this.#image = image || 'https://via.placeholder.com/250x150/222222/FFFFFF?text=No+Image';
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get cost() { return this.#cost; }
    get description() { return this.#description; }
    get image() { return this.#image; }
    
    getDetailsHTML() {
        return '';
    }

    render(isEditMode) {
        let actionsHtml = '';
        if (isEditMode) {
            actionsHtml = `
                <div class="card-actions">
                    <button class="btn-edit" data-id="${this.id}">Ред.</button>
                    <button class="btn-danger btn-delete" data-id="${this.id}">Удалить</button>
                </div>
            `;
        }

        return `
            <div class="card" data-id="${this.id}">
                <div class="card-header">
                    <span>${this.name}</span>
                    <span class="card-cost">${this.cost}</span>
                </div>
                <img src="${this.image}" class="card-img" alt="${this.name}">
                <div class="card-body">
                    <div class="card-desc">${this.description}</div>
                    ${this.getDetailsHTML()}
                </div>
                ${actionsHtml}
            </div>
        `;
    }

    toJSON() {
        return {
            type: this.constructor.name,
            id: this.id,
            name: this.name,
            cost: this.cost,
            description: this.description,
            image: this.image
        };
    }
}

class Creature extends Card {
    #damage;
    #hp;

    constructor(id, name, cost, description, image, damage, hp) {
        super(id, name, cost, description, image);
        this.#damage = damage;
        this.#hp = hp;
    }

    get damage() { return this.#damage; }
    get hp() { return this.#hp; }

    getDetailsHTML() {
        return `
            <div class="card-stats">
                <span title="Урон">⚔️ ${this.damage}</span>
                <span title="Здоровье">❤️ ${this.hp}</span>
            </div>
        `;
    }

    toJSON() {
        return { ...super.toJSON(), damage: this.damage, hp: this.hp };
    }
}

class Spell extends Card {
    #effectType;

    constructor(id, name, cost, description, image, effectType) {
        super(id, name, cost, description, image);
        this.#effectType = effectType;
    }

    get effectType() { return this.#effectType; }

    getDetailsHTML() {
        return `
            <div class="card-stats" style="justify-content: center;">
                <span>✨ Эффект: ${this.effectType}</span>
            </div>
        `;
    }

    toJSON() {
        return { ...super.toJSON(), effectType: this.effectType };
    }
}

class Artifact extends Card {
    #durability;

    constructor(id, name, cost, description, image, durability) {
        super(id, name, cost, description, image);
        this.#durability = durability;
    }

    get durability() { return this.#durability; }

    getDetailsHTML() {
        return `
            <div class="card-stats" style="justify-content: center;">
                <span>🛡️ Время жизни: ${this.durability} сек.</span>
            </div>
        `;
    }

    toJSON() {
        return { ...super.toJSON(), durability: this.durability };
    }
}


// 2. РАБОТА С ХРАНИЛИЩЕМ
const STORAGE_KEY = 'cr_card_deck_lab5';

function saveDeck(deck) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deck));
}

function loadDeck() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    try {
        const parsed = JSON.parse(data);
        return parsed.map(item => {
            switch (item.type) {
                case 'Creature':
                    return new Creature(item.id, item.name, item.cost, item.description, item.image, item.damage, item.hp);
                case 'Spell':
                    return new Spell(item.id, item.name, item.cost, item.description, item.image, item.effectType);
                case 'Artifact':
                    return new Artifact(item.id, item.name, item.cost, item.description, item.image, item.durability);
                default:
                    return null;
            }
        }).filter(item => item !== null);
    } catch (e) {
        console.error("Ошибка LS:", e);
        return null;
    }
}


//ГЛАВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
let deck = [];
let isEditMode = false;

//3 КАРТЫ CLASH ROYALE
const defaultDeck = [
    new Creature(
        null, 
        'П.Е.К.К.А.', 
        7, 
        'Тяжелобронированный боец ближнего боя. Бабочки — её единственная слабость.', 
        'img/pekka.jpg', 
        678, // Урон
        3125 // Здоровье
    ),
    new Spell(
        null, 
        'Бревно', 
        2, 
        'Сметает всё на своём пути, нанося урон и отбрасывая врагов назад.', 
        'img/log.jpg', 
        'Отбрасывание'
    ),
    new Artifact(
        null, 
        'Надгробие', 
        3, 
        'Здание, которое периодически выпускает скелетов. Когда разрушается, появляется еще больше скелетов!', 
        'img/tombstone.jpg', 
        40 // Время жизни в секундах
    )
];

// Инициализация
function init() {
    const saved = loadDeck();
    deck = (saved && saved.length > 0) ? saved : defaultDeck;
    renderApp();
}

// Генерация всего содержимого страницы
function renderApp() {
    document.body.innerHTML = `
        <header>
            <h1>Clash Royale: Колода</h1>
            <div class="controls">
                <label style="cursor:pointer">
                    <input type="checkbox" id="edit-mode-toggle" ${isEditMode ? 'checked' : ''}>
                    Режим редактирования
                </label>
                ${isEditMode ? '<button id="btn-add-card" class="btn-primary">Добавить карту</button>' : ''}
            </div>
        </header>
        <main class="deck-container" id="deck-container">
            ${deck.map(card => card.render(isEditMode)).join('')}
        </main>
    `;

    bindEvents();
}

// Навешивание обработчиков
function bindEvents() {
    document.getElementById('edit-mode-toggle').addEventListener('change', (e) => {
        isEditMode = e.target.checked;
        renderApp();
    });

    const btnAdd = document.getElementById('btn-add-card');
    if (btnAdd) btnAdd.addEventListener('click', () => showModal());

    document.getElementById('deck-container').addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains('btn-delete')) {
            if (confirm("Удалить эту карту?")) {
                deck = deck.filter(c => c.id !== id);
                saveDeck(deck);
                renderApp();
            }
        } else if (e.target.classList.contains('btn-edit')) {
            showModal(id);
        }
    });
}

// Модальное окно для создания/редактирования
function showModal(cardId = null) {
    const card = cardId ? deck.find(c => c.id === cardId) : null;
    
    const modalHtml = `
        <div class="modal-overlay" id="modal-overlay">
            <div class="modal">
                <h2>${card ? 'Редактирование' : 'Новая карта'}</h2>
                <form id="card-form">
                    <div class="form-group">
                        <label>Тип</label>
                        <select id="card-type" ${card ? 'disabled' : ''}>
                            <option value="Creature" ${card instanceof Creature ? 'selected' : ''}>Существо</option>
                            <option value="Spell" ${card instanceof Spell ? 'selected' : ''}>Заклинание</option>
                            <option value="Artifact" ${card instanceof Artifact ? 'selected' : ''}>Артефакт</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Имя</label>
                        <input type="text" id="card-name" value="${card ? card.name : ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Мана</label>
                        <input type="number" id="card-cost" value="${card ? card.cost : 0}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea id="card-desc" required>${card ? card.description : ''}</textarea>
                    </div>
                    
                    <div id="dynamic-fields"></div>

                    <div class="modal-actions">
                        <button type="button" id="btn-close-modal">Отмена</button>
                        <button type="submit" class="btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const typeSelect = document.getElementById('card-type');
    const dynamicFields = document.getElementById('dynamic-fields');

    const updateFields = () => {
        const type = typeSelect.value;
        if (type === 'Creature') {
            dynamicFields.innerHTML = `
                <div class="form-group"><label>Урон</label><input type="number" id="card-dmg" value="${card?.damage || 0}" min="0"></div>
                <div class="form-group"><label>Здоровье</label><input type="number" id="card-hp" value="${card?.hp || 1}" min="1"></div>
            `;
        } else if (type === 'Spell') {
            dynamicFields.innerHTML = `<div class="form-group"><label>Тип эффекта</label><input type="text" id="card-effect" value="${card?.effectType || ''}" required></div>`;
        } else {
            dynamicFields.innerHTML = `<div class="form-group"><label>Время жизни (сек)</label><input type="number" id="card-dur" value="${card?.durability || 1}" min="1"></div>`;
        }
    };

    updateFields();
    typeSelect.addEventListener('change', updateFields);

    document.getElementById('btn-close-modal').addEventListener('click', () => {
        document.getElementById('modal-overlay').remove();
    });

    document.getElementById('card-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('card-name').value.trim();
        const cost = parseInt(document.getElementById('card-cost').value);
        const desc = document.getElementById('card-desc').value.trim();
        const type = typeSelect.value;

        if (name.length < 2) return alert("Слишком короткое имя!");

        let newCard;
        const img = card ? card.image : '';

        if (type === 'Creature') {
            const d = parseInt(document.getElementById('card-dmg').value);
            const h = parseInt(document.getElementById('card-hp').value);
            newCard = new Creature(cardId, name, cost, desc, img, d, h);
        } else if (type === 'Spell') {
            const eff = document.getElementById('card-effect').value.trim();
            newCard = new Spell(cardId, name, cost, desc, img, eff);
        } else {
            const dur = parseInt(document.getElementById('card-dur').value);
            newCard = new Artifact(cardId, name, cost, desc, img, dur);
        }

        if (cardId) {
            const idx = deck.findIndex(c => c.id === cardId);
            deck[idx] = newCard;
        } else {
            deck.push(newCard);
        }

        saveDeck(deck);
        renderApp();
        document.getElementById('modal-overlay').remove();
    });
}

// Запуск
init();