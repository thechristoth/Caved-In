var settings = null;

window.onload = function() {
     
    settings = new SettingsManager();

    settings.init();
};

function changeSettingsOption(type){
    if(settings != null){
        if(type == 'graphics'){
            settings.changeSettingsOption('graphics');
        }
        else if(type == 'audio'){
            settings.changeSettingsOption('audio');
        }
    }
}
