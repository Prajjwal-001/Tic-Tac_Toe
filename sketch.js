let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let w, h;
let ai = 'X';
let human = 'O';
let currentPlayer = human;
let gameMode = 'ai';
let resultP;

let scores = {
  X: 10,
  O: -10,
  tie: 0
};

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('game');
  w = width / 3;
  h = height / 3;
  if (gameMode === 'ai') {
    bestMove();
  }
}

function draw() {
  background(200);

  strokeWeight(4);
  stroke(0);

  line(w, 0, w, height);
  line(w * 2, 0, w * 2, height);
  line(0, h, width, h);
  line(0, h * 2, width, h * 2);

  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 3; i++) {
      let x = w * i + w / 2;
      let y = h * j + h / 2;
      let spot = board[i][j];
      textSize(32);
      let r = w / 4;
      if (spot == human) {
        fill(255, 0, 0);
        ellipse(x, y, r * 2);
      } else if (spot == ai) {
        fill(0, 0, 255);
        line(x - r, y - r, x + r, y + r);
        line(x + r, y - r, x - r, y + r);
      }
    }
  }

  let result = checkWinner();
  if (result !== null) {
    noLoop();
    resultP = createP('');
    resultP.style('font-size', '32pt');
    if (result == 'tie') {
      resultP.html('Tie!');
    } else {
      resultP.html(`${result} wins!`);
    }
    resultP.parent('game-container');
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        board[i][j] = ai;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move = { i, j };
        }
      }
    }
  }
  board[move.i][move.j] = ai;
  currentPlayer = human;
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = ai;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = max(score, bestScore);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] == '') {
          board[i][j] = human;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

function equals3(a, b, c) {
  return a == b && b == c && a != '';
}

function checkWinner() {
  let winner = null;

  for (let i = 0; i < 3; i++) {
    if (equals3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
    }
  }

  for (let i = 0; i < 3; i++) {
    if (equals3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
    }
  }

  if (equals3(board[0][0], board[1][1], board[2][2])) {
    winner = board[0][0];
  }
  if (equals3(board[2][0], board[1][1], board[0][2])) {
    winner = board[2][0];
  }

  let openSpots = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] == '') {
        openSpots++;
      }
    }
  }

  if (winner == null && openSpots == 0) {
    return 'tie';
  } else {
    return winner;
  }
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    if (board[i][j] == '') {
      if (gameMode === 'two-player') {
        board[i][j] = currentPlayer;
        currentPlayer = currentPlayer == human ? ai : human;
      } else if (gameMode === 'ai' && currentPlayer == human) {
        board[i][j] = human;
        currentPlayer = ai;
        bestMove();
      }
    }
  }
}

function setupEventListeners() {
  document.getElementById('switch-mode').addEventListener('click', () => {
    if (gameMode === 'ai') {
      gameMode = 'two-player';
      document.getElementById('switch-mode').innerText = 'Switch to AI Mode';
    } else {
      gameMode = 'ai';
      document.getElementById('switch-mode').innerText = 'Switch to Two Player Mode';
      bestMove();
    }
    resetGame();
  });

  document.getElementById('reset-game').addEventListener('click', () => {
    resetGame();
  });
}

function resetGame() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = human;
  loop();
  redraw();
  if (resultP) {
    resultP.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setup();
});
