class ManufacturingMachine{

    init(obj3d, chunkName){

        this.obj3d = obj3d;
        this.uuid = this.obj3d.uuid;
        this.chunkName = chunkName;
        this.name = "manufacturing_machine";
        this.interactiveElements = null;
        this.switchSensorMesh = null;
        this.materialSensorMesh = null;
        this.downButtonSensorMesh = null;
        this.upButtonSensorMesh = null;
        this.wheel1 = null;
        this.isOn = false;
        this.wheel2 = null;
        this.wheel3 = null;
        this.isItemChoosen = false;
        this.switch = null;
        this.upButton = null;
        this.downButton = null;
        this.manufacturingCarousellMesh = null;
        this.leds = {fe: "", au:"", dl: "", wo: "", pl: "", mc: ""};
        this.manufacturedItems = [];
        this.canManufacture = false;
        this.positionalSoundVolume = app.settings.audio.sound_fx_volume;

        this.quantity = {

            iron: 0,
            wood: 0,
            gold: 0,
            diamond: 0,
            plant: 0,
            shotgun_part: 0,
            magnum_part: 0

        };

        
        setTimeout(()=>{

            this.inChunk = app.chunkManager.chunks.find(chunk => chunk.name === this.chunkName);

        },1);

        this.arrangeModel(this.obj3d);
        this.setVisibility();
        this.makeSensors();
        this.makeAnimations()

    }


