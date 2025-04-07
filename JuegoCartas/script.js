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

// Mapa de imágenes a sonidos
const soundMap = {
    'img/image1.jpg': new Audio('sounds/image1.mp3'),
    'img/image2.jpg': new Audio('sounds/image2.mp3'),
    'img/image3.jpg': new Audio('sounds/image3.mp3'),
    'img/image4.jpg': new Audio('sounds/image4.mp3'),
    'img/image5.jpg': new Audio('sounds/image5.mp3'),
    'img/image6.jpg': new Audio('sounds/image6.mp3'),
    'img/image7.jpg': new Audio('sounds/image7.mp3'),
    'img/image8.jpg': new Audio('sounds/image8.mp3'),
    'img/image9.jpg': new Audio('sounds/image9.mp3'),
    'img/image10.jpg': new Audio('sounds/image10.mp3'),
    'img/image11.jpg': new Audio('sounds/image11.mp3'),
    'img/image12.jpg': new Audio('sounds/image12.mp3'),
    'img/image13.jpg': new Audio('sounds/image13.mp3'),
    'img/image14.jpg': new Audio('sounds/image14.mp3')
};

// Lista de todas las imágenes posibles (incluye todas las imágenes de todos los niveles)
const allImages = [
    'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg', 'img/image4.jpg',
    'img/image5.jpg', 'img/image6.jpg', 'img/image7.jpg', 'img/image8.jpg',
    'img/image9.jpg', 'img/image10.jpg', 'img/image11.jpg', 'img/image12.jpg',
    'img/image13.jpg', 'img/image14.jpg',
    'img/back.jpg' // Incluye la imagen de fondo de las cartas
];

// Función para precargar imágenes con promesa
function preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        });
    });

    return Promise.all(promises);
}

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
    imagesArray = getImagesForLevel(currentLevel);
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
    updateLevelDisplay();
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

        // Reproducir el sonido específico de la imagen acertada
        const matchedImage = firstCard.dataset.image;
        if (soundMap[matchedImage]) {
            soundMap[matchedImage].play();
        }

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
    const screenWidth = window.innerWidth;

    switch (currentLevel) {
        case 1:
            columns = screenWidth < 400 ? 4 : 4;
            break;
        case 2:
            columns = screenWidth < 400 ? 5 : 5;
            break;
        case 3:
            columns = screenWidth < 400 ? 3 : 6;
            break;
        case 4:
            columns = screenWidth < 400 ? 4 : 7;
            break;
        default:
            columns = 4;
    }

    board.style.gridTemplateColumns = `repeat(${columns}, minmax(45px, 1fr))`;
    board.style.maxWidth = `100%`;
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

    nextLevelButton.disabled = currentLevel === 4;

    gameOverOverlay.style.display = 'flex';
    setTimeout(() => {
        gameOverOverlay.classList.add('active');
    }, 10);
}

function closeGameOver() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    gameOverOverlay.classList.remove('active');
    setTimeout(() => {
        gameOverOverlay.style.display = 'none';
        restartGame();
    }, 300);
}

function goToNextLevel() {
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    if (currentLevel < 4) {
        currentLevel++;
        gameOverOverlay.classList.remove('active');
        setTimeout(() => {
            gameOverOverlay.style.display = 'none';
            changeLevel(currentLevel);
        }, 300);
    }
}

window.onload = function () {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    preloadImages(allImages)
        .then(() => {
            // Ocultar el overlay de carga cuando todas las imágenes estén listas
            loadingOverlay.style.display = 'none';
            addLevelControls();
            loadPlayerName();
            createBoard();
            updateMatchesText();
            updateLevelDisplay();
        })
        .catch(err => {
            console.error('Error al precargar imágenes:', err);
            // En caso de error, aún mostramos el juego
            loadingOverlay.style.display = 'none';
            addLevelControls();
            loadPlayerName();
            createBoard();
            updateMatchesText();
            updateLevelDisplay();
        });
};