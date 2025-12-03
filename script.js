let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let isAnswerSelected = false;   // Prevents multiple selections
let currentQuizResponses = [];  // Array to store detailed responses for the current quiz


// Open Trivia DB Categories (Name and ID)
const CATEGORIES = [
    { id: '', name: 'Mixed Category (Any)' },
    { id: '9', name: 'General Knowlwdge' },
    { id: '10', name: 'Books' },
    { id: '11', name: 'Film' },
    { id: '12', name: 'Music' },
    { id: '13', name: 'Musicals & Theatres' },
    { id: '14', name: 'Television' },
    { id: '15', name: 'Video Games' },
    { id: '16', name: 'Board Games' },
    { id: '17', name: 'Science & Nature' },
    { id: '18', name: 'Computers' },
    { id: '19', name: 'Mathematics' },
    { id: '20', name: 'Mythology' },
    { id: '21', name: 'Sports' },
    { id: '22', name: 'Geography' },
    { id: '23', name: 'History' },
    { id: '24', name: 'Politics' },
    { id: '25', name: 'Art' },
    { id: '26', name: 'Celebrities' },
    { id: '27', name: 'Animals' },
    { id: '28', name: 'Vehicles' },
    { id: '29', name: 'Comics' },
    { id: '30', name: 'Gadgets' },
    { id: '31', name: 'Japanese Anime & Manga' },
    { id: '32', name: 'Cartoon & Animations' }
];


// DOM Elements
const body = document.body;
const themeToggle = document.querySelector("#theme-toggle");
const backButton = document.querySelector("#back-button");
const configArea = document.querySelector("#config-area");
const categorySelect = document.querySelector("#category-select")
const numQuestionSelect = document.querySelector("#num-questions");
const startQuiz = document.querySelector("#start-quiz");
const viewHistory = document.querySelector("#view-history");
const loadingMsg = document.querySelector("#loading");
const quizArea = document.querySelector("#quiz-area");
const resultArea = document.querySelector("#result-area");
const questionText = document.querySelector("#question-text");
const categoryElement = document.querySelector("#category");
const questionCount = document.querySelector("#question-count");
const answerButtons = document.querySelector("#answer-buttons");
const nextButton = document.querySelector("#next-button");
const feedback = document.querySelector("#feedback");
const finalScore = document.querySelector("#final-score");
const restartButton = document.querySelector("#restart-button");
const historyArea = document.querySelector("#history-area");
const historyList = document.querySelector("#history-list");


// LocalStorage Key
const LOCAL_STORAGE_KEY = "quizMasterHistory";
const THEME_STORAGE_KEY = "quizTheme";


// Base API URL
const BASE_API_URL = 'https://opentdb.com/api.php';


// SVG Icons for the theme toggle
const sunIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
const moonIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;


/**
 * Utility function to decode HTML entities from the API response
 * @param {string} html The encoded string
 * @returns {string} The decoded string
 */
function decodeHtml(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

/**
 * Utility function to shuffle an array (Fisher-Yates)
 * @param {Array} array The array to shuffle
 * @returns {Array} The shuffled array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


/**
 * Loads quiz history from localStorage.
 * @returns {Array} Array of past quiz results.
 */
function loadQuizHistory() {
    try {
        const history = localStorage.getItem(LOCAL_STORAGE_KEY);
        return history ? JSON.parse(history) : [];
    } catch (e) {
        console.error("Error loading quiz history:", e);
        return [];
    }
}


/**
 * Saves the current quiz result to localStorage.
 * @param {number} totalQuestions Total number of questions in the quiz.
 */
function saveQuizResult(totalQuestions) {
    const history = loadQuizHistory();
    const now = new Date();
    const categoryName = CATEGORIES.find(c => c.id === categorySelect.value)?.name || 'Mixed Category';

    const result = {
        id: Date.now(),
        date: now.toLocaleString(),
        score: score,
        total: totalQuestions,
        category: categoryName,
        responses: currentQuizResponses     // Detailed respose history
    };

    history.unshift(result);    // Add to the start

    // Keep only the last 10 quizzes to prevent locatStorage bloat
    if (history.length > 10) {
        history.pop();
    }

    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.error("Error saving quiz result:", e);
    }
}


