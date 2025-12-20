const output = document.getElementById("output");

/* ========= СОСТОЯНИЕ ИГРЫ ========= */

let numPlayers = 0;
let wordsPerPlayer = 0;

let players = [];
let scores = [];
let words = [];
let hat = [];

let currentRound = 1;
let currentExplainer = 0;
let currentWord = null;

let timer = null;
let timeLeft = 30;

let gameModes = [];

/* ========= УТИЛИТЫ ========= */

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function enableEnterNavigation(inputs, submitButton) {
    inputs.forEach((input, index) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                } else {
                    submitButton.click();
                }
            }
        });
    });

    inputs[0]?.focus();
}

/* ========= ПРАВИЛА ========= */

const rules = {
    words: "Объясняйте словами",
    gestures: "Объясняйте жестами",
    oneword: "Объясняйте одним словом",
    phrases: "Объясняйте фразами",
    yoga: "Объясняйте йогой"
};

/* ========= СТАРТ ========= */

function init() {
    output.innerHTML = `
        <p>Количество игроков (минимум 3):</p>
        <input id="numP" type="number">
        <p>Сколько слов на игрока?</p>
        <input id="wp" type="number" value="10">
        <p>Дополнительные режимы:</p>
        <label><input type="checkbox" id="canWeSkip"> Можно пропускать имена?</label><br>
        <label><input type="checkbox" id="modeY"> Й</label><br>
        <button onclick="setGame()">OK</button>
    `;
}

function setGame() {
    numPlayers = +document.getElementById("numP").value;
    if (numPlayers < 3) {
        alert("Минимум 3 игрока");
        return;
    }

    wordsPerPlayer = +document.getElementById("wp").value;
    if (wordsPerPlayer < 1) {
        alert("Число должно быть положительным");
        return;
    }

    const modeF = document.getElementById("modeF").checked;
    const modeY = document.getElementById("modeY").checked;

    gameModes = ['words', 'gestures', 'oneword'];
    if (modeF) gameModes.push('phrases');
    if (modeY) gameModes.push('yoga');

    players = Array.from({length: numPlayers}, (_, i) => `Игрок ${i+1}`);
    scores = Array(numPlayers).fill(0);
    collectWords(0);
}

/* ========= СЛОВА ========= */

function collectWords(playerIndex) {
    if (playerIndex >= players.length) {
        startRound(1);
        return;
    }

    const playerName = players[playerIndex];

    output.innerHTML = `
        <h2>Игрок ${playerIndex + 1}</h2>
        <p>Имя:</p>
        <input id="playerName" value="${playerName}">
    `;

    for (let i = 0; i < wordsPerPlayer; i++) {
        output.innerHTML += `
            <input id="word${i}" placeholder="Слово ${i + 1}">
        `;
    }

    output.innerHTML += `<br><button id="submitWords">Далее</button>`;

    const inputs = [document.getElementById("playerName")];
    for (let i = 0; i < wordsPerPlayer; i++) {
        inputs.push(document.getElementById(`word${i}`));
    }

    const btn = document.getElementById("submitWords");
    btn.onclick = () => saveWords(playerIndex);

    enableEnterNavigation(inputs, btn);
}

function saveWords(playerIndex) {
    const name = document.getElementById("playerName").value.trim();
    if (!name) {
        alert("Введите имя игрока");
        return;
    }
    players[playerIndex] = name;

    for (let i = 0; i < wordsPerPlayer; i++) {
        const w = document.getElementById(`word${i}`).value.trim();
        if (!w) {
            alert("Все слова должны быть заполнены");
            return;
        }
        words.push(w);
    }
    collectWords(playerIndex + 1);
}

/* ========= РАУНДЫ ========= */

function startRound(round) {
    currentRound = round;
    currentExplainer = 0;
    hat = [...words];
    shuffle(hat);

    if (round > gameModes.length) {
        showScores();
        return;
    }

    const mode = gameModes[round - 1];

    output.innerHTML = `
        <h2>Раунд ${round}</h2>
        <p>${rules[mode]}</p>
        <button onclick="waitNextPlayer()">Начать раунд</button>
    `;
}

/* ========= ХОД ========= */

function beginTurn() {
    if (hat.length === 0) {
        endRound();
        return;
    }

    timeLeft = 30;

    const guesser = (currentExplainer + 1) % numPlayers;

    output.innerHTML = `
        <p>
            <strong>${players[currentExplainer]}</strong> объясняет 
            <strong>${players[guesser]}</strong>
        </p>
        <h1 id="word"></h1>
        <p>⏱ <span id="timer">30</span> сек</p>
        <button onclick="guessed()">✔ Отгадано</button>
        <button onclick="skipped()">✖ Пропуск</button>
    `;

    nextWord();
    timer = setInterval(tick, 1000);
}

function tick() {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        endTurn();
    }
}

function nextWord() {
    if (hat.length === 0) {
        endRound();
        return;
    }
    currentWord = hat.pop();
    document.getElementById("word").innerText = currentWord;
}

/* ========= РЕЗУЛЬТАТ СЛОВА ========= */

function guessed() {
    const guesser = (currentExplainer + 1) % numPlayers;
    scores[currentExplainer]++;
    scores[guesser]++;
    nextWord();
}

function skipped() {
    scores[currentExplainer] -= 2;
    hat.unshift(currentWord);
    nextWord();
}

/* ========= ЗАВЕРШЕНИЕ ========= */

function waitNextPlayer() {
    const nextExplainer = currentExplainer;
    const nextGuesser = (currentExplainer + 1) % numPlayers;

    output.innerHTML = `
        <h2>Смена игрока</h2>
        <p>
            Следующий объясняющий:<br>
            <strong>${players[nextExplainer]} -> ${players[nextGuesser]}</strong>
        </p>
        <button onclick="beginTurn()">▶ Начать ход</button>
    `;
}

function endTurn() {
    clearInterval(timer);
    currentExplainer = (currentExplainer + 1) % numPlayers;
    waitNextPlayer();
}


function endRound() {
    clearInterval(timer);
    if (currentRound >= gameModes.length) {
        showScores();
    } else {
        startRound(currentRound + 1);
    }
}

function showScores() {
    output.innerHTML = "<h2>🏆 Итоги</h2><ul>";
    players.forEach((p, i) => {
        output.innerHTML += `<li>${p}: ${scores[i]}</li>`;
    });
    output.innerHTML += "</ul>";
}

/* ========= ЗАПУСК ========= */

init();
