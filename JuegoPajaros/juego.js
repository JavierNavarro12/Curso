document.addEventListener('DOMContentLoaded', () => {
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
  const orientationLock = document.getElementById('orientation-lock');
  const welcomeScreen = document.getElementById('welcome-screen');
  const loadingBar = document.getElementById('loading-bar');
  const loadingBarContainer = document.querySelector('.loading-bar-container');
  const startGameButton = document.getElementById('start-game-button');

  let birdY = 250;
  let gravity = 0.2;
  let velocity = 0;
  let jump = -6;
  let maxVelocity = 8;
  let score = 0;
  let coins = 0;
  let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
  let gameActive = false;
  let pipes = [];
  let coinsInGame = [];

  let gameHeight = 500;
  let gameWidth = 800;
  let pipeWidth = 30;
  let pipeGap = 200;
  let pipeSpeed = 2;
  let pipeIntervalTime = 2000;
  let birdX = 150;

  let currentDifficultyLevel = 0;
  let pipeInterval = null;
  let selectedCharacter = localStorage.getItem('selectedCharacter') || null;
  let birdSize = 30;
  let hasCustomized = JSON.parse(localStorage.getItem('hasCustomized')) || false;
  let characterSelected = JSON.parse(localStorage.getItem('characterSelected')) || false;

  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

  let unlockedItems = JSON.parse(localStorage.getItem('unlockedItems')) || {
    'wings-style-0': true,
    'wings-style-1': false,
    'wings-style-2': false,
    'pipe-style-1': false,
    'pipe-style-2': false,
    'pipe-style-3': false,
    'character-1': true,
    'character-2': false,
    'character-3': false,
    'character-4': false,
    'character-5': false,
    'trail-effect-1': false,
    'trail-effect-2': false,
    'trail-effect-3': false
  };

  if (!unlockedItems['character-1']) {
    unlockedItems['character-1'] = true;
    localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
  }

  let equippedItems = JSON.parse(localStorage.getItem('equippedItems')) || {
    'wings-style': 'wings-style-0',
    'pipe-style': null,
    'trail-effect': null
  };

  const shopItems = {
    'wings-style-0': { price: 0, description: 'Alas 🪽', type: 'wings-style', value: 'default' },
    'wings-style-1': { price: 15, description: 'Alas Doradas 🪶', type: 'wings-style', value: 'golden' },
    'wings-style-2': { price: 20, description: 'Alas Demoníacas 👹', type: 'wings-style', value: 'demonic' },
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

  const predefinedCharacters = {
    1: {
      bodyColor: '#FF6347',
      wingsColor: '#FF4500',
      size: 30,
      image: 'img/character1.png'
    },
    2: {
      bodyColor: '#4682B4',
      wingsColor: '#4169E1',
      size: 35,
      image: 'img/character2.png'
    },
    3: {
      bodyColor: '#32CD32',
      wingsColor: '#228B22',
      size: 25,
      image: 'img/character3.png'
    },
    4: {
      bodyColor: '#FFD700',
      wingsColor: '#FFA500',
      size: 30,
      image: 'img/character4.png'
    },
    5: {
      bodyColor: '#EE82EE',
      wingsColor: '#DA70D6',
      size: 28,
      image: 'img/character5.png'
    }
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Ocultar todos los contenedores al inicio, excepto la pantalla de bienvenida
  menu.classList.add('hidden');
  gameContainer.classList.add('hidden');
  customizationMenu.classList.add('hidden');
  equipMenu.classList.add('hidden');
  shopMenu.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  orientationLock.classList.add('hidden');

  // Iniciar la animación de la barra de carga
  if (loadingBar) {
    console.log('Iniciando animación de la barra de carga...');
    // Forzamos un reflow para asegurar que la animación se aplique
    loadingBar.offsetWidth; // Esto reinicia la animación
    loadingBar.style.width = '100%';
  } else {
    console.error('Elemento #loading-bar no encontrado');
  }

  // Mostrar el botón "Jugar" y ocultar la barra de carga después de 5 segundos
  setTimeout(() => {
    console.log('Ocultando barra de carga y mostrando botón Jugar...');
    if (loadingBarContainer) {
      loadingBarContainer.classList.add('hidden');
    } else {
      console.error('Elemento .loading-bar-container no encontrado');
    }
    if (startGameButton) {
      startGameButton.classList.remove('hidden');
    } else {
      console.error('Elemento #start-game-button no encontrado');
    }
  }, 5000);

  // Al hacer clic en "Jugar", ocultar la pantalla de bienvenida y mostrar el menú principal
  startGameButton.addEventListener('click', () => {
    console.log('Botón Jugar clicado');
    welcomeScreen.classList.add('hidden');
    menu.classList.remove('hidden');
    customizationMenu.classList.add('hidden');
    gameContainer.classList.add('hidden');
    equipMenu.classList.add('hidden');
    shopMenu.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    checkOrientation();
  });

  function adjustGameDimensions() {
    if (isMobile) {
      gameWidth = window.innerWidth;
      gameHeight = window.innerHeight * 0.6;
      if (gameHeight > 500) gameHeight = 500;

      birdX = gameWidth * 0.2;
      birdY = gameHeight * 0.5;
      pipeWidth = gameWidth * 0.04;
      pipeGap = gameHeight * 0.4;
      pipeIntervalTime = 2000;
      pipeSpeed = 2;

      gameArea.style.width = `${gameWidth}px`;
      gameArea.style.height = `${gameHeight}px`;

      bird.style.left = `${birdX}px`;
      bird.style.top = `${birdY}px`;
    }
  }

  function checkOrientation() {
    if (welcomeScreen && !welcomeScreen.classList.contains('hidden')) {
      return;
    }

    if (!isMobile) {
      orientationLock.classList.add('hidden');
      if (!gameActive) {
        if (!customizationMenu.classList.contains('hidden')) {
          return;
        }
        menu.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        customizationMenu.classList.add('hidden');
        equipMenu.classList.add('hidden');
        shopMenu.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
      }
      return;
    }

    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (!isLandscape) {
      orientationLock.classList.remove('hidden');
      gameContainer.classList.add('hidden');
      menu.classList.add('hidden');
      customizationMenu.classList.add('hidden');
      equipMenu.classList.add('hidden');
      shopMenu.classList.add('hidden');
      gameOverScreen.classList.add('hidden');
    } else {
      orientationLock.classList.add('hidden');
      adjustGameDimensions();
      if (!gameActive) {
        if (!customizationMenu.classList.contains('hidden')) {
          return;
        }
        menu.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        customizationMenu.classList.add('hidden');
        equipMenu.classList.add('hidden');
        shopMenu.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
      } else {
        gameContainer.classList.remove('hidden');
        menu.classList.add('hidden');
        customizationMenu.classList.add('hidden');
        equipMenu.classList.add('hidden');
        shopMenu.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
      }
    }
  }

  window.addEventListener('orientationchange', checkOrientation);
  window.addEventListener('resize', () => {
    checkOrientation();
    adjustGameDimensions();
  });

  function updateCustomBirdPreview() {
    // Verificamos si los elementos existen antes de acceder a sus propiedades
    if (!bodyColorInput || !wingsColorInput || !customBirdPreview) {
      console.warn('No se puede ejecutar updateCustomBirdPreview: faltan elementos en el DOM');
      return;
    }

    const bodyColor = bodyColorInput.value ? (hasCustomized ? bodyColorInput.value : '#FFD700') : '#FFD700';
    const wingsColor = wingsColorInput.value ? (hasCustomized ? wingsColorInput.value : '#FFFFFF') : '#FFFFFF';

    customBirdPreview.style.background = bodyColor;
    customBirdPreview.style.width = `${birdSize}px`;
    customBirdPreview.style.height = `${birdSize}px`;
    customBirdPreview.style.setProperty('--wings-color', wingsColor);

    customBirdPreview.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2');
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
    }
  }

  function updateCharacterOptions() {
    characterOptions.forEach(option => {
      const characterId = option.getAttribute('data-character');
      if (unlockedItems[`character-${characterId}`]) {
        option.classList.add('unlocked');
      } else {
        option.classList.remove('unlocked');
      }
      if (selectedCharacter === characterId) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
  }

  function updateEquipOptions() {
    equipOptions.innerHTML = '';

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
          applyCharacter();
          updateCustomBirdPreview();
        });

        const unequipButton = document.createElement('button');
        unequipButton.classList.add('unequip-button');
        unequipButton.textContent = 'Desequipar';
        unequipButton.disabled = equippedItems[shopItems[item].type] !== item;
        unequipButton.addEventListener('click', () => {
          equippedItems[shopItems[item].type] = 'wings-style-0';
          localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
          updateEquipOptions();
          applyCharacter();
          updateCustomBirdPreview();
        });

        buttonContainer.appendChild(equipButton);
        buttonContainer.appendChild(unequipButton);
        equipItem.appendChild(buttonContainer);
        equipOptions.appendChild(equipItem);
      }
    });
  }

  function updateHighScores() {
    const now = new Date();
    const dateString = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
    highScores.push({ score: score, date: dateString });

    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);
    localStorage.setItem('highScores', JSON.stringify(highScores));

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

  function updateShop() {
    shopCoinsDisplay.textContent = totalCoins;
    shopItemsContainer.innerHTML = '';

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

  characterOptions.forEach(option => {
    option.addEventListener('click', () => {
      const characterId = option.getAttribute('data-character');
      if (!unlockedItems[`character-${characterId}`]) {
        alert('¡Este personaje está bloqueado! Desbloquéalo en la tienda. 🏪');
        return;
      }
      selectedCharacter = characterId;
      localStorage.setItem('selectedCharacter', selectedCharacter);
      const character = predefinedCharacters[selectedCharacter];
      birdSize = character.size;
      equipBirdSizeInput.value = birdSize;
      hasCustomized = false;
      localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
      updateCharacterOptions();
      menu.classList.add('hidden');
      equipMenu.classList.remove('hidden');
      updateEquipOptions();
    });
  });

  if (customizeCharacterButton) {
    customizeCharacterButton.addEventListener('click', () => {
      selectedCharacter = null;
      localStorage.setItem('selectedCharacter', selectedCharacter);
      updateCharacterOptions();
      menu.classList.add('hidden');
      customizationMenu.classList.remove('hidden');
      updateCustomBirdPreview();
    });
  } else {
    console.error('Botón #customize-character-button no encontrado');
  }

  if (confirmCustomization) {
    confirmCustomization.addEventListener('click', () => {
      console.log('Botón Confirmar clicado');
      hasCustomized = true;
      localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
      customizationMenu.classList.add('hidden');
      equipMenu.classList.add('hidden');
      updateEquipOptions();
    });
  } else {
    console.error('Botón #confirm-customization no encontrado');
  }

  if (backToMenu) {
    backToMenu.addEventListener('click', () => {
      customizationMenu.classList.add('hidden');
      menu.classList.remove('hidden');
    });
  } else {
    console.error('Botón #back-to-menu no encontrado');
  }

  if (confirmEquip) {
    confirmEquip.addEventListener('click', () => {
      console.log('Botón Confirmar (Equipar) clicado');
      birdSize = equipBirdSizeInput.value;
      applyCharacter();
      equipMenu.classList.add('hidden');
      menu.classList.remove('hidden');
      playButton.disabled = false;
      characterSelected = true;
      localStorage.setItem('characterSelected', JSON.stringify(characterSelected));
    });
  } else {
    console.error('Botón #confirm-equip no encontrado');
  }

  if (backToSelection) {
    backToSelection.addEventListener('click', () => {
      equipMenu.classList.add('hidden');
      menu.classList.remove('hidden');
      playButton.disabled = !characterSelected;
    });
  } else {
    console.error('Botón #back-to-selection no encontrado');
  }

  if (bodyColorInput) {
    bodyColorInput.addEventListener('input', updateCustomBirdPreview);
  } else {
    console.error('Elemento #body-color no encontrado');
  }

  if (wingsColorInput) {
    wingsColorInput.addEventListener('input', updateCustomBirdPreview);
  } else {
    console.error('Elemento #wings-color no encontrado');
  }

  if (shopButton) {
    shopButton.addEventListener('click', () => {
      menu.classList.add('hidden');
      shopMenu.classList.remove('hidden');
      updateShop();
    });
  } else {
    console.error('Botón #shop-button no encontrado');
  }

  if (backToMenuFromShop) {
    backToMenuFromShop.addEventListener('click', () => {
      shopMenu.classList.add('hidden');
      menu.classList.remove('hidden');
    });
  } else {
    console.error('Botón #back-to-menu-from-shop no encontrado');
  }

  function applyCharacter() {
    let bodyColor, wingsColor, image;

    if (selectedCharacter) {
      const character = predefinedCharacters[selectedCharacter];
      bodyColor = character.bodyColor;
      wingsColor = character.wingsColor;
      image = character.image;
    } else {
      // Verificamos si los elementos existen antes de acceder a sus propiedades
      bodyColor = (hasCustomized && bodyColorInput && bodyColorInput.value) ? bodyColorInput.value : '#FFD700';
      wingsColor = (hasCustomized && wingsColorInput && wingsColorInput.value) ? wingsColorInput.value : '#FFFFFF';
      image = null;
    }

    bird.style.background = image ? `url(${image})` : bodyColor;
    bird.style.backgroundSize = 'cover';
    bird.style.backgroundPosition = 'center';
    bird.style.width = `${birdSize}px`;
    bird.style.height = `${birdSize}px`;
    bird.style.setProperty('--wings-color', wingsColor);

    bird.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2');
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
    }

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

  function createCoin(pipeX, pipeHeight) {
    const coinY = pipeHeight + pipeGap / 2;
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = `${pipeX + pipeWidth + 50}px`;
    coin.style.top = `${coinY}px`;
    gameArea.appendChild(coin);
    coinsInGame.push({ element: coin, x: pipeX + pipeWidth + 50, y: coinY });
  }

  function moveCoins() {
    coinsInGame.forEach((coin, index) => {
      coin.x -= pipeSpeed;
      coin.element.style.left = `${coin.x}px`;

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

      if (coin.x < -15) {
        coin.element.remove();
        coinsInGame.splice(index, 1);
      }
    });
  }

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

    let isMoving = false;
    if (pipeSpeed >= 50 && Math.random() < 0.3) {
      isMoving = true;
    }

    gameArea.appendChild(pipeTop);
    gameArea.appendChild(pipeBottom);

    pipes.push({ top: pipeTop, bottom: pipeBottom, x: gameWidth, passed: false, isMoving: isMoving, baseHeight: pipeHeight, moveOffset: 0, moveTime: Date.now() });

    if (Math.random() > 0.5) {
      createCoin(gameWidth, pipeHeight);
    }
  }

  function adjustDifficulty() {
    const newPipeSpeed = 2 + Math.floor(score / 5) * 0.5;

    if (newPipeSpeed !== pipeSpeed) {
      pipeSpeed = newPipeSpeed;
      pipeIntervalTime = 2000 - (pipeSpeed - 2) * 20;
      pipeGap = Math.max(100, 200 - (pipeSpeed - 2) * 2);
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

  function movePipes() {
    pipes.forEach((pipe, index) => {
      pipe.x -= pipeSpeed;
      pipe.top.style.left = `${pipe.x}px`;
      pipe.bottom.style.left = `${pipe.x}px`;

      if (pipe.isMoving) {
        const elapsedTime = (Date.now() - pipe.moveTime) % 2000;
        const progress = elapsedTime / 2000;
        pipe.moveOffset = 50 * Math.sin(progress * 2 * Math.PI);

        const newTopHeight = pipe.baseHeight + pipe.moveOffset;
        const newBottomHeight = gameHeight - newTopHeight - pipeGap;

        if (newTopHeight >= 50 && newBottomHeight >= 50) {
          pipe.top.style.height = `${newTopHeight}px`;
          pipe.bottom.style.height = `${newBottomHeight}px`;
        }
      }

      const birdRect = bird.getBoundingClientRect();
      const pipeTopRect = pipe.top.getBoundingClientRect();
      const pipeBottomRect = pipe.bottom.getBoundingClientRect();

      // Añadimos depuración para verificar las dimensiones
      console.log(`Pipe ${index} - Top Height: ${pipeTopRect.height}, Bottom Height: ${pipeBottomRect.height}, Gap: ${pipeBottomRect.top - pipeTopRect.bottom}`);

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
        return;
      }

      if (birdY <= 0 || birdY >= gameHeight - parseInt(bird.style.height)) {
        endGame();
        return;
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

  function updateBird() {
    velocity += gravity;
    if (velocity > maxVelocity) velocity = maxVelocity;
    if (velocity < -maxVelocity) velocity = -maxVelocity;
    birdY += velocity;
    bird.style.top = `${birdY}px`;
  }

  function endGame() {
    gameActive = false;
    finalScoreDisplay.textContent = score;
    totalCoins += coins;
    localStorage.setItem('totalCoins', totalCoins);
    totalCoinsDisplay.textContent = totalCoins;
    updateHighScores();

    gameArea.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    menu.classList.add('hidden');
    customizationMenu.classList.add('hidden');
    equipMenu.classList.add('hidden');
    shopMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');

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

  function startGame() {
    gameActive = true;
    score = 0;
    coins = 0;
    scoreDisplay.textContent = score;
    coinsDisplay.textContent = coins;
    birdY = gameHeight * 0.5;
    velocity = 0;
    bird.style.top = `${birdY}px`;
    gameOverScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');
    pipes = [];
    coinsInGame = [];

    pipeSpeed = 2;
    pipeIntervalTime = 2000;
    pipeGap = gameHeight * 0.4;
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

  if (playButton) {
    playButton.addEventListener('click', () => {
      console.log('Botón Jugar clicado');
      applyCharacter();
      menu.classList.add('hidden');
      gameContainer.classList.remove('hidden');
      startGame();
    });
  } else {
    console.error('Botón #play-button no encontrado');
  }

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

  document.addEventListener('touchstart', (e) => {
    if (gameActive) {
      e.preventDefault();
      velocity = jump;
    }
  });

  document.addEventListener('touchend', (e) => {
    e.preventDefault();
  });

  if (restartButton) {
    restartButton.addEventListener('click', () => {
      gameOverScreen.classList.add('hidden');
      gameContainer.classList.add('hidden');
      menu.classList.remove('hidden');
    });
  } else {
    console.error('Botón #restart-button no encontrado');
  }

  // Llamada inicial a las funciones de actualización
  updateCharacterOptions();
  updateCustomBirdPreview();
  updateShop();
  checkOrientation();
  adjustGameDimensions();
  playButton.disabled = !characterSelected;
});