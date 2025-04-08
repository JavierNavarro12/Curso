const bird = document.getElementById('bird');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const coinsDisplay = document.getElementById('coins');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const totalCoinsDisplay = document.getElementById('total-coins');
const shopCoinsDisplay = document.getElementById('shop-coins');
const restartButton = document.getElementById('restart-button');
const menu = document.getElementById('menu');
const gameContainer = document.querySelector('.game-container');
const playButton = document.getElementById('play-button');
const characterOptions = document.querySelectorAll('.character-option');
const bodyColorInput = document.getElementById('body-color');
const wingsColorInput = document.getElementById('wings-color');
const birdSizeInput = document.getElementById('bird-size');
const predefinedBirdSizeInput = document.getElementById('predefined-bird-size');
const customBirdPreview = document.getElementById('custom-bird-preview');
const buyButtons = document.querySelectorAll('.buy-button');

let birdY = 250; // Posición inicial del pájaro (centro vertical)
let gravity = 0.2; // Gravedad
let velocity = 0; // Velocidad vertical del pájaro
let jump = -6; // Fuerza del salto
let maxVelocity = 8; // Límite para la velocidad vertical
let score = 0;
let coins = 0; // Contador de monedas en la partida actual
let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0; // Monedas totales (persistentes)
let gameActive = false;
let pipes = [];
let coinsInGame = []; // Array para las monedas en el juego

const gameHeight = 500; // Altura del área de juego
const gameWidth = 800; // Ancho del área de juego
const pipeWidth = 30; // Ancho de las tuberías
let pipeGap = 200; // Hueco entre las tuberías (inicial)
let pipeSpeed = 2; // Velocidad de las tuberías (inicial)
let pipeIntervalTime = 3000; // Intervalo entre tuberías (inicial, en milisegundos)
const birdX = 150; // Posición fija del pájaro en el eje X

let currentDifficultyLevel = 0; // Nivel de dificultad actual (0 a 5)
let pipeInterval = null; // Inicializamos como null para evitar intervalos duplicados
let selectedCharacter = null; // Personaje seleccionado (null si se usa personalización)

// Elementos desbloqueados (persistentes)
let unlockedItems = JSON.parse(localStorage.getItem('unlockedItems')) || {
  'body-color-1': false,
  'wings-style-1': false,
  'pipe-style-1': false,
  'character-1': false,
  'character-2': false,
  'character-3': false,
  'character-4': false,
  'character-5': false,
  'trail-effect-1': false
};

// Precios de los ítems en la tienda
const shopItems = {
  'body-color-1': { price: 10, description: 'Nuevo color de cuerpo (Rojo)' },
  'wings-style-1': { price: 15, description: 'Nuevo estilo de alas (Elegante)' },
  'pipe-style-1': { price: 20, description: 'Nuevo estilo de tuberías (Metálico)' },
  'character-1': { price: 25, description: 'Personaje 1' },
  'character-2': { price: 25, description: 'Personaje 2' },
  'character-3': { price: 25, description: 'Personaje 3' },
  'character-4': { price: 25, description: 'Personaje 4' },
  'character-5': { price: 25, description: 'Personaje 5' },
  'trail-effect-1': { price: 30, description: 'Efecto de rastro (Estrellas)' }
};

// Datos de los personajes predefinidos
const predefinedCharacters = {
  1: {
    bodyColor: '#FF6347', // Tomate
    wingsColor: '#FF4500', // Naranja rojizo
    size: 30, // Tamaño inicial (ajustable)
    image: 'img/character1.png'
  },
  2: {
    bodyColor: '#4682B4', // Azul acero
    wingsColor: '#4169E1', // Azul real
    size: 35, // Tamaño inicial (ajustable)
    image: 'img/character2.png'
  },
  3: {
    bodyColor: '#32CD32', // Verde lima
    wingsColor: '#228B22', // Verde bosque
    size: 25, // Tamaño inicial (ajustable)
    image: 'img/character3.png'
  },
  4: {
    bodyColor: '#FFD700', // Dorado
    wingsColor: '#FFA500', // Naranja
    size: 30, // Tamaño inicial (ajustable)
    image: 'img/character4.png'
  },
  5: {
    bodyColor: '#EE82EE', // Violeta
    wingsColor: '#DA70D6', // Orquídea
    size: 28, // Tamaño inicial (ajustable)
    image: 'img/character5.png'
  }
};

