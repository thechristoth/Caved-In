
var body = document.querySelector('body');

body.requestPointerLock = body.requestPointerLock || body.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

window.goToPage = function(href) {
    document.querySelector('body').style.opacity = 0
    setTimeout(function() { 
        window.location.href = href;
    }, 500)
}

document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})

checkIfFirstRun();

function checkIfFirstRun(){

    if(localStorage.getItem("game_settings") == null || JSON.parse(localStorage.getItem("game_settings")).first_run){

        localStorage.setItem("game_settings", JSON.stringify(DEFAULT_SETTINGS));
    
    }
}