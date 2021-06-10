var difficulty = 'easy';
var num_rows;
var num_cols;
var num_mines;
var grid;

var scoreboard = document.getElementById("scoreboard");
var mine_count = document.getElementById('mine-count');
var smiley_btn = document.getElementById('smiley-btn');
var time_count = document.getElementById('time-count');
var board = document.getElementById('game-board');


const can_vibrate = window.navigator.vibrate
function vibrateDevice(duration) {
  if (can_vibrate) window.navigator.vibrate(duration);
}

// used to know which event listeners to use for long press
const is_iOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
(navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
!window.MSStream;


const difficulties = ['easy', 'intermediate', 'expert'];
var diff_idx = 0;
mine_count.addEventListener("click", function() {
  vibrateDevice(50); // vibrate for 50ms
  diff_idx = (diff_idx + 1) % difficulties.length;
  difficulty = difficulties[diff_idx];
  configureGame(difficulty);
  setDimensions();
});


var remaining_mines;
function subtractMineCount() {
  remaining_mines--;
  mine_count.innerHTML = Math.max(remaining_mines, 0);
  while (mine_count.innerHTML.length < 3) {
    mine_count.innerHTML = '0' + String(mine_count.innerHTML);
  }
}

function addMineCount() {
  remaining_mines++;
  if (remaining_mines > 0) { mine_count.innerHTML = remaining_mines; }
  else { mine_count.innerHTML = 0 };
  while (mine_count.innerHTML.length < 3) {
    mine_count.innerHTML = '0' + String(mine_count.innerHTML);
  }
}

var can_sink_count = false;  // controls sinkMineCount() setTimeout ability
function sinkMineCount() {
  if (
    (can_sink_count) &&
    (mine_count.innerHTML != '000')
  ) {
    subtractMineCount();
    setTimeout(sinkMineCount, 10);
  }
}


var time;
var timer;
var timer_active = false;

function startTimer() {
  resetTime();
  timer_active = true;
  timer = setInterval(function() {
    updateTimer();
  }, 1000);
}

function updateTimer() {
 time++;
 if (time == 999) { stopTimer(); }
 var time_string = String(time);
 while (time_string.length != 3) { time_string = '0' + time_string; }
 time_count.innerHTML = time_string;
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = false;
    timer_active = false;
  }
}

function resetTime() {
  time = 0;
  if (timer) { stopTimer(); }
  if (timer_active) { timer_active = false; }
  time_count.innerHTML = '000';
}


function setPresets(difficulty) {
  var presets = {
    // 'difficulty': [rows, cols, mines]
    'easy':          [10, 10, 10],
    'intermediate':  [16, 16, 40],
    'expert':        [30, 16, 99]
  }
  var choice = presets[difficulty];
  // set vars
  num_rows = choice[0];
  num_cols = choice[1];
  num_mines = choice[2];
  remaining_mines = choice[2];
  grid = [];
  // update board layout
  board.style.gridTemplateColumns = 'repeat(' + num_cols + ', 1fr)';
  board.style.gridTemplateRows = 'repeat(' + num_rows + ', 1fr)';
  // reset scoreboard
  can_sink_count = false;  // disallow mine counter setTimeout decrement
  mine_count.innerHTML = '0' + num_mines;
  smiley_btn.style.backgroundImage = 'url(./img/face-smile.png)';
}

function generateBoard() {
  for (r=0; r<num_rows; r++) {
    grid[r] = [];
    for (c=0; c<num_cols; c++) {
      grid[r][c] = 0;
    }
  }
}

function generateMines() {
  var rand_row;
  var rand_col;
  for (m=0; m<num_mines; m++) {
    do {
      rand_row = Math.floor(Math.random() * num_rows);
      rand_col = Math.floor(Math.random() * num_cols);
    } while (grid[rand_row][rand_col] == "M")
    grid[rand_row][rand_col] = "M";
  }
}

function generateTileNumbers() {
  for (r=0; r<num_rows; r++) {
    for (c=0; c<num_cols; c++) {
      if (grid[r][c] != "M") {
        checkAdjacentTiles(r,c);
      }
    }
  }
}

function checkAdjacentTiles(row, col) {
  var mines = 0;
  for (var r=row-1; r<=row+1; r++) {
    for (var c=col-1; c<=col+1; c++) {
      try {
        if (grid[r][c] == "M") { mines++; }
      } catch {
        continue;
      }
    }
  }
  grid[row][col] = mines;
}

function clearBoard() {
  while (board.firstChild) { board.removeChild(board.firstChild); }
}

function configureBoard() {
  clearBoard();
  for (r=0; r<num_rows; r++) {
    for (c=0; c<num_cols; c++) {
      var cell = document.createElement('span');
      var cell_id = 'c-' + r.toString() + '-' + c.toString();
      cell.setAttribute('id', cell_id);
      cell.classList.add('cell');
      cell.innerHTML = grid[r][c];
      // short press uncovers cell and long press flags cell functionality
      if (is_iOS) {
        cell.addEventListener('touchstart', cellMousedown);
        cell.addEventListener('touchend', iOScellClick);
      } else {
        cell.addEventListener('mousedown', cellMousedown);
        cell.addEventListener('mouseup', cellMouseup);
        cell.addEventListener('click', cellClick);
      }

      cell.classList.add('num' + grid[r][c]);

      var cover = document.createElement('span');
      cover.classList.add('cover');

      cell.insertAdjacentElement('beforeend', cover);
      board.insertAdjacentElement('beforeend', cell);
    }
  }
}

