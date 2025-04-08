const bird = document.getElementById('bird');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const coinsDisplay = document.getElementById('coins');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const totalCoinsDisplay = document.getElementById('total-coins');
const restartButton = document.getElementById('restart-button');
const menu = document.getElementById('menu');
const gameContainer = document.querySelector('.game-container');
const playButton = document.getElementById('play-button');
const shopButton = document.getElementById('shop-button');
const characterOptions = document.querySelectorAll('.character-option');
const bodyColorInput = document.getElementById('body-color');
const wingsColorInput = document.getElementById('wings-color');
const customizeCharacterButton = document.getElementById('customize-character-button');
const customizationMenu = document.getElementById('customization-menu');
const confirmCustomization = document.getElementById('confirm-customization');
const backToMenu = document.getElementById('back-to-menu');
const equipMenu = document.getElementById('equip-menu');
const equipOptions = document.getElementById('equip-options');
const equipBirdSizeInput = document.getElementById('equip-bird-size');
const confirmEquip = document.getElementById('confirm-equip');
const backToSelection = document.getElementById('back-to-selection');
const customBirdPreview = document.getElementById('custom-bird-preview');
const highScoresTableBody = document.querySelector('#high-scores-table tbody');
const shopMenu = document.getElementById('shop-menu');
const shopItemsContainer = document.getElementById('shop-items');
const shopCoinsDisplay = document.getElementById('shop-coins');
const backToMenuFromShop = document.getElementById('back-to-menu-from-shop');

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
let pipeIntervalTime = 2000; // Intervalo entre tuberías (inicial)
const birdX = 150; // Posición fija del pájaro en el eje X

let currentDifficultyLevel = 0; // Nivel de dificultad actual
let pipeInterval = null; // Inicializamos como null para evitar intervalos duplicados
let selectedCharacter = localStorage.getItem('selectedCharacter') || null; // Personaje seleccionado (persistente)
let birdSize = 30; // Tamaño del pájaro (se ajustará en el menú de equipamiento)
let hasCustomized = JSON.parse(localStorage.getItem('hasCustomized')) || false; // Bandera para saber si el jugador ha personalizado el personaje
let characterSelected = JSON.parse(localStorage.getItem('characterSelected')) || false; // Bandera para saber si ya se ha seleccionado un personaje

// Mejores puntuaciones (persistentes)
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Elementos desbloqueados (persistentes)
let unlockedItems = JSON.parse(localStorage.getItem('unlockedItems')) || {
  'wings-style-0': true, // Alas por defecto desbloqueadas
  'wings-style-1': false,
  'wings-style-2': false,
  'wings-style-3': false,
  'pipe-style-1': false,
  'pipe-style-2': false,
  'pipe-style-3': false,
  'character-1': true, // Personaje 1 desbloqueado por defecto
  'character-2': false,
  'character-3': false,
  'character-4': false,
  'character-5': false,
  'trail-effect-1': false,
  'trail-effect-2': false,
  'trail-effect-3': false
};

// Ítems equipados (persistentes)
let equippedItems = JSON.parse(localStorage.getItem('equippedItems')) || {
  'wings-style': 'wings-style-0', // Alas por defecto equipadas inicialmente
  'pipe-style': null,
  'trail-effect': null
};

// Precios de los ítems en la tienda (nombres ajustados)
const shopItems = {
  'wings-style-0': { price: 0, description: 'Alas 🪽', type: 'wings-style', value: 'default' }, // Alas por defecto
  'wings-style-1': { price: 15, description: 'Alas Doradas 🪶', type: 'wings-style', value: 'golden' },
  'wings-style-2': { price: 20, description: 'Alas Demoníacas 👹', type: 'wings-style', value: 'demonic' },
  'wings-style-3': { price: 25, description: 'Alas de Fuego 🔥', type: 'wings-style', value: 'fire' },
  'pipe-style-1': { price: 20, description: 'Tuberías Metálicas 🛠️', type: 'pipe-style', value: 'metallic' },
  'pipe-style-2': { price: 25, description: 'Tuberías de Cristal 💎', type: 'pipe-style', value: 'crystal' },
  'pipe-style-3': { price: 30, description: 'Tuberías de Madera 🌳', type: 'pipe-style', value: 'wood' },
  'character-2': { price: 25, description: 'Personaje 2 🐤', type: 'character' },
  'character-3': { price: 25, description: 'Personaje 3 🐥', type: 'character' },
  'character-4': { price: 25, description: 'Personaje 4 🐧', type: 'character' },
  'character-5': { price: 25, description: 'Personaje 5 🦅', type: 'character' },
  'trail-effect-1': { price: 30, description: 'Efecto de rastro (Estrellas) ✨', type: 'trail-effect', value: 'stars' },
  'trail-effect-2': { price: 35, description: 'Efecto de rastro (Corazones) 💕', type: 'trail-effect', value: 'hearts' },
  'trail-effect-3': { price: 40, description: 'Efecto de rastro (Fuego) 🔥', type: 'trail-effect', value: 'fire' }
};

