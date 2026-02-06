const output = document.getElementById("output");

/* ========= СОСТОЯНИЕ ========= */
let players = [
    { name: "Игрок 1", hp: 3, isPlayer: true },
    { name: "Игрок 2", hp: 3, isPlayer: false }
];

let shotgun = {
    chamberSize: 8,
    currentChamber: 0,
    shells: [],
    liveCount: 0,
    blankCount: 0
};

let currentTurn = 0; // 0 = первый игрок, 1 = второй игрок
let gameStarted = false;
let gameOver = false;

/* ========= ИНИЦИАЛИЗАЦИЯ ========= */
function init() {
    output.innerHTML = `
        <h2>🔫 Buckshot Roulette (Дробовик)</h2>
        <p>Введите имя игроков:</p>
        
        <div style="margin: 20px 0;">
            <strong>Игрок 1:</strong><br>
            <input id="player1" type="text" value="Игрок 1" placeholder="Имя игрока 1"><br><br>
            
            <strong>Игрок 2:</strong><br>
            <input id="player2" type="text" value="Игрок 2" placeholder="Имя игрока 2">
        </div>
        
        <p>Количество патронов в дробовике (4-8):</p>
        <input id="shellCount" type="number" min="4" max="8" value="6">
        <br><br>
        
        <button onclick="startGame()">Начать игру</button>
    `;
}

function startGame() {
    const player1Name = document.getElementById("player1").value.trim();
    const player2Name = document.getElementById("player2").value.trim();
    const shellCount = +document.getElementById("shellCount").value;
    
    if (!player1Name || !player2Name) {
        alert("Введите имена обоих игроков");
        return;
    }
    
    if (shellCount < 4 || shellCount > 8) {
        alert("Количество патронов должно быть от 4 до 8");
        return;
    }
    
    // Инициализация игроков
    players[0].name = player1Name;
    players[1].name = player2Name;
    players[0].hp = 3;
    players[1].hp = 3;
    
    // Инициализация дробовика
    shotgun.chamberSize = shellCount;
    shotgun.currentChamber = 0;
    shotgun.liveCount = Math.floor(shellCount / 2);
    shotgun.blankCount = shellCount - shotgun.liveCount;
    
    // Создаем патроны
    shotgun.shells = [];
    for (let i = 0; i < shotgun.liveCount; i++) {
        shotgun.shells.push({ type: "live", used: false });
    }
    for (let i = 0; i < shotgun.blankCount; i++) {
        shotgun.shells.push({ type: "blank", used: false });
    }
    
    // Перемешиваем патроны
    shuffleShells();
    
    currentTurn = 0;
    gameStarted = true;
    gameOver = false;
    
    showGameScreen();
}

function shuffleShells() {
    for (let i = shotgun.shells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shotgun.shells[i], shotgun.shells[j]] = [shotgun.shells[j], shotgun.shells[i]];
    }
}

/* ========= ИГРОВОЙ ЭКРАН ========= */
function showGameScreen() {
    const currentPlayer = players[currentTurn];
    const opponent = players[1 - currentTurn];
    
    // Статистика игроков
    const playerStats = `
        <div style="display: flex; justify-content: space-around; margin: 20px 0;">
            <div style="text-align: center; padding: 10px; background: ${currentTurn === 0 ? '#ffeb3b' : '#e8f5e9'}; border-radius: 5px; width: 45%;">
                <h3>${players[0].name}</h3>
                <div style="font-size: 24px;">${getHealthBar(players[0].hp)}</div>
                <p>HP: ${players[0].hp}/3</p>
                ${currentTurn === 0 ? "<strong>🎯 Ваш ход</strong>" : ""}
            </div>
            
            <div style="text-align: center; padding: 10px; background: ${currentTurn === 1 ? '#ffeb3b' : '#e8f5e9'}; border-radius: 5px; width: 45%;">
                <h3>${players[1].name}</h3>
                <div style="font-size: 24px;">${getHealthBar(players[1].hp)}</div>
                <p>HP: ${players[1].hp}/3</p>
                ${currentTurn === 1 ? "<strong>🎯 Ваш ход</strong>" : ""}
            </div>
        </div>
    `;
    
    // Визуализация дробовика и патронов
    const shotgunVisual = createShotgunVisual();
    
    // Счетчик оставшихся патронов
    const remainingShells = shotgun.shells.filter(s => !s.used).length;
    const remainingLive = shotgun.shells.filter(s => !s.used && s.type === "live").length;
    const remainingBlank = shotgun.shells.filter(s => !s.used && s.type === "blank").length;
    
    const shellsInfo = `
        <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0;">
            <p><strong>Осталось патронов:</strong> ${remainingShells}</p>
            <p>🔴 Боевые: ${remainingLive} | ⚪ Холостые: ${remainingBlank}</p>
        </div>
    `;
    
    output.innerHTML = `
        <h2>${currentPlayer.name}, ваш ход</h2>
        
        ${playerStats}
        
        <h3>🔫 Дробовик</h3>
        ${shotgunVisual}
        
        ${shellsInfo}
        
        <div style="margin: 20px 0;">
            <button onclick="shootAtOpponent()" style="padding: 15px 30px; font-size: 18px; background: #d32f2f; color: white; border: none; border-radius: 5px; margin: 10px;">
                💥 Выстрелить в противника
            </button>
            
            <button onclick="shootAtYourself()" style="padding: 15px 30px; font-size: 18px; background: #1976d2; color: white; border: none; border-radius: 5px; margin: 10px;">
                🎯 Выстрелить в себя
            </button>
        </div>
        
        <p>Следующий патрон: ${getNextShellType()}</p>
    `;
}