function configureGame(difficulty) {
  resetTime();
  setPresets(difficulty);
  generateBoard();
  generateMines();
  generateTileNumbers();
  // console.table(grid);
  configureBoard();
}
configureGame(difficulty);
// setInterval(configureGame, 2000);

smiley_btn.addEventListener("click", function() {
  vibrateDevice(50); // vibrate for 50ms
  configureGame(difficulty);
});


// variables for storing if user long clicks a cell
var start_time;
var end_time;
var long_press = false;

function cellMousedown() {
  start_time = new Date().getTime();
}

function cellMouseup() {
  end_time = new Date().getTime();
  long_press = (end_time - start_time < 500) ? false : true;
}

function cellClick() {
  (long_press) ? flagCell(this, this.id) : clickCell(this, this.id);
}

function cellClickAlt() {
  if (long_press) flagCell(this, this.id);
}


function flagCell(cell, cell_id) {
  vibrateDevice(25); // vibrate for 25ms
  var cell_cover = cell.querySelector('.cover');
  var flag_cover = cell.querySelector('.flag-cover');
  if (cell_cover) {
    cell.removeChild(cell_cover);
    flag_cover = document.createElement('span');
    flag_cover.classList.add('flag-cover');
    flag_cover.style.backgroundImage = './img/flag.png';
    flag_cover.style.cursor = 'default';
    cell.insertAdjacentElement('beforeend', flag_cover);
    if (is_iOS) {
      cell.removeEventListener('touchend', iOScellClick);
      cell.addEventListener('touchend', iOScellClickAlt);
    } else {
      cell.removeEventListener('click', cellClick);
      cell.addEventListener('click', cellClickAlt);
    }
    subtractMineCount();
  } else {
    cell.removeChild(flag_cover);
    cell_cover = document.createElement('span');
    cell_cover.classList.add('cover');
    cell.insertAdjacentElement('beforeend', cell_cover);
    if (is_iOS) {
      cell.removeEventListener('touchend', iOScellClickAlt);
      cell.addEventListener('touchend', iOScellClick);
    } else {
      cell.removeEventListener('click', cellClickAlt);
      cell.addEventListener('click', cellClick);
    }

    addMineCount();
  }
}

function clickCell(cell, cell_id) {
  // Start Timer if Needed
  if (!timer_active) { startTimer(); }

  // Update Cell
  var cell_cover = cell.querySelector('.cover');
  if (cell_cover) {
    cell.removeChild(cell_cover);
    cell.onclick = null;
    cell.classList.add('clicked');
  }

  // Check Tile Value
  var val = cell.innerHTML[0];

  // hit mine
  if (val == 'M') { hitMine(cell); }

  // hit nonzero number
  else if (val != 0) { checkWin(); }

  // hit 0 - recursion
  else {
    var split_id = cell_id.split('-');
    var row = parseInt(split_id[1]);
    var col = parseInt(split_id[2]);

    var r = Math.max(row-1, 0);
    var r_hi = Math.min(row+1, num_rows-1);
    var c;
    var c_hi;


    for (r; r<r_hi+1; r++) {
      c = Math.max(col-1, 0);
      c_hi = Math.min(col+1, num_cols-1);
      for (c; c<=c_hi; c++) {

        var adj_cell_id = 'c-' + String(r) + '-' + String(c);
        var adj_cell = document.getElementById(adj_cell_id);

        if ((adj_cell_id != cell_id) && (adj_cell.querySelector('.cover') != null)) {
          clickCell(adj_cell, adj_cell_id);
        }
      }
    }
  }
}

function hitMine(cell) {
  cell.style.backgroundColor = '#ff0000';
  smiley_btn.style.backgroundImage = 'url(./img/face-frown.png)';
  uncoverBoard('lose');
  stopTimer();
}

function checkWin() {
  for (r=0; r<num_rows; r++) {
    for (c=0; c<num_cols; c++) {
      var curr_cell = document.getElementById('c-' + String(r) + '-' + String(c));
      if (
        (grid[r][c] != 'M') &&
        (curr_cell.querySelector('.cover') != null)
      ) {
        return;  // player has not located all mines
      }
    }
  }
  // player has won
  stopTimer();
  smiley_btn.style.backgroundImage = 'url(./img/face-cool.png)';
  uncoverBoard('win');
  can_sink_count = true;  // allow mine counter setTimeout decrement
  sinkMineCount();
}

function uncoverBoard(result) {
  vibrateDevice(250); // vibrate for 250ms
  var covers = document.getElementsByClassName('cover');
  var parent;
  while (covers.length > 0) {
    parent = covers[0].parentNode;
    parent.removeChild(covers[0]);
    parent.onclick = null;
    parent.classList.add('clicked');

    if (
      (result == 'win') &&
      (parent.innerHTML[0] == 'M')
    ) {
      var cover = document.createElement('span');
      cover.classList.add('flag-cover');
      cover.style.backgroundImage = './img/flag.png';
      cover.style.cursor = 'default';
      parent.insertAdjacentElement('beforeend', cover);

      parent.style.background = 'var(--light-grey)';  // bugfix - remove mine img
    }
  }
}
