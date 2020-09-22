/*
   Curran Seam
   TCSS 435 AI
   Pacman
*/
var GAMEBOARD = [];

var getXY = function(x, y) {
    var i = Math.floor((x - BUBBLES_X_START + BUBBLES_GAP / 2) / BUBBLES_GAP);
    var j = Math.floor((y - BUBBLES_Y_START + 9) / 17.75);

    return { x: i, y: j }
}

var buildGameboard = function() {
    GAMEBOARD = [];
    for (var i = 0; i < 26; i++) {
        GAMEBOARD.push([]);
        for (var j = 0; j < 29; j++) {
            GAMEBOARD[i].push({
                bubble: false,
                superBubble: false,
                inky: false,
                pinky: false,
                blinky: false,
                clyde: false,
                pacman: false,
                eaten: false,
                last: null
            });
        }
    }

    for (var i = 0; i < BUBBLES_ARRAY.length; i++) {
        var bubbleParams = BUBBLES_ARRAY[i].split(";");
        var y = parseInt(bubbleParams[1]) - 1;
        var x = parseInt(bubbleParams[2]) - 1;
        var type = bubbleParams[3];
        var eaten = parseInt(bubbleParams[4]);
        if (type === "b") {
            GAMEBOARD[x][y].bubble = true;
        } else {
            GAMEBOARD[x][y].superBubble = true;
        }
        if (eaten === 0) {
            GAMEBOARD[x][y].eaten = false;
        } else {
            GAMEBOARD[x][y].eaten = true;
        }
    }

    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            if (!GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].superBubble) {
                GAMEBOARD[i][j] = null;
            }
        }
    }

    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            if ((i === 0 && (j === 13)) ||
                (i === 1 && (j === 13)) ||
                (i === 2 && (j === 13)) ||
                (i === 3 && (j === 13)) ||
                (i === 4 && (j === 13)) ||
                (i === 6 && (j === 13)) ||
                (i === 7 && (j === 13)) ||
                (i === 8 && (j >= 10 && j <= 18)) ||
                (i === 9 && (j === 10 || j === 16)) ||
                (i === 10 && (j === 10 || j === 16)) ||
                (i === 11 && (((j >= 8) && (j <= 10)) || j === 16)) ||
                (i === 12 && (j === 10 || j === 16)) ||
                (i === 13 && (j === 10 || j === 16)) ||
                (i === 14 && (((j >= 8) && (j <= 10)) || j === 16)) ||
                (i === 15 && (j === 10 || j === 16)) ||
                (i === 16 && (j === 10 || j === 16)) ||
                (i === 17 && (j >= 10 && j <= 18)) ||
                (i === 18 && (j === 13)) ||
                (i === 19 && (j === 13)) ||
                (i === 21 && (j === 13)) ||
                (i === 22 && (j === 13)) ||
                (i === 23 && (j === 13)) ||
                (i === 24 && (j === 13)) ||
                (i === 25 && (j === 13))) {
                GAMEBOARD[i][j] = {
                    bubble: false,
                    superBubble: false,
                    inky: false,
                    pinky: false,
                    blinky: false,
                    clyde: false,
                    pacman: false,
                    eaten: false
                };
            }
        }
    }

    var p = getXY(GHOST_INKY_POSITION_X, GHOST_INKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].inky = true;
    p = getXY(GHOST_PINKY_POSITION_X, GHOST_PINKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pinky = true;
    p = getXY(GHOST_BLINKY_POSITION_X, GHOST_BLINKY_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].blinky = true;
    p = getXY(GHOST_CLYDE_POSITION_X, GHOST_CLYDE_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].clyde = true;

    p = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
    if (p.x >= 0 && p.x < 26 && GAMEBOARD[p.x][p.y]) GAMEBOARD[p.x][p.y].pacman = true;

};

function drawRect(i, j) {
    var ctx = PACMAN_CANVAS_CONTEXT;
    var ygap = 17.75;
    var x = BUBBLES_X_START + i * BUBBLES_GAP - BUBBLES_GAP / 2;
    var y = BUBBLES_Y_START + j * ygap - 9;
    var w = BUBBLES_GAP;
    var h = ygap;

    if (GAMEBOARD && GAMEBOARD[0] && GAMEBOARD[i][j]) {
        ctx.strokeStyle = "green";
        ctx.rect(x, y, w, h);
        ctx.stroke();
    }
}

function drawDebug() {
    for (var i = 0; i < 26; i++) {
        for (var j = 0; j < 29; j++) {
            drawRect(i, j);
        }
    }
}

function selectMove() {
    buildGameboard();
    if (!PACMAN_DEAD && !GAMEOVER) { // make sure the game is running
        var pacmanPos = getXY(PACMAN_POSITION_X, PACMAN_POSITION_Y);
        var dir = oneDirection();
        setTimeout(validate(pacmanPos, dir), 2000);

        if (GAMEBOARD[pacmanPos.x][pacmanPos.y] !== null) GAMEBOARD[pacmanPos.x][pacmanPos.y].eaten = true;
        var bubbles = getBubbles();
        var location = bfsHelper(pacmanPos, bubbles);

        if (location !== undefined) var direction = getDirection(pacmanPos, location);
        if (location !== undefined && canMovePacman(direction)) movePacman(direction);
    }
}