// Datos de los personajes predefinidos (con colores de alas únicos)
const predefinedCharacters = {
  1: {
    bodyColor: '#FF6347', // Tomate
    wingsColor: '#FF4500', // Naranja rojizo (color único para las alas)
    size: 30, // Tamaño inicial (ajustable)
    image: 'img/character1.png'
  },
  2: {
    bodyColor: '#4682B4', // Azul acero
    wingsColor: '#4169E1', // Azul real (color único para las alas)
    size: 35, // Tamaño inicial (ajustable)
    image: 'img/character2.png'
  },
  3: {
    bodyColor: '#32CD32', // Verde lima
    wingsColor: '#228B22', // Verde bosque (color único para las alas)
    size: 25, // Tamaño inicial (ajustable)
    image: 'img/character3.png'
  },
  4: {
    bodyColor: '#FFD700', // Dorado
    wingsColor: '#FFA500', // Naranja (color único para las alas)
    size: 30, // Tamaño inicial (ajustable)
    image: 'img/character4.png'
  },
  5: {
    bodyColor: '#EE82EE', // Violeta
    wingsColor: '#DA70D6', // Orquídea (color único para las alas)
    size: 28, // Tamaño inicial (ajustable)
    image: 'img/character5.png'
  }
};

// Actualizar la vista previa del personaje personalizado
function updateCustomBirdPreview() {
  const bodyColor = hasCustomized ? bodyColorInput.value : '#FFD700'; // Usar color predeterminado si no se ha personalizado
  const wingsColor = hasCustomized ? wingsColorInput.value : '#FFFFFF'; // Usar color predeterminado si no se ha personalizado

  customBirdPreview.style.background = bodyColor;
  customBirdPreview.style.width = `${birdSize}px`;
  customBirdPreview.style.height = `${birdSize}px`;
  customBirdPreview.style.setProperty('--wings-color', wingsColor);

  // Aplicar estilo de alas equipado en la vista previa
  customBirdPreview.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2', 'wings-style-3');
  if (equippedItems['wings-style']) {
    const style = shopItems[equippedItems['wings-style']].value;
    if (style === 'default') {
      customBirdPreview.classList.add('wings-style-0');
    }
    if (style === 'golden') {
      customBirdPreview.classList.add('wings-style-1');
    }
    if (style === 'demonic') {
      customBirdPreview.classList.add('wings-style-2');
    }
    if (style === 'fire') {
      customBirdPreview.classList.add('wings-style-3');
    }
  }
}

