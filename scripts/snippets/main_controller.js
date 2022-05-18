var audioElement = null;

var iframe = document.getElementById("mainScreen");
document.addEventListener('DOMContentLoaded', function(event) {

    createGlobalAudio();
    document.querySelector('body').style.opacity = 1;
     var iframe = document.getElementById('mainScreen');

    focus();
    window.addEventListener('blur', function() {
        if(document.activeElement === iframe) {
           
            audioElement.play();
            
        }
    });
    

});

function checkClickOnGame(location){

    if(location.href.endsWith('game.html')){

        document.getElementById("mainScreen").contentDocument.addEventListener("keydown", (e) => {

            if(e.key == "b"){

                audioElement.play();

            }

        });

        audioElement.pause();

    }
    else if(location.href.endsWith('settings.html')){

        var saveButton = iframe.contentWindow.document.getElementById("save")

        saveButton.addEventListener("click", () => {
            audioElement.volume = JSON.parse(localStorage.getItem("game_settings")).audio.music_volume;
        });

    }
}


function createGlobalAudio(){

    audioElement = new Audio('../assets/sounds/Haunted_Woods_Loop.mp3');
    audioElement.loop = true;

    if(localStorage.getItem("game_settings") != undefined){
        audioElement.volume = JSON.parse(localStorage.getItem("game_settings")).audio.music_volume;
    }
    else{
        audioElement.volume = 0.2;
    }

}