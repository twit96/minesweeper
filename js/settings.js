var help_btn = document.getElementById('help-btn');

var settings_bg = document.getElementById('settings-bg');
var settings = document.getElementById('settings');
var settings_btn = document.getElementById('settings-btn');


help_btn.onclick = function() {
  showSettings();
}

settings_btn.onclick = function() {
  hideSettings();
}

settings_bg.onclick = function() {
  hideSettings();
}


function showSettings() {
  settings_bg.style.display = 'block';
  settings.style.display = 'flex';
  stopTimer();
}

function hideSettings() {
  settings_bg.style.display = 'none';
  settings.style.display = 'none';
  if (time != 0) resumeTimer();
}