/**
 * Populates the category select dropdown with options
 */
function populateCategories() {
    CATEGORIES.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}


/**
 * Controls which main application area is visible and manages the back button.
 *  @param {HTMLElement} areaToShow The DOM element to show (configArea, quizArea, etc.)
 */
function showArea(areaToShow) {
    // Determine if the back button should be visible
    const showBackButton = (areaToShow !== configArea && areaToShow !== loadingMsg);

    if (showBackButton) {
        backButton.classList.remove("hidden");
    } else {
        backButton.classList.add("hidden");
    }

    [configArea, loadingMsg, quizArea, resultArea, historyArea].forEach(area => {
        if (area === areaToShow) {
            area.classList.remove("hidden");
        } else {
            area.classList.add("hidden");
        }
    });
}


/**
 * Fetches questions from the Open Trivia Database API based on config
 *  @param {number} amount The number of questions to fetch
 * @param {string} categoryId The category ID (or empty string for any)
 */
async function fetchQuestions(amount, categoryId) {
    showArea(loadingMsg);
    loadingMsg.innerHTML = `<div class="loader"></div><div>Fetching questions...</div>`;

    let url = `${BASE_API_URL}?amount=${amount}&type=multiple`;
    if (categoryId) {
        url += `&category=${categoryId}`;
    }

    const maxRetries = 5;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.response_code === 0 && data.results && data.results.length > 0) {
                questions = data.results;
                resetQuiz();
                renderQuestion();
                return;
            } else if (data.response_code === 1) {
                // Response code 1: No results
                loadingMsg.innerHTML = `<p class="text-red">No questions found for the current settings. Please adjust your category or amount and try again.</p>`;
                setTimeout(() => showArea(configArea), 3000);   // Show config after delay
                return;
            } else {
                throw new Error(`Failed to load questions due to API error`);
            }
        } catch (error) {
            console.error("Fetch error :", error);
            currentRetry++;
            if (currentRetry < maxRetries) {
                const delay = Math.pow(2, currentRetry) * 1000;     // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                loadingMsg.innerHTML = `<p class="text-red">Failed to load trivia questions after multiple attempts. Please check your connection or try again later.</p><p class="text-xs mt-2">${error.message}</p>`;
                return;
            }
        }
    }
}


/**
 * Resets the quiz state and prepares the UI for the first question
 */
function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    isAnswerSelected = false;
    currentQuizResponses = [];  // Reset the detailed responses for the new quiz

    showArea(quizArea);
    nextButton.disabled = true;
    feedback.textContent = '';
}


/** * Renders the current question and its answers
 */
function renderQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const currentQ = questions[currentQuestionIndex];
    isAnswerSelected = false;  // Reset for the new question
    nextButton.disabled = true;  // Disable next button until an answer is selected
    feedback.textContent = '';  // Clear previous feedback
    answerButtons.innerHTML = '';  // Clear previous answers

    // Decode and display question text and category
    categoryElement.textContent = `Category: ${decodeHtml(currentQ.category)} (${currentQ.difficulty})`;
    questionText.textContent = decodeHtml(currentQ.question);
    questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

    // Combine correct and incorrect answers and shuffle
    const allAnswers = [currentQ.correct_answer, ...currentQ.incorrect_answers];
    const shuffledAnswers = shuffleArray(allAnswers.map(decodeHtml));
    const correctAnswerDecoded = decodeHtml(currentQ.correct_answer);

    // Create and display answer buttons
    shuffledAnswers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer;

        // Use new CSS classes
        button.classList.add(
            "answer-button", "answer-button-base"
        );

        button.addEventListener("click", () => handleAnswer(button, answer === correctAnswerDecoded));
        answerButtons.appendChild(button);
    });
}


/**
 * Handles the user's answer selection, checks correctness, and provides feedback
 * @param {HTMLElement} selectedButton The button the user clicked
 * @param {boolean} isCorrect True if the selected answer is correct
 */
