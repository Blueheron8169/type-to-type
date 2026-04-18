const sentences = [
    "The coffee shop down the street just opened a new outdoor patio.",
    "Have you ever tried learning a new language during the summer?",
    "She danced through the rain without a single care in the world!",
    "Morning runs help me feel energized and ready for the busy day ahead.",
    "I always prefer to take the scenic route when driving through the mountains on weekends.",
    "Do you think it will rain before we finish our hike up the mountain today?",
    "The gentle breeze made the trees sway, and the birds began to sing loudly.",
    "Could you please pass the salt and pepper before your dinner gets cold?",
    "What a incredibly beautiful sunset we witnessed over the calm ocean this evening!",
    "Reading a good book by the fireplace is my favorite way to spend a chilly night.",
    "They decided to bake fresh chocolate chip cookies because it was raining outside.",
    "Have you finished writing the report, or do you need more time to review the data?",
    "The tiny puppy chased its tail until it fell over from pure exhaustion!",
    "My favorite color is blue, but I also really love wearing dark green sweaters.",
    "How many times do I have to remind you to lock the front door?",
    "The concert was absolutely amazing, and the band played all of my favorite songs!",
    "He quietly slipped out the back door hoping nobody would notice he was gone.",
    "Are we really going to eat pizza for the third night in a row?",
    "She carefully painted the canvas with bright colors and bold, sweeping strokes.",
    "I cannot believe we finally won the championship game after all these years!",
    "The old library smells like dust and old paper, which is very comforting to me.",
    "Will you help me carry these heavy boxes up to the second floor?",
    "That was the most delicious slice of cherry pie I have ever tasted!",
    "He bought a vintage bicycle and spent the entire weekend trying to fix the rusty chain.",
    "The children laughed out loud when the clown suddenly dropped all of his juggling balls.",
    "Can you believe how fast this year has gone by?",
    "The quiet forest is the perfect place to go when you need to clear your busy mind.",
    "Watch out for that huge puddle in the middle of the sidewalk!",
    "She always drinks a cup of warm tea right before she goes to sleep.",
    "Why did the alarm clock have to ring so early on a Saturday morning?",
    "The hot air balloon gently drifted higher into the bright blue sky.",
    "I am saving all my extra coins to buy a new camera next month.",
    "Did you remember to water the plants while I was away on my vacation?",
    "The fireworks display over the lake was absolutely spectacular this year!",
    "He usually takes the train to work, but today he decided to walk.",
    "What kind of music do you like to listen to when you study for exams?",
    "The fresh snow covered the entire neighborhood in a soft, white blanket.",
    "Don't forget to grab your umbrella before you leave the house today!",
    "They spent the whole afternoon building a giant sandcastle on the sunny beach.",
    "Is there any more coffee left in the pot, or should I brew a fresh batch?",
    "The mystery novel kept me guessing the ending until the very last page.",
    "I was so surprised when they threw a secret birthday party just for me!",
    "The bakery around the corner makes the absolute best chocolate croissants in town.",
    "Have you ever thought about traveling across the country in a small van?",
    "She smiled brightly and waved goodbye as the train slowly pulled away from the station.",
    "Stop wasting your time and start focusing on your long term goals!",
    "The comfortable old chair in the corner of the room is perfect for an afternoon nap.",
    "Will the package arrive before the weekend, or do we have to wait until Monday?",
    "The stars shone brightly in the clear night sky, far away from the city lights.",
    "I really enjoy cooking dinner for my family on Sunday evenings."
];

// DOM Elements
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const jackInBtn = document.getElementById('jack-in-btn');

const timeDisplay = document.getElementById('time-display');
const wpmDisplay = document.getElementById('wpm-display');
const accuracyDisplay = document.getElementById('accuracy-display');
const sentenceDisplay = document.getElementById('sentence-display');
const typeInput = document.getElementById('type-input');

const pauseBtn = document.getElementById('pause-btn');
const pauseModal = document.getElementById('pause-modal');
const resumeBtn = document.getElementById('resume-btn');
const quitBtn = document.getElementById('quit-btn');

const resultsModal = document.getElementById('results-modal');
const finalWpm = document.getElementById('final-wpm');
const finalAccuracy = document.getElementById('final-accuracy');
const feedbackMessage = document.getElementById('feedback-message');
const restartBtn = document.getElementById('restart-btn');
const homeBtn = document.getElementById('home-btn');

// Game State
const GAME_DURATION = 60;
let timeRemaining = GAME_DURATION;
let timer = null;
let currentSentence = "";
let charactersTyped = 0;
let correctCharacters = 0;
let totalKeystrokes = 0;
let gameActive = false;
let gamePaused = false;

// Screen Management
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active', 'hidden'));
    document.querySelectorAll('.screen').forEach(s => {
        if (s !== screen) s.classList.add('hidden');
    });
    screen.classList.add('active');
}

