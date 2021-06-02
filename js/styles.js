var body = document.querySelector('body');
var scoreboard = document.getElementById("scoreboard");
var board = document.getElementById('game-board');
var settings = document.getElementById('settings');

var body_width;
var body_height;
function setDimensions() {

  body_width = window.innerWidth;
  body_height = window.innerHeight;

  var scoreboard_height = scoreboard.offsetHeight;
  var settings_height = settings.offsetHeight;
  var board_height = body_height - scoreboard_height - settings_height;
  var view_min = Math.min(board_height, body_width);

  var body_padding = Math.floor(0.025 * view_min);
  board_height -= (4 * body_padding);
  body_width -= (2 * body_padding);
  view_min = Math.min(board_height, body_width);

  var cell_max = Math.max(num_rows, num_cols);
  var cell_dimensions = view_min / cell_max;
  var cell_font_size = (cell_dimensions / 2) + "px";

  body.style.padding = body_padding + "px";
  scoreboard.style.marginBottom = body_padding + "px";
  scoreboard.style.width = view_min + "px";
  board.style.height = view_min + "px";
  board.style.width = view_min + "px";
  settings.style.width = view_min + "px";
  settings.style.marginTop = body_padding + "px";

  if (
    (difficulty) &&
    (difficulty == 'expert') &&
    (window.innerWidth <= 700)
  ) {
    var view_max = Math.max(board_height, body_width) - (4 * body_padding);
    board.style.height = view_max + 'px';
    cell_font_size = (cell_dimensions / 8) * 7 + "px";
  }

  var cells = document.getElementsByClassName('cell');
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.width = cell_dimensions;
    cells[i].style.height = cell_dimensions;
    cells[i].style.fontSize = cell_font_size;
  }
}


window.addEventListener('resize', function() {
  if (
    (body_width != window.innerWidth) ||
    (body_height != window.innerHeight)
  ) {
    setDimensions();
  }
});

setDimensions();

var smiley_btn = document.getElementById('smiley-btn');
smiley_btn.addEventListener("click", function(){
  setDimensions();
}, false);
