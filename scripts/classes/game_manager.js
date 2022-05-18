class GameManager{

    init(){

        this.gameOverDiv = document.getElementById("game_over_div");
        this.guiElements = document.getElementById("gui_elements");
        this.controlsInfo = document.getElementById("controls");
        this.maaterialInfo = document.getElementById("help");
        this.congratulationsScreen = document.getElementById("congratulations_screen");
        this.pouseScreen = document.getElementById("pousedScreen");
        this.body = document.querySelector('body');

        this.popupMaker = new PopupMaker();
        this.popupMaker.init();

        this.body.requestPointerLock = this.body.requestPointerLock || body.mozRequestPointerLock;
        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
        this.infoIsShowing = false;
        this.pouseScreenIsShowing = false;

    }

    restart(){
        
        app.player.restart();

        this.gameOverDiv.style.display = "none";
        this.guiElements.style.display = "inline-block";
        
        app.start();

    }

    createBackgroundMusic(){

        this.backgroundMusic = new Audio('../assets/sounds/EmptyCity.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = app.settings.audio.music_volume;
        this.backgroundMusic.play();

    }

    showControlsInfo(){

        if(!app.keys.states.h_pressed_info){

            if(!app.keys.states.i_pressed_info){

                app.keys.states.i_pressed_info = true;
                this.controlsInfo.style.display = "inline-block";
                this.guiElements.style.display = "none";
                this.infoIsShowing = true;
                app.stop();
        
            }
            else if(app.keys.states.i_pressed_info){
    
                app.keys.states.i_pressed_info = false;
                this.controlsInfo.style.display = "none";
                this.guiElements.style.display = "inline-block";
                this.infoIsShowing = false;
                app.start();
    
            }

        }

    }

    showMaterialInfo(){

        if(!app.keys.states.i_pressed_info){

            if(!app.keys.states.h_pressed_info){

                app.keys.states.h_pressed_info = true;
                this.maaterialInfo.style.display = "inline-block";
                this.guiElements.style.display = "none";
                this.infoIsShowing = true;
                app.stop();
    
            }
            else if(app.keys.states.h_pressed_info){
    
                app.keys.states.h_pressed_info = false;
                this.maaterialInfo.style.display = "none";
                this.guiElements.style.display = "inline-block";
                this.infoIsShowing = false;
                app.start();
    
            }

        }

    }

    showCongratulationsScreen(){

        this.congratulationsScreen.style.display = "inline-block";
        this.guiElements.style.display = "none";
        this.controlsInfo.style.display = "none";
        this.maaterialInfo.style.display = "none";
        app.stop();

    }

    hideInfo(){

        if(app.isStopLoop){
            
            this.controlsInfo.style.display = "none";
            this.maaterialInfo.style.display = "none";
            this.guiElements.style.display = "inline-block";
            this.infoIsShowing = false;
            app.keys.states.i_pressed_info = false;
            app.keys.states.h_pressed_info = false;
            app.start();

        }

    }

    pouseGame(){

        if(app.keys.states.escape_pressed){

            app.stop();
            this.pouseScreen.style.display = "inline-block";
            this.pouseScreenIsShowing = true;
            this.guiElements.style.display = "none";

        }

    }

    startGame(){

        if(app.keys.states.escape_pressed){

            app.start();
            this.pouseScreen.style.display = "none";
            this.pouseScreenIsShowing = false;

        }

    }

    gameOver(){

        app.stop();

        this.gameOverDiv.style.display = "inline-block";
        this.guiElements.style.display = "none";

    }

    hideStats(){

        app.stats.domElement.style.display = "none";

    }

    showStats(){

        app.stats.domElement.style.display = "inline-block";

    }
}