// Initialization
function initGame() {
    timeRemaining = GAME_DURATION;
    charactersTyped = 0;
    correctCharacters = 0;
    totalKeystrokes = 0;
    gameActive = true;
    gamePaused = false;
    
    timeDisplay.textContent = timeRemaining;
    wpmDisplay.textContent = "0";
    accuracyDisplay.textContent = "100%";
    
    typeInput.disabled = false;
    typeInput.value = "";
    
    resultsModal.classList.add('hidden');
    pauseModal.classList.add('hidden');
    sentenceDisplay.classList.remove('blurred');
    
    showScreen(gameScreen);
    getNextSentence();
    typeInput.focus();
    
    startTimer();
}

function returnToHome() {
    gameActive = false;
    stopTimer();
    resultsModal.classList.add('hidden');
    pauseModal.classList.add('hidden');
    showScreen(homeScreen);
}

// Timer Logic
function startTimer() {
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function updateTimer() {
    if (!gameActive || gamePaused) return;
    
    timeRemaining--;
    timeDisplay.textContent = timeRemaining;
    
    if (timeRemaining <= 0) {
        endGame();
    }
}

// Pause Logic
function togglePause() {
    if (!gameActive) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        stopTimer();
        pauseModal.classList.remove('hidden');
        sentenceDisplay.classList.add('blurred');
        typeInput.disabled = true;
    } else {
        pauseModal.classList.add('hidden');
        sentenceDisplay.classList.remove('blurred');
        typeInput.disabled = false;
        typeInput.focus();
        startTimer();
    }
}

// Core Game Logic
function getNextSentence() {
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    // Render characters
    sentenceDisplay.innerHTML = '';
    currentSentence.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        charSpan.classList.add('char');
        sentenceDisplay.appendChild(charSpan);
    });
    
    typeInput.value = "";
    updateCursor(0);
}

function endGame() {
    stopTimer();
    gameActive = false;
    typeInput.disabled = true;
    
    // Calculate final stats
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    
    finalWpm.textContent = wpm;
    finalAccuracy.textContent = `${accuracy}%`;
    
    // Cyberpunk specific feedback
    if (wpm > 80) {
        feedbackMessage.textContent = "NEURAL LINK OPTIMIZED. TOP TIER HACKER.";
    } else if (wpm > 50) {
        feedbackMessage.textContent = "SOLID CONNECTION. GOOD UPLINK SPEED.";
    } else if (wpm > 30) {
        feedbackMessage.textContent = "CONNECTION STABLE. TRAINING REQUIRED.";
    } else {
        feedbackMessage.textContent = "UPLINK DEGRADED. SPEED INSUFFICIENT.";
    }
    
    resultsModal.classList.remove('hidden');
}

function calculateWPM() {
    const timeElapsed = GAME_DURATION - timeRemaining;
    if (timeElapsed === 0) return 0;
    
    const minutes = timeElapsed / 60;
    const words = correctCharacters / 5;
    return Math.round(words / minutes);
}

function calculateAccuracy() {
    if (totalKeystrokes === 0) return 100;
    return Math.round((correctCharacters / totalKeystrokes) * 100);
}

function updateCursor(index) {
    const chars = sentenceDisplay.querySelectorAll('.char');
    chars.forEach((char, i) => {
        char.classList.remove('cursor');
        if (i === index) {
            char.classList.add('cursor');
        }
    });
    
    if (index >= chars.length && gameActive && !gamePaused) {
        getNextSentence();
    }
}

// Event Listeners
jackInBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
homeBtn.addEventListener('click', returnToHome);
pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);
quitBtn.addEventListener('click', returnToHome);

// Handle ESC key for pausing
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gameActive) {
        togglePause();
    }
});

// Click anywhere on the typing area focuses the input
document.querySelector('.typing-area').addEventListener('click', () => {
    if (gameActive && !gamePaused) {
        typeInput.focus();
    }
});

// Typing Event Listener
typeInput.addEventListener('input', () => {
    if (!gameActive || gamePaused) return;
    
    const inputValue = typeInput.value;
    const inputArray = inputValue.split('');
    const chars = sentenceDisplay.querySelectorAll('.char');
    
    if (inputArray.length > charactersTyped) {
        totalKeystrokes++;
    }
    
    charactersTyped = inputArray.length;
    let currentCorrectCount = 0;
    
    chars.forEach((charSpan, index) => {
        const typedChar = inputArray[index];
        
        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (typedChar === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
            currentCorrectCount++;
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
        }
    });
    
    updateCursor(inputArray.length);
    
    // Sentence Complete
    if (inputArray.length === chars.length) {
        let isPerfect = true;
        chars.forEach(char => {
            if (!char.classList.contains('correct')) isPerfect = false;
        });
        
        if (isPerfect) {
            correctCharacters += chars.length;
            charactersTyped = 0; 
            getNextSentence();
        }
    } else {
         const tempTotalCorrect = correctCharacters + currentCorrectCount;
         const timeElapsed = GAME_DURATION - timeRemaining;
         if (timeElapsed > 0) {
             const minutes = timeElapsed / 60;
             const words = tempTotalCorrect / 5;
             wpmDisplay.textContent = Math.round(words / minutes);
         }
         
         if (totalKeystrokes > 0) {
             accuracyDisplay.textContent = `${Math.round((tempTotalCorrect / totalKeystrokes) * 100)}%`;
         }
    }
});
