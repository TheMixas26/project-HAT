const output = document.getElementById("output");

/* ========= СОСТОЯНИЕ ========= */
let players = [];
let currentPlayer = 0;
let bulletPosition = -1;
let chamberSize = 6;
let currentChamber = 0;
let gameStarted = false;
let gameOver = false;

/* ========= УТИЛИТЫ ========= */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ========= ИНИЦИАЛИЗАЦИЯ ========= */
function init() {
    output.innerHTML = `
        <h2>🔫 Русская рулетка</h2>
        <p>Количество игроков (2-6):</p>
        <input id="numP" type="number" min="2" max="6" value="4">
        <br><br>
        <p>Количество патронов в барабане (1-5):</p>
        <input id="bullets" type="number" min="1" max="5" value="1">
        <br><br>
        <button onclick="setPlayers()">Начать игру</button>
    `;
}

function setPlayers() {
    const numPlayers = +document.getElementById("numP").value;
    const numBullets = +document.getElementById("bullets").value;
    
    if (numPlayers < 2 || numPlayers > 6) {
        alert("Должно быть от 2 до 6 игроков");
        return;
    }
    
    if (numBullets < 1 || numBullets > 5) {
        alert("Должно быть от 1 до 5 патронов");
        return;
    }
    
    players = Array.from({ length: numPlayers }, (_, i) => ({
        name: `Игрок ${i + 1}`,
        alive: true
    }));
    
    // Генерируем позиции патронов
    const bulletPositions = [];
    while (bulletPositions.length < numBullets) {
        const pos = getRandomInt(0, chamberSize - 1);
        if (!bulletPositions.includes(pos)) {
            bulletPositions.push(pos);
        }
    }
    bulletPosition = bulletPositions; // Теперь это массив
    
    currentChamber = 0;
    currentPlayer = 0;
    gameStarted = true;
    gameOver = false;
    
    collectPlayers();
}

/* ========= ВВОД ИМЕН ========= */
function collectPlayers() {
    output.innerHTML = "<h2>Введите имена игроков</h2>";
    
    for (let i = 0; i < players.length; i++) {
        output.innerHTML += `
            <input id="player${i}" placeholder="Игрок ${i + 1}" value="Игрок ${i + 1}"><br>
        `;
    }
    
    output.innerHTML += `<button onclick="savePlayers()">Начать рулетку</button>`;
}

function savePlayers() {
    for (let i = 0; i < players.length; i++) {
        const name = document.getElementById(`player${i}`).value.trim();
        if (!name) {
            alert("Заполните все имена");
            return;
        }
        players[i].name = name;
    }
    
    showGameScreen();
}

/* ========= ИГРОВОЙ ЭКРАН ========= */
function showGameScreen() {
    const player = players[currentPlayer];
    
    // Создаем визуализацию барабана
    let chamberVisual = "";
    for (let i = 0; i < chamberSize; i++) {
        const isCurrent = i === currentChamber;
        const hasBullet = bulletPosition.includes(i);
        const isFired = currentChamber > i;
        
        let chamberClass = "chamber";
        if (isCurrent) chamberClass += " current";
        if (isFired) chamberClass += " fired";
        
        chamberVisual += `
            <div class="${chamberClass}" style="
                width: 40px;
                height: 40px;
                border: 2px solid #333;
                margin: 5px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                background: ${isCurrent ? '#ff6b6b' : (isFired ? '#ccc' : '#fff')};
            ">
                ${hasBullet && isFired ? '💥' : (hasBullet ? '🔴' : '')}
            </div>
        `;
    }
    
    // Список игроков
    let playersList = "<div style='margin: 20px 0;'>";
    players.forEach((p, idx) => {
        playersList += `
            <div style="padding: 5px; margin: 2px; background: ${idx === currentPlayer ? '#ffeb3b' : (p.alive ? '#e8f5e9' : '#ffcdd2')}">
                ${p.name} ${p.alive ? '✅' : '💀'}
            </div>
        `;
    });
    playersList += "</div>";
    
    output.innerHTML = `
        <h2>Ход: ${player.name}</h2>
        <div style="margin: 10px 0; display: flex; gap: 10px; justify-content: center;">
            <button onclick="toggleChamber()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px;">
                👁️ Показать/Скрыть барабан
            </button>
            <button onclick="spinChamber()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px;">
                🔄 Крутить барабан
            </button>
        </div>
        <div id="chamberContainer" style="display: none; text-align: center;">
            <div style='display: flex; justify-content: center; margin: 20px; flex-wrap: wrap;'>
                ${chamberVisual}
            </div>
            <p style="color: #666; font-style: italic;">Красная ячейка - текущая позиция, 🔴 - патрон, 💥 - выстреленный патрон</p>
        </div>
        ${playersList}
        <div style="margin: 20px 0; text-align: center;">
            <button onclick="pullTrigger()" style="padding: 15px 30px; font-size: 18px; background: #d32f2f; color: white; border: none; border-radius: 5px;">
                🔫 Нажать на курок
            </button>
        </div>
        <p>Текущий игрок может крутить барабан сколько угодно раз, затем нажать на курок.</p>
    `;
}

