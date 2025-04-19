const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const wpmResult = document.getElementById("wpm");
const accuracyResult = document.getElementById("accuracy");
const progressBar = document.getElementById("progress-bar");
const difficult = document.getElementById("difficulty-ui");
const timeResult = document.getElementById("time");

let startTime = null;
let endTime = null;
let fullText = "";
let currentTyped = "";
let correctChars = 0;
let totalChars = 0;

const initTest = (wordCount = 30) => {
    currentTyped = "";
    startTime = null;
    correctChars = 0;
    totalChars = 0;

    const wordsToType = [];
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    difficult.innerHTML = modeSelect.value;

    fullText = wordsToType.join(" ");

    if (!(currentTyped.length === fullText.length)) {
        wpmResult.innerHTML = `. . .`;
        accuracyResult.innerHTML = `. . .`;
        timeResult.innerHTML = `. . .`;
    }

    renderFullText();
};

const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

const renderFullText = () => {
    wordDisplay.innerHTML = fullText.split("").map((char, i) => {
        return `<span class="char ${char === " " ? "space-char" : ""}" data-index="${i}">${char === " " ? "&nbsp;" : char}</span>`;
    }).join('');
};

const updateTypingState = () => {
    correctChars = 0;
    totalChars = currentTyped.length;

    const chars = wordDisplay.querySelectorAll(".char");

    chars.forEach((span, i) => {
        const expectedChar = fullText[i];
        const typedChar = currentTyped[i];

        if (typedChar == null) {
            span.className = "char";
        } else if (typedChar === expectedChar) {
            span.className = "char typing_correct";
            correctChars++;
        } else {
            span.className = "char typing_incorrect";
        }
    });

    if (currentTyped.length === fullText.length) {
        endTime = Date.now();
        const { wpm, accuracy, minutes } = calculateStats();
        const minutesFixed = minutes.toFixed(2);

        wpmResult.innerHTML = wpm;
        accuracyResult.innerHTML = `${accuracy} %`;
        timeResult.innerHTML = minutesFixed;
        document.body.classList.remove('typing-active');
        return
    }
};

const calculateStats = () => {
    if (!startTime) return {
        wpm: 0,
        accuracy: 0
    };

    const end = endTime ?? Date.now();
    const minutes = (end - startTime) / 60000;
    const wordsTyped = correctChars / 5;
    const wpm = Math.round(wordsTyped / minutes);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;

    return { wpm, accuracy, minutes };
};

document.addEventListener('keydown', (e) => {
    if (fullText.length === 0) return;
    if (!startTime) startTime = Date.now();

    if (e.key === 'Backspace') {
        currentTyped = currentTyped.slice(0, -1);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        currentTyped += e.key;
    }

    updateTypingState();
});

modeSelect.addEventListener('change', () => initTest());

initTest();