// Actualizar la vista previa del personaje personalizado
function updateCustomBirdPreview() {
  const bodyColor = bodyColorInput.value;
  const wingsColor = wingsColorInput.value;
  const size = birdSizeInput.value;

  customBirdPreview.style.background = bodyColor;
  customBirdPreview.style.width = `${size}px`;
  customBirdPreview.style.height = `${size}px`;
  customBirdPreview.style.setProperty('--wings-color', wingsColor);
}

// Actualizar el estado de los personajes predefinidos (bloqueados/desbloqueados)
function updateCharacterOptions() {
  characterOptions.forEach(option => {
    const characterId = option.getAttribute('data-character');
    if (unlockedItems[`character-${characterId}`]) {
      option.classList.add('unlocked');
    } else {
      option.classList.remove('unlocked');
    }
  });
}

// Seleccionar un personaje predefinido y actualizar el control de tamaño
characterOptions.forEach(option => {
  option.addEventListener('click', () => {
    const characterId = option.getAttribute('data-character');
    if (!unlockedItems[`character-${characterId}`]) {
      alert('¡Este personaje está bloqueado! Desbloquéalo en la tienda. 🏪');
      return;
    }
    characterOptions.forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');
    selectedCharacter = characterId;
    const character = predefinedCharacters[selectedCharacter];
    predefinedBirdSizeInput.value = character.size;
  });
});

// Actualizar la vista previa al cambiar las opciones de personalización
bodyColorInput.addEventListener('input', updateCustomBirdPreview);
wingsColorInput.addEventListener('input', updateCustomBirdPreview);
birdSizeInput.addEventListener('input', updateCustomBirdPreview);

// Aplicar el personaje seleccionado o personalizado al pájaro
function applyCharacter() {
  let bodyColor, wingsColor, size, image;

  if (selectedCharacter) {
    const character = predefinedCharacters[selectedCharacter];
    bodyColor = character.bodyColor;
    wingsColor = character.wingsColor;
    size = predefinedBirdSizeInput.value;
    image = character.image;
  } else {
    bodyColor = bodyColorInput.value;
    wingsColor = wingsColorInput.value;
    size = birdSizeInput.value;
    image = null;
  }

  // Aplicar ítems desbloqueados
  if (unlockedItems['body-color-1'] && !selectedCharacter) {
    bodyColor = '#FF0000'; // Rojo (ítem desbloqueado)
  }

  bird.style.background = image ? `url(${image})` : bodyColor;
  bird.style.backgroundSize = 'cover';
  bird.style.backgroundPosition = 'center';
  bird.style.width = `${size}px`;
  bird.style.height = `${size}px`;
  bird.style.setProperty('--wings-color', wingsColor);

  // Aplicar efecto de rastro si está desbloqueado
  if (unlockedItems['trail-effect-1']) {
    bird.classList.add('trail-effect-1');
  } else {
    bird.classList.remove('trail-effect-1');
  }
}

// Generar una moneda en el centro del hueco entre las tuberías
function createCoin(pipeX, pipeHeight) {
  const coinY = pipeHeight + pipeGap / 2; // Centro del hueco entre las tuberías
  const coin = document.createElement('div');
  coin.classList.add('coin');
  coin.style.left = `${pipeX + pipeWidth + 50}px`; // Aparece después de la tubería
  coin.style.top = `${coinY}px`;
  gameArea.appendChild(coin);
  coinsInGame.push({ element: coin, x: pipeX + pipeWidth + 50, y: coinY });
}

