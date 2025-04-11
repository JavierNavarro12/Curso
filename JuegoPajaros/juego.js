document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado, iniciando script...');

  // Declaración de elementos del DOM con verificación
  const elements = {
    bird: document.getElementById('bird'),
    gameArea: document.querySelector('.game-area'),
    scoreDisplay: document.getElementById('score'),
    coinsDisplay: document.getElementById('coins'),
    difficultyLevelDisplay: document.createElement('span'), // Crear dinámicamente
    gameOverScreen: document.getElementById('game-over'),
    finalScoreDisplay: document.getElementById('final-score'),
    totalCoinsDisplay: document.getElementById('total-coins'),
    restartButton: document.getElementById('restart-button'),
    menu: document.getElementById('menu'),
    gameContainer: document.querySelector('.game-container'),
    playButton: document.getElementById('play-button'),
    shopButton: document.getElementById('shop-button'),
    powerUpsButton: document.getElementById('power-ups-button'),
    characterOptions: document.querySelectorAll('.character-option'),
    bodyColorInput: document.getElementById('body-color'),
    wingsColorInput: document.getElementById('wings-color'),
    wingsSizeInput: document.getElementById('wings-size'),
    equipWingsSizeInput: document.getElementById('equip-wings-size'),
    customizeCharacterButton: document.getElementById('customize-character-button'),
    customizationMenu: document.getElementById('customization-menu'),
    confirmCustomization: document.getElementById('confirm-customization'),
    backToMenu: document.getElementById('back-to-menu'),
    equipMenu: document.getElementById('equip-menu'),
    equipOptions: document.getElementById('equip-options'),
    equipBirdSizeInput: document.getElementById('equip-bird-size'),
    confirmEquip: document.getElementById('confirm-equip'),
    backToSelection: document.getElementById('back-to-selection'),
    customBirdPreview: document.getElementById('custom-bird-preview'),
    highScoresTableBody: document.querySelector('#high-scores-table tbody'),
    shopMenu: document.getElementById('shop-menu'),
    shopItemsContainer: document.getElementById('shop-items'),
    shopCoinsDisplay: document.getElementById('shop-coins'),
    backToMenuFromShop: document.getElementById('back-to-menu-from-shop'),
    orientationLock: document.getElementById('orientation-lock'),
    welcomeScreen: document.getElementById('welcome-screen'),
    loadingBar: document.getElementById('loading-bar'),
    loadingBarContainer: document.querySelector('.loading-bar-container'),
    startGameButton: document.getElementById('start-game-button'),
    gameModeMenu: document.getElementById('game-mode-menu'),
    classicModeButton: document.getElementById('classic-mode-button'),
    powerUpsModeButton: document.getElementById('power-ups-mode-button'),
    survivalModeButton: document.getElementById('survival-mode-button'),
    inverseModeButton: document.getElementById('inverse-mode-button'), // Nuevo botón para Modo Inverso
    backToMainMenu: document.getElementById('back-to-main-menu'),
  };

  // Configurar el elemento difficultyLevelDisplay
  elements.difficultyLevelDisplay.id = 'difficulty-level';
  elements.difficultyLevelDisplay.style.position = 'absolute';
  elements.difficultyLevelDisplay.style.top = '10px';
  elements.difficultyLevelDisplay.style.left = '10px';
  elements.difficultyLevelDisplay.style.color = '#000';
  elements.difficultyLevelDisplay.style.fontSize = '16px';
  elements.difficultyLevelDisplay.style.display = 'none';

  // Verificar elementos clave
  Object.keys(elements).forEach(key => {
    if (!elements[key] && key !== 'characterOptions' && key !== 'difficultyLevelDisplay') {
      console.error(`Elemento ${key} no encontrado en el DOM`);
    }
  });

  // Definir shopItems
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

  // Variables del juego
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
  let particles = [];
  let powerUps = [];
  let gameMode = null;
  let activeShield = false;
  let speedBoostActive = false;
  let magnetActive = false;
  let powerUpDuration = 5000;
  let lastPowerUpType = null;
  let difficultyLevel = 1;
  let survivalTime = 0;
  let maxSurvivalLevel = 0;
  let gameLoopId = null; // Para almacenar el ID de requestAnimationFrame
  let isInputActive = false; // Nueva variable para rastrear si se está tocando/presionando
  let hasInteractedInverse = false; // Nueva variable para modo inverso

  let gameHeight = 500;
  let gameWidth = 1000;
  let pipeWidth = 30;
  let pipeGap = 150;
  let pipeSpeed = 2;
  let pipeIntervalTime = 2000;
  let birdX = 150;

  let basePipeGap = pipeGap;
  let pipeInterval = null;
  let selectedCharacter = localStorage.getItem('selectedCharacter') || null;
  let birdSize = 30;
  let wingsSize = parseInt(localStorage.getItem('wingsSize')) || 40;
  let hasCustomized = JSON.parse(localStorage.getItem('hasCustomized')) || false;
  let characterSelected = JSON.parse(localStorage.getItem('characterSelected')) || false;
  let hasSelectedInSession = false; // Nueva variable para rastrear selección en la sesión actual

  let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  let bodyColor = '#FFD700';
  let wingsColor = '#FFFFFF';
  let hasSeenWelcomeScreen = false;

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

  if (!equippedItems['wings-style'] || !shopItems[equippedItems['wings-style']]) {
    console.warn('equippedItems[\'wings-style\'] inválido, reiniciando a valor por defecto');
    equippedItems['wings-style'] = 'wings-style-0';
    localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
  }

  const predefinedCharacters = {
    1: { bodyColor: '#FF6347', wingsColor: '#FF4500', size: 30, image: 'img/character1.png' },
    2: { bodyColor: '#4682B4', wingsColor: '#4169E1', size: 35, image: 'img/character2.png' },
    3: { bodyColor: '#32CD32', wingsColor: '#228B22', size: 25, image: 'img/character3.png' },
    4: { bodyColor: '#FFD700', wingsColor: '#FFA500', size: 30, image: 'img/character4.png' },
    5: { bodyColor: '#EE82EE', wingsColor: '#DA70D6', size: 28, image: 'img/character5.png' }
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Ocultar todos los contenedores al inicio
  elements.menu.classList.add('hidden');
  elements.gameContainer.classList.add('hidden');
  elements.customizationMenu.classList.add('hidden');
  elements.equipMenu.classList.add('hidden');
  elements.shopMenu.classList.add('hidden');
  elements.gameOverScreen.classList.add('hidden');
  elements.gameModeMenu.classList.add('hidden');
  elements.orientationLock.classList.add('hidden');

  if (!hasSeenWelcomeScreen) {
    if (!isMobile || window.matchMedia("(orientation: landscape)").matches) {
      elements.welcomeScreen.classList.remove('hidden');
    } else {
      elements.orientationLock.classList.remove('hidden');
    }
  }

  function startLoadingAnimation() {
    if (elements.loadingBar && elements.loadingBarContainer && elements.startGameButton) {
      console.log('Iniciando animación de la barra de carga...');
      elements.loadingBar.style.transition = 'width 5s linear';
      elements.loadingBar.offsetWidth;
      elements.loadingBar.style.width = '100%';
      elements.loadingBar.addEventListener('transitionend', () => {
        console.log('Animación de la barra de carga completada, mostrando botón Jugar...');
        elements.loadingBarContainer.classList.add('hidden');
        elements.startGameButton.classList.remove('hidden');
      }, { once: true });
    }
  }

  function handleStartGame() {
    console.log('Botón Jugar clicado');
    hasSeenWelcomeScreen = true;
    elements.welcomeScreen.classList.add('hidden');
    elements.menu.classList.remove('hidden');
    checkOrientation();
  }

  if (elements.startGameButton) {
    elements.startGameButton.addEventListener('click', handleStartGame);
    elements.startGameButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleStartGame();
    }, { passive: false });
  }

  function adjustGameDimensions() {
    if (isMobile) {
      gameWidth = window.innerWidth;
      gameHeight = window.innerHeight * 0.6;
      if (gameHeight > 500) gameHeight = 500;
      birdX = gameWidth * 0.2;
      birdY = (gameHeight - birdSize) / 2; // Ajustar birdY según birdSize
      pipeWidth = gameWidth * 0.04;
      pipeGap = gameHeight * 0.45;
      basePipeGap = pipeGap;
      pipeIntervalTime = 2000;
      pipeSpeed = 2;
      gravity = 0.1;
      jump = -3;
      maxVelocity = 5;
      elements.gameArea.style.width = `${gameWidth}px`;
      elements.gameArea.style.height = `${gameHeight}px`;
      elements.bird.style.left = `${birdX}px`;
      elements.bird.style.top = `${birdY}px`;
      // Ajustar tamaño de las monedas en móvil
      const styleSheet = document.createElement('style');
      styleSheet.innerHTML = `
        .coin {
          width: 25px !important;
          height: 25px !important;
        }
      `;
      document.head.appendChild(styleSheet);
    } else {
      gameWidth = 1000;
      gameHeight = 500;
      pipeGap = 150;
      basePipeGap = pipeGap;
      jump = -6;
      gravity = 0.2;
      maxVelocity = 8;
      birdX = gameWidth * 0.15;
      birdY = (gameHeight - birdSize) / 2; // Ajustar birdY según birdSize
      elements.gameArea.style.width = `${gameWidth}px`;
      elements.gameArea.style.height = `${gameHeight}px`;
      elements.bird.style.left = `${birdX}px`;
      elements.bird.style.top = `${birdY}px`;
      // Ajustar tamaño de las monedas en escritorio
      const styleSheet = document.createElement('style');
      styleSheet.innerHTML = `
        .coin {
          width: 20px !important;
          height: 20px !important;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }

  function checkOrientation() {
    if (!isMobile) {
      elements.orientationLock.classList.add('hidden');
      if (!hasSeenWelcomeScreen) {
        elements.welcomeScreen.classList.remove('hidden');
        startLoadingAnimation();
      } else if (!gameActive) {
        elements.menu.classList.remove('hidden');
        elements.gameContainer.classList.add('hidden');
        elements.customizationMenu.classList.add('hidden');
        elements.equipMenu.classList.add('hidden');
        elements.shopMenu.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');
        elements.gameModeMenu.classList.add('hidden');
      }
      return;
    }

    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (!isLandscape) {
      elements.orientationLock.classList.remove('hidden');
      elements.welcomeScreen.classList.add('hidden');
      elements.gameContainer.classList.add('hidden');
      elements.menu.classList.add('hidden');
      elements.customizationMenu.classList.add('hidden');
      elements.equipMenu.classList.add('hidden');
      elements.shopMenu.classList.add('hidden');
      elements.gameOverScreen.classList.add('hidden');
      elements.gameModeMenu.classList.add('hidden');
    } else {
      elements.orientationLock.classList.add('hidden');
      adjustGameDimensions();
      if (!hasSeenWelcomeScreen) {
        elements.welcomeScreen.classList.remove('hidden');
        startLoadingAnimation();
      } else if (!gameActive) {
        elements.menu.classList.remove('hidden');
        elements.gameContainer.classList.add('hidden');
        elements.customizationMenu.classList.add('hidden');
        elements.equipMenu.classList.add('hidden');
        elements.shopMenu.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');
        elements.gameModeMenu.classList.add('hidden');
      } else {
        elements.gameContainer.classList.remove('hidden');
        elements.menu.classList.add('hidden');
      }
    }
  }

  window.addEventListener('orientationchange', checkOrientation);
  window.addEventListener('resize', () => {
    checkOrientation();
    adjustGameDimensions();
  });

  function updateCustomBirdPreview() {
    if (!elements.customBirdPreview) return;
    elements.customBirdPreview.style.background = bodyColor;
    elements.customBirdPreview.style.width = `${birdSize}px`;
    elements.customBirdPreview.style.height = `${birdSize}px`;
    elements.customBirdPreview.style.setProperty('--wings-color', wingsColor);
    elements.customBirdPreview.style.setProperty('--wings-size', `${wingsSize}px`);
    elements.customBirdPreview.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2');
    if (equippedItems['wings-style']) {
      const style = shopItems[equippedItems['wings-style']].value;
      if (style === 'default') elements.customBirdPreview.classList.add('wings-style-0');
      else if (style === 'golden') elements.customBirdPreview.classList.add('wings-style-1');
      else if (style === 'demonic') elements.customBirdPreview.classList.add('wings-style-2');
    }
  }

  function updateCharacterOptions() {
    elements.characterOptions.forEach(option => {
      const characterId = option.getAttribute('data-character');
      // Forzar que character-1 esté desbloqueado
      if (characterId === '1') {
        unlockedItems[`character-${characterId}`] = true;
        localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
      }
      if (unlockedItems[`character-${characterId}`]) option.classList.add('unlocked');
      else option.classList.remove('unlocked');
      // Solo aplicar 'selected' si el usuario ha seleccionado un personaje en esta sesión
      if (hasSelectedInSession && selectedCharacter === characterId) {
        option.classList.add('selected');
      } else {
        option.classList.remove('selected');
      }
    });
  }

  function updateEquipOptions() {
    elements.equipOptions.innerHTML = '';
    Object.keys(unlockedItems).forEach(item => {
      if (unlockedItems[item] && shopItems[item] && shopItems[item].type !== 'character') {
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
        if (equippedItems[shopItems[item].type] === item) equipButton.classList.add('active');
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
        elements.equipOptions.appendChild(equipItem);
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
    elements.highScoresTableBody.innerHTML = '';
    highScores.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${index + 1}</td><td>${entry.score}</td><td>${entry.date}</td>`;
      elements.highScoresTableBody.appendChild(row);
    });
  }

  function updateShop() {
    elements.shopCoinsDisplay.textContent = totalCoins;
    elements.shopItemsContainer.innerHTML = '';
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
      elements.shopItemsContainer.appendChild(shopItem);
    });
  }

  elements.characterOptions.forEach(option => {
    option.addEventListener('click', () => {
      const characterId = option.getAttribute('data-character');
      if (!unlockedItems[`character-${characterId}`]) {
        alert('¡Este personaje está bloqueado! Desbloquéalo en la tienda. 🏪');
        return;
      }
      selectedCharacter = characterId;
      hasSelectedInSession = true; // Marcar que el usuario ha seleccionado un personaje en esta sesión
      localStorage.setItem('selectedCharacter', selectedCharacter);
      const character = predefinedCharacters[selectedCharacter];
      birdSize = character.size;
      bodyColor = character.bodyColor;
      wingsColor = character.wingsColor;
      elements.equipBirdSizeInput.value = birdSize;
      hasCustomized = false;
      localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
      updateCharacterOptions();
      elements.menu.classList.add('hidden');
      elements.equipMenu.classList.remove('hidden');
      updateEquipOptions();
    });
  });

  if (elements.customizeCharacterButton) {
    elements.customizeCharacterButton.addEventListener('click', () => {
      selectedCharacter = null;
      hasSelectedInSession = false; // Reiniciar al personalizar
      localStorage.setItem('selectedCharacter', selectedCharacter);
      updateCharacterOptions();
      elements.menu.classList.add('hidden');
      elements.customizationMenu.classList.remove('hidden');
      updateCustomBirdPreview();
    });
  }

  if (elements.confirmCustomization) {
    elements.confirmCustomization.addEventListener('click', () => {
      bodyColor = elements.bodyColorInput.value;
      wingsColor = elements.wingsColorInput.value;
      wingsSize = parseInt(elements.wingsSizeInput.value);
      localStorage.setItem('wingsSize', wingsSize);
      hasCustomized = true;
      characterSelected = true;
      localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
      localStorage.setItem('characterSelected', JSON.stringify(characterSelected));
      elements.customizationMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      elements.playButton.disabled = false;
      velocity = 0; // Reiniciar velocity
      updateEquipOptions();
      applyCharacter();
    });
  }

  if (elements.backToMenu) {
    elements.backToMenu.addEventListener('click', () => {
      elements.customizationMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  }

  if (elements.confirmEquip) {
    elements.confirmEquip.addEventListener('click', () => {
      birdSize = Math.max(20, parseInt(elements.equipBirdSizeInput.value));
      wingsSize = parseInt(elements.equipWingsSizeInput.value);
      localStorage.setItem('wingsSize', wingsSize);
      velocity = 0; // Reiniciar velocity
      applyCharacter();
      elements.equipMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      elements.playButton.disabled = false;
      characterSelected = true;
      localStorage.setItem('characterSelected', JSON.stringify(characterSelected));
    });
  }

  if (elements.backToSelection) {
    elements.backToSelection.addEventListener('click', () => {
      elements.equipMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  }

  if (elements.bodyColorInput) elements.bodyColorInput.addEventListener('input', () => { bodyColor = elements.bodyColorInput.value; updateCustomBirdPreview(); });
  if (elements.wingsColorInput) elements.wingsColorInput.addEventListener('input', () => { wingsColor = elements.wingsColorInput.value; updateCustomBirdPreview(); });
  if (elements.wingsSizeInput) elements.wingsSizeInput.addEventListener('input', () => { wingsSize = parseInt(elements.wingsSizeInput.value); updateCustomBirdPreview(); });
  if (elements.equipWingsSizeInput) elements.equipWingsSizeInput.addEventListener('input', () => { wingsSize = parseInt(elements.equipWingsSizeInput.value); applyCharacter(); });

  if (elements.wingsSizeInput) elements.wingsSizeInput.value = wingsSize;
  if (elements.equipWingsSizeInput) elements.equipWingsSizeInput.value = wingsSize;

  if (elements.shopButton) {
    elements.shopButton.addEventListener('click', () => {
      elements.menu.classList.add('hidden');
      elements.shopMenu.classList.remove('hidden');
      updateShop();
    });
  }

  if (elements.backToMenuFromShop) {
    elements.backToMenuFromShop.addEventListener('click', () => {
      elements.shopMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  }

  if (elements.playButton) {
    elements.playButton.addEventListener('click', () => {
      elements.menu.classList.add('hidden');
      elements.gameModeMenu.classList.remove('hidden');
    });
  }

  // Configurar los botones de modo de juego una sola vez al inicio
  function initializeModeButtons() {
    const modeButtons = [
      { button: elements.classicModeButton, mode: 'classic', desc: 'Esquiva tuberías y acumula puntos en un desafío clásico.', hasInfo: true },
      { button: elements.powerUpsModeButton, mode: 'power-ups', desc: 'Usa power-ups como escudos, velocidad y magnetismo para superar obstáculos.', hasInfo: true },
      { button: elements.survivalModeButton, mode: 'survival', desc: 'Sobrevive el mayor tiempo posible con dificultad creciente por niveles. ¡Gana 5 monedas al llegar al nivel 5!', hasInfo: true },
      { button: elements.inverseModeButton, mode: 'inverse', desc: 'Controles invertidos: toca para bajar y suelta para subir.', hasInfo: true }, // Nuevo modo inverso
      { button: elements.backToMainMenu, mode: null, desc: '', hasInfo: false } // El botón "Volver" no tiene info
    ];

    modeButtons.forEach(({ button, mode, desc, hasInfo }) => {
      if (button) {
        // Guardar el texto original del botón
        const originalText = button.textContent;
        // Crear un contenedor para el texto
        const textSpan = document.createElement('span');
        textSpan.textContent = originalText;
        textSpan.classList.add('button-text'); // Añadir clase para centrar el texto
        button.innerHTML = ''; // Limpiar el contenido del botón
        button.appendChild(textSpan);

        // Añadir el botón de información solo si hasInfo es true
        if (hasInfo) {
          const infoButton = document.createElement('span');
          infoButton.classList.add('info-button');
          infoButton.textContent = 'i';
          button.appendChild(infoButton);

          infoButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const existingPanel = document.querySelector('.info-panel');
            if (existingPanel) existingPanel.remove();

            const panel = document.createElement('div');
            panel.classList.add('info-panel');
            panel.textContent = desc;
            panel.style.position = 'absolute';
            panel.style.left = `${button.offsetLeft}px`;
            panel.style.background = '#fff';
            panel.style.border = '1px solid #000';
            panel.style.padding = '5px';
            panel.style.zIndex = '1000';
            panel.style.maxWidth = `${button.offsetWidth}px`; // Asegurar que el panel no sea más ancho que el botón
            panel.style.boxSizing = 'border-box';

            // Añadir el panel al DOM para medir su altura
            elements.gameModeMenu.appendChild(panel);

            // Calcular la altura real del panel
            const panelHeight = panel.offsetHeight;
            const buttonHeight = button.offsetHeight;
            const buttonTop = button.offsetTop;
            const gameModeMenuHeight = elements.gameModeMenu.offsetHeight;
            const gameModeMenuTop = elements.gameModeMenu.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;

            // Calcular el espacio disponible debajo del botón dentro del contenedor
            const spaceBelowInContainer = gameModeMenuHeight - (buttonTop + buttonHeight);
            // Calcular el espacio disponible debajo del botón en la ventana
            const buttonBottomInViewport = gameModeMenuTop + buttonTop + buttonHeight;
            const spaceBelowInViewport = viewportHeight - buttonBottomInViewport;

            // Determinar si el panel cabe debajo del botón
            const fitsBelow = spaceBelowInContainer >= panelHeight && spaceBelowInViewport >= panelHeight;

            if (fitsBelow) {
              // Posicionar debajo del botón
              panel.style.top = `${buttonTop + buttonHeight + 5}px`; // 5px de margen
              panel.style.bottom = 'auto';
            } else {
              // Posicionar arriba del botón
              panel.style.top = 'auto';
              panel.style.bottom = `${spaceBelowInContainer + buttonHeight + 5}px`; // 5px de margen
            }

            document.addEventListener('click', (e) => {
              if (!panel.contains(e.target) && e.target !== infoButton) panel.remove();
            }, { once: true });
          });
        }

        // Añadir evento de clic para los botones de modo (excepto "Volver")
        if (mode) {
          button.addEventListener('click', () => {
            gameMode = mode;
            startGame();
          });
        } else {
          // Evento para el botón "Volver"
          button.addEventListener('click', () => {
            elements.gameModeMenu.classList.add('hidden');
            elements.menu.classList.remove('hidden');
            document.querySelectorAll('.info-panel').forEach(panel => panel.remove());
          });
        }
      }
    });

    // Añadir estilos CSS para uniformidad
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      #game-mode-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center; /* Centrar los elementos */
        gap: 10px;
        padding: 20px;
        background-color: #fff;
        border: 2px solid #000;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 90%; /* Ajustar al 90% del contenedor padre */
        max-width: 400px; /* Ancho máximo para escritorio */
        height: auto; /* Altura automática para escritorio */
        margin: 0 auto; /* Centrar horizontalmente */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* Centrar completamente */
        box-sizing: border-box;
        overflow: hidden; /* Evitar scroll */
      }
      #game-mode-menu button {
        width: 100%; /* Ocupar el ancho del contenedor */
        max-width: 350px; /* Ancho máximo para escritorio */
        padding: 15px;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        background-color: #ff4500;
        color: #fff;
        border: 2px solid #000;
        border-radius: 5px;
        cursor: pointer;
        box-sizing: border-box;
      }
      #game-mode-menu button .button-text {
        flex-grow: 1;
        text-align: center;
        padding-right: 30px; /* Ajustado para centrar mejor el texto */
      }
      #game-mode-menu button .info-button {
        width: 20px; /* Tamaño unificado para escritorio y móvil */
        height: 20px;
        background-color: #ccc;
        color: #000;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px; /* Tamaño de fuente unificado */
        margin-left: 10px;
        cursor: pointer;
      }
      #game-mode-menu button:hover {
        background-color: #ff6347;
      }
      /* Estilos específicos para móvil */
      @media (max-width: 600px) {
        #game-mode-menu {
          width: 90%;
          max-width: 300px; /* Reducir el ancho máximo en móvil */
          height: auto; /* Altura automática para que quepan todos los botones */
          padding: 10px; /* Reducir el padding para ahorrar espacio */
          overflow: hidden; /* Evitar scroll */
        }
        #game-mode-menu h2 {
          font-size: 1rem; /* Reducir el tamaño del título */
          margin-bottom: 10px;
        }
        #game-mode-menu button {
          max-width: 250px; /* Reducir el ancho de los botones en móvil */
          padding: 6px; /* Reducir aún más el padding para ahorrar espacio */
          font-size: 12px; /* Reducir el tamaño de la fuente */
        }
        #game-mode-menu button .button-text {
          padding-right: 20px; /* Ajustar el padding en móvil */
        }
        #game-mode-menu button .info-button {
          width: 20px; /* Tamaño unificado para móvil */
          height: 20px;
          font-size: 14px; /* Tamaño de fuente unificado */
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // Llamar a la inicialización de los botones una sola vez
  initializeModeButtons();

  function applyCharacter() {
    birdSize = Math.max(20, birdSize);
    elements.bird.style.background = selectedCharacter ? `url(${predefinedCharacters[selectedCharacter].image})` : bodyColor;
    elements.bird.style.backgroundSize = 'cover';
    elements.bird.style.backgroundPosition = 'center';
    elements.bird.style.width = `${birdSize}px`;
    elements.bird.style.height = `${birdSize}px`;
    elements.bird.style.setProperty('--wings-color', wingsColor);
    elements.bird.style.setProperty('--wings-size', `${wingsSize}px`);
    elements.bird.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2');
    if (equippedItems['wings-style']) {
      const style = shopItems[equippedItems['wings-style']].value;
      if (style === 'default') elements.bird.classList.add('wings-style-0');
      else if (style === 'golden') elements.bird.classList.add('wings-style-1');
      else if (style === 'demonic') elements.bird.classList.add('wings-style-2');
    }
    // Ajustar birdY para que el pájaro esté centrado después de cambiar el tamaño
    birdY = (gameHeight - birdSize) / 2;
    birdY = Math.max(0, Math.min(birdY, gameHeight - birdSize)); // Asegurar que esté dentro de los límites
    elements.bird.style.top = `${birdY}px`;
  }

  function createParticle() {
    if (!equippedItems['trail-effect'] || !shopItems[equippedItems['trail-effect']]) return;
    const effect = shopItems[equippedItems['trail-effect']].value;
    if (effect !== 'stars' && effect !== 'hearts' && effect !== 'fire') return;
    const particle = document.createElement('div');
    particle.classList.add('particle');
    if (effect === 'stars') particle.classList.add('particle-stars');
    else if (effect === 'hearts') particle.classList.add('particle-hearts');
    else if (effect === 'fire') particle.classList.add('particle-fire');
    const x = birdX - 10;
    const y = birdY + (birdSize / 2);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    elements.gameArea.appendChild(particle);
    particles.push({ element: particle, x: x, y: y, lifetime: 500 });
    setTimeout(() => {
      particle.remove();
      particles = particles.filter(p => p.element !== particle);
    }, 500);
  }

  function updateParticles() {
    particles.forEach((particle, index) => {
      particle.x -= pipeSpeed;
      particle.element.style.left = `${particle.x}px`;
      if (particle.x < -10) {
        particle.element.remove();
        particles.splice(index, 1);
      }
    });
  }

  function createCoin(pipeX, pipeHeight) {
    const coinY = pipeHeight + pipeGap / 2;
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = `${pipeX + pipeWidth + 50}px`;
    coin.style.top = `${coinY}px`;
    elements.gameArea.appendChild(coin);
    coinsInGame.push({ element: coin, x: pipeX + pipeWidth + 50, y: coinY });
  }

  function createPowerUp(pipeX, pipeHeight) {
    if (gameMode !== 'power-ups') return;
    if (Math.random() > 0.98) return;
    const availablePowerUps = [
      { type: 'speed', class: 'powerup-speed', emoji: '⚡', weight: 0.40 },
      { type: 'magnet', class: 'powerup-magnet', emoji: '🧲', weight: 0.40 },
      { type: 'shield', class: 'powerup-shield', emoji: '🛡️', weight: 0.20 }
    ].filter(p => p.type !== lastPowerUpType);
    if (availablePowerUps.length === 0) return;
    const totalWeight = availablePowerUps.reduce((sum, p) => sum + p.weight, 0);
    let random = Math.random() * totalWeight;
    let selectedPowerUp = availablePowerUps[availablePowerUps.length - 1];
    for (const powerUp of availablePowerUps) {
      random -= powerUp.weight;
      if (random <= 0) {
        selectedPowerUp = powerUp;
        break;
      }
    }
    lastPowerUpType = selectedPowerUp.type;
    let powerUpY = pipeHeight + pipeGap / 2 + (Math.random() * 50 - 25);
    const powerUpX = pipeX + pipeWidth + 50;
    let overlap = coinsInGame.some(coin => {
      const distanceX = Math.abs(coin.x - powerUpX);
      const distanceY = Math.abs(coin.y - powerUpY);
      return distanceX < 30 && distanceY < 30;
    });
    if (overlap) {
      powerUpY += (Math.random() > 0.5 ? 50 : -50);
      if (powerUpY < pipeHeight + 25 || powerUpY > pipeHeight + pipeGap - 25) return;
    }
    const powerUp = document.createElement('div');
    powerUp.classList.add('powerup', selectedPowerUp.class);
    powerUp.textContent = selectedPowerUp.emoji;
    powerUp.style.left = `${powerUpX}px`;
    powerUp.style.top = `${powerUpY}px`;
    powerUp.dataset.type = selectedPowerUp.type;
    elements.gameArea.appendChild(powerUp);
    powerUps.push({ element: powerUp, x: powerUpX, y: powerUpY, type: selectedPowerUp.type });
  }

  function moveCoins() {
    coinsInGame.forEach((coin, index) => {
      if (magnetActive) {
        const dx = birdX - coin.x;
        const dy = birdY - coin.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          coin.x += dx * 0.3;
          coin.y += dy * 0.3;
          if (distance < 20) {
            coins += gameMode === 'survival' ? difficultyLevel : 1;
            elements.coinsDisplay.textContent = coins;
            coin.element.remove();
            coinsInGame.splice(index, 1);
            return;
          }
        }
      }
      coin.x -= pipeSpeed;
      coin.element.style.left = `${coin.x}px`;
      coin.element.style.top = `${coin.y}px`;
      const birdRect = elements.bird.getBoundingClientRect();
      const coinRect = coin.element.getBoundingClientRect();
      if (
        birdRect.right > coinRect.left &&
        birdRect.left < coinRect.right &&
        birdRect.bottom > coinRect.top &&
        birdRect.top < coinRect.bottom
      ) {
        coins += gameMode === 'survival' ? difficultyLevel : 1;
        elements.coinsDisplay.textContent = coins;
        coin.element.remove();
        coinsInGame.splice(index, 1);
      }
      if (coin.x < -15) {
        coin.element.remove();
        coinsInGame.splice(index, 1);
      }
    });
  }

  function movePowerUps() {
    powerUps.forEach((powerUp, index) => {
      powerUp.x -= pipeSpeed;
      powerUp.element.style.left = `${powerUp.x}px`;
      const birdRect = elements.bird.getBoundingClientRect();
      const powerUpRect = powerUp.element.getBoundingClientRect();
      if (
        birdRect.right > powerUpRect.left &&
        birdRect.left < powerUpRect.right &&
        birdRect.bottom > powerUpRect.top &&
        birdRect.top < powerUpRect.bottom
      ) {
        activatePowerUp(powerUp.type);
        powerUp.element.remove();
        powerUps.splice(index, 1);
      }
      if (powerUp.x < -20) {
        powerUp.element.remove();
        powerUps.splice(index, 1);
      }
    });
  }

  function activatePowerUp(type) {
    clearTimeout(elements.bird.shieldTimeout);
    clearTimeout(elements.bird.speedTimeout);
    clearTimeout(elements.bird.magnetTimeout);
    if (type === 'shield') {
      activeShield = true;
      elements.bird.style.boxShadow = '0 0 15px #00BFFF';
      elements.bird.shieldTimeout = setTimeout(() => {
        activeShield = false;
        elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
      }, powerUpDuration);
    } else if (type === 'speed') {
      speedBoostActive = true;
      const originalSpeed = pipeSpeed; // Guardar la velocidad original
      pipeSpeed = originalSpeed * 1.5; // Aumentar la velocidad
      elements.bird.speedTimeout = setTimeout(() => {
        speedBoostActive = false;
        pipeSpeed = originalSpeed; // Restaurar la velocidad original
        if (gameMode === 'survival') {
          pipeSpeed = 2 + difficultyLevel * 0.5; // Ajustar según la dificultad si es modo survival
        }
      }, powerUpDuration);
    } else if (type === 'magnet') {
      magnetActive = true;
      elements.bird.magnetTimeout = setTimeout(() => {
        magnetActive = false;
      }, powerUpDuration);
    }
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
    let isMoving = pipeSpeed >= 50 && Math.random() < 0.3;
    elements.gameArea.appendChild(pipeTop);
    elements.gameArea.appendChild(pipeBottom);
    pipes.push({ top: pipeTop, bottom: pipeBottom, x: gameWidth, passed: false, isMoving: isMoving, baseHeight: pipeHeight, moveOffset: 0, moveTime: Date.now() });
    if (Math.random() > 0.5) createCoin(gameWidth, pipeHeight);
    createPowerUp(gameWidth, pipeHeight);
  }

  function adjustDifficulty() {
    if (gameMode === 'survival') {
      const newDifficultyLevel = Math.floor(survivalTime / 10000) + 1; // Subir de nivel cada 10 segundos
      if (newDifficultyLevel !== difficultyLevel) {
        difficultyLevel = newDifficultyLevel;
        elements.difficultyLevelDisplay.textContent = `Nivel ${difficultyLevel}`;
        pipeSpeed = 2 + difficultyLevel * 0.5; // Aumentar velocidad de las tuberías
        pipeGap = Math.max(100, basePipeGap - difficultyLevel * 10); // Reducir el espacio entre tuberías
        pipeIntervalTime = Math.max(1000, 2000 - difficultyLevel * 100); // Reducir el intervalo entre tuberías
        clearInterval(pipeInterval);
        pipeInterval = setInterval(createPipe, pipeIntervalTime);
      }
      maxSurvivalLevel = Math.max(maxSurvivalLevel, difficultyLevel);
    } else {
      elements.difficultyLevelDisplay.style.display = 'none';
      if (!speedBoostActive) { // Solo ajustar si no hay power-up de velocidad activo
        const newPipeSpeed = 2 + Math.floor(score / 5) * 0.5;
        if (newPipeSpeed !== pipeSpeed) {
          pipeSpeed = newPipeSpeed;
          pipeIntervalTime = 2000 - (pipeSpeed - 2) * 20;
          pipeGap = score < 50 ? Math.max(80, basePipeGap - (pipeSpeed - 2) * 2) : Math.max(80, basePipeGap - (score - 50) * 1);
          clearInterval(pipeInterval);
          pipeInterval = setInterval(createPipe, pipeIntervalTime);
        }
      }
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
      const birdRect = elements.bird.getBoundingClientRect();
      const pipeTopRect = pipe.top.getBoundingClientRect();
      const pipeBottomRect = pipe.bottom.getBoundingClientRect();
      if (
        birdRect.right > pipeTopRect.left &&
        birdRect.left < pipeTopRect.right &&
        (birdRect.top < pipeTopRect.bottom || birdRect.bottom > pipeBottomRect.top)
      ) {
        if (activeShield) {
          activeShield = false;
          elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
          pipe.top.remove();
          pipe.bottom.remove();
          pipes.splice(index, 1);
          return;
        } else {
          endGame();
          return;
        }
      }
      if (pipe.x + pipeWidth < birdX && !pipe.passed) {
        score++;
        elements.scoreDisplay.textContent = score;
        pipe.passed = true;
      }
      if (pipe.x + pipeWidth < -pipeWidth) {
        pipe.top.remove();
        pipe.bottom.remove();
        pipes.splice(index, 1);
      }
    });
  }
  function updateBird() {
    if (!gameActive) return;
  
    if (gameMode === 'inverse') {
      // Modo Inverso: aplicar gravedad desde el inicio
      if (isInputActive) {
        velocity += gravity; // Baja con gravedad cuando se presiona
      } else {
        velocity -= 0.5; // Sube cuando se suelta
      }
      hasInteractedInverse = true; // Marcar como interactuado desde el inicio para consistencia
    } else {
      // Modos normales: aplicar gravedad normalmente
      velocity += gravity;
      if (isInputActive) {
        velocity = jump; // Mantener el salto mientras se presiona
      }
    }
  
    // Limitar la velocidad máxima
    if (velocity > maxVelocity) velocity = maxVelocity;
    if (velocity < -maxVelocity) velocity = -maxVelocity;
  
    birdY += velocity;
    elements.bird.style.top = `${birdY}px`;
  
    // Verificar colisión con los bordes de la pantalla
    if (birdY <= 0 || birdY + birdSize >= gameHeight) {
      if (activeShield) {
        birdY = Math.max(0, Math.min(birdY, gameHeight - birdSize));
        velocity = 0;
      } else {
        endGame();
        return;
      }
    }
  
    // Generar partículas si están equipadas
    if (gameActive && equippedItems['trail-effect'] && (!elements.bird.lastParticleTime || Date.now() - elements.bird.lastParticleTime > 100)) {
      createParticle();
      elements.bird.lastParticleTime = Date.now();
    }
  }

  function jumpHandler(e) {
    if (!gameActive) return;
    e.preventDefault();
    isInputActive = true;
    if (gameMode === 'inverse') {
      hasInteractedInverse = true; // Registrar la primera interacción
      velocity = gravity; // Iniciar bajada
    } else {
      velocity = jump; // Modos normales: salto hacia arriba
    }
  }

  function releaseHandler(e) {
    if (!gameActive) return;
    e.preventDefault();
    isInputActive = false;
    if (gameMode === 'inverse') {
      hasInteractedInverse = true; // Registrar interacción
      velocity = -0.5; // Subir al soltar
    }
    // En modos normales, la gravedad se encarga
  }

  // Añadir event listeners para los controles
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jumpHandler(e);
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') releaseHandler(e);
  });

  document.addEventListener('mousedown', jumpHandler);
  document.addEventListener('mouseup', releaseHandler);

  document.addEventListener('touchstart', jumpHandler, { passive: false });
  document.addEventListener('touchend', releaseHandler, { passive: false });

  function startGame() {
    if (!characterSelected) {
      alert('Por favor, selecciona o personaliza un personaje antes de jugar.');
      elements.gameModeMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      return;
    }
    // Cancelar cualquier gameLoop previo
    if (gameLoopId) {
      cancelAnimationFrame(gameLoopId);
      gameLoopId = null;
    }
    gameActive = true;
    score = 0;
    coins = 0;
    survivalTime = 0;
    difficultyLevel = 1;
    maxSurvivalLevel = 0;
    pipeSpeed = 2;
    pipeGap = basePipeGap;
    pipeIntervalTime = 2000;
    // Restablecer parámetros de movimiento según el modo (móvil o escritorio)
    if (isMobile) {
      gravity = 0.1;
      jump = -3;
      maxVelocity = 5;
    } else {
      gravity = 0.2;
      jump = -6;
      maxVelocity = 8;
    }
    velocity = 0; // Reiniciar velocity
    isInputActive = false; // Reiniciar estado de entrada
    hasInteractedInverse = false; // Reiniciar interacción para modo inverso
    birdY = (gameHeight - birdSize) / 2; // Centrar el pájaro según su tamaño
    birdY = Math.max(0, Math.min(birdY, gameHeight - birdSize)); // Asegurar que esté dentro de los límites
    elements.bird.style.top = `${birdY}px`;
    elements.bird.style.left = `${birdX}px`;
    pipes = [];
    coinsInGame = [];
    particles = [];
    powerUps = [];
    activeShield = false;
    speedBoostActive = false;
    magnetActive = false;
    lastPowerUpType = null;
    elements.scoreDisplay.textContent = score;
    elements.coinsDisplay.textContent = coins;
    elements.gameArea.innerHTML = '';
    elements.gameArea.appendChild(elements.bird);
    if (gameMode === 'survival') {
      elements.difficultyLevelDisplay.style.display = 'block';
      elements.difficultyLevelDisplay.textContent = `Nivel ${difficultyLevel}`;
      elements.gameArea.appendChild(elements.difficultyLevelDisplay);
    }
    applyCharacter();
    elements.gameModeMenu.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');
    elements.gameOverScreen.classList.add('hidden');
    elements.gameArea.classList.remove('hidden');
    if (pipeInterval) clearInterval(pipeInterval);
    pipeInterval = setInterval(createPipe, pipeIntervalTime);
    let lastTime = performance.now();
    function gameLoop(currentTime) {
      if (!gameActive) return;
      const deltaTime = currentTime - lastTime; // Tiempo en milisegundos desde el último frame
      lastTime = currentTime;

      // Actualizar survivalTime en cada frame si estamos en modo survival
      if (gameMode === 'survival') {
        survivalTime += deltaTime;
      }

      updateBird();
      movePipes();
      moveCoins();
      movePowerUps();
      updateParticles();
      adjustDifficulty(); // Llamar a adjustDifficulty en cada frame

      gameLoopId = requestAnimationFrame(gameLoop);
    }
    gameLoopId = requestAnimationFrame(gameLoop);
  }

  function endGame() {
    gameActive = false;
    // Cancelar el gameLoop
    if (gameLoopId) {
      cancelAnimationFrame(gameLoopId);
      gameLoopId = null;
    }
    clearInterval(pipeInterval);
    totalCoins += coins;
    if (gameMode === 'survival' && maxSurvivalLevel >= 5) { // Cambiado de 10 a 5
      totalCoins += 5;
      setTimeout(() => {
        alert('¡Has ganado 5 monedas por llegar al nivel 5!'); // Mensaje actualizado
        elements.gameContainer.classList.remove('hidden');
        elements.gameArea.classList.add('hidden');
        elements.gameOverScreen.classList.remove('hidden');
        elements.menu.classList.add('hidden');
      }, 500);
    } else {
      elements.gameContainer.classList.remove('hidden');
      elements.gameArea.classList.add('hidden');
      elements.gameOverScreen.classList.remove('hidden');
      elements.menu.classList.add('hidden');
    }
    localStorage.setItem('totalCoins', totalCoins);
    elements.finalScoreDisplay.textContent = score;
    elements.totalCoinsDisplay.textContent = totalCoins;
    updateHighScores();
    pipes.forEach(pipe => { pipe.top.remove(); pipe.bottom.remove(); });
    coinsInGame.forEach(coin => coin.element.remove());
    particles.forEach(particle => particle.element.remove());
    powerUps.forEach(powerUp => powerUp.element.remove());
    pipes = [];
    coinsInGame = [];
    particles = [];
    powerUps = [];
    activeShield = false;
    speedBoostActive = false;
    magnetActive = false;
    clearTimeout(elements.bird.shieldTimeout);
    clearTimeout(elements.bird.speedTimeout);
    clearTimeout(elements.bird.magnetTimeout);
    elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  }

  if (elements.restartButton) {
    elements.restartButton.addEventListener('click', () => {
      elements.gameOverScreen.classList.add('hidden');
      elements.gameModeMenu.classList.remove('hidden');
    });
  }

  // Inicializar el juego
  adjustGameDimensions();
  checkOrientation();
  updateCharacterOptions();
  updateEquipOptions();
  applyCharacter();
  updateCustomBirdPreview();
});