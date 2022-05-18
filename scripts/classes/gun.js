class Gun extends Item{

    init(src, machinePosition, inChunk){

        super.init(src, machinePosition, inChunk);
        this.bulletPos = new THREE.Vector3();
        this.bulletQuat = new THREE.Vector3();
        this.bullets = [];
        this.bulletQuantity = 0;
        this.makeBulletFireOnce = false;
        this.maxBulletDistance = 500;
        this.maxBulletQantity = 0;
        this.once = true;
        this.visual = null;
        this.hideVisual = null;
        this.ammoBoxVisual = null;
        this.quatTemp = new THREE.Quaternion();
        this.bulletVisual = null;
        this.SpriteTexture = app.assetManager.gunFireTexture;
        this.spriteMaterial = new THREE.SpriteMaterial( { 

            depthWrite: false,
            map: this.SpriteTexture,
            transparent : true ,
            opacity: 0

        });

        this.sprite = new THREE.Sprite( this.spriteMaterial );
        this.sprite.renderOrder = 1;
        scene.add( this.sprite );


    }

    displayVisual(){

        if(this.once){

            this.once = false;

            if(this.name == "magnum"){

                this.maxBulletQantity = 5;

            }else{

                this.maxBulletQantity = 6;

            }


        }

        this.hideVisual.style.display = "none";

        this.visual.style.display = "inline-block";

    }

    hideVisuals(){

        this.visual.style.display = "none";

    }

    decrementBulletsInGun(){

        this.bulletQuantity--;
        this.freshVisuals();

    }

    decrementAmmoBox(){

        app.player.ammoBoxQuantity[this.name+"_ammo"]--;
        this.freshVisuals();

    }

    freshVisuals(){

        this.bulletVisual.innerHTML = this.bulletQuantity + " / " + this.maxBulletQantity;
        this.ammoBoxVisual.innerHTML = "x "+app.player.ammoBoxQuantity[this.name+"_ammo"];
        
    }

    shoot(){

        if(this.bulletQuantity > 0 && !app.player.dead){

            if(this.name == "magnum"){

                createjs.Sound.play("magnumShootSound");
                this.bulletName = "magnumBullet";

            }
            else{

                createjs.Sound.play("shotgunShootSound");
                this.bulletName = "shotgunBullet";

            }

            this.decrementBulletsInGun();
            this.bullet.getWorldPosition( this.bulletPos );
            this.newBullet = this.bullet.clone();
            this.newBullet.name = this.bulletName;
            this.bulletQuat = this.bullet.getWorldQuaternion(this.quatTemp);
            this.newBullet.quaternion.copy(this.bulletQuat);
            this.newBullet.position.set(this.bulletPos.x, this.bulletPos.y, this.bulletPos.z);
            this.newBullet.position.y += 0.7;
            this.newBullet.translateX(-2.6);
            scene.add(this.newBullet);
            makeMeshInvisible(this.newBullet);

            if(!this.makeBulletFireOnce){

                this.bullet.translateZ(-0.3)

                this.makeBulletFireOnce = true;

                this.sprite.scale.set(0.6,0.6,0.6);

                this.bullet.getWorldPosition( this.bulletPos );
                this.sprite.position.set(this.bulletPos.x+0.01, this.bulletPos.y+0.01, this.bulletPos.z+0.01);

                this.mesh.attach(this.sprite);

            }

            this.sprite.material.opacity = 0.5;

            setTimeout(()=>{
                this.sprite.material.opacity = 0;
            }, 50)



            this.bullets.push(this.newBullet);

        }
        
    }

    reLoad(){
        
        if(app.player.ammoBoxQuantity[this.name+"_ammo"] > 0 && !app.player.dead){

            this.decrementAmmoBox();
            if(this.name == "magnum"){

                createjs.Sound.play("magnumReloadSound");

            }
            else{

                createjs.Sound.play("shotgunReloadSound");

            }
            this.bulletQuantity = this.maxBulletQantity;
            this.freshVisuals();

        }

    }

    update(){

        if(this.bullets.length != 0){
            this.bullets.forEach(bullet => {

                bullet.translateZ(-0.7);

                if(bullet.position.distanceTo(this.bullet.position) > this.maxBulletDistance){

                    destroyObject(bullet, scene);
                    deleteFromArray(this.bullets, bullet);

                }
                
            });
        }
 
    }

}