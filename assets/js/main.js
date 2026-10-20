// ===== THEME TOGGLE (Dark/Light Mode) =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ===== PLATFORM TABS (Cheat Pages) =====
const tabBtns = document.querySelectorAll('.tab-btn');
const cheatTables = document.querySelectorAll('.cheat-table');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        cheatTables.forEach(table => table.classList.add('hidden'));

        const platform = btn.dataset.platform;
        const selectedTable = document.getElementById(platform);
        if (selectedTable) {
            selectedTable.classList.remove('hidden');
        }
    });
});

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.getElementById('cheatSearch');
const gamesGrid = document.getElementById('gamesGrid');

if (searchInput && gamesGrid) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const gameCards = gamesGrid.querySelectorAll('.game-card');

        gameCards.forEach(card => {
            const gameName = card.querySelector('h3').textContent.toLowerCase();
            if (gameName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ===== PROGRESS TRACKER =====
const progressButtons = document.querySelectorAll('.btn-complete');
const totalProgressEl = document.getElementById('totalProgress');
const totalProgressBar = document.getElementById('totalProgressBar');

// Load saved progress
let progress = JSON.parse(localStorage.getItem('tutorialProgress')) || {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};

function updateProgress() {
    let total = 0;
    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById(`progressBar${i}`);
        const percent = document.getElementById(`progress${i}`);
        const btn = document.querySelector(`[data-progress="${i}"]`);
        
        if (bar && percent) {
            bar.style.width = progress[i] + '%';
            percent.textContent = progress[i] + '%';
        }
        
        if (btn && progress[i] >= 100) {
            btn.textContent = 'Completed ✓';
            btn.classList.add('completed');
            btn.disabled = true;
        }
        
        total += progress[i];
    }
    
    const totalPercent = Math.round(total / 4);
    if (totalProgressEl) {
        totalProgressEl.textContent = totalPercent + '%';
    }
    if (totalProgressBar) {
        totalProgressBar.style.width = totalPercent + '%';
    }
}

progressButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const progressId = btn.dataset.progress;
        const percent = parseInt(btn.dataset.percent);
        
        if (progress[progressId] < 100) {
            progress[progressId] = Math.min(progress[progressId] + percent, 100);
            localStorage.setItem('tutorialProgress', JSON.stringify(progress));
            updateProgress();
        }
    });
});

updateProgress();

// ===== NEWSLETTER FORM =====
const newsletterForm = document.getElementById('newsletterForm');
const newsletterMsg = document.getElementById('newsletterMsg');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Save to localStorage (in real app, send to server)
        const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
        subscribers.push({ email, date: new Date().toISOString() });
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        
        newsletterMsg.textContent = '✅ Subscribe ho gaya! Thank you!';
        newsletterForm.reset();
        
        setTimeout(() => {
            newsletterMsg.textContent = '';
        }, 5000);
    });
}

// ===== QUIZ FUNCTIONALITY =====
const quizQuestions = [
    {
        question: "Game design me 'Core Loop' kya hota hai?",
        options: ["Game ka main menu", "Player repeatedly kaam jo karta hai", "Game ka ending", "Game ka loading screen"],
        correct: 1
    },
    {
        question: "Ye me se kaunsa game engine free hai?",
        options: ["Unreal Engine", "Unity", "Godot", "Frostbite"],
        correct: 2
    },
    {
        question: "Game me 'Playtesting' kyun zaroori hai?",
        options: ["Game ko crash karne ke liye", "Players se feedback lene ke liye", "Game ko slow karne ke liye", "Graphics improve karne ke liye"],
        correct: 1
    },
    {
        question: "'Level Design' me sabse important cheez kya hai?",
        options: ["Bahut saare enemies", "Player ka smooth experience", "Bahut saare colors", "Bahut saare power-ups"],
        correct: 1
    },
    {
        question: "Game me 'Monetization' kya hai?",
        options: ["Game ko free dena", "Game se paisa kamane ka tareeka", "Game ko delete karna", "Game ko slow karna"],
        correct: 1
    },
    {
        question: "'Game Mechanics' kya hote hain?",
        options: ["Game ke rules aur systems", "Game ke characters", "Game ka music", "Game ka title"],
        correct: 0
    },
    {
        question: "Kaunsa language Unity me use hota hai?",
        options: ["Python", "C#", "Java", "Ruby"],
        correct: 1
    },
    {
        question: "Game me 'Feedback Loop' kya hai?",
        options: ["Player ko turant reward dena", "Game ko restart karna", "Game ko delete karna", "Game ko slow karna"],
        correct: 0
    },
    {
        question: "'Game Balancing' kya hai?",
        options: ["Game ko heavy banana", "Game ko fair aur challenging rakhna", "Game ko free dena", "Game ko slow karna"],
        correct: 1
    },
    {
        question: "Kaunsa platform indie developers ke liye best hai publish karne ke liye?",
        options: ["Steam", "itch.io", "PlayStation Store", "Xbox Store"],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let quizAnswered = false;

const quizContainer = document.getElementById('quizContainer');
const questionText = document.getElementById('questionText');
const quizOptions = document.getElementById('quizOptions');
const questionNumber = document.getElementById('questionNumber');
const quizProgressBar = document.getElementById('quizProgressBar');
const quizResult = document.getElementById('quizResult');
const scoreNumber = document.getElementById('scoreNumber');
const resultMessage = document.getElementById('resultMessage');
const restartQuizBtn = document.getElementById('restartQuiz');

function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showResult();
        return;
    }
    
    quizAnswered = false;
    const q = quizQuestions[currentQuestion];
    
    questionText.textContent = q.question;
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    quizProgressBar.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
    
    quizOptions.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index, btn));
        quizOptions.appendChild(btn);
    });
}