// Mover las monedas y detectar colisiones
function moveCoins() {
  coinsInGame.forEach((coin, index) => {
    coin.x -= pipeSpeed;
    coin.element.style.left = `${coin.x}px`;

    // Detectar colisión con el pájaro
    const birdRect = bird.getBoundingClientRect();
    const coinRect = coin.element.getBoundingClientRect();

    if (
      birdRect.right > coinRect.left &&
      birdRect.left < coinRect.right &&
      birdRect.bottom > coinRect.top &&
      birdRect.top < coinRect.bottom
    ) {
      coins++;
      coinsDisplay.textContent = coins;
      coin.element.remove();
      coinsInGame.splice(index, 1);
    }

    // Eliminar monedas que salen de la pantalla
    if (coin.x < -15) {
      coin.element.remove();
      coinsInGame.splice(index, 1);
    }
  });
}

// Generar una nueva tubería
function createPipe() {
  const minHeight = 50;
  const maxHeight = gameHeight - pipeGap - 50;
  const pipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;

  const pipeTop = document.createElement('div');
  pipeTop.classList.add('pipe', 'top');
  pipeTop.style.height = `${pipeHeight}px`;
  pipeTop.style.left = `${gameWidth}px`;

  const pipeBottom = document.createElement('div');
  pipeBottom.classList.add('pipe', 'bottom');
  pipeBottom.style.height = `${gameHeight - pipeHeight - pipeGap}px`;
  pipeBottom.style.left = `${gameWidth}px`;

  // Aplicar estilo desbloqueado a las tuberías
  if (unlockedItems['pipe-style-1']) {
    pipeTop.style.background = 'linear-gradient(90deg, #4A4A4A, #6A6A6A)';
    pipeBottom.style.background = 'linear-gradient(90deg, #4A4A4A, #6A6A6A)';
    pipeTop.style.borderColor = '#333';
    pipeBottom.style.borderColor = '#333';
  }

  gameArea.appendChild(pipeTop);
  gameArea.appendChild(pipeBottom);

  pipes.push({ top: pipeTop, bottom: pipeBottom, x: gameWidth, passed: false });

  // Generar una moneda con un 50% de probabilidad
  if (Math.random() > 0.5) {
    createCoin(gameWidth, pipeHeight);
  }
}

// Ajustar la dificultad según la puntuación
function adjustDifficulty() {
  const newDifficultyLevel = Math.floor(score / 10);
  if (newDifficultyLevel > 5) return;
  if (newDifficultyLevel !== currentDifficultyLevel) {
    currentDifficultyLevel = newDifficultyLevel;
    pipeSpeed = 2 + currentDifficultyLevel * 0.5;
    pipeIntervalTime = 3000 - currentDifficultyLevel * 300;
    pipeGap = 200 - currentDifficultyLevel * 10;
    if (pipeInterval) {
      clearInterval(pipeInterval);
    }
    pipeInterval = setInterval(() => {
      if (gameActive) {
        createPipe();
      }
    }, pipeIntervalTime);
  }
}

// Mover las tuberías y detectar colisiones
function movePipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    pipe.top.style.left = `${pipe.x}px`;
    pipe.bottom.style.left = `${pipe.x}px`;

    const birdRect = bird.getBoundingClientRect();
    const pipeTopRect = pipe.top.getBoundingClientRect();
    const pipeBottomRect = pipe.bottom.getBoundingClientRect();

    const birdLeft = birdRect.left;
    const birdRight = birdRect.right;
    const birdTop = birdRect.top;
    const birdBottom = birdRect.bottom;

    const pipeLeft = pipeTopRect.left;
    const pipeRight = pipeTopRect.right;
    const pipeTopBottom = pipeTopRect.bottom;
    const pipeBottomTop = pipeBottomRect.top;

    if (
      birdRight > pipeLeft &&
      birdLeft < pipeRight &&
      (birdTop < pipeTopBottom || birdBottom > pipeBottomTop)
    ) {
      endGame();
    }

    if (birdY <= 0 || birdY >= gameHeight - parseInt(bird.style.height)) {
      endGame();
    }

    if (pipe.x + pipeWidth < birdX && !pipe.passed) {
      score++;
      scoreDisplay.textContent = score;
      pipe.passed = true;
      adjustDifficulty();
    }

    if (pipe.x + pipeWidth < -pipeWidth) {
      pipe.top.remove();
      pipe.bottom.remove();
      pipes.splice(index, 1);
    }
  });
}

