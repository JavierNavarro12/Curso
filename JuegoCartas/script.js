let playerName = "Anónimo";
let lastMatchTime = 0;
const imagesArray = [
    'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg', 'img/image4.jpg',
    'img/image5.jpg', 'img/image6.jpg', 'img/image7.jpg', 'img/image8.jpg',
    'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg', 'img/image4.jpg',
    'img/image5.jpg', 'img/image6.jpg', 'img/image7.jpg', 'img/image8.jpg'
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

function createInitialBoard() {
    shuffle(imagesArray);
    board.innerHTML = '';
    imagesArray.forEach((image, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.dataset.image = image;
        cardElement.style.backgroundImage = "url('img/back.jpg')";
        cardElement.onerror = function() {
            this.style.backgroundColor = "#ccc";
            console.error("Error cargando imagen de fondo");
        };
        board.appendChild(cardElement);
    });
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
    matchesDisplay.textContent = `Aciertos: ${totalMatches}/8`;
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
        matchesDisplay.textContent = `Aciertos: ${totalMatches}/8`;
        flippedCards = [];

        if (matchedCards.length === imagesArray.length) {
            clearInterval(timerInterval);
            saveScore();
            setTimeout(() => {
                alert(`¡Ganaste ${playerName}!\nPuntos: ${score}\nTiempo: ${timer} segundos\nAciertos: ${totalMatches}/8`);
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
}

function saveScore() {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({
        player: playerName,
        score: score,
        time: timer,
        matches: totalMatches,
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
        row.insertCell(2).textContent = `${entry.time}s (${entry.matches}/8)`;

        let deleteCell = row.insertCell(3);
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

// Inicialización
loadPlayerName();
createInitialBoard();
updateScoreboard();
