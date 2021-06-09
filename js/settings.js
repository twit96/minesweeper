var help_btn = document.getElementById('help-btn');

var settings_bg = document.getElementById('settings-bg');
var settings = document.getElementById('settings');
var settings_btn = document.getElementById('settings-btn');


help_btn.onclick = function() {
  settings_bg.style.display = 'block';
  settings.style.display = 'flex';
}


settings_btn.onclick = function() {
  settings_bg.style.display = 'none';
  settings.style.display = 'none';
}