function selectAnswer(index, btn) {
    if (quizAnswered) return;
    quizAnswered = true;
    
    const q = quizQuestions[currentQuestion];
    const options = quizOptions.querySelectorAll('.quiz-option');
    
    options.forEach((opt, i) => {
        if (i === q.correct) {
            opt.classList.add('correct');
        } else if (i === index && index !== q.correct) {
            opt.classList.add('wrong');
        }
        opt.disabled = true;
    });
    
    if (index === q.correct) {
        score++;
    }
    
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1500);
}

function showResult() {
    document.querySelector('.quiz-question').classList.add('hidden');
    quizResult.classList.remove('hidden');
    scoreNumber.textContent = score;
    
    let message = '';
    if (score === 10) {
        message = '🏆 Perfect! Tu ek pro game designer hai!';
    } else if (score >= 7) {
        message = '🎉 Bahut acha! Thoda aur practice karo!';
    } else if (score >= 5) {
        message = '👍 Good start! Tutorials dobara dekho!';
    } else {
        message = '📚 Koi baat nahi! Tutorials padh ke dobara try karo!';
    }
    resultMessage.textContent = message;
}

if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        quizResult.classList.add('hidden');
        document.querySelector('.quiz-question').classList.remove('hidden');
        loadQuestion();
    });
}

// Load quiz if on quiz page
if (quizContainer) {
    loadQuestion();
}

// ===== MINI GAME: MEMORY CARD GAME =====
const gameBoard = document.getElementById('gameBoard');
const moveCountEl = document.getElementById('moveCount');
const matchCountEl = document.getElementById('matchCount');
const timerEl = document.getElementById('timer');
const restartGameBtn = document.getElementById('restartGame');

const cardEmojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎢'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameTimer = null;
let seconds = 0;
let gameStarted = false;

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function createBoard() {
    if (!gameBoard) return;
    
    gameBoard.innerHTML = '';
    cards = shuffle([...cardEmojis, ...cardEmojis]);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    
    moveCountEl.textContent = '0';
    matchCountEl.textContent = '0';
    timerEl.textContent = '0:00';
    
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerHTML = `
            <span class="card-front">❓</span>
            <span class="card-back">${emoji}</span>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    
    if (!gameStarted) {
        gameStarted = true;
        gameTimer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        moveCountEl.textContent = moves;
        
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.emoji === card2.dataset.emoji) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            matchCountEl.textContent = matchedPairs;
            flippedCards = [];
            
            if (matchedPairs === cardEmojis.length) {
                clearInterval(gameTimer);
                setTimeout(() => {
                    alert(`🎉 Jeet gaye! ${moves} moves me complete kiya!`);
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
            }, 1000);
        }
    }
}

if (restartGameBtn) {
    restartGameBtn.addEventListener('click', createBoard);
}

// Initialize game if on game page
if (gameBoard) {
    createBoard();
}

// ===== ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .game-card, .tutorial-item, .resource-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== CONSOLE EASTER EGG =====
console.log('%c🎮 GameLearn Hub', 'font-size: 24px; color: #e94560; font-weight: bold;');
console.log('%cWelcome to GameLearn Hub! Made with ❤️ for young gamers', 'font-size: 14px; color: #b8b8b8;');
console.log('%cWant to learn game design? Check out our tutorials!', 'font-size: 12px; color: #666;');
