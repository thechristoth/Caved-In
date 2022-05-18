class RockProcessingMachine {

    init(obj3d, chunkName){

        this.obj3d = obj3d;
        this.uuid = this.obj3d.uuid;
        this.chunkName = chunkName;
        this.bigWheel = null;
        this.smallWheel = null;
        this.coalSensorMesh = null;
        this.name = "rock_processing_machine"
        this.rockSensorMesh = null;
        this.switchSensor = null;
        this.interactiveElements = null;
        this.globalPos = new THREE.Vector3();
        this.switch = null;
        this.leds = {dl: "", rl: "", cl: ""};
        this.DoneMaterialBarModel = null;
        this.mixer = app.chunkManager.mixer;
        this.isOn = false;
        this.MaterialBarSrc = '../assets/models/done_material_bar.glb';

        this.positionalSoundVolume = app.settings.audio.sound_fx_volume;

        this.onceIronMission = true;

        this.updateLittle = 60;

        this.coalQuantity = 0;
        this.rockPutInMachine = null;
        this.rockType = null;

        this.modelLoader = app.modelLoader;

        setTimeout(()=>{

            this.inChunk = app.chunkManager.chunks.find(chunk => chunk.name === this.chunkName);

        },1)
        
        this.LoadDoneMaterialBar();
        this.arrangeModel(this.obj3d);
        this.modelSettings();
        this.setVisibility();
        this.makeAnimations();
        this.makeSensors();

    }

    processRock(rockType){

        setTimeout(() => {

            app.gameManager.popupMaker.createPopup("A " + rockType + " rock is processed!", "info");

            this.bigWheelAnimation.stop();
            this.smallWheelAnimation.stop();

            if(this.onceIronMission && rockType.startsWith("rawIron")){

                this.onceIronMission = false;
                app.missionManager.nextMission("process_iron_rock");

            }

            destroyObject(this.rockPutInMachine, scene);
            deleteFromArray(this.inChunk.items, this.rockPutInMachine);
            app.chunkManager.margeCloseChunkItems();

            this.colorLed(this.leds.dl, ONLEDCOLOR);
            this.colorLed(this.leds.rl, OFFLEDCOLOR);
            this.colorLed(this.leds.cl, OFFLEDCOLOR);

            this.makeNewBar();

            this.materialGoOutAnimation = new TWEEN.Tween(this.newMaterialBar.position)
            .to({z: this.machineMain.position.z+10}, 1000) 
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(()=>{

                this.turnMachineOff();

            })

            this.dropMaterialBarinMachineAnimation = new TWEEN.Tween(this.newMaterialBar.position)
            .to({y: this.machineMain.position.y}, 500) 
            .easing(TWEEN.Easing.Quadratic.In) 
            .start()
            .onComplete(()=>{

                this.materialGoOutAnimation.start();
        
            })

        }, this.rockType.timeToProcess*1000);

    }

    turnMachineOn(){

        if(!this.isOn){

            if(this.rockPutInMachine != null){

                if(this.isenoughCoal()){

                    this.bigSwitchSoundEmitter.play();
                    this.switchOnAnimation.start(); // Start the tween immediately.
                    this.isOn = true;
    
                }
                else{

                    app.gameManager.popupMaker.createPopup("Not enough coal in the machine!", "warning");

                }
            }
            else{

                app.gameManager.popupMaker.createPopup("Please put a rock first that you want to process.", "warning");

            }

        }

    }

    turnMachineOff(){

        setTimeout(()=>{
            this.colorLed(this.leds.dl, OFFLEDCOLOR);
        }, 2000);
        this.bigSwitchSoundEmitter.play();
        this.fadeOutAnimation.stop();
        this.switchOffAnimation.start();
        this.isOn = false;
        this.fadeOutAnimation.start();


    }

    putInMachine(item){

        if(app.world.isHaveCurrent){

            if(item.material.name == "coal"){
                destroyObject(item, scene);
                deleteFromArray(this.inChunk.items, item);
                app.chunkManager.margeCloseChunkItems();
                this.coalQuantity++;
                item.position.y -= 5;
                item.updateMatrix();

                if(this.rockPutInMachine != null){

                    createjs.Sound.play("putInMachineSound");

                    if(this.isenoughCoal()){

                        this.colorLed(this.leds.cl, ONLEDCOLOR);
        
                    }
                }
                else{
                    app.gameManager.popupMaker.createPopup("Please put a rock first that you want to process.", "warning");
                }

            }
            else{
                this.rockPutInMachine = item;

                createjs.Sound.play("putInMachineSound");

                this.rockType = ROCKS.find(rock => rock.type === this.rockPutInMachine.material.name)

                item.position.y += 1000;
                item.updateMatrix();
                this.colorLed(this.leds.rl, ONLEDCOLOR);

                if(this.isenoughCoal()){

                    this.colorLed(this.leds.cl, ONLEDCOLOR);

                }
            }
        }
        else{
            app.gameManager.popupMaker.createPopup("There is no electricity in the mine!", "warning");
        }

    }

    makeNewBar(){

        this.newMaterialBar = this.DoneMaterialBarModel.clone();
        this.newMaterialBar.children[0].material = this.rockType.processedMaterial;
        app.chunkManager.nowChunk.items.push(this.newMaterialBar.children[0])
        app.chunkManager.pickableItems.push(this.newMaterialBar.children[0])
        scene.add(this.newMaterialBar);

        this.rockPutInMachine = null;
        this.coalQuantity = 0;

    }

    makeMachinePositionalSound(){

        this.machineSound = app.assetManager.machineSound;
        this.machineSoundEmitter = new THREE.PositionalAudio( app.player.listener );
        this.machineSoundEmitter.setLoop ( true );
        this.machineSoundEmitter.setBuffer( this.machineSound );
        this.machineSoundEmitter.setVolume(this.positionalSoundVolume);
        this.machineSoundEmitter.setRefDistance( 20 );
        this.bigWheel.add( this.machineSoundEmitter );
        this.createPosAudioFadeOutAnimation();
        
    }

    makePositionalSwitchSound(){

        this.bigSwitchSound = app.assetManager.bigSwitchSound;

        this.bigSwitchSoundEmitter = new THREE.PositionalAudio( app.player.listener );
        this.bigSwitchSoundEmitter.setBuffer( this.bigSwitchSound );
        this.bigSwitchSoundEmitter.setRefDistance( 20 );
        this.bigSwitchSoundEmitter.setVolume(this.positionalSoundVolume);

        this.switch.add( this.bigSwitchSoundEmitter );

    }

    createPosAudioFadeOutAnimation(){

        this.soundIntensity = this.machineSoundEmitter.getVolume();
        this.fadeOutAnimation = new TWEEN.Tween({sound: 0})
        .to({sound: 1}, 700) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            this.machineSoundEmitter.pause();
            
        })
        .onStart(()=> {
            this.soundIntensity = this.machineSoundEmitter.getVolume();
        })
        .onUpdate(() => {

            if(this.machineSoundEmitter.getVolume() > 0.1){
                this.soundIntensity -= 0.05;
                this.machineSoundEmitter.setVolume(this.soundIntensity);
            }
        });


    }
    

    arrangeModel(obj3d){

        obj3d.children.forEach(machineGroup => {

            if(machineGroup.name.startsWith("interactive_elements")){

                this.interactiveElements = machineGroup;
                this.rockSensorMesh = machineGroup.children[0];
                this.coalSensorMesh = machineGroup.children[1];
                this.switchSensor = machineGroup.children[2];

            }

            else if(machineGroup.name.startsWith("moving_elements")){

                machineGroup.children.forEach(element =>{

                    if(element.name.startsWith("switch")){

                        this.switch = element;

                    }
                    if(element.name.startsWith("wheel_big")){

                        this.bigWheel = element;

                    }
                    else{

                        this.smallWheel = element;

                    }
                });
            }
            else if(machineGroup.name.startsWith("leds")){

                machineGroup.children.forEach(led => {

                    if(led.name.startsWith("done_led")){
                        this.leds.dl = led;
                    }
                    else if(led.name.startsWith("coal_led")){
                        this.leds.cl = led;
                    }
                    else {
                        this.leds.rl = led;
                    }

                });

            }
            else if(machineGroup.name.startsWith("visual_elements")){

                this.machineMain = machineGroup.children[1];
                this.machineMain.getWorldPosition(this.globalPos);

            }

        });
    }

    makeAnimations(){

        this.switchOnAnimation = new TWEEN.Tween(this.switch.rotation)
            .to({z: '+' + ((2*Math.PI/3))}, 1000) 
            .easing(TWEEN.Easing.Quadratic.Out) 
            .onComplete(()=>{

                this.bigWheelAnimation.start();
                this.smallWheelAnimation.start();
                this.machineSoundEmitter.setVolume(this.positionalSoundVolume);
                this.machineSoundEmitter.play();

                this.processRock(this.rockPutInMachine.material.name); //process Rock

            });

        this.switchOffAnimation = new TWEEN.Tween(this.switch.rotation)
            .to({z: '-' + ((2*Math.PI/3))}, 1000) 
            .easing(TWEEN.Easing.Quadratic.In) 

        this.bigWheelAnimation = new TWEEN.Tween(this.bigWheel.rotation)
            .to({z: '+' + ((2*Math.PI))}, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .repeat(Infinity);

        this.smallWheelAnimation = new TWEEN.Tween(this.smallWheel.rotation)
            .to({z: '+' + ((2*Math.PI))}, 1000) 
            .easing(TWEEN.Easing.Linear.None) 
            .repeat(Infinity)

    }

    setVisibility(){

        makeMeshInvisible(this.interactiveElements.children);

    }

    modelSettings(){

        this.switch.rotation.z = 0;

    }

    makeSensors(){

        this.rockSensor = new THREE.Box3();
        this.rockSensor.name = "rock_sensor";

        this.coalSensor = new THREE.Box3();
        this.coalSensor.name = "coal_sensor";

    }

    isenoughCoal(){

        if(this.coalQuantity >=  this.rockType.coalNeedToProcess){

            return true;

        }
        else{

            return false;

        }

    }

    insideRockSensor(){
         
        this.sensor(this.rockSensor);

    }

    insideCoalSensor(){

        this.sensor(this.coalSensor);

    }

    colorLed(led, color){

        led.material.color.setHex(color);
        led.material.emissive.setHex(color);
        led.material.emissiveIntensity = 0.5;


    }

    computeBoundingBox(mesh){

        //computes the bounding box for geometry
    
        mesh.geometry.computeBoundingBox();
    
    }

    sensor(box3){

        this.once = true;

        app.chunkManager.pickableItems.forEach(item =>{

            if(box3.distanceToPoint(item.position) == 0 && this.once){

                if(box3.name == "coal_sensor" && item.material.name != "coal"){

                    app.gameManager.popupMaker.createPopup("You can't put rock in coal conatiner.", "warning");
                    item.position.z += 5;
                    this.once = false;

                }
                else if(box3.name == "rock_sensor" && item.material.name == "coal"){

                    item.position.x += 5;

                    app.gameManager.popupMaker.createPopup("You can't put coal in rock conatiner.", "warning");
                    this.once = false;

                }
                else if(this.rockPutInMachine != null && box3.name == "rock_sensor"){
                    app.gameManager.popupMaker.createPopup("There is a rock in the machine called " + this.rockPutInMachine.material.name + ".", "warning");
                    item.position.x += 5;
                    this.once = false;
                }
                else if(item.material.name != "coal" && ROCKS.find(rock => rock.type === item.material.name) == undefined){

                    item.position.x += 5;
                    app.gameManager.popupMaker.createPopup("You can't put processed material in this machine", "warning");

                }
                else{

                    this.putInMachine(item);
                    this.once = false;
                }

            }

        });

    }

    async LoadDoneMaterialBar(){

        this.model = await this.modelLoader.loadModel(this.MaterialBarSrc);
        this.DoneMaterialBarModel = this.model.scene.children[0];
        this.DoneMaterialBarModel.position.set(this.globalPos.x , this.globalPos.y+5, this.globalPos.z-9);

    }

    update(){

        if(this.updateLittle > 0){

            this.updateLittle--;
            this.coalSensor.copy( this.coalSensorMesh.geometry.boundingBox ).applyMatrix4( this.coalSensorMesh.matrixWorld );
            this.rockSensor.copy( this.rockSensorMesh.geometry.boundingBox ).applyMatrix4( this.rockSensorMesh.matrixWorld );
            
        }
        
    }

}
