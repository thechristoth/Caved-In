class MainDoor{

    init(obj3d, chunkName){

        this.obj3d = obj3d;
        this.chunkName = chunkName;
        this.isOpen = false;
        this.lock = null;
        this.leftDoor = null;
        this.rightDoor = null;
        this.woodRod = null;
        this.lockSensor = null;
        this.lockBottom = null;
        this.collider = null;

        this.canWoodRodFall = false;
        this.canLockFall = false;

        this.arrangeModel();

        this.removeMetalness();

           
        setTimeout(()=>{

            this.inChunk = app.chunkManager.chunks.find(chunk => chunk.name === this.chunkName);
            this.inChunk.items.push(this.lockSensor);
            this.inChunk.colliders.push(this.collider);
            app.chunkManager.margeCloseChunkItems();

        },1);

        makeMeshInvisible(this.lockSensor);
        makeMeshInvisible(this.collider);
        this.setMaterials();

        this.makeAnimations();
        

    }

    open(){

        createjs.Sound.play("doorOpenSound");
        this.leftDoorAnimation.start();
        this.rightDoorAnimation.start();

    }

    unlock(){
    
        if(!this.isOpen){

            if(app.player.isHaveKey){

                this.isOpen = true;
                createjs.Sound.play("lockOpenSound");
                this.lockBottomAnimation.start();
                app.gameManager.popupMaker.createPopup("Congratulation, you have completed this mission: "+  "open_the_main_door".bold(), "mission_completed");
                
            }
            else{

                createjs.Sound.play("failToUnlockDoorSound");
                app.gameManager.popupMaker.createPopup("You can't open the door, you dont't have key!", "warning");
                this.failUnlockAnimation.start();

            }

        }


    }

    arrangeModel(){
        
        this.obj3d.children.forEach(doorElement => {

            if(doorElement.name == "lock"){

                this.lock = doorElement;

                this.lock.children.forEach(lockElement => {

                    if(lockElement.name == "lock_bottom"){

                        this.lockBottom = lockElement;

                    }

                });

            }
            else if(doorElement.name == "lock_sensor"){
                this.lockSensor = doorElement;
            }
            else if(doorElement.name == "left_door"){

                this.leftDoor = doorElement;

            }
            else if(doorElement.name == "right_door"){

                this.rightDoor = doorElement;


            }
            else if(doorElement.name == "wood_rod"){

                this.woodRod = doorElement;
                

            }
            else if(doorElement.name == "collider"){

                this.collider = doorElement;

            }
            
        });
    }

    makeAnimations(){

        this.failUnlockAnimation = new TWEEN.Tween(this.lock.rotation)
        .to({x: '+' + ((Math.PI/10))}, 200)
        .easing(TWEEN.Easing.Cubic.InOut)
        .yoyo(true)
        .repeat(1)

        this.woodRodForwardAnimation = new TWEEN.Tween(this.woodRod.position)
        .to({z: '-' + (2.5)}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            this.woodRodRotateAnimation.start();

        });

        this.lockBottomAnimation = new TWEEN.Tween(this.lockBottom.rotation)
        .to({z: '-' + (Math.PI/4)}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            this.lockUnlockAnimation.start();

        });

        this.lockUnlockAnimation = new TWEEN.Tween(this.lock.rotation)
        .to({x: '+' + (Math.PI/2)}, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            this.lockGoForwardAnimation.start();

        });

        this.lockGoForwardAnimation = new TWEEN.Tween(this.lock.position)
        .to({z: '+' + (1)}, 300)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            this.woodRodForwardAnimation.start();
            createjs.Sound.play("pullWoodSound");
            this.canLockFall = true;

        });

        this.woodRodRotateAnimation = new TWEEN.Tween(this.woodRod.rotation)
        .to({x: '-' + (Math.PI/2)}, 200)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(()=>{

             this.canWoodRodFall = true;

        });

        this.woodRodRotateBackAnimation = new TWEEN.Tween(this.woodRod.rotation)
        .to({x: '+' + (Math.PI/2)}, 200)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(()=>{

            this.open();

        });

        this.leftDoorAnimation = new TWEEN.Tween(this.leftDoor.rotation)
        .to({z: '+' + (Math.PI/2)}, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)

        this.rightDoorAnimation = new TWEEN.Tween(this.rightDoor.rotation)
        .to({z: '-' + (Math.PI/2)}, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(()=>{

            deleteFromArray(this.inChunk.colliders, this.collider ); 
            destroyObject(this.collider, scene);
            app.gameManager.showCongratulationsScreen();          

        });



    }

    setMaterials(){

        this.obj3d.traverse(function(mesh){

            if(mesh instanceof THREE.Mesh){

                if(mesh.material.hasOwnProperty("map") && mesh.material.map != null){

                    mesh.material.map.anisotropy = app.composition.maxAnisotropy;
                    mesh.material.map.minFilter = THREE.LinearMipmapLinearFilter;
     
                }

            }

        });

    }


    removeMetalness(){

        this.obj3d.children.forEach(child => {

            if(child.type == "Mesh"){
                child.material.metalness = 0;
            }

        });
    }

    update(delta){

        if(this.canLockFall && this.lock.position.y > -3.2){
            
            this.lock.position.y -= 0.3;
        }
        if(this.canWoodRodFall && this.woodRod.position.y > -3.5){

            this.woodRod.position.y -= 0.3;

            if(this.woodRod.position.y < -1){
                this.woodRodRotateBackAnimation.start();
            }
        }

    }
}