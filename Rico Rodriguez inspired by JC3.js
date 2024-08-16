const player = "p";
const bullet = "b";
const background = "g";
const obstacle = "o";

setLegend(
  [player, bitmap`
................
................
................
.....777777.....
.....7C77C7.....
.....777777.....
.....773377.....
......7777......
.....777777.....
.......77.......
......7777......
......7..7......
.....77..77.....
................
................
................`],
  [bullet, bitmap`
................
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
.LLLLLLLLLLLLLL.
................`],
  [obstacle, bitmap`
................
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
................
................`],
  [background, bitmap`
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444`]
);

setBackground(background);

const level = map`
................
................
................
...ooooo........
...o............
...o............
........p.......
................
................
...ooooo........
................
................
................
................
................`;
setMap(level);

setSolids([player, bullet, obstacle]);

let gameOver = false;
let gameStarted = false;
let stepsSurvived = 0;

function showStartScreen() {
  addText("Your name is", { x: 2, y: 1, color: color`3` });
  addText("Rico Rodriguez.", { x: 2, y: 2, color: color`3` });
  addText("The black hand", { x: 2, y: 4, color: color`3` });
  addText("have found you", { x: 2, y: 5, color: color`3` });
  addText("vulnerable!", { x: 2, y: 6, color: color`3` });
  addText("Your controls", { x: 2, y: 8, color: color`3` });
  addText("have been", { x: 2, y: 9, color: color`3` });
  addText("hacked", { x: 2, y: 10, color: color`3` });
  addText("and are somehow", { x: 2, y: 11, color: color`3` });
  addText("flipped!", { x: 2, y: 12, color: color`3` });
  addText("Press I to start", { x: 2, y: 14, color: color`3` });
}

function instructions() {
  clearText();
  addText("Use DSAW to move", { x: 2, y: 1, color: color`3` })
}

function hideStartScreen() {
  clearText();
}

function createBullet() {
  if (!gameOver && gameStarted) {
    const x = 0;
    const y = Math.floor(Math.random() * height());

    // Ensure the bullet doesn't spawn in an obstacle
    const obstacleAtSpawn = getTile(x, y).find(s => s.type === obstacle);

    if (!obstacleAtSpawn && x !== getFirst(player).x && y !== getFirst(player).y) {
      addSprite(x, y, bullet);
    }
  }
}

function moveBullets() {
  if (!gameOver && gameStarted) {
    getAll(bullet).forEach(b => {
      
      const nextTile = getTile(b.x + 1, b.y);
      if (b.x < width() - 1 && !nextTile.some(t => t.type === obstacle)) {
        b.x += 1;
      } else {
        b.remove();
      }
    });
  }
}

function checkCollisions() {
  const p = getFirst(player);
  
  if (p) {
    getAll(bullet).forEach(b => {
      if (p.x - b.x == 1 &&
          p.y == b.y) {
        gameOver = true;
        addText("Game Over!", { x: 2, y: 5, color: color`3` });
        addText(`Survived Steps: ${stepsSurvived}`, { x: 2, y: 7, color: color`3` });
        addText("Press J to restart", { x: 2, y: 9, color: color`3` });
        getAll(bullet).forEach(b => b.remove());
        setInterval(() => {}, 1000);
      }
    });
  }
}

onInput("w", () => {
  const p = getFirst(player);
  if (!gameOver && gameStarted && p.y < height() - 1) {
    const nextTile = getTile(p.x, p.y + 1);
    if (!nextTile.some(t => t.type === obstacle)) {
      p.y += 1;
      stepsSurvived += 1;
    }
  }
});

onInput("s", () => {
  const p = getFirst(player);
  if (!gameOver && gameStarted && p.y > 0) {
    const nextTile = getTile(p.x, p.y - 1);
    if (!nextTile.some(t => t.type === obstacle)) {
      p.y -= 1;
      stepsSurvived += 1;
    }
  }
});

onInput("a", () => {
  const p = getFirst(player);
  if (!gameOver && gameStarted && p.x > 0) {
    const nextTile = getTile(p.x - 1, p.y);
    if (!nextTile.some(t => t.type === obstacle)) {
      p.x -= 1;
      stepsSurvived += 1;
    }
  }
});

onInput("d", () => {
  const p = getFirst(player);
  if (!gameOver && gameStarted && p.x < width() - 1) {
    const nextTile = getTile(p.x + 1, p.y);
    if (!nextTile.some(t => t.type === obstacle)) {
      p.x += 1;
      stepsSurvived += 1;
    }
  }
});

onInput("j", () => {
    location.reload();
});

onInput("i", () => {
  if (!gameStarted) {
    gameStarted = true;
    hideStartScreen();
  }
});

afterInput(() => {
  if (!gameOver && gameStarted) {
    moveBullets();
    checkCollisions();
    createBullet();
    addText(`${stepsSurvived}`, { x: 2, y: 1, color: color`3` });
  }
});

setInterval(createBullet, 300);

showStartScreen();
