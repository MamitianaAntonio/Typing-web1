const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry", "peach", "lemon", "lime", "melon", "plum"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery", "laptop", "desktop", "tablet", "speaker", "headset"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception", "opportunity", "revolutionary", "sophisticated", "extraordinary", "determination"]
};

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const wpmResult = document.getElementById("wpm");
const accuracyResult = document.getElementById("accuracy");
const progressBar = document.getElementById("progress-bar");
const difficult = document.getElementById("difficulty-ui");
const timeResult = document.getElementById("time");
const timer = document.getElementById("timer");
const typingInput = document.getElementById("typing-input");

let startTime = null;
let endTime = null;
let fullText = "";
let currentTyped = "";
let correctChars = 0;
let totalChars = 0;
let timeLeft = 0;
let timerInterval = null;
let lines = [];
let currentLineIndex = 0;

// Function to get selected time in seconds
const getSelectedTimeInSeconds = () => {
    const selectedTime = document.querySelector('input[name="time"]:checked').value;
    switch (selectedTime) {
        case "30s":
            return 30;
        case "1min":
            return 60;
        case "1min30s":
            return 90;
        default:
            return 90;
    }
};

// Function to format time as MM:SS
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Function to start countdown timer
const startCountdown = () => {
    // Clear any existing interval
    if (timerInterval) clearInterval(timerInterval);
    
    // Set initial timer display
    timer.textContent = formatTime(timeLeft);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        
        // Update timer display
        timer.textContent = formatTime(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTime = Date.now();
            
            // Recalculate correctChars and totalChars one last time
            correctChars = 0;
            totalChars = currentTyped.length;
            
            for (let i = 0; i < currentTyped.length; i++) {
                if (currentTyped[i] === fullText[i]) {
                    correctChars++;
                }
            }
            
            const { wpm, accuracy, minutes } = calculateStats();
            wpmResult.innerHTML = wpm;
            accuracyResult.innerHTML = `${accuracy} %`;
            timeResult.innerHTML = `${minutes.toFixed(2)} min`;
            progressBar.classList.add("typing-progress__bar-complete");
            document.body.classList.remove('typing-active');
            typingInput.blur();
        }
    }, 1000);
};

// Function to split text into lines based on difficulty
const splitTextIntoLines = (text) => {
    const words = text.split(" ");
    const lines = [];
    
    // Calculate how many words we need per line to fill the container
    // This will depend on the container width and average word length
    
    // Get the container width in characters (approximate)
    const containerWidth = Math.floor(document.querySelector('.typing-container').clientWidth / 16); // 16px is approx char width
    
    // Calculate average characters per line based on difficulty
    let charsPerLine;
    
    switch(modeSelect.value) {
        case 'easy':
            charsPerLine = containerWidth * 0.9; // 90% of container width
            break;
        case 'medium':
            charsPerLine = containerWidth * 0.95; // 95% of container width
            break;
        case 'hard':
            charsPerLine = containerWidth; // 100% of container width
            break;
        default:
            charsPerLine = containerWidth * 0.9;
    }
    
    let currentLine = [];
    let currentLineLength = 0;
    
    // Fill each line with words until it reaches the target length
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordLength = word.length + 1; // +1 for space
        
        // If adding this word would exceed the line length, start a new line
        if (currentLineLength + wordLength > charsPerLine && currentLine.length > 0) {
            lines.push(currentLine.join(" "));
            currentLine = [word];
            currentLineLength = wordLength;
        } else {
            // Otherwise add the word to the current line
            currentLine.push(word);
            currentLineLength += wordLength;
        }
    }
    
    // Add the last line if it's not empty
    if (currentLine.length > 0) {
        lines.push(currentLine.join(" "));
    }
    
    return lines;
};


const initTest = (wordCount = 30) => {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    currentTyped = "";
    startTime = null;
    endTime = null;
    correctChars = 0;
    totalChars = 0;
    currentLineIndex = 0;
    
    // Reset the timer display based on selected time
    timeLeft = getSelectedTimeInSeconds();
    timer.textContent = formatTime(timeLeft);
    
    // Reset progress bar
    progressBar.classList.remove("typing-progress__bar-complete");
    progressBar.style.width = '0%';
    
    // Reset input field
    typingInput.value = "";
    
    // Generate new words
    const wordsToType = [];
    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }
    
    difficult.innerHTML = modeSelect.value;
    fullText = wordsToType.join(" ");
    
    // Split text into lines
    lines = splitTextIntoLines(fullText);
    
    // Reset result displays
    wpmResult.innerHTML = `. . .`;
    accuracyResult.innerHTML = `. . .`;
    timeResult.innerHTML = `. . .`;
    
    renderLines();
    
    // Focus the input field
    typingInput.focus();
};

const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

// Render lines of text
const renderLines = () => {
    wordDisplay.innerHTML = '';
    
    lines.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = `line ${index === currentLineIndex ? 'active' : index < currentLineIndex ? 'completed' : 'upcoming'}`;
        
        // For completed lines, don't display content
        if (index < currentLineIndex) {
            wordDisplay.appendChild(lineElement);
            return;
        }
        
        // For active and upcoming lines, display content
        const lineContent = document.createElement('div');
        lineContent.className = 'line-content';
        
        lineContent.innerHTML = line.split("").map((char, i) => {
            const globalIndex = getGlobalIndex(index, i);
            return `<span class="char ${char === " " ? "space-char" : ""}" data-index="${globalIndex}">${char === " " ? "&nbsp;" : char}</span>`;
        }).join('');
        
        lineElement.appendChild(lineContent);
        wordDisplay.appendChild(lineElement);
    });
};

