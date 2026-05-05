//Тёмная тема
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Проверяем куки при загрузке страницы
const savedTheme = getCookie('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️ Светлая тема';
}

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    
    if (body.classList.contains('dark-theme')) {
        themeToggleBtn.textContent = '☀️ Светлая тема';
        setCookie('theme', 'dark', 30);
    } else {
        themeToggleBtn.textContent = '🌙 Темная тема';
        setCookie('theme', 'light', 30);
    }
});


// Лента отзывов
const reviewsContainer = document.getElementById('reviews-container');
const reviewForm = document.getElementById('review-form');

const defaultReviews = [
    { 
        name: "Дмитрий", 
        text: "Наклейка реально работает, теперь меня даже коты боятся! Отличный шокер.",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dima" 
    },
    { 
        name: "Олег", 
        text: "Шокер мощный, а наклейка вообще пушка! Светит как фара от жигулей.",
        img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oleg" 
    }
];

// Пытаемся получить отзывы из cookie
let reviewsArray = getCookie('user_reviews');

// ЖЕЛЕЗОБЕТОННАЯ ЗАЩИТА: Если в куки лежит мусор (не массив) или куки пустые, берем стандарнтые отзывы
if (!Array.isArray(reviewsArray)) {
    reviewsArray = [...defaultReviews]; 
}

// Функция для отрисовки отзывов на странице
function renderReviews() {
    if (!reviewsContainer) return; // Защита от ошибок, если элемент не найден
    
    reviewsContainer.innerHTML = ''; // Очищаем контейнер
    
    reviewsArray.forEach(review => {
        const reviewEl = document.createElement('div');
        reviewEl.className = 'rev';
        
        // Изображения в форме отзывов (Если ссылки нет, ставим заглушку)
        const imgSrc = review.img ? review.img : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anon';
        
        reviewEl.innerHTML = `
            <img src="${imgSrc}" alt="Аватар" class="rev-img">
            <div class="rev-content">
                <p>"${review.text}"</p>
                <cite>— ${review.name}</cite>
            </div>
        `;
        reviewsContainer.appendChild(reviewEl);
    });
}

// Первичная отрисовка отзывов при загрузке
renderReviews();

// Обработка отправки формы
if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Останавливаем перезагрузку страницы
        
        const nameInput = document.getElementById('review-name').value.trim();
        const textInput = document.getElementById('review-text').value.trim();
        const imgInput = document.getElementById('review-img').value.trim();

        // Валидация введённых данных
        if (nameInput.length < 2) {
            alert("Ошибка: Имя должно содержать минимум 2 символа.");
            return;
        }
        
        if (textInput.length < 5) {
            alert("Ошибка: Текст отзыва слишком короткий.");
            return;
        }

        // Создаем новый объект отзыва
        const newReview = {
            name: nameInput,
            text: textInput,
            img: imgInput
        };

        // Добавляем в массив
        reviewsArray.push(newReview);
        
        // Сохраняем обновленный массив в cookie на 30 дней
        setCookie('user_reviews', reviewsArray, 30);
        
        // Перерисовываем ленту отзывов
        renderReviews();
        
        // Очищаем форму
        reviewForm.reset();
    });
}