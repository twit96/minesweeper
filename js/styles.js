// var body_width;
// var body_height;
// function setDimensions() {
//   body_width = window.innerWidth;
//   body_height = window.innerHeight;
//
//   var scoreboard_height = scoreboard.offsetHeight;
//   var board_height = body_height - scoreboard_height;
//
//   var view_min = Math.min(board_height, body_width);
//   scoreboard.style.width = view_min + "px";
//   board.style.height = view_min + "px";
//   board.style.width = view_min + "px";
//   var cell_max = Math.max(num_rows, num_cols);
//
//   var cell_dimensions = view_min / cell_max;
//   var cell_font_size = (cell_dimensions / 2) + "px";
//
//   var elements = document.getElementsByClassName('cell');
//   for (var i = 0; i < elements.length; i++) {
//     elements[i].style.width = cell_dimensions;
//     elements[i].style.height = cell_dimensions;
//     elements[i].style.fontSize = cell_font_size;
//   }
// }


var body = document.querySelector('body');
var body_width;
var body_height;
function setDimensions() {

  body_width = window.innerWidth;
  body_height = window.innerHeight;

  var scoreboard_height = scoreboard.offsetHeight;
  var board_height = body_height - scoreboard_height;
  var view_min = Math.min(board_height, body_width);

  var body_padding = Math.floor(0.025 * view_min);
  board_height -= (3 * body_padding);
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

  if (
    (difficulty) &&
    (difficulty == 'expert') &&
    (window.innerWidth <= 1000)
  ) {
    board.style.height = '90vh';
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

var button = document.querySelector('button');  // smiley button
button.addEventListener("click", function(){
  setDimensions();
}, false);