    manufactureItem(item){

        setTimeout(() => {

            if(item.type == "500 Magnum" || item.type == "ShotGun"){

                this.newItem = new Gun();

            }
            else if(item.type == "Ammo for ShotGun" ||
             item.type == "Ammo for 500 Magnum"){

                this.newItem = new Item();
                
            }
            else if(item.type == "Grenade"){
                this.newItem = new Grenade();
            }

            else if(item.type == "Medicine" ){
                this.newItem = new Medicicne();
            }

            this.colorLed(this.leds.dl, ONLEDCOLOR);
  

            this.newItem.init(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).model, this.obj3d.position, this.inChunk);
            this.manufacturedItems.push(this.newItem);

            this.turnMachineOff();

        }, item.timeToProcess*1000);

    }

    turnMachineOn(){

        if(!this.isOn){

            if(this.manufacturedItems.length == 0){

                this.itemToManufacture = this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z);
                if(this.itemToManufacture != undefined){

                    if(this.isAllMaterialForItemInMachine()){

                        if(!this.isHaveGunForAmmo()){

                            app.gameManager.popupMaker.createPopup("You not have gun for this ammo!", "warning");
                            
                        }
                        else{

                            this.isOn = true;
                            this.switchOnAnimation.start();
                            this.bigSwitchSoundEmitter.play();

                        }

                    }
                    else{

                        app.gameManager.popupMaker.createPopup("You not put all items, that need to manufacture " + this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).type, "warning");
                    }

                }
                else{
                    app.gameManager.popupMaker.createPopup("First choose item, that you manufacture!", "warning")
                }

            }
            else{
                app.gameManager.popupMaker.createPopup("Please pickup the item that you manufactured!", "warning")
            }
             
        }

    }


    turnMachineOff(){

        this.fadeOutAnimation.stop();
        this.fadeOutAnimation.start();
        this.wheel1Animation.stop();
        this.wheel2Animation.stop();
        this.wheel3Animation.stop();

        this.bigSwitchSoundEmitter.play();

        this.switchOffAnimation.start();


        for (let key in this.leds) {

          if(key != "dl"){

            this.colorLed(this.leds[key], OFFLEDCOLOR);

          }
        }

        this.quantity = {

            iron: 0,
            wood: 0,
            gold: 0,
            diamond: 0,
            plant: 0,
            shotgun_part: 0,
            magnum_part: 0

        };

        this.isOn = false;
        this.isItemChoosen = false;

    }

    makeAnimations(){

        this.wheel1Animation = new TWEEN.Tween(this.wheel1.rotation)
        .to({z: '+' + ((2*Math.PI))}, 2000)
        .easing(TWEEN.Easing.Linear.None)
        .repeat(Infinity);

        this.wheel2Animation = new TWEEN.Tween(this.wheel2.rotation)
        .to({z: '+' + ((2*Math.PI))}, 2000)
        .easing(TWEEN.Easing.Linear.None)
        .repeat(Infinity);

        this.wheel3Animation = new TWEEN.Tween(this.wheel3.rotation)
        .to({z: '+' + ((2*Math.PI))}, 2000)
        .easing(TWEEN.Easing.Linear.None)
        .repeat(Infinity);

        this.switchOnAnimation = new TWEEN.Tween(this.switch.rotation)
        .to({x: '-' + ((Math.PI/4))}, 700) 
        .easing(TWEEN.Easing.Quadratic.Out) 
        .onComplete(()=>{

            

            this.manufactureItem(this.itemToManufacture);

            this.machineSoundEmitter.setVolume(this.positionalSoundVolume);
            this.machineSoundEmitter.play();
            this.wheel1Animation.start();
            this.wheel2Animation.start();
            this.wheel3Animation.start();

        });

        this.switchOffAnimation = new TWEEN.Tween(this.switch.rotation)
        .to({x: '+' + ((Math.PI/4))}, 700) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{
            setTimeout(()=>{
                this.colorLed(this.leds.dl, OFFLEDCOLOR)
            }, 2000)
        })

    }

    createPosAudioFadeOutAnimation(){

        this.sound = {value: 0};
        this.soundIntensity = this.machineSoundEmitter.getVolume();
        this.fadeOutAnimation = new TWEEN.Tween(this.sound)
        .to({value: '+1'}, 700) 
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            this.machineSoundEmitter.pause();
            this.sound = {value: 0};
            
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

                this.upButtonSensorMesh =  machineGroup.children[0];
                this.downButtonSensorMesh =  machineGroup.children[1];
                this.switchSensorMesh =  machineGroup.children[2];
                this.materialSensorMesh =  machineGroup.children[3];

                
            }

            else if(machineGroup.name.startsWith("moving_elements")){

                machineGroup.children.forEach(element =>{
                    if(element.name.startsWith( "down_button")){

                        this.downButton = element;

                    }
                    else if(element.name.startsWith("up_button")){

                        this.upButton = element;

                    }
                    else if(element.name.startsWith("manufacturing_carousell")){

                        this.manufacturingCarousellMesh = element;

                    }
                    else if(element.name.startsWith("handle")){

                        this.switch = element;

                    }
                    else if(element.name.startsWith("wheel1")){

                        this.wheel1 = element;

                    }
                    else if(element.name.startsWith("wheel2")){

                        this.wheel2 = element;

                    }
                    else if(element.name.startsWith("wheel3")){

                        this.wheel3 = element;

                    }
                });

            }

            else if(machineGroup.name.startsWith("leds")){

                machineGroup.children.forEach(led => {
                    if(led.name.startsWith("au_led")){
                        this.leds.au = led;
                    }
                    else if(led.name.startsWith("wood_led")){
                        this.leds.wo = led;
                    }
                    else if(led.name.startsWith("fe_led")){
                        this.leds.fe = led;
                    }
                    else if(led.name.startsWith("done_led")){
                        this.leds.dl = led;
                    }
                    else if(led.name.startsWith("material_container_led")){
                        this.leds.mc = led;
                    }
                    else if(led.name.startsWith("pl_led")){
                        this.leds.pl = led;
                    }
                });

            }
        });

        

    }

    setVisibility(){

        makeMeshInvisible(this.interactiveElements.children);

    }

    makeSensors(){

        this.computeBoundingBox(this.materialSensorMesh);

        this.materialSensor = new THREE.Box3().setFromObject(this.materialSensorMesh);
        this.materialSensor .name = "material_sensor";

    }

    insideMaterialSensor(){
         
        this.sensor(this.materialSensor);

    }

    rotateCarousell(direction){

        if(!this.isOn && !this.isItemChoosen){

            this.carousellDirection = direction;

            if((this.manufacturingCarousellMesh.rotation.z != MANUFACTURABLEITEMS[5].angle || this.carousellDirection == -1) &&
             (this.manufacturingCarousellMesh.rotation.z != MANUFACTURABLEITEMS[4].angle || this.carousellDirection == 1)){
    
                this.manufacturingCarousellMesh.rotation.z += Math.PI/4 * this.carousellDirection; //-1 / 1
    
            }

        }

    }

    sensor(box3){

        this.once = true;

        app.chunkManager.pickableItems.forEach(item =>{

            if(box3.distanceToPoint(item.position) == 0 && this.once){

                this.once = false;

                if(item.material.name == "gold" || item.material.name == "iron" ||
                 item.material.name == "wood"  || item.material.name == "plant" || item.material.name == "shotgun_part" ||
                 item.material.name == "magnum_part"){
                    
                    this.putInMachine(item);


                }
                else{

                    app.gameManager.popupMaker.createPopup("You can't put raw rock in this machine, you need to process it in the RockProcessingMachine!", "warning");


                }

            }

        });

    }

    isHaveGunForAmmo(){

        if(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).type == "Ammo for ShotGun" ||
        this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).type == "Ammo for 500 Magnum"){

            if(app.player.guns.length == 0){

                return false;

            }
            else if(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).type == "Ammo for ShotGun" &&
            app.player.guns.some((gun) => { return gun.name == "shotgun"})){
    
                return true;

            }
            else if(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).type == "Ammo for 500 Magnum" &&
            app.player.guns.some((gun) => {return gun.name == "magnum"})){
  
                return true;

            }
            else{
                return false;
            }

        }
        else{

            return true;
            
        }

    }

    putInMachine(item){

        if(app.world.isHaveCurrent){

            if(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z) != undefined){

                if(this.isMaterialNeedForManufacturableItem(item.material.name)){

                    if(!this.testIfEnoughMaterial(item)){

                        if(!this.isHaveGunForAmmo()){

                            app.gameManager.popupMaker.createPopup("You not have gun for this ammo!", "warning");

                        }
                        else{

                            createjs.Sound.play("putInMachineSound");

                            if(item.material.name == "gold"){
                                this.quantity.gold++;
                            }
                            else if(item.material.name == "diamond"){
                                this.quantity.diamond++;
                            }
                            else if(item.material.name == "iron"){
                                this.quantity.iron++;
                            }
                            else if(item.material.name == "wood"){
                                this.quantity.wood++;
                            }
                            else if(item.material.name == "shotgun_part"){
                                this.quantity.shotgun_part++;
                            }
                            else if(item.material.name == "magnum_part"){
                                this.quantity.magnum_part++;
                            }
                            else{
                                this.quantity.plant++;
                            }

                            this.isItemChoosen = true;

                            item.position.y += 1000;
            
                            deleteFromArray(app.chunkManager.pickableItems, item);
                            destroyObject(item, scene);

                            app.gameManager.popupMaker.createPopup("You put 1 " + item.material.name + " in this machine!", "info");

                            if(this.isAllMaterialForItemInMachine()){
                                this.colorLed(this.leds.mc, ONLEDCOLOR )
                                
                            }

                        }

                        this.testIfEnoughMaterial(item);

                    }
                    else{

                        app.gameManager.popupMaker.createPopup("You have enough " + item.material.name + " material in this machine!", "warning");
                        
                    }

                }
                else{

                    app.gameManager.popupMaker.createPopup("You don't need this material for " + this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).type, "warning");
                
                }

            }
            else{

                app.gameManager.popupMaker.createPopup("First choose item, that you manufacture!", "warning");

            }  

        }
        else{
            app.gameManager.popupMaker.createPopup("There is no electricity in the mine!", "warning");
        }


    }

    makeMachinePositionalSound(){

        this.machineSound = app.assetManager.machineSound;

        this.machineSoundEmitter = new THREE.PositionalAudio( app.player.listener );
        this.machineSoundEmitter.setLoop ( true );
        this.machineSoundEmitter.setBuffer( this.machineSound );
        this.machineSoundEmitter.setVolume(this.positionalSoundVolume);
        this.machineSoundEmitter.setRefDistance( 20 );
        this.obj3d.add( this.machineSoundEmitter );
        this.createPosAudioFadeOutAnimation();

    }

    makePositionalSwitchSound(){

        this.bigSwitchSound = app.assetManager.bigSwitchSound;

        this.bigSwitchSoundEmitter = new THREE.PositionalAudio( app.player.listener );
        this.bigSwitchSoundEmitter.setBuffer( this.bigSwitchSound );
        this.bigSwitchSoundEmitter.setVolume(this.positionalSoundVolume);
        this.bigSwitchSoundEmitter.setRefDistance( 20 );
        this.obj3d.add( this.bigSwitchSoundEmitter );

    }

    colorLed(led, color){

        led.material.color.setHex(color);
        led.material.emissive.setHex(color);
        led.material.emissiveIntensity = 0.5;


    }

    getManufacturableItemByAngle(angle){

        return MANUFACTURABLEITEMS.find(item => item.angle === angle)

    }

    testIfEnoughMaterial(item){

        for (let [key, value] of Object.entries(this.quantity)){

            if(`${key}`.toString() == item.material.name){

                this.inMachineQuantity = `${value}`;

                for (let [key, value] of Object.entries(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).materialNeedToProcess)) {

                    if(`${key}`.toString() == item.material.name){

                        if(this.inMachineQuantity >= `${value}`){

                            for (let key in this.leds) {

                                if(this.leds[key].material.name.startsWith(item.material.name)){
                      
                                  this.colorLed(this.leds[key], ONLEDCOLOR);
                      
                                }
                              }
                            return true;

                        }
                        else{
                            return false;
                        }

                    }

                }

            }

        }

    }

    isAllMaterialForItemInMachine(){

        this.quantityCounter = 0;
        this.object = this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).materialNeedToProcess;
        this.key = null;
        this.materialNum = 0;

        for (this.key in this.object) {

            this.materialNum++;

            if (this.object.hasOwnProperty(this.key)) {

                if(this.quantity[this.key] >= this.object[this.key]){

                    this.quantityCounter++;

                }

            }
        }

        if(this.quantityCounter < this.materialNum){

            return false;

        }
        else{

            return true;

        }



    }

    isMaterialNeedForManufacturableItem(materialName){

        for (let [key, value] of Object.entries(this.getManufacturableItemByAngle(this.manufacturingCarousellMesh.rotation.z).materialNeedToProcess)) {

            if(`${key}`.toString() == materialName ){

                if(`${value}` > 0){

                    return true;
                    
                }
                else{

                    return false;

                }

            }
        }


    }

    computeBoundingBox(mesh){
    
        mesh.geometry.computeBoundingBox();
    
    }
}