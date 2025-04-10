document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado, iniciando script...');

  // Declaración de elementos del DOM con verificación
  const elements = {
    bird: document.getElementById('bird'),
    gameArea: document.querySelector('.game-area'),
    scoreDisplay: document.getElementById('score'),
    coinsDisplay: document.getElementById('coins'),
    gameOverScreen: document.getElementById('game-over'),
    finalScoreDisplay: document.getElementById('final-score'),
    totalCoinsDisplay: document.getElementById('total-coins'),
    restartButton: document.getElementById('restart-button'),
    menu: document.getElementById('menu'),
    gameContainer: document.querySelector('.game-container'),
    playButton: document.getElementById('play-button'),
    shopButton: document.getElementById('shop-button'),
    characterOptions: document.querySelectorAll('.character-option'),
    bodyColorInput: document.getElementById('body-color'),
    wingsColorInput: document.getElementById('wings-color'),
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
  };

  // Verificar elementos clave
  Object.keys(elements).forEach(key => {
    if (!elements[key] && key !== 'characterOptions') {
      console.error(`Elemento ${key} no encontrado en el DOM`);
    }
  });

  // Definir shopItems primero para evitar el ReferenceError
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

  let bodyColor = '#FFD700';
  let wingsColor = '#FFFFFF';

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
  elements.menu.classList.add('hidden');
  elements.gameContainer.classList.add('hidden');
  elements.customizationMenu.classList.add('hidden');
  elements.equipMenu.classList.add('hidden');
  elements.shopMenu.classList.add('hidden');
  elements.gameOverScreen.classList.add('hidden');
  elements.orientationLock.classList.add('hidden');

  // Iniciar la animación de la barra de carga
  if (elements.loadingBar) {
    console.log('Iniciando animación de la barra de carga...');
    elements.loadingBar.style.transition = 'width 5s linear';
    elements.loadingBar.offsetWidth;
    elements.loadingBar.style.width = '100%';
  } else {
    console.error('Elemento #loading-bar no encontrado');
  }

  // Mostrar el botón "Jugar" después de 5 segundos
  setTimeout(() => {
    console.log('Ocultando barra de carga y mostrando botón Jugar...');
    if (elements.loadingBarContainer) {
      elements.loadingBarContainer.classList.add('hidden');
    } else {
      console.error('Elemento .loading-bar-container no encontrado');
    }
    if (elements.startGameButton) {
      elements.startGameButton.classList.remove('hidden');
    } else {
      console.error('Elemento #start-game-button no encontrado');
    }
  }, 5000);

  // Evento del botón "Jugar"
  if (elements.startGameButton) {
    const startGameHandler = () => {
      console.log('Botón Jugar clicado');
      elements.welcomeScreen.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      elements.customizationMenu.classList.add('hidden');
      elements.gameContainer.classList.add('hidden');
      elements.equipMenu.classList.add('hidden');
      elements.shopMenu.classList.add('hidden');
      elements.gameOverScreen.classList.add('hidden');
      checkOrientation();
    };

    elements.startGameButton.addEventListener('click', startGameHandler);
    elements.startGameButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startGameHandler();
    });
  }

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

      elements.gameArea.style.width = `${gameWidth}px`;
      elements.gameArea.style.height = `${gameHeight}px`;

      elements.bird.style.left = `${birdX}px`;
      elements.bird.style.top = `${birdY}px`;
    }
  }

  function checkOrientation() {
    if (elements.welcomeScreen && !elements.welcomeScreen.classList.contains('hidden')) {
      return;
    }

    if (!isMobile) {
      elements.orientationLock.classList.add('hidden');
      if (!gameActive) {
        if (!elements.customizationMenu.classList.contains('hidden')) {
          return;
        }
        elements.menu.classList.remove('hidden');
        elements.gameContainer.classList.add('hidden');
        elements.customizationMenu.classList.add('hidden');
        elements.equipMenu.classList.add('hidden');
        elements.shopMenu.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');
      }
      return;
    }

    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (!isLandscape) {
      elements.orientationLock.classList.remove('hidden');
      elements.gameContainer.classList.add('hidden');
      elements.menu.classList.add('hidden');
      elements.customizationMenu.classList.add('hidden');
      elements.equipMenu.classList.add('hidden');
      elements.shopMenu.classList.add('hidden');
      elements.gameOverScreen.classList.add('hidden');
    } else {
      elements.orientationLock.classList.add('hidden');
      adjustGameDimensions();
      if (!gameActive) {
        if (!elements.customizationMenu.classList.contains('hidden')) {
          return;
        }
        elements.menu.classList.remove('hidden');
        elements.gameContainer.classList.add('hidden');
        elements.customizationMenu.classList.add('hidden');
        elements.equipMenu.classList.add('hidden');
        elements.shopMenu.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');
      } else {
        elements.gameContainer.classList.remove('hidden');
        elements.menu.classList.add('hidden');
        elements.customizationMenu.classList.add('hidden');
        elements.equipMenu.classList.add('hidden');
        elements.shopMenu.classList.add('hidden');
        elements.gameOverScreen.classList.add('hidden');
      }
    }
  }

  window.addEventListener('orientationchange', checkOrientation);
  window.addEventListener('resize', () => {
    checkOrientation();
    adjustGameDimensions();
  });

  function updateCustomBirdPreview() {
    if (!elements.customBirdPreview) {
      console.warn('No se puede ejecutar updateCustomBirdPreview: customBirdPreview no encontrado');
      return;
    }

    elements.customBirdPreview.style.background = bodyColor;
    elements.customBirdPreview.style.width = `${birdSize}px`;
    elements.customBirdPreview.style.height = `${birdSize}px`;
    elements.customBirdPreview.style.setProperty('--wings-color', wingsColor);

    elements.customBirdPreview.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2');
    if (equippedItems['wings-style'] && shopItems[equippedItems['wings-style']]) {
      const style = shopItems[equippedItems['wings-style']].value;
      if (style === 'default') {
        elements.customBirdPreview.classList.add('wings-style-0');
      } else if (style === 'golden') {
        elements.customBirdPreview.classList.add('wings-style-1');
      } else if (style === 'demonic') {
        elements.customBirdPreview.classList.add('wings-style-2');
      }
    }
  }

  function updateCharacterOptions() {
    elements.characterOptions.forEach(option => {
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
    elements.equipOptions.innerHTML = '';

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
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.score}</td>
        <td>${entry.date}</td>
      `;
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
      localStorage.setItem('selectedCharacter', selectedCharacter);
      updateCharacterOptions();
      elements.menu.classList.add('hidden');
      elements.customizationMenu.classList.remove('hidden');
      updateCustomBirdPreview();
    });
  } else {
    console.error('Botón #customize-character-button no encontrado');
  }

  if (elements.confirmCustomization) {
    elements.confirmCustomization.addEventListener('click', () => {
      console.log('Botón Confirmar clicado');
      bodyColor = elements.bodyColorInput.value;
      wingsColor = elements.wingsColorInput.value;
      hasCustomized = true;
      characterSelected = true;
      localStorage.setItem('hasCustomized', JSON.stringify(hasCustomized));
      localStorage.setItem('characterSelected', JSON.stringify(characterSelected));
      elements.customizationMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      elements.playButton.disabled = false;
      updateEquipOptions();
      applyCharacter();
    });
  } else {
    console.error('Botón #confirm-customization no encontrado');
  }

  if (elements.backToMenu) {
    elements.backToMenu.addEventListener('click', () => {
      elements.customizationMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  } else {
    console.error('Botón #back-to-menu no encontrado');
  }

  if (elements.confirmEquip) {
    elements.confirmEquip.addEventListener('click', () => {
      console.log('Botón Confirmar (Equipar) clicado');
      birdSize = elements.equipBirdSizeInput.value;
      applyCharacter();
      elements.equipMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      elements.playButton.disabled = false;
      characterSelected = true;
      localStorage.setItem('characterSelected', JSON.stringify(characterSelected));
    });
  } else {
    console.error('Botón #confirm-equip no encontrado');
  }

  if (elements.backToSelection) {
    elements.backToSelection.addEventListener('click', () => {
      elements.equipMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      elements.playButton.disabled = !characterSelected;
    });
  } else {
    console.error('Botón #back-to-selection no encontrado');
  }

  if (elements.bodyColorInput) {
    elements.bodyColorInput.addEventListener('input', () => {
      bodyColor = elements.bodyColorInput.value;
      updateCustomBirdPreview();
    });
  } else {
    console.error('Elemento #body-color no encontrado');
  }

  if (elements.wingsColorInput) {
    elements.wingsColorInput.addEventListener('input', () => {
      wingsColor = elements.wingsColorInput.value;
      updateCustomBirdPreview();
    });
  } else {
    console.error('Elemento #wings-color no encontrado');
  }

  if (elements.shopButton) {
    elements.shopButton.addEventListener('click', () => {
      elements.menu.classList.add('hidden');
      elements.shopMenu.classList.remove('hidden');
      updateShop();
    });
  } else {
    console.error('Botón #shop-button no encontrado');
  }

  if (elements.backToMenuFromShop) {
    elements.backToMenuFromShop.addEventListener('click', () => {
      elements.shopMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  } else {
    console.error('Botón #back-to-menu-from-shop no encontrado');
  }

  function applyCharacter() {
    let image;

    if (selectedCharacter) {
      const character = predefinedCharacters[selectedCharacter];
      image = character.image;
    } else {
      image = null;
    }

    elements.bird.style.background = image ? `url(${image})` : bodyColor;
    elements.bird.style.backgroundSize = 'cover';
    elements.bird.style.backgroundPosition = 'center';
    elements.bird.style.width = `${birdSize}px`;
    elements.bird.style.height = `${birdSize}px`;
    elements.bird.style.setProperty('--wings-color', wingsColor);

    elements.bird.classList.remove('wings-style-0', 'wings-style-1', 'wings-style-2');
    if (equippedItems['wings-style'] && shopItems[equippedItems['wings-style']]) {
      const style = shopItems[equippedItems['wings-style']].value;
      if (style === 'default') {
        elements.bird.classList.add('wings-style-0');
      } else if (style === 'golden') {
        elements.bird.classList.add('wings-style-1');
      } else if (style === 'demonic') {
        elements.bird.classList.add('wings-style-2');
      }
    }

    particles.forEach(particle => particle.element.remove());
    particles = [];
  }

  function createParticle() {
    if (!equippedItems['trail-effect'] || !shopItems[equippedItems['trail-effect']]) return;

    const effect = shopItems[equippedItems['trail-effect']].value;
    if (effect !== 'stars' && effect !== 'hearts' && effect !== 'fire') return;

    const particle = document.createElement('div');
    particle.classList.add('particle');
    if (effect === 'stars') {
      particle.classList.add('particle-stars');
    } else if (effect === 'hearts') {
      particle.classList.add('particle-hearts');
    } else if (effect === 'fire') {
      particle.classList.add('particle-fire');
    }

    const birdRect = elements.bird.getBoundingClientRect();
    const gameAreaRect = elements.gameArea.getBoundingClientRect();
    const x = birdX - 10;
    const y = birdY + (birdSize / 2);
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    elements.gameArea.appendChild(particle);

    particles.push({
      element: particle,
      x: x,
      y: y,
      lifetime: 500
    });

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

  function moveCoins() {
    coinsInGame.forEach((coin, index) => {
      coin.x -= pipeSpeed;
      coin.element.style.left = `${coin.x}px`;

      const birdRect = elements.bird.getBoundingClientRect();
      const coinRect = coin.element.getBoundingClientRect();

      if (
        birdRect.right > coinRect.left &&
        birdRect.left < coinRect.right &&
        birdRect.bottom > coinRect.top &&
        birdRect.top < coinRect.bottom
      ) {
        coins++;
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

    if (equippedItems['pipe-style'] && shopItems[equippedItems['pipe-style']]) {
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

    elements.gameArea.appendChild(pipeTop);
    elements.gameArea.appendChild(pipeBottom);

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
      if (score < 50) {
        pipeGap = Math.max(100, 200 - (pipeSpeed - 2) * 2);
      }
      if (pipeInterval) {
        clearInterval(pipeInterval);
      }
      pipeInterval = setInterval(() => {
        if (gameActive) {
          createPipe();
        }
      }, pipeIntervalTime);
    }

    if (score >= 50) {
      const reductionFactor = (score - 50) * 1;
      pipeGap = Math.max(80, 200 - reductionFactor);
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

      if (birdY <= 0 || birdY >= gameHeight - parseInt(elements.bird.style.height)) {
        endGame();
        return;
      }

      if (pipe.x + pipeWidth < birdX && !pipe.passed) {
        score++;
        elements.scoreDisplay.textContent = score;
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
    elements.bird.style.top = `${birdY}px`;

    if (gameActive && equippedItems['trail-effect']) {
      if (!elements.bird.lastParticleTime || Date.now() - elements.bird.lastParticleTime > 100) {
        createParticle();
        elements.bird.lastParticleTime = Date.now();
      }
    }
  }

  function endGame() {
    gameActive = false;
    elements.finalScoreDisplay.textContent = score;
    totalCoins += coins;
    localStorage.setItem('totalCoins', totalCoins);
    elements.totalCoinsDisplay.textContent = totalCoins;
    updateHighScores();

    elements.gameArea.classList.add('hidden');
    elements.gameOverScreen.classList.remove('hidden');
    elements.menu.classList.add('hidden');
    elements.customizationMenu.classList.add('hidden');
    elements.equipMenu.classList.add('hidden');
    elements.shopMenu.classList.add('hidden');
    elements.gameContainer.classList.remove('hidden');

    pipes.forEach((pipe) => {
      pipe.top.remove();
      pipe.bottom.remove();
    });
    coinsInGame.forEach((coin) => {
      coin.element.remove();
    });
    particles.forEach((particle) => {
      particle.element.remove();
    });
    pipes = [];
    coinsInGame = [];
    particles = [];
    if (pipeInterval) {
      clearInterval(pipeInterval);
      pipeInterval = null;
    }
  }

  function startGame() {
    gameActive = true;
    score = 0;
    coins = 0;
    elements.scoreDisplay.textContent = score;
    elements.coinsDisplay.textContent = coins;
    birdY = gameHeight * 0.5;
    velocity = 0;
    elements.bird.style.top = `${birdY}px`;
    elements.gameOverScreen.classList.add('hidden');
    elements.gameArea.classList.remove('hidden');
    pipes = [];
    coinsInGame = [];
    particles = [];

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
        updateParticles();
        requestAnimationFrame(gameLoop);
      }
    }
    gameLoop();
  }

  if (elements.playButton) {
    elements.playButton.addEventListener('click', () => {
      console.log('Botón Jugar clicado');
      applyCharacter();
      elements.menu.classList.add('hidden');
      elements.gameContainer.classList.remove('hidden');
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
    if (gameActive) {
      e.preventDefault();
    }
  });

  if (elements.restartButton) {
    elements.restartButton.addEventListener('click', () => {
      elements.gameOverScreen.classList.add('hidden');
      elements.gameContainer.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  } else {
    console.error('Botón #restart-button no encontrado');
  }

  updateCharacterOptions();
  updateShop();
  checkOrientation();
  adjustGameDimensions();
  elements.playButton.disabled = !characterSelected;
});