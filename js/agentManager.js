RUN = 1;
MAX_RUNS = 1;

AGENT_TIMER = -1;

function initAgent() {
    //console.log(BUBBLES_ARRAY);
    if (AGENT_TIMER === -1) {
        AGENT_TIMER = setInterval(loop, PACMAN_MOVING_SPEED);
    }
};

function loop() {
    if (GAMEOVER && RUN < MAX_RUNS) { // restart the game
        RUN++;
        simulateKeydown(13);
        simulateKeydown(13);
    }
    if (GAMEOVER && RUN === MAX_RUNS) {
        RUN++;
        outputStats();
    }

    selectMove();
};

function outputStats() {
    console.log("SCORE: " + SCORE + " HIGHSCORE: " + HIGHSCORE + " LEVEL: " + LEVEL);
};