// Get global character index from line index and character index
const getGlobalIndex = (lineIndex, charIndex) => {
    let globalIndex = charIndex;
    
    for (let i = 0; i < lineIndex; i++) {
        // Add the length of the line plus a space
        globalIndex += lines[i].length;
        
        // Add a space between lines (except for the last line)
        if (i < lines.length - 1) {
            globalIndex += 1;
        }
    }
    
    return globalIndex;
};

// Get line index and character index from global index
const getLineAndCharIndex = (globalIndex) => {
    let remainingChars = globalIndex;
    let lineIndex = 0;
    
    while (lineIndex < lines.length && remainingChars >= lines[lineIndex].length) {
        remainingChars -= lines[lineIndex].length;
        lineIndex++;
    }
    
    return {
        lineIndex,
        charIndex: remainingChars
    };
};

const updateTypingState = () => {
    // Reset counters on each update
    correctChars = 0;
    totalChars = currentTyped.length;
    
    // Check each typed character
    for (let i = 0; i < currentTyped.length; i++) {
        if (currentTyped[i] === fullText[i]) {
            correctChars++;
        }
    }
    
    // Check if we need to move to the next line
    if (currentLineIndex < lines.length) {
        const currentLine = lines[currentLineIndex];
        const lineStartIndex = getGlobalIndex(currentLineIndex, 0);
        const nextLineStartIndex = currentLineIndex + 1 < lines.length ? 
                                  getGlobalIndex(currentLineIndex + 1, 0) : 
                                  fullText.length;
        
        // If all characters in the current line have been typed
        if (currentTyped.length >= nextLineStartIndex) {
            // Move to next line
            currentLineIndex++;
            
            // Clear input field for the next line
            typingInput.value = "";
            currentTyped = currentTyped.substring(0, nextLineStartIndex);
            
            // Re-render lines with updated classes
            renderLines();
        }
    }
    
    // Update character styling
    const allChars = wordDisplay.querySelectorAll(".char");
    
    allChars.forEach((span) => {
        const i = parseInt(span.getAttribute("data-index"));
        const expectedChar = fullText[i];
        const typedChar = currentTyped[i];
        
        // Reset classes
        span.className = "char";
        if (expectedChar === " ") span.classList.add("space-char");
        
        // Add current class to show cursor position
        if (i === currentTyped.length) {
            span.classList.add("current");
        }
        
        if (typedChar != null) {
            if (typedChar === expectedChar) {
                span.classList.add("typing_correct");
            } else {
                span.classList.add("typing_incorrect");
            }
        }
    });
    
    const progress = (currentTyped.length / fullText.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Check if the test is complete
    if (currentTyped.length === fullText.length) {
        endTime = Date.now();
        const { wpm, accuracy, minutes } = calculateStats();
        const minutesFixed = minutes.toFixed(2);
        wpmResult.innerHTML = wpm;
        accuracyResult.innerHTML = `${accuracy} %`;
        timeResult.innerHTML = `${minutesFixed} min`;
        progressBar.classList.add("typing-progress__bar-complete");
        document.body.classList.remove('typing-active');
        
        // Clear the timer
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Blur the input field
        typingInput.blur();
    }
};

const calculateStats = () => {
    if (!startTime) return {
        wpm: 0,
        accuracy: 0,
        minutes: 0
    };
    
    // Calculate elapsed time in minutes
    const end = endTime ?? Date.now();
    const minutes = (end - startTime) / 60000;
    
    // Calculate number of correctly typed words
    // A word is generally considered as 5 characters
    const wordsTyped = correctChars / 5;
    
    // Calculate WPM (words per minute)
    // Standard formula: (number of words / time in minutes)
    const wpm = Math.round(wordsTyped / minutes);
    
    // Calculate accuracy
    // Percentage of correctly typed characters relative to total typed characters
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    
    return { wpm, accuracy, minutes };
};

// Setup input event listeners
typingInput.addEventListener('input', () => {
    if (fullText.length === 0) return;
    
    if (!startTime) {
        startTime = Date.now();
        timeLeft = getSelectedTimeInSeconds();
        startCountdown();
    }
    
    // Update current typed text
    const lineStartIndex = getGlobalIndex(currentLineIndex, 0);
    const previousText = currentTyped.substring(0, lineStartIndex);
    currentTyped = previousText + typingInput.value;
    
    updateTypingState();
});

// Focus the input when clicking on the typing container
document.querySelector(".typing-container").addEventListener("click", () => {
    typingInput.focus();
});

// Handle mode change
modeSelect.addEventListener('change', () => initTest());

// Handle restart button
document.getElementById("restart-icon").addEventListener("click", (e) => {
    e.preventDefault();
    initTest();
});

// Handle time option change
document.querySelectorAll('input[name="time"]').forEach(option => {
    option.addEventListener("change", () => {
        // Update time display
        timeLeft = getSelectedTimeInSeconds();
        timer.textContent = formatTime(timeLeft);
        
        // If test hasn't started yet, no need to restart
        if (!startTime) return;
        
        // Otherwise, restart the test
        initTest();
    });
});

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Focus the input field
    typingInput.focus();
    
    // Initialize the test
    initTest();
});
