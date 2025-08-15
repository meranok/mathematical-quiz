let questions = [
    { question: "What is 5 x 7?", options: ["30", "35", "40", "45"], correctAnswerIndex: 1 },
    { question: "What is the value of sin(30)?", options: ["0.5", "1", "0.866", "0"], correctAnswerIndex: 0 },
    { question: "If you have 12 apples and give away 5, how many do you have left?", options: ["6", "7", "8", "9"], correctAnswerIndex: 1 },
    { question: "What is the value of log10(100)?", options: ["1", "2", "10", "100"], correctAnswerIndex: 1 }
];

let currentPage = 'quiz';
let currentQuestionIndex = 0;
let selectedAnswer = null;
let score = 0;
let quizCompleted = false;
let isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

const body = document.body;
const quizPage = document.getElementById('quiz-page');
const adminPage = document.getElementById('admin-page');
const quizContainer = document.getElementById('quiz-container');
const questionsList = document.getElementById('questions-list');
const questionsCount = document.getElementById('questions-count');
const addQuestionForm = document.getElementById('add-question-form');
const newQuestionInput = document.getElementById('new-question-input');
const newOptionInputs = [
    document.getElementById('new-option-1'),
    document.getElementById('new-option-2'),
    document.getElementById('new-option-3'),
    document.getElementById('new-option-4')
];
const newCorrectAnswerSelect = document.getElementById('new-correct-answer-select');
const quizPageBtn = document.getElementById('quiz-page-btn');
const adminPageBtn = document.getElementById('admin-page-btn');
const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const confirmationModal = document.getElementById('confirmation-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
let questionToDeleteId = null;

const renderUI = () => {
    showPage(currentPage);
    if (currentPage === 'quiz') {
        renderQuizPage();
    } else if (currentPage === 'admin') {
        renderAdminPage();
    }
    
};

const showPage = (pageName) => {
    quizPage.classList.remove('active');
    adminPage.classList.remove('active');
    quizPageBtn.classList.remove('active');
    adminPageBtn.classList.remove('active');

    if (pageName === 'quiz') {
        quizPage.classList.add('active');
        quizPageBtn.classList.add('active');
    } else {
        adminPage.classList.add('active');
        adminPageBtn.classList.add('active');
    }
    currentPage = pageName;
};

const renderQuizPage = () => {
    quizContainer.innerHTML = '';

    if (questions.length === 0) {
        quizContainer.innerHTML = `<div class="loading-text">No questions available. Please add some from the Admin page.</div>`;
        return;
    }

    if (quizCompleted) {
        const quizCompletedContainer = document.createElement('div');
        quizCompletedContainer.className = 'quiz-completed';
        quizCompletedContainer.innerHTML = `
            <h2>Quiz Completed!</h2>
            <p>Your final score is: <span>${score}</span> / <span>${questions.length}</span></p>
            <button id="reset-quiz-btn" class="next-btn">Try Again</button>
        `;
        quizContainer.appendChild(quizCompletedContainer);
        document.getElementById('reset-quiz-btn').addEventListener('click', resetQuiz);
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const quizContent = document.createElement('div');
    quizContent.innerHTML = `
        <div class="quiz-question-container">
            <h2 class="quiz-title">Question ${currentQuestionIndex + 1} of ${questions.length}</h2>
            <p class="quiz-question-text">${currentQuestion.question}</p>
        </div>
        <div id="options-container" class="options-container">
            ${currentQuestion.options.map((option, index) => `
                <button class="option-btn" data-index="${index}">${option}</button>
            `).join('')}
        </div>
        <div style="margin-top: 2rem; text-align: right;">
            <button id="next-question-btn" class="next-btn" disabled>
                ${currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
        </div>
    `;
    quizContainer.appendChild(quizContent);

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            setSelectedAnswer(parseInt(e.target.dataset.index));
        });
    });

    document.getElementById('next-question-btn').addEventListener('click', handleNextQuestion);
};

const setSelectedAnswer = (index) => {
    selectedAnswer = index;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    const selectedBtn = document.querySelector(`.option-btn[data-index="${index}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
    document.getElementById('next-question-btn').disabled = false;
};

const renderAdminPage = () => {
    questionsCount.textContent = questions.length;
    questionsList.innerHTML = '';
    questions.forEach((q, index) => {
        const li = document.createElement('li');
        li.className = "question-list-item";
        li.innerHTML = `
            <span class="question-text">Q${index + 1}: ${q.question}</span>
            <button class="delete-question-btn" data-index="${index}">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
        `;
        questionsList.appendChild(li);
    });
    document.querySelectorAll('.delete-question-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            questionToDeleteId = e.currentTarget.dataset.index;
            confirmationModal.classList.add('visible');
        });
    });
};


const handleNextQuestion = () => {
    if (selectedAnswer === null) {
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
        score += 1;
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
        currentQuestionIndex = nextIndex;
        selectedAnswer = null;
        renderQuizPage();
    } else {
        quizCompleted = true;
        renderQuizPage();
    }
};

const resetQuiz = () => {
    currentQuestionIndex = 0;
    selectedAnswer = null;
    score = 0;
    quizCompleted = false;
    renderQuizPage();
};

const handleAddQuestion = (e) => {
    e.preventDefault();
    
    const newQuestionData = {
        question: newQuestionInput.value,
        options: newOptionInputs.map(input => input.value),
        correctAnswerIndex: parseInt(newCorrectAnswerSelect.value, 10),
    };

    questions.push(newQuestionData);

    newQuestionInput.value = '';
    newOptionInputs.forEach(input => input.value = '');
    newCorrectAnswerSelect.value = 0;
    renderUI();
};

const handleDeleteQuestion = () => {
    if (questionToDeleteId !== null) {
        questions.splice(questionToDeleteId, 1);
    }
    confirmationModal.classList.remove('visible');
    questionToDeleteId = null;
    renderUI();
};

const toggleDarkMode = () => {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        body.classList.add('dark-mode');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    } else {
        body.classList.remove('dark-mode');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
};


document.addEventListener('DOMContentLoaded', () => {
    if (isDarkMode) {
        body.classList.add('dark-mode');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
    } else {
        body.classList.remove('dark-mode');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    toggleDarkModeBtn.addEventListener('click', toggleDarkMode);

    quizPageBtn.addEventListener('click', () => {
        showPage('quiz');
        renderUI();
    });
    adminPageBtn.addEventListener('click', () => {
        showPage('admin');
        renderUI();
    });
    addQuestionForm.addEventListener('submit', handleAddQuestion);
    confirmDeleteBtn.addEventListener('click', handleDeleteQuestion);
    cancelDeleteBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('visible');
        questionToDeleteId = null;
    });
    renderUI();
});