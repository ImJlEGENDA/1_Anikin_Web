/**
 * Устанавливает cookie с заданным именем, значением и сроком жизни.
 * @param {string} name - Название параметра.
 * @param {string} value - Значение параметра.
 * @param {number} days - Срок хранения в днях.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Извлекает значение cookie по его имени.
 * @param {string} name - Название параметра.
 * @returns {string|null} Значение или null, если параметр не найден.
 */
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}