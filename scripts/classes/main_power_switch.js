class MainPowerSwitch{

    init(obj3d){

        this.obj3d = obj3d;
        this.uuid = this.obj3d.uuid;
        this.isOn = false;
        this.switch = null;
        this.switchSensor = null;
        this.onceTurnOnMission = true;

        this.arrangeModel();
        this.makeAnimations();
        makeMeshInvisible(this.switchSensor);

    }

    turnMachineOn(){

        this.bigSwitchSoundEmitter.play();
        createjs.Sound.play("electricitySound");
        this.switchOnAnimation.start();

        setTimeout(() => {

            this.turnMachineOff();

        }, getRndInteger(70000, 150000));

    }

    turnMachineOff(){

        this.switchOffAnimation.start();

    }

    makePositionalSwitchSound(){

        this.bigSwitchSound = app.assetManager.bigSwitchSound;

        this.bigSwitchSoundEmitter = new THREE.PositionalAudio( app.player.listener );
        this.bigSwitchSoundEmitter.setBuffer( this.bigSwitchSound );
        this.bigSwitchSoundEmitter.setRefDistance( 20 );
        this.obj3d.add( this.bigSwitchSoundEmitter );

    }

    arrangeModel(){

        this.obj3d.children.forEach(child => {

            if(child.name.startsWith("interactive_elements")){

                this.switchSensor = child.children[0];

            }
            else if(child.name.startsWith("switch")){
                this.switch = child;
            }
            
        });

    }

    makeAnimations(){

        this.switchOnAnimation = new TWEEN.Tween(this.switch.rotation)
        .to({z: '+' + ((Math.PI/2))}, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out) 
        .onComplete(()=>{

            if(this.onceTurnOnMission){

                this.onceTurnOnMission = false;
                app.missionManager.nextMission("find_the_main_power_switch_and_turn_it_on");
    
            }
            
            this.isOn = true;
            app.world.isHaveCurrent = true;

        });

        this.switchOffAnimation = new TWEEN.Tween(this.switch.rotation)
        .to({z: '-' + ((Math.PI/2))}, 1000) 
        .easing(TWEEN.Easing.Quadratic.In) 
        .onComplete(()=>{
        
            this.isOn = false;
            app.world.isHaveCurrent = false;

        });

    }

}