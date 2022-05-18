class SettingsManager{

    init(){
        
        this.form = document.getElementById("settings_form");
        this.graphicsTableElements = this.form.childNodes[1].childNodes[1].childNodes[1];
        this.audioTableElements = this.form.childNodes[3].childNodes[1].childNodes[1];
        this.graphicsElements = [];
        this.audioElements = [];
        this.getElementsFromForm();
        this.graphicSettings = {};
        this.audioSettings = {};
        this.settings = DEFAULT_SETTINGS;
        this.loadSettings();
        this.setSliders();

        
    }

    getElementsFromForm(){

        this.graphicsTableElements.childNodes.forEach(child => {

            if(child.childNodes.length > 0){
                this.graphicsElements.push(child.childNodes[3].childNodes[1]);
            }

        });

        this.audioTableElements.childNodes.forEach(child => {

            if(child.nodeName == "TR"){

                child.childNodes.forEach(child =>{

                    if(child.nodeName == "TD" && !child.contains(document.getElementById("field_value")) &&
                    !child.contains(document.getElementById("field_value1"))){

                        this.audioElements.push(child.childNodes[1].childNodes[1]);

                    }
                    
                })

            }
        
        });

    }
    
    saveSettings(){

        localStorage.setItem("game_settings", JSON.stringify(this.settings));
        this.isFirstRun = JSON.parse(localStorage.getItem("game_settings")).first_run;

        if(this.isFirstRun.value){

            this.settings.first_run = false;
            localStorage.setItem("game_settings", JSON.stringify(this.settings));

        }

    }

    loadSettings(){

        this.loadGraphicsSettings();
        this.loadAudioSettings();

    }

    loadGraphicsSettings(){

        this.graphics = JSON.parse(localStorage.getItem("game_settings")).graphics;
        this.graphicsElements.forEach(element => {

            if(element.name == "field_of_vision"){

                element.value = this.graphics[element.name];

            }
            else{

                element.selectedIndex = this.getIndex(this.graphics[element.name]);

            }
            
        });

    }

    loadAudioSettings(){

        this.audio = JSON.parse(localStorage.getItem("game_settings")).audio;
        this.audioElements.forEach(element => {

            element.value = this.mapRange(this.audio[element.name], 0, 1, 0, 100);

        })

    }

    mapRange(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    getIndex(object){

        if(object.hasOwnProperty("value")){

            this.value = object.value;

        }
        else{

            this.value = object;

        }

        if(this.value == "on"){

            return 0;

        }

        return 1;
    }

    changeSettingsOption(to){

        this.changeVisibility(to);

    }

    setSliders(){

        this.musicSlider = document.getElementById("music_slider");
        this.soundFXslider = document.getElementById("soundfx_slider");
        document.getElementById("music").innerHTML = this.musicSlider.value;
        document.getElementById("soundfx").innerHTML = this.soundFXslider.value;
        this.musicSlider.oninput = function() {

            document.getElementById("music").innerHTML = this.value;

        }

        this.soundFXslider.oninput = function() {

            document.getElementById("soundfx").innerHTML = this.value;

        }

    }

    changeVisibility(to){

        if(to == "graphics"){
            
            document.getElementById("graphics_settings").style.display = "inline-block";
            document.getElementById("audio_settings").style.display = "none";

        }
        else if(to == "audio"){

            document.getElementById("graphics_settings").style.display = "none";
            document.getElementById("audio_settings").style.display = "inline-block";

        }

    }

    goToPage(href){

        window.location.href = href;
    
    }

    convertFormsToObject(){

        const formData = new FormData(this.form);
        for (var pair of formData.entries()) {

            this.graphicSettings[pair[0]] = pair[1];

            if(pair[0] == "music_volume" || pair[0] == "sound_fx_volume"){

                this.audioSettings[pair[0]] = pair[1];

            }

        }

    }

    onSave(){

        this.convertFormsToObject();

        Object.keys(this.graphicSettings).forEach(key => {

            this.settings.graphics[key] = this.graphicSettings[key];

        });

        Object.keys(this.audioSettings).forEach(key => {

            this.settings.audio[key] = this.mapRange(this.audioSettings[key], 0, 100, 0, 1);


        });
        

        this.saveSettings();

    }

}