// Функция для переключения видимости барабана
function toggleChamber() {
    const chamberContainer = document.getElementById('chamberContainer');
    if (chamberContainer) {
        if (chamberContainer.style.display === 'none') {
            chamberContainer.style.display = 'block';
        } else {
            chamberContainer.style.display = 'none';
        }
    }
}

// Функция для прокрутки барабана
function spinChamber() {
    // Прокручиваем барабан на случайное количество позиций (от 1 до полного оборота)
    const spinAmount = getRandomInt(1, chamberSize);
    currentChamber = (currentChamber + spinAmount) % chamberSize;
    
    // Показываем анимацию прокрутки
    output.innerHTML = `
        <h2>${players[currentPlayer].name} крутит барабан...</h2>
        <div style="text-align: center;">
            <div style="font-size: 80px; animation: spin 0.5s ease-in-out;">🔄</div>
            <p>Барабан прокручен на ${spinAmount} позиций</p>
            <p>Новая текущая позиция: ${currentChamber + 1}</p>
            <button onclick="showGameScreen()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 5px;">
                Продолжить игру
            </button>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(${spinAmount * 60}deg); }
            }
        </style>
    `;
    
    setTimeout(() => {
        showGameScreen();
    }, 1500);
}

/* ========= ОСНОВНАЯ МЕХАНИКА ========= */
function pullTrigger() {
    const player = players[currentPlayer];
    
    // Проверяем, попал ли патрон
    if (bulletPosition.includes(currentChamber)) {
        // Выстрел!
        player.alive = false;
        
        // Удаляем этот патрон из массива (так как он выстрелил)
        bulletPosition = bulletPosition.filter(pos => pos !== currentChamber);
        
        output.innerHTML = `
            <h1 style="color: #d32f2f;">💥 БАХ!</h1>
            <h2>${player.name} был убит!</h2>
            <div style="font-size: 100px;">💀</div>
            <p>Игрок выбывает из игры.</p>
            <p>Осталось патронов в барабане: ${bulletPosition.length}</p>
            <button onclick="nextTurn()">Продолжить</button>
        `;
    } else {
        // Пустой выстрел
        output.innerHTML = `
            <h1 style="color: #4caf50;">💨 Щёлк!</h1>
            <h2>${player.name} выжил!</h2>
            <div style="font-size: 100px;">🎉</div>
            <p>Повезло! Передайте револьвер следующему игроку.</p>
            <button onclick="nextTurn()">Следующий игрок</button>
        `;
    }
    
    // Переходим к следующей каморе
    currentChamber = (currentChamber + 1) % chamberSize;
}

function nextTurn() {
    // Проверяем, не закончилась ли игра
    const alivePlayers = players.filter(p => p.alive);
    
    if (alivePlayers.length === 1) {
        // Остался один выживший
        const winner = alivePlayers[0];
        gameOver = true;
        
        output.innerHTML = `
            <h1 style="color: #4caf50;">🏆 ПОБЕДА!</h1>
            <h2>${winner.name} победил в русской рулетке!</h2>
            <div style="font-size: 100px;">🎖️</div>
            <p>Игра окончена. Все остальные игроки мертвы.</p>
            <button onclick="init()">Новая игра</button>
        `;
        return;
    }
    
    // Если закончились патроны
    if (bulletPosition.length === 0) {
        output.innerHTML = `
            <h1 style="color: #4caf50;">🎮 Игра окончена!</h1>
            <h2>Все патроны израсходованы!</h2>
            <p>Выжившие игроки:</p>
            <div style="margin: 20px 0;">
                ${players.filter(p => p.alive).map(p => `<div style="padding: 10px; background: #e8f5e9;">✅ ${p.name}</div>`).join('')}
            </div>
            <button onclick="init()">Новая игра</button>
        `;
        return;
    }
    
    // Переход к следующему живому игроку
    do {
        currentPlayer = (currentPlayer + 1) % players.length;
    } while (!players[currentPlayer].alive);
    
    showGameScreen();
}

/* ========= ЗАПУСК ========= */
init();