const questions = [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "High Tech Modern Language", correct: false },
            { text: "Hyper Transfer Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false }
        ]
    },
    {
        question: "Which language is used for styling web pages?",
        answers: [
            { text: "HTML", correct: false },
            { text: "JQuery", correct: false },
            { text: "CSS", correct: true },
            { text: "XML", correct: false }
        ]
    },
    {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        answers: [
            { text: "<script href='xxx.js'>", correct: false },
            { text: "<script name='xxx.js'>", correct: false },
            { text: "<script src='xxx.js'>", correct: true },
            { text: "<script file='xxx.js'>", correct: false }
        ]
    },
    {
        question: "How do you create a function in JavaScript?",
        answers: [
            { text: "function myFunction()", correct: true },
            { text: "function = myFunction()", correct: false },
            { text: "function:myFunction()", correct: false },
            { text: "create myFunction()", correct: false }
        ]
    },
    {
        question: "Which CSS property controls the text size?",
        answers: [
            { text: "font-style", correct: false },
            { text: "text-size", correct: false },
            { text: "text-style", correct: false },
            { text: "font-size", correct: true }
        ]
    }
];

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionTextElement = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const timeElement = document.getElementById('time-left');
const currentQuestionNumElement = document.getElementById('current-question-num');
const totalQuestionsElement = document.getElementById('total-questions');

const scoreTextElement = document.getElementById('score-text');
const maxScoreElement = document.getElementById('max-score');
const feedbackTextElement = document.getElementById('feedback-text');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerId;

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    quizScreen.classList.add('active');
    
    currentQuestionIndex = 0;
    score = 0;
    totalQuestionsElement.innerText = questions.length;
    
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
    currentQuestionNumElement.innerText = currentQuestionIndex + 1;
    startTimer();
}

function showQuestion(question) {
    questionTextElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearTimeout(timerId);
    nextBtn.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    timeLeft = 15;
    timeElement.innerText = timeLeft;
    timeElement.style.color = '#ff6b6b';
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timeElement.innerText = timeLeft;
        if(timeLeft <= 5) {
            timeElement.style.color = '#ff4757';
        }
        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleTimeOut();
        }
    }, 1000);
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    clearInterval(timerId);
    
    if (correct) {
        score++;
    }
    
    setStatusClass(selectedButton, correct);
    
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if(button.dataset.correct === "true") {
            button.classList.add('correct');
        } else if (button !== selectedButton) {
            button.style.opacity = '0.5';
        }
    });
    
    if (questions.length > currentQuestionIndex + 1) {
        nextBtn.classList.remove('hide');
    } else {
        setTimeout(showResult, 1500);
    }
}

function handleTimeOut() {
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        if(button.dataset.correct === "true") {
            button.classList.add('correct');
        } else {
            button.style.opacity = '0.5';
        }
    });
    
    if (questions.length > currentQuestionIndex + 1) {
        nextBtn.classList.remove('hide');
    } else {
        setTimeout(showResult, 1500);
    }
}

function setStatusClass(element, correct) {
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function showResult() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    scoreTextElement.innerText = score;
    maxScoreElement.innerText = questions.length;
    
    if (score === questions.length) {
        feedbackTextElement.innerText = "Perfect score! You are a genius!";
    } else if (score >= questions.length / 2) {
        feedbackTextElement.innerText = "Good job! You passed.";
    } else {
        feedbackTextElement.innerText = "Better luck next time.";
    }
}
