let playerName = "Anónimo";
let lastMatchTime = 0;
let imagesArray = [
    'img/image1.jpg', 'img/image1.jpg',
    'img/image2.jpg', 'img/image2.jpg',
    'img/image3.jpg', 'img/image3.jpg',
    'img/image4.jpg', 'img/image4.jpg',
    'img/image5.jpg', 'img/image5.jpg',
    'img/image6.jpg', 'img/image6.jpg',
    'img/image7.jpg', 'img/image7.jpg',
    'img/image8.jpg', 'img/image8.jpg'
];

let board = document.getElementById('board');
let scoreDisplay = document.getElementById('score');
let timerDisplay = document.getElementById('timer');
let matchesDisplay = document.getElementById('matches');
let scoreboard = document.getElementById('scoreboard').getElementsByTagName('tbody')[0];
let nameOverlay = document.getElementById('nameOverlay');
let playerNameInput = document.getElementById('playerNameInput');

let flippedCards = [];
let matchedCards = [];
let score = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;
let totalMatches = 0;
let currentLevel = 1;

const basePairs = [
    'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg', 'img/image4.jpg',
    'img/image5.jpg', 'img/image6.jpg', 'img/image7.jpg', 'img/image8.jpg'
];

const additionalPairsLevel2 = ['img/image9.jpg', 'img/image10.jpg'];
const additionalPairsLevel3 = ['img/image11.jpg', 'img/image12.jpg'];
const additionalPairsLevel4 = ['img/image13.jpg', 'img/image14.jpg'];

function getImagesForLevel(level) {
    let images = [...basePairs];
    if (level >= 2) images = [...images, ...additionalPairsLevel2];
    if (level >= 3) images = [...images, ...additionalPairsLevel3];
    if (level >= 4) images = [...images, ...additionalPairsLevel4];
    
    let pairedImages = [];
    images.forEach(img => pairedImages.push(img, img));
    return shuffle(pairedImages);
}

function setPlayerName() {
    const name = playerNameInput.value.trim();
    playerName = name || "Anónimo";
    nameOverlay.style.display = 'none';
    localStorage.setItem('playerName', playerName);
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', flipCard);
    });
}

function loadPlayerName() {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
        playerNameInput.value = savedName;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard() {
    imagesArray = getImagesForLevel(currentLevel); // Actualizar imagesArray según el nivel
    shuffle(imagesArray);
    board.innerHTML = '';
    board.className = `game-board level-${currentLevel}`;
    imagesArray.forEach((image, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.image = image;
        cardElement.style.backgroundImage = "url('img/back.jpg')";
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });

    flippedCards = [];
    matchedCards = [];
    score = 0;
    totalMatches = 0;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    matchesDisplay.textContent = `Aciertos: ${totalMatches}/${getTotalPairs()}`;
    gameStarted = false;

    if (timerInterval) clearInterval(timerInterval);
    timer = 0;
    timerDisplay.textContent = `Tiempo: ${timer}s`;
    lastMatchTime = 0;
    updateBoardSize();
    updateLevelDisplay(); // Actualizar el display del nivel
}

function flipCard(event) {
    const card = event.target;
    if (card.classList.contains('flipped') || flippedCards.length === 2) return;

    if (!gameStarted) {
        gameStarted = true;
        lastMatchTime = Date.now();
        startTimer();
    }

    card.classList.add('flipped');
    card.style.backgroundImage = `url('${card.dataset.image}')`;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        matchedCards.push(firstCard, secondCard);
        totalMatches++;

        const now = Date.now();
        const timeTaken = (now - lastMatchTime) / 1000;
        lastMatchTime = now;

        const speedBonus = Math.max(0, 50 - Math.floor(timeTaken));
        score += 100 + speedBonus;

        scoreDisplay.textContent = `Puntuación: ${score}`;
        matchesDisplay.textContent = `Aciertos: ${totalMatches}/${getTotalPairs()}`;
        flippedCards = [];

        if (matchedCards.length === imagesArray.length) {
            clearInterval(timerInterval);
            saveScore();
            showGameOver();
        }
    } else {
        setTimeout(() => {
            firstCard.style.backgroundImage = 'url(img/back.jpg)';
            secondCard.style.backgroundImage = 'url(img/back.jpg)';
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];

            score = Math.max(0, score - 20);
            scoreDisplay.textContent = `Puntuación: ${score}`;
        }, 1000);
    }
}

function getTotalPairs() {
    return imagesArray.length / 2;
}