function handleAnswer(selectedButton, isCorrect) {
    if (isAnswerSelected) return;   // Prevent double-clicking

    isAnswerSelected = true;
    nextButton.disabled = false;

    const currentQ = questions[currentQuestionIndex];
    const userAnswer = selectedButton.textContent;
    const correctAnswerDecoded = decodeHtml(currentQ.correct_answer);

    // Record response detail
    currentQuizResponses.push({
        question: decodeHtml(currentQ.question),
        userAnswer: userAnswer,
        correctAnswer: correctAnswerDecoded,
        isCorrect: isCorrect,
        category: decodeHtml(currentQ.category),
        difficulty: currentQ.difficulty
    });

    // Highlight all answer buttons based on correctness
    Array.from(answerButtons.children).forEach(button => {
        const buttonIsCorrect = button.textContent === correctAnswerDecoded;

        if (buttonIsCorrect) {
            button.classList.add("correct");
        } else if (button === selectedButton) {
            button.classList.add("incorrect");
        }

        // Disable all buttons after selection
        button.disabled = true;
        // Remove hover effects using CSS classes
        button.classList.remove("answer-button");
        button.style.transform = "none";
    });

    // Update score and feedback
    if (isCorrect) {
        score++;
        feedback.textContent = '🎉 Correct!';
        feedback.classList.remove('text-red');
        feedback.classList.add('text-green');
    } else {
        feedback.textContent = '❌ Incorrect. The correct answer is highlighted.';
        feedback.classList.remove('text-green');
        feedback.classList.add('text-red');
    }
}


/**
 * Advances the quiz to the next question
 */
function nextQuestion() {
    if (!isAnswerSelected) return;

    currentQuestionIndex++;
    renderQuestion();
}


/**
 * Displays the final quiz results
 */
function showResult() {
    // Save the result befor displaying
    saveQuizResult(questions.length);

    showArea(resultArea);

    finalScore.textContent = `${score} / ${questions.length}`;

    let message = "";
    const percentage = (score / questions.length) * 100;

    // Remove previous message if restarting quickly
    const prevMessage = resultArea.querySelector(".result-message");
    if (prevMessage) prevMessage.remove();

    if (percentage === 100) {
        message = "Perfect Score! You are a true Trivia Master! 🏆";
    } else if (percentage >= 70) {
        message = "Great job! You know your stuff! 🌟";
    } else if (percentage >= 40) {
        message = "Solid effort. Keep learning! 👍";
    } else {
        message = "You can do better! Time for some review. 😉";
    }

    const messageEl = document.createElement("p");
    messageEl.classList.add("result-message", "text-medium");
    messageEl.textContent = message;

    finalScore.after(messageEl);
}


/**
 * Renders the quiz history list
 */
function renderHistory() {
    const history = loadQuizHistory();
    historyList.innerHTML = '';

    if (history.length === 0) {
        historyList.innerHTML = `<p class="text-light text-center">You haven't completed any quizzes yet!</p>`;
        return;
    }

    history.forEach((quiz, index) => {
        const percentage = ((quiz.score / quiz.total) * 100).toFixed(0);
        const item = document.createElement("div");
        item.classList.add("history-item", "space-y-4");    // Adding space-y-4 class for vertical spacing

        // Determine color based on performance
        let scoreColor = "score-red";
        if (percentage >= 70) scoreColor = "score-green";
        else if (percentage >= 40) scoreColor = "score-yellow";

        item.innerHTML = `
            <div class="history-item-header">
                <span class="history-title">Quiz #${history.length - index}</span>
                <span class="history-date">${quiz.date}</span>
            </div>
            <p class="history-category">
                Category: <span class="history-category-name">${quiz.category}</span>
            </p>
            <p class="history-score">
                Score: <span class="${scoreColor}">${quiz.score} / ${quiz.total}</span> (${percentage}%)
            </p>
            <button data-quiz-id="${quiz.id}" class="view-details">
                View Details
            </button>
            <div id="details-${quiz.id}" class="details-view hidden">
                </div>
        `;
        historyList.appendChild(item);
    });

    // Attach event listeners to "View Details" buttons
    document.querySelectorAll(".view-details").forEach(button => {
        button.addEventListener("click", (e) => toggleQuizDetails(e.target.dataset.quizId, history));
    });
}


