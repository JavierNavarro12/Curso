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

const additionalPairsLevel2 = [
    'img/image9.jpg', 'img/image10.jpg'
];

const additionalPairsLevel3 = [
    'img/image11.jpg', 'img/image12.jpg', 'img/image13.jpg', 'img/image14.jpg'
];

function getImagesForLevel(level) {
    let images = [...basePairs];
    
    if (level >= 2) {
        images = [...images, ...additionalPairsLevel2];
    }
    if (level >= 3) {
        // Asegúrate de que solo haya 12 parejas (24 cartas en total)
        images = [...images, ...additionalPairsLevel3].slice(0, 12);  // Limitar a 12 parejas
    }
    
    // Duplicar para hacer parejas
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
    shuffle(imagesArray);
    board.innerHTML = '';
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
            setTimeout(() => {
                alert(`¡Ganaste ${playerName}!\nPuntos: ${score}\nTiempo: ${timer} segundos\nAciertos: ${totalMatches}/${getTotalPairs()}`);
            }, 500);
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
        level: currentLevel,  // Agregar el nivel
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
        row.insertCell(3).textContent = `Nivel ${entry.level}`;  // Mostrar el nivel

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
    // Configuración fija de columnas por nivel
    let columns;
    switch(currentLevel) {
        case 1: columns = 4; break;
        case 2: columns = 5; break;
        case 3: columns = 6; break;
        default: columns = 4;
    }
    
    // Asegurar que el tablero tenga el ancho suficiente
    board.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
    board.style.maxWidth = `${columns * 110}px`; // 100px + 10px de gap
}

function updateMatchesText() {
    matchesDisplay.textContent = `Aciertos: ${totalMatches}/${getTotalPairs()}`;
}

window.changeLevel = function (newLevel) {
    currentLevel = newLevel;
    imagesArray = getImagesForLevel(currentLevel);
    createBoard();
    updateBoardSize();
    updateMatchesText();
}

window.addLevelControls = function () {
    const buttonsContainer = document.querySelector('.buttons-container');
    
    const levelControls = document.createElement('div');
    levelControls.classList.add('level-controls');
    
    const prevButton = document.createElement('button');
    prevButton.textContent = "Nivel Anterior";
    prevButton.onclick = () => currentLevel > 1 && changeLevel(currentLevel - 1);
    prevButton.classList.add('level-button');
    
    const nextButton = document.createElement('button');
    nextButton.textContent = "Nivel Siguiente";
    nextButton.onclick = () => currentLevel < 3 && changeLevel(currentLevel + 1);
    nextButton.classList.add('level-button');
    
    levelControls.appendChild(prevButton);
    levelControls.appendChild(nextButton);
    buttonsContainer.appendChild(levelControls);
    
    updateLevelDisplay();
};

window.updateLevelDisplay = function () {
    const levelDisplay = document.getElementById('levelDisplay');
    if (levelDisplay) {
        levelDisplay.textContent = `Nivel: ${currentLevel}`;
    }
};

window.onload = function () {
    addLevelControls();
    loadPlayerName();
    createBoard();
    updateMatchesText();
};