function startTimer() {
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Tiempo: ${timer}s`;
        if (timer % 3 === 0) {
            score = Math.max(0, score - 1);
            scoreDisplay.textContent = `Puntuación: ${score}`;
        }
    }, 1000);
}

function restartGame() {
    createBoard();
    updateBoardSize();
    updateMatchesText();
}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({
        player: playerName,
        score: score,
        time: timer,
        level: currentLevel,
        date: new Date().toISOString()
    });

    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem('scores', JSON.stringify(scores));
    updateScoreboard();
}

function updateScoreboard() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scoreboard.innerHTML = '';

    scores.forEach((entry, index) => {
        let row = scoreboard.insertRow();
        row.insertCell(0).textContent = entry.player;
        row.insertCell(1).textContent = entry.score;
        row.insertCell(2).textContent = `${entry.time}s`;
        row.insertCell(3).textContent = `Nivel ${entry.level}`;

        let deleteCell = row.insertCell(4);
        let deleteButton = document.createElement('button');
        deleteButton.textContent = "Eliminar";
        deleteButton.onclick = function () { deleteScore(index); };
        deleteButton.style.padding = "5px 10px";
        deleteButton.style.fontSize = "12px";
        deleteButton.style.backgroundColor = "#f44336";
        deleteCell.appendChild(deleteButton);
    });
}

function deleteScore(index) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.splice(index, 1);
    localStorage.setItem('scores', JSON.stringify(scores));
    updateScoreboard();
}

function resetScoreboard() {
    if (confirm("¿Borrar todas las puntuaciones?")) {
        localStorage.removeItem('scores');
        updateScoreboard();
    }
}

function updateBoardSize() {
    let columns;
    switch(currentLevel) {
        case 1: columns = 4; break;
        case 2: columns = 5; break;
        case 3: columns = 6; break;
        case 4: columns = 7; break;
        default: columns = 4;
    }
    
    board.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    board.style.maxWidth = `${columns * 110}px`;
}

function updateMatchesText() {
    matchesDisplay.textContent = `Aciertos: ${totalMatches}/${getTotalPairs()}`;
}

function changeLevel(newLevel) {
    currentLevel = newLevel;
    imagesArray = getImagesForLevel(currentLevel);
    createBoard();
    updateBoardSize();
    updateMatchesText();
    updateLevelDisplay();
}

function updateLevelDisplay() {
    const levelDisplay = document.getElementById('levelDisplay');
    if (levelDisplay) {
        levelDisplay.textContent = `Nivel: ${currentLevel}`;
        const prevButton = document.querySelector('.level-button:first-child');
        const nextButton = document.querySelector('.level-button:last-child');
        if (prevButton) prevButton.disabled = currentLevel === 1;
        if (nextButton) nextButton.disabled = currentLevel === 4;
    }
}

function addLevelControls() {
    const buttonsContainer = document.querySelector('.buttons-container');
    
    if (document.querySelector('.level-controls')) return;
    
    const levelControls = document.createElement('div');
    levelControls.className = 'level-controls';
    
    const prevButton = document.createElement('button');
    prevButton.textContent = '◄';
    prevButton.onclick = () => {
        if (currentLevel > 1) {
            changeLevel(currentLevel - 1);
        }
    };
    prevButton.className = 'level-button';
    prevButton.disabled = currentLevel === 1;
    
    const levelDisplay = document.createElement('span');
    levelDisplay.id = 'levelDisplay';
    levelDisplay.className = 'level-display';
    levelDisplay.textContent = `Nivel: ${currentLevel}`;
    
    const nextButton = document.createElement('button');
    nextButton.textContent = '►';
    nextButton.onclick = () => {
        if (currentLevel < 4) {
            changeLevel(currentLevel + 1);
        }
    };
    nextButton.className = 'level-button';
    nextButton.disabled = currentLevel === 4;
    
    levelControls.append(prevButton, levelDisplay, nextButton);
    buttonsContainer.prepend(levelControls);
}
function showGameOver() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalScore = document.getElementById('finalScore');
    const finalTime = document.getElementById('finalTime');
    const finalMatches = document.getElementById('finalMatches');
    const nextLevelButton = document.getElementById('nextLevelButton');

    gameOverMessage.textContent = `¡Felicidades ${playerName}!`;
    finalScore.textContent = `Puntuación: ${score}`;
    finalTime.textContent = `Tiempo: ${timer} segundos`;
    finalMatches.textContent = `Aciertos: ${totalMatches}/${getTotalPairs()}`;

    // Habilitar/deshabilitar el botón de siguiente nivel según el nivel actual
    nextLevelButton.disabled = currentLevel === 4; // Corrección aquí

    gameOverOverlay.style.display = 'flex';
    setTimeout(() => {
        gameOverOverlay.classList.add('active');
    }, 10); // Pequeño retraso para la transición
}

function closeGameOver() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    gameOverOverlay.classList.remove('active');
    setTimeout(() => {
        gameOverOverlay.style.display = 'none';
        restartGame(); // Reinicia el juego al cerrar
    }, 300); // Coincide con la duración de la transición
}

function goToNextLevel() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    if (currentLevel < 4) {
        currentLevel++;
        gameOverOverlay.classList.remove('active');
        setTimeout(() => {
            gameOverOverlay.style.display = 'none';
            changeLevel(currentLevel); // Cambia al siguiente nivel
        }, 300); // Coincide con la duración de la transición
    }
}

window.onload = function () {
    addLevelControls();
    loadPlayerName();
    createBoard();
    updateMatchesText();
    updateLevelDisplay();
};