/**
 * Toggles the detailed view of a past quiz's responses.
 * @param {string} id The ID of the quiz to display/hide details for.
 * @param {Array} historyArray The array of all quiz history objects.
 */
function toggleQuizDetails(id, historyArray) {
    const quizId = parseInt(id);
    const quiz = historyArray.find(q => q.id === quizId);
    if (!quiz) return;

    const detailElement = document.querySelector(`#details-${quizId}`);
    const button = document.querySelector(`[data-quiz-id="${quizId}"]`);

    if (!detailElement || !button) return;

    if (detailElement.classList.contains("hidden")) {
        // Show details
        // First, hide any other open details
        document.querySelectorAll(".details-view").forEach(el => el.classList.add("hidden"));
        document.querySelectorAll(".view-details").forEach(btn => btn.textContent = "View Details");

        detailElement.classList.remove("hidden");
        button.textContent = "Hide Details";

        let detailHtml = '<ul class="space-y-4">';
        quiz.responses.forEach((res, i) => {
            const icon = res.isCorrect ? '✅' : '❌';
            const colorClass = res.isCorrect ? 'text-green' : 'text-red';
            const textClass = body.classList.contains("dark") ? "text-gray-200" : "text-gray-900";

            detailHtml += `
                    <div class="detail-item">
                        <p class="font-bold text-sm ${textClass}">${i + 1}. ${res.question}</p>
                        <p class="text-xs mt-1 ${colorClass}"><span class="font-semibold">${icon} You answered:</span> ${res.userAnswer}</p>
                        ${!res.isCorrect ? `<p class="text-xs text-light"><span class="font-semibold">Correct:</span> ${res.correctAnswer}</p>` : ''}
                        <p class="text-xs text-light">Difficulty: ${res.difficulty}</p>
                    </div>
                `;
        });
        detailHtml += '</ul>';
        detailElement.innerHTML = detailHtml;
    } else {
        // Hide details
        detailElement.classList.add("hidden");
        button.textContent = "View Details";
    }
}

function showHistory() {
    showArea(historyArea);
    renderHistory();
}

// --- Dark Mode Functions ---

/**
 * Sets the theme based on the isDark boolean and saves preference.
 * @param {boolean} isDark True to set dark mode, false for light mode.
 */
function setTheme(isDark) {
    if (isDark) {
        body.classList.add("dark");
        themeToggle.innerHTML = sunIcon;
        themeToggle.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
        body.classList.remove("dark");
        themeToggle.innerHTML = moonIcon;
        themeToggle.setAttribute('aria-label', 'Switch to Dark Mode');
    }
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');

    // Re-render history to apply correct text colors inside the details view
    if (!historyArea.classList.contains("hidden")) {
        renderHistory();
    }
}


/**
 * Toggles the current theme mode.
 */
function toggleDarkMode() {
    const isDark = body.classList.contains("dark");
    setTheme(!isDark);
}


/**
 * Loads the theme preference from localStorage or defaults to light.
 */
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme based on preference or system default
    const initialDark = (savedTheme === 'dark' || (savedTheme === null && prefersDark));
    setTheme(initialDark);
}

// --- Event Listeners and Initialization ---

document.addEventListener("DOMContentLoaded", () => {
    loadTheme();
    populateCategories();

    // Event Handlers for Navigation
    nextButton.addEventListener('click', nextQuestion);
    restartButton.addEventListener('click', () => showArea(configArea));
    viewHistory.addEventListener('click', showHistory);
    backButton.addEventListener('click', () => showArea(configArea));

    // Start Quiz
    startQuiz.addEventListener('click', () => {
        const amount = parseInt(numQuestionSelect.value, 10) || 10;
        const categoryId = categorySelect.value;
        fetchQuestions(amount, categoryId);
    });

    // Theme Toggle
    themeToggle.addEventListener('click', toggleDarkMode);
});

