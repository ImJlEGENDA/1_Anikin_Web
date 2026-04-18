/**
 * Функция запускает турнир по игре "Камень, Ножницы, Бумага".
 * Используются методы alert, confirm и prompt.
 */
function runGame() {
    alert("Добро пожаловать в турнир 'Камень, Ножницы, Бумага'!");

    // Подтверждение начала игры
    const isReady = confirm("Игра идет до 3 побед. Готовы бросить вызов компьютеру?");
    if (!isReady) {
        alert("Возвращайтесь, когда будете готовы!");
        return;
    }

    // Запрос имени игрока с валидацией
    let playerName = prompt("Введите свое имя:");

    // Обработка некорректного ввода имени (пустая строка или Отмена)
    while (playerName === null || playerName.trim() === "") {
        if (playerName === null) {
            alert("Игра отменена.");
            return;
        }
        playerName = prompt("Имя не может быть пустым. Пожалуйста, введите имя:");
    }

    playerName = playerName.trim();
    alert(`Отлично, ${playerName}! Да начнется битва!`);

    // Игровые переменные для ведения счета
    let playerScore = 0;
    let computerScore = 0;
    const options = ["Камень", "Ножницы", "Бумага"];

    // Основной цикл игры до достижения 3 побед одним из участников
    while (playerScore < 3 && computerScore < 3) {
        let choice = prompt(
            `Счет:\n${playerName}: ${playerScore}\nКомпьютер: ${computerScore}\n\nВаш ход (введите цифру):\n1 - Камень\n2 - Ножницы\n3 - Бумага`
        );

        // Обработка нажатия кнопки "Отмена" во время матча
        if (choice === null) {
            const exitConfirmed = confirm("Вы действительно хотите сдаться и выйти из игры?");
            if (exitConfirmed) {
                alert("Засчитано техническое поражение. До встречи!");
                return;
            } else {
                continue;
            }
        }

        choice = choice.trim();

        // Проверка корректности введенных данных
        if (choice !== "1" && choice !== "2" && choice !== "3") {
            alert("Ошибка! Необходимо ввести только цифру 1, 2 или 3.");
            continue;
        }

        // Преобразование выбора игрока в индекс массива (0, 1 или 2)
        let playerIndex = parseInt(choice) - 1;
        // Генерация случайного выбора компьютера (0, 1 или 2)
        let computerIndex = Math.floor(Math.random() * 3);

        let playerChoiceStr = options[playerIndex];
        let computerChoiceStr = options[computerIndex];

        // Логика определения победителя раунда
        if (playerIndex === computerIndex) {
            alert(`Вы выбрали: ${playerChoiceStr}\nКомпьютер выбрал: ${computerChoiceStr}\n\nНичья в этом раунде!`);
        } else if (
            (playerIndex === 0 && computerIndex === 1) || // Камень бьет ножницы
            (playerIndex === 1 && computerIndex === 2) || // Ножницы бьют бумагу
            (playerIndex === 2 && computerIndex === 0)    // Бумага бьет камень
        ) {
            playerScore++;
            alert(`Вы выбрали: ${playerChoiceStr}\nКомпьютер выбрал: ${computerChoiceStr}\n\nВы выиграли этот раунд!`);
        } else {
            computerScore++;
            alert(`Вы выбрали: ${playerChoiceStr}\nКомпьютер выбрал: ${computerChoiceStr}\n\nКомпьютер выиграл этот раунд!`);
        }
    }

    // Вывод финального результата после окончания цикла
    if (playerScore === 3) {
        alert(`ПОБЕДА! ${playerName} обыграл компьютер со счетом ${playerScore}:${computerScore}!`);
    } else {
        alert(`ПОРАЖЕНИЕ! Компьютер оказался сильнее со счетом ${computerScore}:${playerScore}. Повезет в следующий раз!`);
    }
}