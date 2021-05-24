var num_rows;
var num_cols;
var num_mines;
var grid = [];

var board = document.getElementById('board');

setPresets('easy');

function setPresets(difficulty) {
  var presets = {
    // 'difficulty': [rows, cols, mines]
    'easy':          [10, 10, 10],
    'intermediate':  [16, 16, 40],
    'expert':        [16, 30, 99]
  }
  var choice = presets[difficulty];
  // set vars
  num_rows = choice[0];
  num_cols = choice[1];
  num_mines = choice[2];
  // update board layout
  board.style.gridTemplateColumns = 'repeat(' + num_cols + ', 1fr)';
  board.style.gridTemplateRows = 'repeat(' + num_rows + ', 1fr)';
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


function configureBoard() {
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


function configureGame() {
  generateBoard();
  generateMines();
  generateTileNumbers();
  console.table(grid);
  configureBoard();
}
configureGame();



function clickCell(cell, cell_id) {
  console.log('\n' + cell_id);

  // Remove Cover (if it exists)
  var cell_cover = cell.querySelector('.cover');
  if (cell_cover) {
    cell.removeChild(cell_cover);
    cell.onclick = null;
    console.log('cover removed');
  }

  // Check Tile Value
  var val = cell.innerHTML[0];

  // hit mine
  if (val == 'M') {
    console.log('mine hit!');
    return;
  }

  // hit number
  if (val != 0) {
    console.log(val);
    return;
  }

  // hit 0
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
        // adj_cell.style.background = 'tan';

        if ((adj_cell_id != cell_id) && (adj_cell.querySelector('.cover') != null)) {
          clickCell(adj_cell, adj_cell_id);
        }
      }
    }
  }
}