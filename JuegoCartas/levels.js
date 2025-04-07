let currentLevel = 1;

const basePairs = [
    'img/image1.jpg', 'img/image2.jpg', 'img/image3.jpg', 'img/image4.jpg',
    'img/image5.jpg', 'img/image6.jpg', 'img/image7.jpg', 'img/image8.jpg'
];

const additionalPairsLevel2 = [
    'img/image9.jpg', 'img/image10.jpg'
];

const additionalPairsLevel3 = [
    'img/image11.jpg', 'img/image12.jpg'
];
const additionalPairsLevel4 = [
    'img/image13.jpg', 'img/image14.jpg'
];

function getImagesForLevel(level) {
    let images = [...basePairs];
    
    if (level >= 2) images = [...images, ...additionalPairsLevel2];
    if (level >= 3) images = [...images, ...additionalPairsLevel3];
    if (level >= 4) images = [...images, ...additionalPairsLevel4];
    
    let pairedImages = [];
    images.forEach(img => pairedImages.push(img, img));
    return shuffle(pairedImages);
}

function changeLevel(newLevel) {
    currentLevel = newLevel;
    imagesArray = getImagesForLevel(currentLevel);
    createBoard();
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
    prevButton.onclick = () => currentLevel > 1 && changeLevel(currentLevel - 1);
    prevButton.className = 'level-button';
    prevButton.disabled = currentLevel === 1;
    
    const levelDisplay = document.createElement('span');
    levelDisplay.id = 'levelDisplay';
    levelDisplay.className = 'level-display';
    levelDisplay.textContent = `Nivel: ${currentLevel}`;
    
    const nextButton = document.createElement('button');
    nextButton.textContent = '►';
    nextButton.onclick = () => currentLevel < 4 && changeLevel(currentLevel + 1);
    nextButton.className = 'level-button';
    nextButton.disabled = currentLevel === 4;
    
    levelControls.append(prevButton, levelDisplay, nextButton);
    buttonsContainer.prepend(levelControls);
}

document.addEventListener('DOMContentLoaded', () => {
    addLevelControls();
    updateLevelDisplay();
});