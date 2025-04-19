document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerProgressBar = document.getElementById('timerProgressBar');
    const sessionStatus = document.getElementById('sessionStatus');
    const focusDurationInput = document.getElementById('focusDuration');
    const breakDurationInput = document.getElementById('breakDuration');
    const longBreakDurationInput = document.getElementById('longBreakDuration');
    const sessionsBeforeLongBreakInput = document.getElementById('sessionsBeforeLongBreak');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    let timer;
    let timeRemaining = 25 * 60; // Initial focus time in seconds
    let isRunning = false;
    let isFocusSession = true;
    let sessionsCompleted = 0;

    const updateTimerDisplay = () => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timerProgressBar.style.width = `${(timeRemaining / (isFocusSession ? focusDurationInput.value * 60 : breakDurationInput.value * 60)) * 100}%`;
    };

    const startTimer = () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        timer = setInterval(() => {
            if (timeRemaining <= 0) {
                clearInterval(timer);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                if (isFocusSession) {
                    sessionsCompleted++;
                    if (sessionsCompleted >= sessionsBeforeLongBreakInput.value) {
                        timeRemaining = longBreakDurationInput.value * 60;
                        sessionsCompleted = 0;
                        sessionStatus.textContent = 'Long Break';
                    } else {
                        timeRemaining = breakDurationInput.value * 60;
                        sessionStatus.textContent = 'Break Time';
                    }
                    isFocusSession = false;
                } else {
                    timeRemaining = focusDurationInput.value * 60;
                    sessionStatus.textContent = 'Focus Session';
                    isFocusSession = true;
                }
                updateTimerDisplay();
            } else {
                timeRemaining--;
                updateTimerDisplay();
            }
        }, 1000);
    };

    const pauseTimer = () => {
        if (!isRunning) return;
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    };

    const resetTimer = () => {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        timeRemaining = focusDurationInput.value * 60;
        sessionsCompleted = 0;
        isFocusSession = true;
        sessionStatus.textContent = 'Focus Session';
        updateTimerDisplay();
    };

    const switchTab = (event) => {
        tabBtns.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        event.target.classList.add('active');
        document.querySelector(`.tab-content[data-tab="${event.target.dataset.tab}"]`).classList.add('active');
    };

    const setPreset = (event) => {
        const focusDuration = event.target.dataset.focus;
        const breakDuration = event.target.dataset.break;
        focusDurationInput.value = focusDuration;
        breakDurationInput.value = breakDuration;
        presetBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        resetTimer();
    };

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    tabBtns.forEach(btn => btn.addEventListener('click', switchTab));
    presetBtns.forEach(btn => btn.addEventListener('click', setPreset));

    focusDurationInput.addEventListener('input', () => {
        if (!isRunning) {
            timeRemaining = focusDurationInput.value * 60;
            updateTimerDisplay();
        }
    });

    breakDurationInput.addEventListener('input', () => {
        if (!isRunning && !isFocusSession) {
            timeRemaining = breakDurationInput.value * 60;
            updateTimerDisplay();
        }
    });

    longBreakDurationInput.addEventListener('input', () => {
        if (!isRunning && !isFocusSession && sessionsCompleted >= sessionsBeforeLongBreakInput.value) {
            timeRemaining = longBreakDurationInput.value * 60;
            updateTimerDisplay();
        }
    });

    sessionsBeforeLongBreakInput.addEventListener('input', () => {
        if (!isRunning && !isFocusSession && sessionsCompleted >= sessionsBeforeLongBreakInput.value) {
            timeRemaining = longBreakDurationInput.value * 60;
            updateTimerDisplay();
        }
    });

    updateTimerDisplay();
});