function createShotgunVisual() {
    let visual = "<div style='display: flex; align-items: center; justify-content: center; margin: 20px;'>";
    visual += "<div style='font-size: 40px; margin-right: 20px;'>🔫</div>";
    
    // Отображение патронов в дробовике
    visual += "<div style='display: flex; flex-direction: column;'>";
    
    // Пройденные патроны
    for (let i = 0; i < shotgun.currentChamber; i++) {
        if (i < shotgun.shells.length) {
            const shell = shotgun.shells[i];
            visual += `
                <div style="margin: 2px; padding: 5px; border-radius: 3px; background: #ccc; text-align: center; width: 100px;">
                    ${shell.type === "live" ? "🔴" : "⚪"} ${shell.used ? "💨" : ""}
                </div>
            `;
        }
    }
    
    // Текущий патрон (если есть)
    if (shotgun.currentChamber < shotgun.shells.length) {
        const currentShell = shotgun.shells[shotgun.currentChamber];
        visual += `
            <div style="margin: 2px; padding: 5px; border-radius: 3px; background: #ffeb3b; text-align: center; width: 100px; font-weight: bold;">
                ${currentShell.type === "live" ? "🔴" : "⚪"} ТЕКУЩИЙ
            </div>
        `;
    }
    
    // Будущие патроны (скрытые)
    const futureShells = shotgun.shells.length - shotgun.currentChamber - 1;
    if (futureShells > 0) {
        visual += `
            <div style="margin: 2px; padding: 5px; border-radius: 3px; background: #f5f5f5; text-align: center; width: 100px;">
                ❓ Ещё ${futureShells}
            </div>
        `;
    }
    
    visual += "</div>";
    visual += "</div>";
    
    return visual;
}

function getNextShellType() {
    if (shotgun.currentChamber >= shotgun.shells.length) {
        return "Дробовик пуст";
    }
    
    const nextShell = shotgun.shells[shotgun.currentChamber];
    return nextShell.type === "live" ? "🔴 Боевой патрон" : "⚪ Холостой патрон";
}

function getHealthBar(hp) {
    let hearts = "";
    for (let i = 0; i < 3; i++) {
        hearts += i < hp ? "❤️" : "🖤";
    }
    return hearts;
}

/* ========= МЕХАНИКА ВЫСТРЕЛА ========= */
function shootAtOpponent() {
    if (shotgun.currentChamber >= shotgun.shells.length) {
        alert("Дробовик пуст! Перезарядка...");
        reloadShotgun();
        return;
    }
    
    const currentShell = shotgun.shells[shotgun.currentChamber];
    const shooter = players[currentTurn];
    const target = players[1 - currentTurn];
    
    // Отмечаем патрон как использованный
    shotgun.shells[shotgun.currentChamber].used = true;
    shotgun.currentChamber++;
    
    if (currentShell.type === "live") {
        // Попадание боевым патроном
        target.hp--;
        
        output.innerHTML = `
            <h1 style="color: #d32f2f;">💥 БАХ! Попадание!</h1>
            <h2>${shooter.name} выстрелил в ${target.name}</h2>
            <div style="font-size: 80px;">🔫 → 💥</div>
            
            <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>${target.name} получает урон!</h3>
                <p>HP: ${target.hp + 1} → ${target.hp}</p>
                ${getHealthBar(target.hp)}
            </div>
            
            <p>Патрон был <strong>боевым</strong> 🔴</p>
            
            ${checkGameOver()}
            
            <button onclick="endTurn()">Продолжить</button>
        `;
    } else {
        // Холостой выстрел
        output.innerHTML = `
            <h1 style="color: #4caf50;">💨 Щёлк! Промах</h1>
            <h2>${shooter.name} выстрелил в ${target.name}</h2>
            <div style="font-size: 80px;">🔫 → 💨</div>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>${target.name} не пострадал!</h3>
                <p>Холостой патрон не наносит урон</p>
            </div>
            
            <p>Патрон был <strong>холостым</strong> ⚪</p>
            
            <button onclick="endTurn()">Продолжить</button>
        `;
    }
}

