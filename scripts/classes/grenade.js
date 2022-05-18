class Grenade extends Item{

    init(src, machinePosition, inChunk){

        super.init(src, machinePosition, inChunk);
        this.canUse = true;
        this.playerInstance = app.player;
        this.globalPos = new THREE.Vector3();
        this.globalQuat = new THREE.Quaternion();
        this.canAnimate = false;
        this.indexInUsedItems = null;

        this.grenadeLight = app.assetManager.grenadeLight;

        this.putSprieOnce = false;
        this.SpriteTexture = app.assetManager.grenadeFireTexture;
        this.horizontalToAnimateCounter = 0;
        this.verticalToAnimationCounter = 0;

        this.sprite = app.assetManager.grenadeSprite;
        this.sprite.scale.set(1,1,1);
        this.makeAnimation();


    }

    use(){

        if(!app.player.dead){

            this.mesh.getWorldPosition(this.globalPos);
            this.mesh.getWorldQuaternion(this.globalQuat);
            this.mesh.quaternion.copy(this.globalQuat);
            this.playerInstance.firstPersonCamera.remove(this.mesh);
            scene.add(this.mesh);
            this.mesh.position.set(this.globalPos.x, this.globalPos.y, this.globalPos.z);

            this.canAnimate = true;

        }
        

    }

    whoIsClose(){

        if(this.mesh.position.distanceTo(this.playerInstance.player.position) <= 22){

            this.playerInstance.decrementLife(5);

        }
        app.enemyManager.enemies.forEach(enemy => {

            if(enemy.spiderObj3D.position.distanceTo(this.mesh.position) <= 22){

                enemy.decrementLife(5);
    
            }

            
        });

    }

    makeAnimation(){

        this.explosionAnimation = new TWEEN.Tween(this.sprite.scale)
            .to({x: '+' + (7), y: '+' + (7), z: '+' + (7)}, 100) 
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(()=>{

                this.explosionTransparancyAnimation.start();

            })

        this.explosionTransparancyAnimation = new TWEEN.Tween(this.sprite.material)
            .to({opacity: 0}, 100) 
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(()=>{

                this.whoIsClose();
                this.destroy();

            });


    }

    bombEffect(){

        this.sprite.material.opacity = 0.5;
        this.grenadeLight.color.setHex(0xffd88f);
        this.mesh.getWorldPosition(this.globalPos);

        this.grenadeLight.position.set(this.globalPos.x, this.globalPos.y, this.globalPos.z);

        this.sprite.position.set(this.globalPos.x, this.globalPos.y, this.globalPos.z);
        this.explosionAnimation.start();
    }

    destroy(){

        this.grenadeLight.color.setHex(0x000000);
        destroyObject(this.mesh, scene);
        app.player.usedItems.splice(this.indexInUsedItems, 1);

    }

    update(){
        
        if(this.canAnimate && this.horizontalToAnimateCounter <= 10){

            this.horizontalToAnimateCounter++;
            this.mesh.translateZ(-0.8);
            this.mesh.translateY(0.1);
            
        }
        else if(this.canAnimate && this.mesh.position.y > -3){

            this.mesh.translateY(-0.4);
            this.mesh.translateZ(-1);

        }
        else{

            if(!this.putSprieOnce){

                this.putSprieOnce = true;
                this.bombEffect();
                createjs.Sound.play("grenadeSound");

            }

        }

    }
}