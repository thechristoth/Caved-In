class Medicicne extends Item{

    init(src, machinePosition, inChunk){

        super.init(src, machinePosition, inChunk);
        this.canUse = true;
        this.playerInstance = app.player;

    }

    use(){

        if(!app.player.dead){
            
            destroyObject(this.mesh, scene);

            this.playerInstance.incrementLife();
            createjs.Sound.play("madicineSound");
            
        }
        
    }
}