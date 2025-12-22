const output = document.getElementById("output");

/* ========= СОСТОЯНИЕ ========= */

let numPlayers = 0;
let players = [];
let hat = [];
let assignedWords = [];

let currentPlayer = 0;

/* ========= УТИЛИТЫ ========= */

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/* ========= СТАРТ ========= */

function init() {
    output.innerHTML = `
        <h2>🎩 Игра «Кто я?»</h2>
        <p>Количество игроков (минимум 2):</p>
        <input id="numP" type="number">
        <button onclick="setPlayers()">OK</button>
    `;
}

function setPlayers() {
    numPlayers = +document.getElementById("numP").value;

    if (numPlayers < 2) {
        alert("Минимум 2 игрока");
        return;
    }

    players = Array.from({ length: numPlayers }, (_, i) => `Игрок ${i + 1}`);
    hat = [];
    assignedWords = [];
    currentPlayer = 0;

    collectPlayers();
}

/* ========= ИМЕНА ========= */

function collectPlayers() {
    output.innerHTML = "<h2>Введите имена игроков</h2>";

    for (let i = 0; i < numPlayers; i++) {
        output.innerHTML += `
            <input id="player${i}" placeholder="Игрок ${i + 1}"><br>
        `;
    }

    output.innerHTML += `<button onclick="savePlayers()">Далее</button>`;
}

function savePlayers() {
    for (let i = 0; i < numPlayers; i++) {
        const name = document.getElementById(`player${i}`).value.trim();
        if (!name) {
            alert("Заполните все имена");
            return;
        }
        players[i] = name;
    }

    collectWords(0);
}

/* ========= СЛОВА ========= */

function collectWords(index) {
    if (index >= numPlayers) {
        shuffle(hat);
        assignWords();
        showReveal();
        return;
    }

    output.innerHTML = `
        <h2>${players[index]}, введи слово</h2>
        <p>Ты это слово не получишь 😉</p>
        <input id="wordInput" placeholder="Слово">
        <button onclick="saveWord(${index})">Далее</button>
    `;
}

function saveWord(index) {
    const word = document.getElementById("wordInput").value.trim();
    if (!word) {
        alert("Введите слово");
        return;
    }

    hat.push({
    word,
    author: index
    });

    collectWords(index + 1);
}

/* ========= РАЗДАЧА ========= */

function assignWords() {
    let valid = false;

    while (!valid) {
        shuffle(hat);
        valid = true;

        for (let i = 0; i < numPlayers; i++) {
            if (hat[i].author === i) {
                valid = false;
                break;
            }
        }
    }

    assignedWords = hat.map(item => item.word);
}


/* ========= ПОКАЗ СЛОВ ========= */

function showReveal() {
    const playerName = players[currentPlayer];
    const others = players
        .filter((_, i) => i !== currentPlayer)
        .join(" и ");

    output.innerHTML = `
        <h2>${playerName}, отвернись 🙈</h2>
        <p><strong>${others}</strong>, подойдите и посмотрите слово</p>
        <button onclick="showWord()">Показать слово</button>
    `;
}

function showWord() {
    output.innerHTML = `
        <h2>Слово для игрока ${players[currentPlayer]}</h2>
        <h1 style="font-size: 3em;">${assignedWords[currentPlayer]}</h1>
        <button onclick="hideWord()">Скрыть слово</button>
    `;
}

function hideWord() {
    output.innerHTML = `
        <h2>${players[currentPlayer]}, можешь возвращаться</h2>
        <button onclick="nextPlayer()">Следующий игрок</button>
    `;
}

function nextPlayer() {
    currentPlayer++;

    if (currentPlayer >= numPlayers) {
        showEnd();
    } else {
        showReveal();
    }
}

/* ========= КОНЕЦ ========= */

function showWordList() {
    let list = "<h4>📋 Слова игроков</h4>";
    list += "<p>Нажимайте только если нужно. Не подглядывайте 👀</p><ul>";

    for (let i = 0; i < players.length; i++) {
        list += `
            <li>
                ${players[i]} —
                <button onclick="revealSingleWord(${i}, this)">
                    Показать
                </button>
            </li>
        `;
    }

    list += "</ul><br><button onclick='showEnd()'>Назад</button>";
    output.innerHTML = list;
}

function revealSingleWord(index, btn) {
    btn.outerHTML = `<strong>${assignedWords[index]}</strong>`;
}

function showEnd() {
    output.innerHTML = `
        <h2>🎉 Все слова розданы!</h2>
        <p>Если вдруг кто-то забыл слово — можно аккуратно посмотреть.</p>

        <button onclick="showWordList()">Посмотреть слова</button>
        <br><br>
        <button onclick="init()">Новая игра</button>
    `;
}

/* ========= ЗАПУСК ========= */

init();
