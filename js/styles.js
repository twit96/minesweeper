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
  var available_height = body_height - scoreboard_height - settings_height;

  var view_min = Math.min(available_height, body_width);
  var body_padding = Math.floor(0.025 * view_min);

  available_height -= (4 * body_padding);
  var available_width = body_width - (2 * body_padding);
  view_min = Math.min(available_height, available_width);

  var cell_dimensions = Math.min(available_width/num_cols, available_height/num_rows);
  var cell_font_size = (cell_dimensions/2) + "px";

  var board_width = (cell_dimensions * num_cols);
  var board_height = (cell_dimensions * num_rows);

  body.style.padding = body_padding + "px";
  scoreboard.style.marginBottom = body_padding + "px";
  scoreboard.style.width = view_min + "px";
  board.style.width = board_width + 'px';
  board.style.height = board_height + 'px';
  settings.style.width = view_min + "px";
  settings.style.marginTop = body_padding + "px";

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
