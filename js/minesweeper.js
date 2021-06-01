var difficulty = 'intermediate';
var num_rows;
var num_cols;
var num_mines;
var grid;

var scoreboard = document.getElementById("scoreboard");
var mine_count = document.getElementById('mine-count');
var button = document.querySelector('button');  // smiley button
var board = document.getElementById('board');  // game board

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
  grid = [];
  // update board layout
  board.style.gridTemplateColumns = 'repeat(' + num_cols + ', 1fr)';
  board.style.gridTemplateRows = 'repeat(' + num_rows + ', 1fr)';
  // reset scoreboard
  mine_count.innerHTML = '0' + num_mines;
  button.style.backgroundImage = 'url(./img/face-smile.png)';

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
      cell.setAttribute('onclick', 'clickCell(this, this.id)');

      cell.classList.add('num' + grid[r][c]);

      var cover = document.createElement('span');
      cover.classList.add('cover');

      cell.insertAdjacentElement('beforeend', cover);
      board.insertAdjacentElement('beforeend', cell);
    }
  }
}


function configureGame(difficulty) {
  setPresets(difficulty);
  generateBoard();
  generateMines();
  generateTileNumbers();
  // console.table(grid);
  configureBoard();
}
configureGame(difficulty);
// setInterval(configureGame, 2000);

button.addEventListener("click", function(){
  window.navigator.vibrate(100); // vibrate for 100ms
  configureGame(difficulty);
}, false);


function clickCell(cell, cell_id) {

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
  if (val != 0) { return; }

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
  console.log('mine hit!');
  window.navigator.vibrate(250); // vibrate for 250ms
  cell.style.backgroundColor = '#ff0000';
  button.style.backgroundImage = 'url(./img/face-frown.png)';
  var covers = document.getElementsByClassName('cover');
  var parent;
  while (covers.length > 0) {
    parent = covers[0].parentNode;
    parent.removeChild(covers[0]);
    parent.onclick = null;
    parent.classList.add('clicked');
  }
}
