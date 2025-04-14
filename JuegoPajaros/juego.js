document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM completamente cargado, iniciando script...');

  // Declaración de elementos del DOM con verificación
  const elements = {
    bird: document.getElementById('bird'),
    gameArea: document.querySelector('.game-area'),
    scoreDisplay: document.getElementById('score'),
    coinsDisplay: document.getElementById('coins'),
    levelDisplay: document.getElementById('level'),
    xpBar: document.getElementById('xp-bar'),
    difficultyLevelDisplay: document.createElement('span'),
    gameOverScreen: document.getElementById('game-over'),
    finalScoreDisplay: document.getElementById('final-score'),
    totalCoinsDisplay: document.getElementById('total-coins'),
    unlockMessage: document.getElementById('unlock-message'),
    restartButton: document.getElementById('restart-button'),
    menu: document.getElementById('menu'),
    menuLevelDisplay: document.getElementById('menu-level'),
    menuXpDisplay: document.getElementById('menu-xp'),
    progressButton: document.getElementById('progress-button'),
    progressMenu: document.getElementById('progress-menu'),
    progressLevelDisplay: document.getElementById('progress-level'),
    progressXpDisplay: document.getElementById('progress-xp'),
    progressXpBar: document.getElementById('progress-xp-bar'),
    progressItemsContainer: document.getElementById('progress-items'),
    backToMenuFromProgress: document.getElementById('back-to-menu-from-progress'),
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
    inverseModeButton: document.getElementById('inverse-mode-button'),
    backToMainMenu: document.getElementById('back-to-main-menu'),
    achievementsButton: document.getElementById('achievements-button'),
    achievementsMenu: document.getElementById('achievements-menu'),
    achievementsItemsContainer: document.getElementById('achievements-items'),
    backToMenuFromAchievements: document.getElementById('back-to-menu-from-achievements'),
    achievementsNotification: document.getElementById('achievements-notification'),
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
    'trail-effect-3': { price: 40, description: 'Efecto de rastro (Fuego) 🔥', type: 'trail-effect', value: 'fire' },
    'bg-night': { price: 20, description: 'Fondo Noche 🌙', type: 'background', value: 'night' },
    'bg-space': { price: 25, description: 'Fondo Espacio 🚀', type: 'background', value: 'space' },
    'bg-forest': { price: 20, description: 'Fondo Bosque 🌲', type: 'background', value: 'forest' }
  };

  // Definir desbloqueos por nivel
  const levelUnlocks = [
    { level: 3, item: 'character-2', description: 'Personaje 2 🐤' },
    { level: 6, item: 'character-3', description: 'Personaje 3 🐥' },
    { level: 9, item: 'character-4', description: 'Personaje 4 🐧' },
    { level: 12, item: 'character-5', description: 'Personaje 5 🦅' },
    { level: 15, item: 'bg-night', description: 'Fondo Noche 🌙' },
    { level: 18, item: 'bg-space', description: 'Fondo Espacio 🚀' },
    { level: 21, item: 'bg-forest', description: 'Fondo Bosque 🌲' },
    { level: 24, item: 'trail-effect-1', description: 'Efecto de rastro (Estrellas) ✨' },
    { level: 27, item: 'trail-effect-2', description: 'Efecto de rastro (Corazones) 💕' },
    { level: 30, item: 'trail-effect-3', description: 'Efecto de rastro (Fuego) 🔥' },
  ];

  // Definir logros
  const achievements = [
    {
      id: 'score-novice',
      name: 'Puntuación Novato',
      description: 'Alcanza 10 puntos',
      condition: () => score >= 10,
      reward: { coins: 5, xp: 50 }
    },
    {
      id: 'score-medium',
      name: 'Puntuación Media',
      description: 'Alcanza 20 puntos',
      condition: () => score >= 20,
      reward: { coins: 10, xp: 100 }
    },
    {
      id: 'score-hard',
      name: 'Puntuación Difícil',
      description: 'Alcanza 50 puntos',
      condition: () => score >= 50,
      reward: { coins: 20, xp: 200 }
    },
    {
      id: 'score-pro',
      name: 'Puntuación Pro',
      description: 'Alcanza 100 puntos',
      condition: () => score >= 100,
      reward: { coins: 50, xp: 500 }
    },
    {
      id: 'collector-1',
      name: 'Coleccionista 1',
      description: 'Recoge 50 monedas en total',
      condition: () => totalCoins >= 50,
      reward: { coins: 15, xp: 150 }
    },
    {
      id: 'collector-2',
      name: 'Coleccionista 2',
      description: 'Recoge 100 monedas en total',
      condition: () => totalCoins >= 100,
      reward: { coins: 25, xp: 250 }
    },
    {
      id: 'collector-3',
      name: 'Coleccionista 3',
      description: 'Recoge 150 monedas en total',
      condition: () => totalCoins >= 150,
      reward: { coins: 35, xp: 350 }
    },
    {
      id: 'survivor-novice',
      name: 'Superviviente Novato',
      description: 'Sobrevive 60 segundos sin chocar',
      condition: () => survivalTime >= 60000,
      reward: { coins: 10, xp: 100 }
    },
    {
      id: 'survivor-medium',
      name: 'Superviviente Medio',
      description: 'Sobrevive 120 segundos sin chocar',
      condition: () => survivalTime >= 120000,
      reward: { coins: 20, xp: 200 }
    },
    {
      id: 'survivor-pro',
      name: 'Superviviente Pro',
      description: 'Sobrevive 180 segundos sin chocar',
      condition: () => survivalTime >= 180000,
      reward: { coins: 30, xp: 300 }
    }
  ];

  // Variables del juego
  let birdY = 250;
  let gravity = 0.2;
  let velocity = 0;
  let jump = -6;
  let maxVelocity = 8;
  let score = 0;
  let coins = 0;
  let totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
  let playerLevel = parseInt(localStorage.getItem('playerLevel')) || 0;
  let playerXP = parseInt(localStorage.getItem('playerXP')) || 0;
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
  let survivalStartTime = 0;
  let maxSurvivalLevel = 0;
  let gameLoopId = null;
  let isInputActive = false;
  let hasInteractedInverse = false;

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
  let hasSelectedInSession = false;

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
    'trail-effect-3': false,
    'bg-night': false,
    'bg-space': false,
    'bg-forest': false
  };

  // Asegurar que character-1 esté desbloqueado
  if (!unlockedItems['character-1']) {
    unlockedItems['character-1'] = true;
    localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
  }

  let equippedItems = JSON.parse(localStorage.getItem('equippedItems')) || {
    'wings-style': 'wings-style-0',
    'pipe-style': null,
    'trail-effect': null,
    'background': null
  };

  // Estado de los logros
  let achievementsState = JSON.parse(localStorage.getItem('achievements')) || {};
  achievements.forEach(achievement => {
    if (!achievementsState[achievement.id]) {
      achievementsState[achievement.id] = { unlocked: false, claimed: false };
    }
  });

  // Sistema de niveles
  const levelThresholds = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 500 },
    { level: 5, xp: 1000 },
    { level: 6, xp: 1750 },
    { level: 7, xp: 2750 },
    { level: 8, xp: 4000 },
    { level: 9, xp: 5500 },
    { level: 10, xp: 7250 },
    { level: 11, xp: 9250 },
    { level: 12, xp: 11500 },
    { level: 13, xp: 14000 },
    { level: 14, xp: 16750 },
    { level: 15, xp: 19750 },
    { level: 16, xp: 23000 },
    { level: 17, xp: 26500 },
    { level: 18, xp: 30250 },
    { level: 19, xp: 34250 },
    { level: 20, xp: 38500 },
    { level: 21, xp: 43000 },
    { level: 22, xp: 47750 },
    { level: 23, xp: 52750 },
    { level: 24, xp: 58000 },
    { level: 25, xp: 63500 },
    { level: 26, xp: 69250 },
    { level: 27, xp: 75250 },
    { level: 28, xp: 81500 },
    { level: 29, xp: 88000 },
    { level: 30, xp: 94750 },
  ];

  // Función para obtener XP requerida para el siguiente nivel
  function getNextLevelXP(currentLevel) {
    const nextLevel = levelThresholds.find(threshold => threshold.level === currentLevel + 1);
    return nextLevel ? nextLevel.xp : levelThresholds[levelThresholds.length - 1].xp;
  }

  // Función para calcular el nivel basado en XP
  function calculateLevelFromXP(xp) {
    if (xp === 0) {
      return 0;
    }
    
    let newLevel = 0;
    for (let i = 0; i < levelThresholds.length; i++) {
      if (xp < levelThresholds[i].xp) {
        newLevel = i;
        break;
      }
      if (i === levelThresholds.length - 1 && xp >= levelThresholds[i].xp) {
        newLevel = levelThresholds.length;
      }
    }
    return newLevel;
  }

  // Inicialización de playerLevel y playerXP
  if (!localStorage.getItem('playerLevel') && !localStorage.getItem('playerXP')) {
    playerLevel = 0;
    playerXP = 0;
    localStorage.setItem('playerLevel', playerLevel);
    localStorage.setItem('playerXP', playerXP);
  } else {
    playerLevel = calculateLevelFromXP(playerXP);
    localStorage.setItem('playerLevel', playerLevel);
  }

  // Función para manejar desbloqueos por nivel
  function handleLevelUnlocks() {
    let unlockedSomething = false;
    let unlockMessages = [];
    let previousLevel = parseInt(localStorage.getItem('lastCheckedLevel')) || 0;

    // Revisar todos los niveles desde el último verificado hasta el nivel actual
    for (let level = previousLevel + 1; level <= playerLevel; level++) {
      const unlocksForLevel = levelUnlocks.filter(unlock => unlock.level === level);
      unlocksForLevel.forEach(unlock => {
        if (!unlockedItems[unlock.item]) {
          unlockedItems[unlock.item] = true;
          unlockedSomething = true;
          unlockMessages.push(unlock.description);
          console.log(`Desbloqueado: ${unlock.description} en el nivel ${unlock.level}`);
        }
      });
    }

    // Actualizar el último nivel verificado
    localStorage.setItem('lastCheckedLevel', playerLevel);
    localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));

    // Mostrar mensaje si se desbloqueó algo
    if (unlockedSomething) {
      const message = `¡Enhorabuena por llegar al nivel ${playerLevel}! Has desbloqueado: ${unlockMessages.join(', ')}.`;
      elements.unlockMessage.textContent = message;
      elements.unlockMessage.classList.remove('hidden');
      console.log('Mensaje de desbloqueo mostrado:', message);
      updateCharacterOptions();
      updateShop();
      setupProgressMenu();
    } else {
      elements.unlockMessage.classList.add('hidden');
      console.log('No hay nuevos desbloqueos para el nivel', playerLevel);
    }

    return unlockedSomething;
  }

  // Función para verificar y desbloquear logros
  function checkAchievements() {
    let newAchievements = false;
    achievements.forEach(achievement => {
      if (!achievementsState[achievement.id].unlocked && achievement.condition()) {
        achievementsState[achievement.id].unlocked = true;
        newAchievements = true;
        localStorage.setItem('achievements', JSON.stringify(achievementsState));
        showAchievementNotification(achievement.name);
        console.log(`Logro desbloqueado: ${achievement.name}`);
      }
    });
    if (newAchievements) {
      updateAchievementsNotification();
      setupAchievementsMenu();
    }
  }

  // Función para mostrar notificación de logro
  function showAchievementNotification(achievementName) {
    if (!gameActive) return;
    const notification = document.createElement('div');
    notification.classList.add('achievement-notification');
    notification.textContent = `¡Has desbloqueado ${achievementName}!`;
    elements.gameArea.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  // Función para actualizar la notificación en el botón de logros
  function updateAchievementsNotification() {
    const unclaimedAchievements = Object.keys(achievementsState).filter(
      id => achievementsState[id].unlocked && !achievementsState[id].claimed
    ).length;
    if (unclaimedAchievements > 0) {
      elements.achievementsNotification.textContent = unclaimedAchievements;
      elements.achievementsNotification.classList.remove('hidden');
    } else {
      elements.achievementsNotification.classList.add('hidden');
    }
  }

  // Configuración del menú de logros
  function setupAchievementsMenu() {
    if (!elements.achievementsItemsContainer) return;
    elements.achievementsItemsContainer.innerHTML = '';
    achievements.forEach(achievement => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'achievement-item';
      const isUnlocked = achievementsState[achievement.id].unlocked;
      const isClaimed = achievementsState[achievement.id].claimed;
      if (!isUnlocked) {
        itemDiv.classList.add('locked');
      }
      const statusText = isClaimed ? '<span class="completed">Reclamado</span>' : (isUnlocked ? '' : '');
      itemDiv.innerHTML = `
        <p>${achievement.name}: ${achievement.description}<br>
        <span class="reward-text">Recompensa: ${achievement.reward.coins} monedas, ${achievement.reward.xp} XP</span>
        ${statusText}</p>
      `;
      if (isUnlocked && !isClaimed) {
        const claimButton = document.createElement('button');
        claimButton.className = 'claim-button';
        claimButton.textContent = 'Reclamar';
        claimButton.addEventListener('click', () => {
          achievementsState[achievement.id].claimed = true;
          totalCoins += achievement.reward.coins;
          playerXP += achievement.reward.xp;
          localStorage.setItem('achievements', JSON.stringify(achievementsState));
          localStorage.setItem('totalCoins', totalCoins);
          localStorage.setItem('playerXP', playerXP);
          updateLevel();
          setupAchievementsMenu();
          updateAchievementsNotification();
          elements.shopCoinsDisplay.textContent = totalCoins;
        });
        itemDiv.appendChild(claimButton);
      }
      elements.achievementsItemsContainer.appendChild(itemDiv);
    });
  }

  // Evento para abrir el menú de logros
  if (elements.achievementsButton) {
    elements.achievementsButton.addEventListener('click', () => {
      elements.menu.classList.add('hidden');
      elements.achievementsMenu.classList.remove('hidden');
      setupAchievementsMenu();
      updateAchievementsNotification();
    });
  }

  // Evento para volver al menú principal desde logros
  if (elements.backToMenuFromAchievements) {
    elements.backToMenuFromAchievements.addEventListener('click', () => {
      elements.achievementsMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  }

  // Función para actualizar nivel y desbloqueos
  function updateLevel() {
    const oldLevel = playerLevel;
    playerLevel = calculateLevelFromXP(playerXP);
    localStorage.setItem('playerLevel', playerLevel);
    localStorage.setItem('playerXP', playerXP);

    if (playerLevel > oldLevel) {
      showLevelUpNotification();
      handleLevelUnlocks();
    }

    // Actualizar UI
    elements.levelDisplay.textContent = playerLevel;
    elements.menuLevelDisplay.textContent = playerLevel;
    elements.menuXpDisplay.textContent = playerXP;
    if (elements.progressLevelDisplay) elements.progressLevelDisplay.textContent = playerLevel;
    if (elements.progressXpDisplay) elements.progressXpDisplay.textContent = `${playerXP}/${getNextLevelXP(playerLevel)}`;

    // Actualizar barra de XP
    const currentLevelXP = playerLevel === 0 ? 0 : levelThresholds[playerLevel - 1]?.xp || 0;
    const nextLevelXP = getNextLevelXP(playerLevel);
    const xpProgress = nextLevelXP > currentLevelXP ? ((playerXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100 : 100;
    elements.xpBar.style.width = `${xpProgress}%`;
    if (elements.progressXpBar) elements.progressXpBar.style.width = `${xpProgress}%`;
  }

  // Función para mostrar notificación de subida de nivel
  function showLevelUpNotification() {
    const notification = document.createElement('div');
    notification.classList.add('level-up-notification');
    notification.textContent = `¡Subiste al nivel ${playerLevel}!`;
    elements.gameArea.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  // Configuración inicial del menú de progreso
  function setupProgressMenu() {
    if (!elements.progressItemsContainer) return;
    elements.progressItemsContainer.innerHTML = '';
    levelUnlocks.forEach(unlock => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'progress-item';
      const isUnlocked = playerLevel >= unlock.level;
      if (!isUnlocked) {
        itemDiv.classList.add('locked');
      }
      const statusText = isUnlocked ? '<span class="completed">Completado</span>' : '';
      itemDiv.innerHTML = `<p>Nivel ${unlock.level}: ${unlock.description} ${statusText}</p>`;
      elements.progressItemsContainer.appendChild(itemDiv);
    });
  }

  // Actualizar menú de progreso
  function updateProgressMenu() {
    if (!elements.progressMenu) return;
    elements.progressLevelDisplay.textContent = playerLevel;
    elements.progressXpDisplay.textContent = `${playerXP}/${getNextLevelXP(playerLevel)}`;
    
    const currentLevelXP = playerLevel === 0 ? 0 : levelThresholds[playerLevel - 1]?.xp || 0;
    const nextLevelXP = getNextLevelXP(playerLevel);
    const xpProgress = nextLevelXP > currentLevelXP 
      ? Math.min(100, ((playerXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
      : 100;
    
    elements.progressXpBar.style.width = `${xpProgress}%`;
    
    setupProgressMenu();
  }

  // Mostrar menú de progreso
  if (elements.progressButton) {
    elements.progressButton.addEventListener('click', () => {
      elements.menu.classList.add('hidden');
      elements.progressMenu.classList.remove('hidden');
      updateProgressMenu();
    });
  }

  // Volver al menú principal desde progreso
  if (elements.backToMenuFromProgress) {
    elements.backToMenuFromProgress.addEventListener('click', () => {
      elements.progressMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
    });
  }

  // Inicializar UI de nivel y XP
  updateLevel();
  setupProgressMenu();
  setupAchievementsMenu();
  updateAchievementsNotification();

  // Resto de las variables y configuraciones iniciales
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
  if (elements.progressMenu) elements.progressMenu.classList.add('hidden');
  if (elements.achievementsMenu) elements.achievementsMenu.classList.add('hidden');

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
      birdY = (gameHeight - birdSize) / 2;
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
      birdY = (gameHeight - birdSize) / 2;
      elements.gameArea.style.width = `${gameWidth}px`;
      elements.gameArea.style.height = `${gameHeight}px`;
      elements.bird.style.left = `${birdX}px`;
      elements.bird.style.top = `${birdY}px`;
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
        if (elements.progressMenu) elements.progressMenu.classList.add('hidden');
        if (elements.achievementsMenu) elements.achievementsMenu.classList.add('hidden');
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
      if (elements.progressMenu) elements.progressMenu.classList.add('hidden');
      if (elements.achievementsMenu) elements.achievementsMenu.classList.add('hidden');
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
        if (elements.progressMenu) elements.progressMenu.classList.add('hidden');
        if (elements.achievementsMenu) elements.achievementsMenu.classList.add('hidden');
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
      if (characterId === '1') {
        unlockedItems[`character-${characterId}`] = true;
        localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
      }
      if (unlockedItems[`character-${characterId}`]) option.classList.add('unlocked');
      else option.classList.remove('unlocked');
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
          applyBackground();
        });
        const unequipButton = document.createElement('button');
        unequipButton.classList.add('unequip-button');
        unequipButton.textContent = 'Desequipar';
        unequipButton.disabled = equippedItems[shopItems[item].type] !== item;
        unequipButton.addEventListener('click', () => {
          equippedItems[shopItems[item].type] = shopItems[item].type === 'wings-style' ? 'wings-style-0' : null;
          localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
          updateEquipOptions();
          applyCharacter();
          updateCustomBirdPreview();
          applyBackground();
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
        alert('¡Este personaje está bloqueado! Desbloquéalo en la tienda o subiendo de nivel.');
        return;
      }
      selectedCharacter = characterId;
      hasSelectedInSession = true;
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
      hasSelectedInSession = false;
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
      velocity = 0;
      updateEquipOptions();
      applyCharacter();
      applyBackground();
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
      velocity = 0;
      applyCharacter();
      applyBackground();
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

  function initializeModeButtons() {
    const modeButtons = [
      { button: elements.classicModeButton, mode: 'classic', desc: 'Esquiva tuberías y acumula puntos en un desafío clásico.', hasInfo: true },
      { button: elements.powerUpsModeButton, mode: 'power-ups', desc: 'Usa power-ups como escudos, velocidad y magnetismo para superar obstáculos.', hasInfo: true },
      { button: elements.survivalModeButton, mode: 'survival', desc: 'Sobrevive el mayor tiempo posible con dificultad creciente por niveles. ¡Gana 5 monedas al llegar al nivel 5!', hasInfo: true },
      { button: elements.inverseModeButton, mode: 'inverse', desc: 'Controles invertidos: toca para bajar y suelta para subir.', hasInfo: true },
      { button: elements.backToMainMenu, mode: null, desc: '', hasInfo: false }
    ];

    modeButtons.forEach(({ button, mode, desc, hasInfo }) => {
      if (button) {
        const originalText = button.textContent;
        const textSpan = document.createElement('span');
        textSpan.textContent = originalText;
        textSpan.classList.add('button-text');
        button.innerHTML = '';
        button.appendChild(textSpan);

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
            panel.style.maxWidth = `${button.offsetWidth}px`;
            panel.style.boxSizing = 'border-box';

            elements.gameModeMenu.appendChild(panel);

            const panelHeight = panel.offsetHeight;
            const buttonHeight = button.offsetHeight;
            const buttonTop = button.offsetTop;
            const gameModeMenuHeight = elements.gameModeMenu.offsetHeight;
            const gameModeMenuTop = elements.gameModeMenu.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;

            const spaceBelowInContainer = gameModeMenuHeight - (buttonTop + buttonHeight);
            const buttonBottomInViewport = gameModeMenuTop + buttonTop + buttonHeight;
            const spaceBelowInViewport = viewportHeight - buttonBottomInViewport;

            const fitsBelow = spaceBelowInContainer >= panelHeight && spaceBelowInViewport >= panelHeight;

            if (fitsBelow) {
              panel.style.top = `${buttonTop + buttonHeight + 5}px`;
              panel.style.bottom = 'auto';
            } else {
              panel.style.top = 'auto';
              panel.style.bottom = `${spaceBelowInContainer + buttonHeight + 5}px`;
            }

            document.addEventListener('click', (e) => {
              if (!panel.contains(e.target) && e.target !== infoButton) panel.remove();
            }, { once: true });
          });
        }

        if (mode) {
          button.addEventListener('click', () => {
            gameMode = mode;
            startGame();
          });
        } else {
          button.addEventListener('click', () => {
            elements.gameModeMenu.classList.add('hidden');
            elements.menu.classList.remove('hidden');
            document.querySelectorAll('.info-panel').forEach(panel => panel.remove());
          });
        }
      }
    });

    // Ajuste: Eliminar estilos de posición absoluta para progressButton y achievementsButton
    elements.progressButton.style.position = '';
    elements.progressButton.style.top = '';
    elements.progressButton.style.left = '';
    if (elements.achievementsButton) {
      elements.achievementsButton.style.position = '';
      elements.achievementsButton.style.top = '';
      elements.achievementsButton.style.left = '';
    }

    // Dentro de initializeModeButtons(), en la sección de estilos
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
      #game-mode-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 20px;
        background-color: #fff;
        border: 2px solid #000;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 90%;
        max-width: 400px;
        height: auto;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        overflow: hidden;
      }
      #game-mode-menu button {
        width: 100%;
        max-width: 350px;
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
        padding-right: 30px;
      }
      #game-mode-menu button .info-button {
        width: 20px;
        height: 20px;
        background-color: #ccc;
        color: #000;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        margin-left: 10px;
        cursor: pointer;
      }
      #game-mode-menu button:hover {
        background-color: #ff6347;
      }
      @media (max-width: 600px) {
        #game-mode-menu {
          width: 90%;
          max-width: 300px;
          height: auto;
          padding: 10px;
          overflow: hidden;
        }
        #game-mode-menu h2 {
          font-size: 1rem;
          margin-bottom: 10px;
        }
        #game-mode-menu button {
          max-width: 250px;
          padding: 6px;
          font-size: 12px;
        }
        #game-mode-menu button .button-text {
          padding-right: 20px;
        }
        #game-mode-menu button .info-button {
          width: 20px;
          height: 20px;
          font-size: 14px;
        }
      }
      #menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #fff;
        border: 2px solid #000;
        border-radius: 10px;
        padding: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 600px;
        box-sizing: border-box;
      }
      #progress-button, #achievements-button {
        width: 120px;
        padding: 10px 20px;
        font-size: 0.9rem;
        background-color: #ff4500;
        color: #fff;
        border: 2px solid #FFD700;
        border-radius: 5px;
        cursor: pointer;
        box-sizing: border-box;
        transition: background 0.3s, transform 0.1s;
      }
      #progress-button:hover, #achievements-button:hover {
        background-color: #FFD700;
        color: #ff4500;
        transform: scale(1.05);
      }
      #progress-menu, #achievements-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #fff;
        border: 2px solid #000;
        border-radius: 10px;
        padding: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 400px;
        box-sizing: border-box;
      }
      #progress-menu h2, #achievements-menu h2 {
        margin: 0 0 10px;
        font-size: 24px;
        color: #ff4500;
      }
      .progress-stats, .achievements-stats {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
      }
      #progress-xp-bar {
        height: 10px;
        background: #4caf50;
        width: 0%;
        transition: width 0.3s;
        margin: 5px auto;
        border: 1px solid #000;
        border-radius: 5px;
        max-width: 80%;
      }
      .progress-item, .achievement-item {
        width: 100%;
        padding: 5px;
        margin: 5px 0;
        background: #eee;
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .progress-item.locked, .achievement-item.locked {
        opacity: 0.5;
        background: #ccc;
      }
      .progress-item .completed, .achievement-item .completed {
        color: #4caf50;
        font-weight: bold;
      }
      .reward-text {
        color: #FFD700;
        font-size: 0.8em;
      }
      #back-to-menu-from-progress, #back-to-menu-from-achievements {
        width: 120px;
        padding: 10px 20px;
        font-size: 0.9rem;
        background-color: #ff4500;
        color: #fff;
        border: 2px solid #000;
        border-radius: 5px;
        cursor: pointer;
        box-sizing: border-box;
        transition: background 0.3s, transform 0.1s;
      }
      #back-to-menu-from-progress:hover, #back-to-menu-from-achievements:hover {
        background-color: #ff6347;
      }
      #unlock-message {
        color: #FFD700;
        font-weight: bold;
        margin-top: 10px;
        text-align: center;
      }
      .hidden {
        display: none;
      }
      @media (max-width: 600px) {
        #menu {
          width: 90%;
          max-width: 300px;
          padding: 10px;
        }
        #progress-button, #achievements-button {
          width: 15vmin;
          min-width: 12vmin;
          padding: 1.5vmin 3vmin;
          font-size: 1.2vmin;
        }
        #progress-menu, #achievements-menu {
          width: 90%;
          max-width: 300px;
          padding: 10px;
        }
        #progress-menu h2, #achievements-menu h2 {
          font-size: 18px;
        }
        #progress-xp-bar {
          max-width: 90%;
        }
        .progress-item, .achievement-item {
          font-size: 14px;
        }
        .reward-text {
          font-size: 0.7em;
        }
        #back-to-menu-from-progress, #back-to-menu-from-achievements {
          width: 12vmin;
          min-width: 10vmin;
          padding: 1vmin 1.5vmin;
          font-size: 1.2vmin;
        }
      }
    `;
    document.head.appendChild(styleSheet);
  }

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
    birdY = (gameHeight - birdSize) / 2;
    birdY = Math.max(0, Math.min(birdY, gameHeight - birdSize));
    elements.bird.style.top = `${birdY}px`;
  }

  function applyBackground() {
    elements.gameArea.classList.remove('bg-night', 'bg-space', 'bg-forest');
    if (equippedItems['background']) {
      const bg = shopItems[equippedItems['background']].value;
      elements.gameArea.classList.add(`bg-${bg}`);
    }
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
            playerXP += 5;
            localStorage.setItem('playerXP', playerXP);
            updateLevel();
            elements.coinsDisplay.textContent = coins;
            coin.element.remove();
            coinsInGame.splice(index, 1);
            checkAchievements();
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
        playerXP += 5;
        localStorage.setItem('playerXP', playerXP);
        updateLevel();
        elements.coinsDisplay.textContent = coins;
        coin.element.remove();
        coinsInGame.splice(index, 1);
        checkAchievements();
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
    elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    if (type === 'shield') {
        activeShield = true;
        elements.bird.style.boxShadow = '0 0 15px #00BFFF';
    } else if (type === 'speed') {
        speedBoostActive = true;
        const originalSpeed = pipeSpeed;
        pipeSpeed = originalSpeed * 1.5;
        elements.bird.speedTimeout = setTimeout(() => {
            speedBoostActive = false;
            pipeSpeed = originalSpeed;
            if (gameMode === 'survival') {
                pipeSpeed = 2 + difficultyLevel * 0.5;
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
      const newDifficultyLevel = Math.floor(survivalTime / 10000) + 1;
      if (newDifficultyLevel !== difficultyLevel) {
        difficultyLevel = newDifficultyLevel;
        elements.difficultyLevelDisplay.textContent = `Nivel ${difficultyLevel}`;
        pipeSpeed = 2 + difficultyLevel * 0.5;
        pipeGap = Math.max(100, basePipeGap - difficultyLevel * 10);
        pipeIntervalTime = Math.max(1000, 2000 - difficultyLevel * 100);
        clearInterval(pipeInterval);
        pipeInterval = setInterval(createPipe, pipeIntervalTime);
      }
      maxSurvivalLevel = Math.max(maxSurvivalLevel, difficultyLevel);
    } else {
      elements.difficultyLevelDisplay.style.display = 'none';
      if (!speedBoostActive) {
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
        const isColliding =
            birdRect.right > pipeTopRect.left &&
            birdRect.left < pipeTopRect.right &&
            (birdRect.top < pipeTopRect.bottom || birdRect.bottom > pipeBottomRect.top);
        if (isColliding) {
            if (gameMode === 'power-ups' && activeShield) {
                activeShield = false;
                elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                pipe.top.remove();
                pipe.bottom.remove();
                pipes.splice(index, 1);
                return; // Evita cualquier acción adicional para esta tubería
            } else {
                endGame();
                return;
            }
        }
        if (pipe.x + pipeWidth < birdX && !pipe.passed) {
            pipe.passed = true;
            score++;
            playerXP += 10;
            localStorage.setItem('playerXP', playerXP);
            updateLevel();
            elements.scoreDisplay.textContent = score;
            checkAchievements();
        }
        if (pipe.x < -pipeWidth) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.splice(index, 1);
        }
    });
}

function endGame() {
  gameActive = false;
  isInputActive = false;
  cancelAnimationFrame(gameLoopId);
  clearInterval(pipeInterval);
  clearTimeout(elements.bird.shieldTimeout);
  clearTimeout(elements.bird.speedTimeout);
  clearTimeout(elements.bird.magnetTimeout);
  elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  activeShield = false;
  speedBoostActive = false;
  magnetActive = false;
  totalCoins += coins;
  localStorage.setItem('totalCoins', totalCoins);
  updateLevel();
  updateHighScores();
  checkAchievements();
  if (gameMode === 'survival' && maxSurvivalLevel >= 5) {
      totalCoins += 5;
      localStorage.setItem('totalCoins', totalCoins);
      elements.unlockMessage.textContent = '¡Has ganado 5 monedas por alcanzar el nivel 5 en modo Supervivencia!';
      elements.unlockMessage.classList.remove('hidden');
  }
  elements.finalScoreDisplay.textContent = score;
  elements.totalCoinsDisplay.textContent = totalCoins;
  elements.gameContainer.classList.add('hidden');
  elements.gameOverScreen.classList.remove('hidden');
  elements.unlockMessage.classList.remove('hidden');
}

function resetGame() {
  birdY = (gameHeight - birdSize) / 2;
  velocity = gameMode === 'inverse' ? jump : 0; // Iniciar con impulso hacia arriba en modo inverse
  score = 0;
  coins = 0;
  survivalTime = 0;
  maxSurvivalLevel = 0;
  difficultyLevel = 1;
  pipeSpeed = 2;
  pipeGap = basePipeGap;
  pipeIntervalTime = 2000;
  elements.scoreDisplay.textContent = score;
  elements.coinsDisplay.textContent = coins;
  elements.bird.style.top = `${birdY}px`;
  pipes.forEach(pipe => {
      pipe.top.remove();
      pipe.bottom.remove();
  });
  coinsInGame.forEach(coin => coin.element.remove());
  powerUps.forEach(powerUp => powerUp.element.remove());
  particles.forEach(particle => particle.element.remove());
  pipes = [];
  coinsInGame = [];
  powerUps = [];
  particles = [];
  elements.difficultyLevelDisplay.style.display = 'none';
  clearInterval(pipeInterval);
  clearTimeout(elements.bird.shieldTimeout);
  clearTimeout(elements.bird.speedTimeout);
  clearTimeout(elements.bird.magnetTimeout);
  elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  activeShield = false;
  speedBoostActive = false;
  magnetActive = false;
  lastPowerUpType = null;
  isInputActive = false;
}

function startGame() {
  if (!characterSelected) {
      alert('Por favor, selecciona o personaliza un personaje antes de jugar.');
      elements.gameModeMenu.classList.add('hidden');
      elements.menu.classList.remove('hidden');
      return;
  }
  resetGame();
  elements.gameModeMenu.classList.add('hidden');
  elements.gameContainer.classList.remove('hidden');
  elements.gameOverScreen.classList.add('hidden');
  elements.unlockMessage.classList.add('hidden');
  gameActive = true;
  applyCharacter();
  applyBackground();
  elements.gameArea.appendChild(elements.difficultyLevelDisplay);
  if (gameMode === 'survival') {
      elements.difficultyLevelDisplay.style.display = 'block';
      elements.difficultyLevelDisplay.textContent = `Nivel ${difficultyLevel}`;
      survivalStartTime = Date.now();
  }
  pipeInterval = setInterval(createPipe, pipeIntervalTime);
  gameLoopId = requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!gameActive) return;
  // En modo inverso, la velocidad se controla completamente por handleInput/handleInputEnd
  if (gameMode !== 'inverse') {
      velocity += gravity;
  } else if (!isInputActive) {
      // En modo inverso, sin input activo, el pájaro tiende a subir
      velocity = jump; // Mantener impulso hacia arriba cuando no se presiona
  }
  velocity = Math.min(velocity, maxVelocity);
  birdY += velocity;
  birdY = Math.max(0, Math.min(birdY, gameHeight - birdSize));
  elements.bird.style.top = `${birdY}px`;
  if (birdY <= 0 || birdY >= gameHeight - birdSize) {
      if (gameMode === 'power-ups' && activeShield) {
          activeShield = false;
          elements.bird.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
          velocity = 0;
          birdY = birdY <= 0 ? 0 : gameHeight - birdSize;
      } else {
          endGame();
          return;
      }
  }
  movePipes();
  moveCoins();
  movePowerUps();
  updateParticles();
  createParticle();
  if (gameMode === 'survival') {
      survivalTime = Date.now() - survivalStartTime;
      checkAchievements();
  }
  adjustDifficulty();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function createPipe() {
  const minHeight = 20; // Reducir para permitir huecos más arriba
  const maxHeight = gameHeight - pipeGap - 20; // Reducir para permitir huecos más abajo
  // Asegurar que el rango sea lo suficientemente amplio para variabilidad
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

function handleInput() {
  if (!gameActive) return;
  if (gameMode === 'inverse') {
      isInputActive = true;
      velocity = gravity * 15; // Velocidad constante hacia abajo mientras se presiona
  } else {
      velocity = jump;
  }
}

function handleInputEnd() {
  if (!gameActive) return;
  if (gameMode === 'inverse') {
      isInputActive = false;
      velocity = jump; // Impulso hacia arriba al soltar
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
      e.preventDefault();
      handleInput();
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') {
      handleInputEnd();
  }
});

elements.gameArea.addEventListener('mousedown', (e) => {
  e.preventDefault();
  handleInput();
});

elements.gameArea.addEventListener('mouseup', (e) => {
  handleInputEnd();
});

elements.gameArea.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handleInput();
}, { passive: false });

elements.gameArea.addEventListener('touchend', (e) => {
  handleInputEnd();
}, { passive: false });

if (elements.restartButton) {
  elements.restartButton.addEventListener('click', () => {
      elements.gameOverScreen.classList.add('hidden');
      elements.gameModeMenu.classList.remove('hidden');
  });
}

checkOrientation();
adjustGameDimensions();
updateCharacterOptions();
updateEquipOptions();
updateShop();
applyCharacter();
applyBackground();
updateCustomBirdPreview();
updateLevel();
setupProgressMenu();
setupAchievementsMenu();
updateAchievementsNotification();

console.log('Script inicializado correctamente');
});