function shootAtYourself() {
    if (shotgun.currentChamber >= shotgun.shells.length) {
        alert("Дробовик пуст! Перезарядка...");
        reloadShotgun();
        return;
    }
    
    const currentShell = shotgun.shells[shotgun.currentChamber];
    const shooter = players[currentTurn];
    
    // Отмечаем патрон как использованный
    shotgun.shells[shotgun.currentChamber].used = true;
    shotgun.currentChamber++;
    
    if (currentShell.type === "live") {
        // Выстрел в себя боевым патроном
        shooter.hp--;
        
        output.innerHTML = `
            <h1 style="color: #d32f2f;">💥 БАХ! Самоурон!</h1>
            <h2>${shooter.name} выстрелил в себя</h2>
            <div style="font-size: 80px;">🔫 → 💥 → 👤</div>
            
            <div style="background: #ffebee; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>${shooter.name} получает урон!</h3>
                <p>HP: ${shooter.hp + 1} → ${shooter.hp}</p>
                ${getHealthBar(shooter.hp)}
            </div>
            
            <p>Патрон был <strong>боевым</strong> 🔴</p>
            
            ${checkGameOver()}
            
            <button onclick="endTurn()">Продолжить</button>
        `;
    } else {
        // Холостой выстрел в себя
        output.innerHTML = `
            <h1 style="color: #4caf50;">💨 Щёлк! Удача!</h1>
            <h2>${shooter.name} выстрелил в себя</h2>
            <div style="font-size: 80px;">🔫 → 💨 → 👤</div>
            
            <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>Холостой патрон!</h3>
                <p>${shooter.name} не получает урон и получает дополнительный ход!</p>
            </div>
            
            <p>Патрон был <strong>холостым</strong> ⚪</p>
            
            <button onclick="takeExtraTurn()">Сделать дополнительный ход</button>
        `;
    }
}

function takeExtraTurn() {
    // Игрок получает дополнительный ход
    showGameScreen();
}

function endTurn() {
    if (gameOver) return;
    
    // Переход хода к другому игроку
    currentTurn = 1 - currentTurn;
    
    // Проверяем, не пуст ли дробовик
    if (shotgun.currentChamber >= shotgun.shells.length) {
        reloadShotgun();
    }
    
    showGameScreen();
}

function reloadShotgun() {
    // Создаем новые патроны для перезарядки
    const usedShells = shotgun.shells.filter(s => s.used);
    const liveUsed = usedShells.filter(s => s.type === "live").length;
    const blankUsed = usedShells.filter(s => s.type === "blank").length;
    
    // Добавляем новые патроны (половина боевых, половина холостых)
    const totalNewShells = Math.min(4, usedShells.length);
    const newLiveCount = Math.floor(totalNewShells / 2);
    const newBlankCount = totalNewShells - newLiveCount;
    
    for (let i = 0; i < newLiveCount; i++) {
        shotgun.shells.push({ type: "live", used: false });
    }
    for (let i = 0; i < newBlankCount; i++) {
        shotgun.shells.push({ type: "blank", used: false });
    }
    
    // Обновляем счетчики
    shotgun.liveCount += newLiveCount;
    shotgun.blankCount += newBlankCount;
    
    // Перемешиваем только новые патроны
    shuffleShells();
    
    // Показываем сообщение о перезарядке
    alert(`🔫 Дробовик перезаряжен! Добавлено ${totalNewShells} новых патронов.`);
}

function checkGameOver() {
    // Проверяем, не умер ли кто-то
    for (let i = 0; i < players.length; i++) {
        if (players[i].hp <= 0) {
            gameOver = true;
            const winner = players[1 - i];
            
            setTimeout(() => {
                output.innerHTML = `
                    <h1 style="color: #4caf50;">🏆 ПОБЕДА!</h1>
                    <h2>${winner.name} побеждает в Buckshot Roulette!</h2>
                    <div style="font-size: 100px;">🎖️🔫</div>
                    
                    <div style="background: #e8f5e9; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3>${players[i].name} был убит!</h3>
                        <p>${winner.name} остался в живых с ${winner.hp} HP</p>
                    </div>
                    
                    <button onclick="init()">Новая игра</button>
                `;
            }, 500);
            
            return "<p><strong>Игра окончена!</strong></p>";
        }
    }
    
    return "";
}

/* ========= ЗАПУСК ========= */
init();