function validate(pacmanPos, dir) {
    if (dir === 1 && safeCell(pacmanPos.x + 1, pacmanPos.y, true)) movePacman(dir);
    else if (dir === 2 && safeCell(pacmanPos.x, pacmanPos.y + 1, true)) movePacman(dir);
    else if (dir === 3 && safeCell(pacmanPos.x + 1, pacmanPos.y, true)) movePacman(dir);
    else if (dir == 4 && safeCell(pacmanPos.x, pacmanPos.y - 1, true)) movePacman(dir);
}

function getDirection(pacman, location) {
    if (pacman.x === location.x && pacman.y === location.y) return PACMAN_DIRECTION;
    else if (pacman.y === location.y) {
        if (pacman.x < location.x) return 1;
        else if (pacman.x > location.x) return 3;
    } else if (pacman.x === location.x) {
        if (pacman.y < location.y) return 2;
        else if (pacman.y > location.y) return 4;
    }
}

function getBubbles() {
    var bubbles = [];
    for (var i = 0; i < GAMEBOARD.length; i++) {
        for (var j = 0; j < GAMEBOARD[i].length; j++) {
            if (GAMEBOARD[i][j] !== null) {
                if (GAMEBOARD[i][j].bubble && !GAMEBOARD[i][j].eaten ||
                    GAMEBOARD[i][j].superBubble && !GAMEBOARD[i][j].eaten) {
                    bubbles.push({ x: i, y: j });
                }
            }
        }
    }
    return bubbles;
}

function bfs(location, bubbles) {
    var queue = [];
    var visited = [];
    var path = [];
    queue.push(location);
    visited.push(location);
    while (queue.length !== 0) {
        var curr = queue.shift();
        for (var i = 0; i < bubbles.length; i++) {
            if (curr.x === bubbles[i].x && curr.y === bubbles[i].y) {
                path.push(curr);
                while (curr.x !== location.x && curr.y !== location.y) {
                    var last = GAMEBOARD[curr.x][curr.y].last;
                    path.push(last);
                    curr = last;
                }
                return path;
            }
        }
        var neighbors = findNeighbors(curr);
        for (var i = 0; i < neighbors.length; i++) {
            if (!visited.includes(neighbors[i])) {
                queue.push(neighbors[i]);
                visited.push(neighbors[i]);
            }
        }
    }
}

function bfsHelper(location, bubbles) {
    var locations = bfs(location, bubbles);
    if (locations !== undefined) return locations[locations.length - 1];
}

function findNeighbors(position) {
    var neighbors = [];
    if (position.y !== 0 && GAMEBOARD[position.x][position.y - 1] !== null &&
        GAMEBOARD[position.x][position.y - 1] !== undefined &&
        GAMEBOARD[position.x][position.y - 1].last === null && safeCell(position.x, position.y - 1, false) && safeCell(position.x + 1, position.y - 1, false) && safeCell(position.x - 1, position.y - 1, false)) {
        GAMEBOARD[position.x][position.y - 1].last = position;
        neighbors.push({ x: position.x, y: position.y - 1 });
    }
    if (position.x !== 25 && GAMEBOARD[position.x + 1][position.y] !== null &&
        GAMEBOARD[position.x + 1][position.y] !== undefined &&
        GAMEBOARD[position.x + 1][position.y].last === null && safeCell(position.x + 1, position.y, false) && safeCell(position.x + 1, position.y + 1, false) && safeCell(position.x + 1, position.y - 1, false)) {
        GAMEBOARD[position.x + 1][position.y].last = position;
        neighbors.push({ x: position.x + 1, y: position.y });
    }
    if (position.x !== 0 && GAMEBOARD[position.x - 1][position.y] !== null &&
        GAMEBOARD[position.x - 1][position.y] !== undefined &&
        GAMEBOARD[position.x - 1][position.y].last === null && safeCell(position.x - 1, position.y, false) && safeCell(position.x - 1, position.y + 1, false) && safeCell(position.x - 1, position.y - 1, false)) {
        GAMEBOARD[position.x - 1][position.y].last = position;
        neighbors.push({ x: position.x - 1, y: position.y });
    }
    if (position.y !== 28 && GAMEBOARD[position.x][position.y + 1] !== null &&
        GAMEBOARD[position.x][position.y + 1] !== undefined &&
        GAMEBOARD[position.x][position.y + 1].last === null && safeCell(position.x, position.y + 1, false) && safeCell(position.x + 1, position.y + 1, false) && safeCell(position.x - 1, position.y + 1, false)) {
        GAMEBOARD[position.x][position.y + 1].last = position;
        neighbors.push({ x: position.x, y: position.y + 1 });
    }
    return neighbors;
}

function safeCell(x, y, randomMode) {
    if (randomMode && GAMEBOARD[x] !== null && GAMEBOARD[x] !== undefined &&
        GAMEBOARD[x][y] !== null && GAMEBOARD[x][y] !== undefined) return true;

    if (GAMEBOARD[x] === null || GAMEBOARD[x] === undefined ||
        GAMEBOARD[x][y] === null || GAMEBOARD[x][y] === undefined) return true;

    if (GAMEBOARD[x][y].clyde) return GHOST_CLYDE_AFFRAID_TIMER !== null;
    else if (GAMEBOARD[x][y].inky) return GHOST_INKY_AFFRAID_TIMER !== null;
    else if (GAMEBOARD[x][y].blinky) return GHOST_BLINKY_AFFRAID_TIMER !== null;
    else if (GAMEBOARD[x][y].pinky) return GHOST_PINKY_AFFRAID_TIMER !== null;
    return true;
};
// setInterval(drawDebug, 1000 / 3);