// Actualizar la posición del pájaro
function updateBird() {
  velocity += gravity;
  if (velocity > maxVelocity) velocity = maxVelocity;
  if (velocity < -maxVelocity) velocity = -maxVelocity;
  birdY += velocity;
  bird.style.top = `${birdY}px`;
}

// Terminar el juego
function endGame() {
  gameActive = false;
  finalScoreDisplay.textContent = score;
  totalCoins += coins;
  localStorage.setItem('totalCoins', totalCoins);
  totalCoinsDisplay.textContent = totalCoins;
  shopCoinsDisplay.textContent = totalCoins;
  updateShopButtons();

  // Mostrar la pantalla de Game Over y ocultar el área del juego y el menú
  gameOverScreen.classList.remove('hidden');
  gameArea.classList.add('hidden');
  menu.classList.add('hidden');

  // Limpiar tuberías y monedas
  pipes.forEach((pipe) => {
    pipe.top.remove();
    pipe.bottom.remove();
  });
  coinsInGame.forEach((coin) => {
    coin.element.remove();
  });
  pipes = [];
  coinsInGame = [];
  if (pipeInterval) {
    clearInterval(pipeInterval);
    pipeInterval = null;
  }
}

// Actualizar los botones de la tienda
function updateShopButtons() {
  buyButtons.forEach(button => {
    const item = button.parentElement.getAttribute('data-item');
    if (unlockedItems[item]) {
      button.textContent = 'Desbloqueado ✅';
      button.disabled = true;
    } else {
      const price = shopItems[item].price;
      button.disabled = totalCoins < price;
    }
  });
  updateCharacterOptions(); // Actualizar el estado de los personajes predefinidos
}

// Comprar ítems en la tienda
buyButtons.forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement.getAttribute('data-item');
    const price = shopItems[item].price;
    if (totalCoins >= price && !unlockedItems[item]) {
      totalCoins -= price;
      localStorage.setItem('totalCoins', totalCoins);
      unlockedItems[item] = true;
      localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
      shopCoinsDisplay.textContent = totalCoins;
      updateShopButtons();
    }
  });
});

// Iniciar el juego
function startGame() {
  gameActive = true;
  score = 0;
  coins = 0;
  scoreDisplay.textContent = score;
  coinsDisplay.textContent = coins;
  birdY = 250;
  velocity = 0;
  bird.style.top = `${birdY}px`;
  gameOverScreen.classList.add('hidden');
  gameArea.classList.remove('hidden');
  pipes = [];
  coinsInGame = [];

  pipeSpeed = 2;
  pipeIntervalTime = 3000;
  pipeGap = 200;
  currentDifficultyLevel = 0;

  if (pipeInterval) {
    clearInterval(pipeInterval);
    pipeInterval = null;
  }

  pipeInterval = setInterval(() => {
    if (gameActive) {
      createPipe();
    }
  }, pipeIntervalTime);

  function gameLoop() {
    if (gameActive) {
      updateBird();
      movePipes();
      moveCoins();
      requestAnimationFrame(gameLoop);
    }
  }
  gameLoop();
}

// Iniciar el juego al hacer clic en "Jugar"
playButton.addEventListener('click', () => {
  applyCharacter();
  menu.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  startGame(); // Iniciar el juego directamente
});

// Hacer que el pájaro salte al hacer clic o presionar la barra espaciadora
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && gameActive) {
    velocity = jump;
  }
});

document.addEventListener('click', () => {
  if (gameActive) {
    velocity = jump;
  }
});

// Event listener para el botón "Jugar de nuevo"
restartButton.addEventListener('click', () => {
  gameOverScreen.classList.add('hidden');
  gameArea.classList.add('hidden');
  menu.classList.remove('hidden');
  gameContainer.classList.add('hidden');
});

// Inicializar la vista previa del personaje personalizado y la tienda
updateCustomBirdPreview();
updateShopButtons();