// Actualizar el estado de los personajes predefinidos (bloqueados/desbloqueados y seleccionado)
function updateCharacterOptions() {
  characterOptions.forEach(option => {
    const characterId = option.getAttribute('data-character');
    if (unlockedItems[`character-${characterId}`]) {
      option.classList.add('unlocked');
    } else {
      option.classList.remove('unlocked');
    }
    // Resaltar el personaje seleccionado
    if (selectedCharacter === characterId) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

// Actualizar la sección de equipar ítems
function updateEquipOptions() {
  equipOptions.innerHTML = ''; // Limpiar opciones actuales

  Object.keys(unlockedItems).forEach(item => {
    if (unlockedItems[item] && shopItems[item] && shopItems[item].type && shopItems[item].type !== 'character') {
      const equipItem = document.createElement('div');
      equipItem.classList.add('equip-item');

      const itemName = document.createElement('p');
      itemName.textContent = shopItems[item].description;
      equipItem.appendChild(itemName);

      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '5px';

      const equipButton = document.createElement('button');
      equipButton.classList.add('equip-button');
      equipButton.textContent = equippedItems[shopItems[item].type] === item ? 'Equipado' : 'Equipar';
      if (equippedItems[shopItems[item].type] === item) {
        equipButton.classList.add('active');
      }
      equipButton.addEventListener('click', () => {
        equippedItems[shopItems[item].type] = item;
        localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
        updateEquipOptions();
        applyCharacter(); // Actualizar el pájaro con los ítems equipados
        updateCustomBirdPreview(); // Actualizar la vista previa
      });

      const unequipButton = document.createElement('button');
      unequipButton.classList.add('unequip-button');
      unequipButton.textContent = 'Desequipar';
      unequipButton.disabled = equippedItems[shopItems[item].type] !== item;
      unequipButton.addEventListener('click', () => {
        equippedItems[shopItems[item].type] = 'wings-style-0'; // Volver a las alas por defecto
        localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
        updateEquipOptions();
        applyCharacter(); // Actualizar el pájaro con los ítems equipados
        updateCustomBirdPreview(); // Actualizar la vista previa
      });

      buttonContainer.appendChild(equipButton);
      buttonContainer.appendChild(unequipButton);
      equipItem.appendChild(buttonContainer);
      equipOptions.appendChild(equipItem);
    }
  });
}

// Actualizar la tabla de mejores puntuaciones
function updateHighScores() {
  // Añadir la puntuación actual a la lista
  const now = new Date();
  const dateString = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
  highScores.push({ score: score, date: dateString });

  // Ordenar las puntuaciones de mayor a menor
  highScores.sort((a, b) => b.score - a.score);

  // Mantener solo las 5 mejores puntuaciones
  highScores = highScores.slice(0, 5);

  // Guardar en localStorage
  localStorage.setItem('highScores', JSON.stringify(highScores));

  // Actualizar la tabla
  highScoresTableBody.innerHTML = '';
  highScores.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.score}</td>
      <td>${entry.date}</td>
    `;
    highScoresTableBody.appendChild(row);
  });
}

// Actualizar la tienda
function updateShop() {
  shopCoinsDisplay.textContent = totalCoins;
  shopItemsContainer.innerHTML = ''; // Limpiar ítems actuales

  Object.keys(shopItems).forEach(item => {
    const shopItem = document.createElement('div');
    shopItem.classList.add('shop-item');

    const itemName = document.createElement('p');
    itemName.textContent = `${shopItems[item].description} - ${shopItems[item].price} monedas`;
    shopItem.appendChild(itemName);

    const buyButton = document.createElement('button');
    buyButton.textContent = unlockedItems[item] ? 'Comprado' : 'Comprar';
    buyButton.disabled = unlockedItems[item] || totalCoins < shopItems[item].price;
    buyButton.addEventListener('click', () => {
      if (totalCoins >= shopItems[item].price) {
        totalCoins -= shopItems[item].price;
        localStorage.setItem('totalCoins', totalCoins);
        unlockedItems[item] = true;
        localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
        updateShop();
        updateCharacterOptions();
        updateEquipOptions();
      }
    });

    shopItem.appendChild(buyButton);
    shopItemsContainer.appendChild(shopItem);
  });
}

// Seleccionar un personaje predefinido
characterOptions.forEach(option => {
  option.addEventListener('click', () => {
    const characterId = option.getAttribute('data-character');
    if (!unlockedItems[`character-${characterId}`]) {
      alert('¡Este personaje está bloqueado! Desbloquéalo en la tienda. 🏪');
      return;
    }
    selectedCharacter = characterId;
    localStorage.setItem('selectedCharacter', selectedCharacter); // Guardar en localStorage
    const character = predefinedCharacters[selectedCharacter];
    birdSize = character.size;
    equipBirdSizeInput.value = birdSize;
    hasCustomized = false; // Resetear personalización si se elige un personaje predefinido
    localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
    updateCharacterOptions(); // Actualizar la interfaz para reflejar la selección
    menu.classList.add('hidden');
    equipMenu.classList.remove('hidden');
    updateEquipOptions();
  });
});

// Abrir el menú de personalización para el personaje personalizado
customizeCharacterButton.addEventListener('click', () => {
  selectedCharacter = null;
  localStorage.setItem('selectedCharacter', selectedCharacter); // Guardar en localStorage
  updateCharacterOptions(); // Actualizar la interfaz para reflejar la selección
  menu.classList.add('hidden');
  customizationMenu.classList.remove('hidden');
  
  // Restablecer las alas en la vista previa al abrir el menú de personalización
  customBirdPreview.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2', 'wings-style-3');
  updateCustomBirdPreview();
});

// Confirmar personalización y pasar al menú de equipamiento
confirmCustomization.addEventListener('click', () => {
  hasCustomized = true; // Marcar que el jugador ha personalizado
  localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
  customizationMenu.classList.add('hidden');
  equipMenu.classList.remove('hidden');
  updateEquipOptions();
});

// Volver al menú inicial desde el menú de personalización
backToMenu.addEventListener('click', () => {
  customizationMenu.classList.add('hidden');
  menu.classList.remove('hidden');
});

// Confirmar equipamiento y habilitar el botón de jugar
confirmEquip.addEventListener('click', () => {
  birdSize = equipBirdSizeInput.value;
  applyCharacter();
  equipMenu.classList.add('hidden');
  menu.classList.remove('hidden');
  playButton.disabled = false;
  characterSelected = true; // Marcar que ya se ha seleccionado un personaje
  localStorage.setItem('characterSelected', JSON.stringify(characterSelected));
});

// Volver a la selección de personajes desde el menú de equipamiento
backToSelection.addEventListener('click', () => {
  equipMenu.classList.add('hidden');
  menu.classList.remove('hidden');
  playButton.disabled = !characterSelected; // Mantener el botón habilitado si ya hay un personaje seleccionado
});

// Actualizar la vista previa al cambiar las opciones de personalización
bodyColorInput.addEventListener('input', updateCustomBirdPreview);
wingsColorInput.addEventListener('input', updateCustomBirdPreview);

// Abrir el menú de la tienda
shopButton.addEventListener('click', () => {
  menu.classList.add('hidden');
  shopMenu.classList.remove('hidden');
  updateShop();
});

// Volver al menú inicial desde la tienda
backToMenuFromShop.addEventListener('click', () => {
  shopMenu.classList.add('hidden');
  menu.classList.remove('hidden');
});

// Aplicar el personaje seleccionado o personalizado al pájaro
function applyCharacter() {
  let bodyColor, wingsColor, image;

  if (selectedCharacter) {
    const character = predefinedCharacters[selectedCharacter];
    bodyColor = character.bodyColor;
    wingsColor = character.wingsColor; // Usar el color de alas del personaje predefinido
    image = character.image;
  } else {
    // Usar valores predeterminados si no se ha personalizado
    bodyColor = hasCustomized ? bodyColorInput.value : '#FFD700';
    wingsColor = hasCustomized ? wingsColorInput.value : '#FFFFFF';
    image = null;
  }

  bird.style.background = image ? `url(${image})` : bodyColor;
  bird.style.backgroundSize = 'cover';
  bird.style.backgroundPosition = 'center';
  bird.style.width = `${birdSize}px`;
  bird.style.height = `${birdSize}px`;
  bird.style.setProperty('--wings-color', wingsColor);

  // Aplicar estilo de alas equipado (para todos los personajes)
  bird.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2', 'wings-style-3');
  if (equippedItems['wings-style']) {
    const style = shopItems[equippedItems['wings-style']].value;
    if (style === 'default') {
      bird.classList.add('wings-style-0');
    }
    if (style === 'golden') {
      bird.classList.add('wings-style-1');
    }
    if (style === 'demonic') {
      bird.classList.add('wings-style-2');
    }
    if (style === 'fire') {
      bird.classList.add('wings-style-3');
    }
  }

  // Aplicar efecto de rastro equipado
  const trail = bird.querySelector('.trail');
  trail.classList.remove('trail-effect-1', 'trail-effect-2', 'trail-effect-3');
  trail.style.display = 'none';
  if (equippedItems['trail-effect']) {
    const effect = shopItems[equippedItems['trail-effect']].value;
    if (effect === 'stars') {
      trail.classList.add('trail-effect-1');
      trail.style.display = 'block';
    }
    if (effect === 'hearts') {
      trail.classList.add('trail-effect-2');
      trail.style.display = 'block';
    }
    if (effect === 'fire') {
      trail.classList.add('trail-effect-3');
      trail.style.display = 'block';
    }
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

  // Aplicar estilo de tuberías equipado
  if (equippedItems['pipe-style']) {
    const style = shopItems[equippedItems['pipe-style']].value;
    if (style === 'metallic') {
      pipeTop.classList.add('pipe-style-1');
      pipeBottom.classList.add('pipe-style-1');
    } else if (style === 'crystal') {
      pipeTop.classList.add('pipe-style-2');
      pipeBottom.classList.add('pipe-style-2');
    } else if (style === 'wood') {
      pipeTop.classList.add('pipe-style-3');
      pipeBottom.classList.add('pipe-style-3');
    }
  }

  // Si la velocidad es 50 o más, hay un 30% de probabilidad de que las tuberías sean móviles
  let isMoving = false;
  if (pipeSpeed >= 50 && Math.random() < 0.3) {
    isMoving = true;
  }

  gameArea.appendChild(pipeTop);
  gameArea.appendChild(pipeBottom);

  pipes.push({ top: pipeTop, bottom: pipeBottom, x: gameWidth, passed: false, isMoving: isMoving, baseHeight: pipeHeight, moveOffset: 0, moveTime: Date.now() });
  console.log(`Nueva tubería creada: isMoving=${isMoving}, baseHeight=${pipeHeight}`);

  // Generar una moneda con un 50% de probabilidad
  if (Math.random() > 0.5) {
    createCoin(gameWidth, pipeHeight);
  }
}

// Ajustar la dificultad según la puntuación
function adjustDifficulty() {
  // Aumentar velocidad cada 5 puntos, sin límite
  const newPipeSpeed = 2 + Math.floor(score / 5) * 0.5; // Aumenta 0.5 unidades cada 5 puntos

  // Solo actualizar si la velocidad ha cambiado
  if (newPipeSpeed !== pipeSpeed) {
    pipeSpeed = newPipeSpeed;
    // Ajustar el intervalo entre tuberías y el hueco según la velocidad
    pipeIntervalTime = 2000 - (pipeSpeed - 2) * 20; // Reducir intervalo con la velocidad
    pipeGap = Math.max(100, 200 - (pipeSpeed - 2) * 2); // Reducir hueco con la velocidad, con un mínimo de 100
    if (pipeInterval) {
      clearInterval(pipeInterval);
    }
    pipeInterval = setInterval(() => {
      if (gameActive) {
        createPipe();
      }
    }, pipeIntervalTime);
    console.log(`Dificultad ajustada: pipeSpeed=${pipeSpeed}, pipeIntervalTime=${pipeIntervalTime}, pipeGap=${pipeGap}`);
  }
}

// Mover las tuberías y detectar colisiones
function movePipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    pipe.top.style.left = `${pipe.x}px`;
    pipe.bottom.style.left = `${pipe.x}px`;

    // Ajustar la altura de las tuberías móviles para mantener el hueco constante
    if (pipe.isMoving) {
      // Calcular el tiempo transcurrido desde la creación de la tubería
      const elapsedTime = (Date.now() - pipe.moveTime) % 2000; // Ciclo de 2 segundos
      const progress = elapsedTime / 2000; // Progreso de 0 a 1
      // Usar una función sinusoidal para un movimiento suave
      pipe.moveOffset = 50 * Math.sin(progress * 2 * Math.PI); // Amplitud de 50px

      // Ajustar la altura de las tuberías
      const newTopHeight = pipe.baseHeight + pipe.moveOffset;
      const newBottomHeight = gameHeight - newTopHeight - pipeGap;

      // Asegurar que las alturas sean válidas
      if (newTopHeight >= 50 && newBottomHeight >= 50) {
        pipe.top.style.height = `${newTopHeight}px`;
        pipe.bottom.style.height = `${newBottomHeight}px`;
      } else {
        console.warn(`Altura inválida: topHeight=${newTopHeight}, bottomHeight=${newBottomHeight}`);
      }
    }

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
      console.log('Colisión con tubería detectada');
      console.log(`Bird: left=${birdLeft}, right=${birdRight}, top=${birdTop}, bottom=${birdBottom}`);
      console.log(`Pipe: left=${pipeLeft}, right=${pipeRight}, topBottom=${pipeTopBottom}, bottomTop=${pipeBottomTop}`);
      endGame();
      return; // Salir del bucle para evitar múltiples colisiones
    }

    if (birdY <= 0 || birdY >= gameHeight - parseInt(bird.style.height)) {
      console.log('Colisión con los límites del área de juego detectada');
      endGame();
      return; // Salir del bucle para evitar múltiples colisiones
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
  console.log('Game Over triggered');
  gameActive = false;
  finalScoreDisplay.textContent = score;
  totalCoins += coins;
  localStorage.setItem('totalCoins', totalCoins);
  totalCoinsDisplay.textContent = totalCoins;
  updateHighScores(); // Actualizar las mejores puntuaciones

  // Mostrar la pantalla de Game Over
  gameArea.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  menu.classList.add('hidden');
  customizationMenu.classList.add('hidden');
  equipMenu.classList.add('hidden');
  shopMenu.classList.add('hidden');
  gameContainer.classList.remove('hidden');

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
  pipeIntervalTime = 2000;
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
  gameContainer.classList.add('hidden');
  menu.classList.remove('hidden');
  playButton.disabled = !characterSelected; // Mantener el botón habilitado si ya hay un personaje seleccionado
});

// Inicializar la vista previa del personaje personalizado y las mejores puntuaciones
updateCustomBirdPreview();
updateHighScores();
updateCharacterOptions(); // Asegurar que el personaje 1 esté desbloqueado y el seleccionado se resalte
playButton.disabled = !characterSelected; // Habilitar el botón de jugar si ya hay un personaje seleccionado