class Spider{

    init(posX, posZ, isBoss){

        this.posX = posX;
        this.posZ = posZ;
        this.isBoss = isBoss;
        this.life = 5;
        this.speed = 0.12;
        this.bulletSpeed = 0.5;
        this.mixer = null;
        this.clips = null; 
        this.spiderObj3D = null;
        this.body = null;
        this.collider = new THREE.Box3();
        this.playerInstance = app.player;
        this.isExecutedIdle = false;
        this.enemyInstance = null;
        this.isExecutedWalk = false;
        this.dead = false;
        this.hpScale = 2.5/12;
        this.hpBarGeometry = null;
        this.hpBarMaterial = null;
        this.hpBar = null;
        this.isExecutedWalkLegsUp = false;
        this.attackIsExecuted = false;
        this.isStabExecuted = false;
        this.wordPosition = new THREE.Vector3();
        this.worldQaternion = new THREE.Quaternion();
        this.positionalSoundVolume = app.settings.audio.sound_fx_volume;
        this.bullets = [];


        this.shootAction = () => {
           this.shoot();
        }
        this.modelLoader = app.modelLoader;
        this.arrangeModel();

        if(isBoss){
            this.setupBoss();
        }

        this.makePositionalSounds();

    }

    arrangeModel(){


        if(this.isBoss){

            this.model = cloneGltf(app.assetManager.spiderBossModel);
            this.speed = 0.13;
            this.bulletSpeed = 0.8;
            
        }
        else{
            this.model = cloneGltf(app.assetManager.spiderModel);
        }

        this.modelScene = this.model.scene;
        this.spiderObj3D = this.modelScene.children[0];
        this.spiderObj3D.children[0].children[1].material.needsUpdate = true;
        this.makeAnimations(this.modelScene, this.model.animations);
        this.spiderObj3D.position.x += this.posX;
        this.spiderObj3D.position.z += this.posZ;
        const geometry = new THREE.BoxGeometry( 3, 2, 3 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        this.body = new THREE.Mesh(geometry, material);
        this.body.geometry.computeBoundingBox();
        this.spiderObj3D.add(this.body);
        this.body.position.z += 1;
        makeMeshInvisible(this.body);
        this.entity = new FollowPathEntity();
        this.entity.init(this.spiderObj3D, this.playerInstance.player, this.speed);
        scene.add(this.spiderObj3D);
        this.createHpBar();

    }

    shoot(){

        this.posStart = new THREE.Vector3();
            
        this.spiderObj3D.getWorldQuaternion(this.worldQaternion);
        this.spiderObj3D.getWorldPosition(this.wordPosition);

        this.bulletMesh = new THREE.Mesh(new THREE.SphereGeometry( 0.12, 8 , 8), new THREE.MeshBasicMaterial({
            color: 0xad1100,
        }));

        if(!this.spiderShootSoundEmitter.isPlaying && !app.player.dead){

            this.spiderShootSoundEmitter.play();

        }
        this.bulletMesh.name = "spiderBullet";

        this.bulletMesh.quaternion.copy(this.worldQaternion);
        this.bulletMesh.position.set(this.wordPosition.x, this.wordPosition.y-0.25, this.wordPosition.z-0.1);

        this.posStart.set(this.bulletMesh.position.x, this.bulletMesh.position.y, this.bulletMesh.position.z);

        this.bulletMesh.posStart = this.posStart;

        if(this.isBoss){

            this.bulletMesh.scale.set(1.3, 1.3, 1.3, 1.3);

        }

        this.bullets.push(this.bulletMesh);

        scene.add(this.bulletMesh);
        

    }

    setupBoss(){

        this.life = 30;
        this.spiderObj3D.scale.set(2,2,2);
        this.hpScale = 2.5/72;


    }

    createHpBar(){

        this.spiderObj3D.getWorldQuaternion(this.worldQaternion);
        this.spiderObj3D.getWorldPosition(this.wordPosition);

        this.hpBarGeometry = new THREE.BoxGeometry( 2.5, 0.05, 0.05 );
        this.hpBarMaterial = new THREE.MeshLambertMaterial( {color: 0x991206} );
        this.hpBar = new THREE.Mesh( this.hpBarGeometry, this.hpBarMaterial );
        this.hpBar.quaternion.copy(this.worldQaternion);
        this.hpBar.position.set(this.wordPosition.x, this.wordPosition.y+2, this.wordPosition.z);
        scene.add( this.hpBar );
        this.spiderObj3D.attach(this.hpBar)

    }

    destroyBullet(bullet){

        destroyObject(bullet, scene);
        deleteFromArray(this.bullets, bullet);

    }
    
    death(enemy){

        if(!this.dead){

            this.hpBar.scale.set(0,0,0);
            this.oncePlay("death", 0.5);

            this.spiderDieSoundEmitter.play();

            this.deathAnimation.start();

            setTimeout(() => {
    
                this.bullets.forEach(bullet =>{
                    destroyObject(bullet, scene);
                });
        
                this.bullets = [];
        
                clearInterval(this.t);
              
                this.spiderObj3D.children.forEach((mesh, index) =>{
                    if(index == 0){
                        destroyObject(mesh.children[1], scene);
                    }
                    else{
                        if(mesh.hasOwnProperty("type") && mesh.type == "Mesh"){

                            destroyObject(mesh, scene);

                        }
                    }
                });
        
                destroyObject(this.body, scene);
                destroyObject(this.hpBar, scene);

                this.enemyInstance = enemy;
    
            }, 550);
        }

    }

    decrementLife(amount){

        this.life -= amount;
        this.hpBar.scale.x -= (amount * this.hpScale);

    }

    checkDamage(){

        if(this.playerInstance.guns.length > 0){

            this.playerInstance.guns.forEach(gun => {

                gun.bullets.forEach(bullet =>{

                    if(this.collider.distanceToPoint( bullet.position ) == 0){

                        if(!this.spiderDamageSoundEmitter.isPlaying && !app.player.dead){

                            this.spiderDamageSoundEmitter.play();

                        }

                        if(bullet.name == "magnumBullet"){

                            this.decrementLife(2.5);

                        }
                        else{

                            this.decrementLife(1);

                        }

                        destroyObject(bullet, scene);
                        deleteFromArray(gun.bullets, bullet);

                    }

                });
                
            });

        }
    }

    makeAnimations( model, animations ){

        this.api = { state: 'walk' };
        this.states = [ "idle", "walk", "walk_up_legs" ];
        this.onceActions = ["attack", "stab"];
        this.mixer = new THREE.AnimationMixer( model );
        this.actions = {};

        for ( let i = 0; i < animations.length; i ++ ) {

            this.clip = animations[ i ];
            this.action = this.mixer.clipAction( this.clip );
            this.actions[ this.clip.name ] = this.action;

            if(animations[i].name == "attack" || animations[i].name == "stab"){

                this.action.clampWhenFinished = true;
				this.action.loop = THREE.LoopOnce;

            }

        }

        this.activeAction = this.actions[ 'walk' ];
        this.activeAction.play();
        this.deathAnimation = new TWEEN.Tween(this.spiderObj3D.scale)
        .to({x: 0, y: 0, z: 0}, 550) 
        .easing(TWEEN.Easing.Quadratic.In) 
        .onComplete(()=>{

            app.enemyManager.deleteEnemy(this.enemyInstance);

            if(this.isBoss){

                this.createKey();
                app.missionManager.nextMission("find_and_kill_the_boss_and_get_the_key");

            }
    
        })


    }

    makePositionalSounds(){

        this.spiderAttackSound = app.assetManager.spiderAttackSound;
        this.spiderCrunchSound = app.assetManager.spiderCrunchSound;
        this.spiderDamageSound = app.assetManager.spiderDamageSound;
        this.spiderDieSound = app.assetManager.spiderDieSound;

        if(this.isBoss){

            this.spiderShootSound = app.assetManager.spiderBossShootSound;

        }
        else{

            this.spiderShootSound = app.assetManager.spiderShootSound;

        }

        this.spiderAttackSoundEmitter = this.makePositionalSound(this.spiderAttackSound);
        this.spiderCrunchSoundEmitter = this.makePositionalSound(this.spiderCrunchSound);
        this.spiderShootSoundEmitter = this.makePositionalSound(this.spiderShootSound);
        this.spiderDamageSoundEmitter = this.makePositionalSound(this.spiderDamageSound);
        this.spiderDieSoundEmitter = this.makePositionalSound(this.spiderDieSound);

        this.spiderObj3D.add( this.spiderAttackSoundEmitter, this.spiderCrunchSoundEmitter, 
            this.spiderShootSoundEmitter, this.spiderDamageSoundEmitter);

    }

    makePositionalSound(sound){

        this.emitter = new THREE.PositionalAudio( app.player.listener );
        this.emitter.setBuffer( sound );
        this.emitter.setVolume(this.positionalSoundVolume);
        this.emitter.setRefDistance( 20 );

        return this.emitter;

    }

    onKeyDown(name){

        this.oncePlay( name )

    }

    oncePlay( name, duration ) {

        this.fadeToAction( name, duration );

        this.mixer.addEventListener( 'finished',  this.restoreState.bind(this));

    }

    restoreState() {

        this.mixer.removeEventListener( 'finished' );

        this.fadeToAction( this.api.state, 0.2 );

        this.api.state = "idle"

    }

    createKey(){

        this.key = app.assetManager.mainDoorKey.scene.children[0].clone();
        scene.add(this.key);
        this.key.position.set(this.spiderObj3D.position.x, this.spiderObj3D.position.y-3, this.spiderObj3D.position.z);
        app.assetManager.keyLight.color.setHex(0xffd88f);
        app.assetManager.keyLight.position.set(this.key.position.x, this.key.position.y, this.key.position.z);
        app.chunkManager.nowChunk.items.push(this.key);
        app.chunkManager.margeCloseChunkItems();

    }

    fadeToAction( name, duration ) {

        this.previousAction = this.activeAction;
        this.activeAction = this.actions[ name ];

        if ( this.previousAction !== this.activeAction ) {

            this.previousAction.fadeOut( duration );

        }

        this.activeAction
            .reset()
            .setEffectiveTimeScale( 1 )
            .setEffectiveWeight( 1 )
            .fadeIn( duration )
            .play();

    }

    update(delta){

        if(this.mixer){
            this.mixer.update( delta );

        }

        if(this.entity){
            this.entity.update();
        }

        if(this.body){

            this.collider.copy( this.body.geometry.boundingBox ).applyMatrix4( this.body.matrixWorld );
        }

        if(this.bullets.length > 0){
            this.bullets.forEach(bullet =>{
                bullet.translateZ(this.bulletSpeed);
                if(bullet.posStart.distanceTo(bullet.position) > 100){
                    this.destroyBullet(bullet);
                }
            })
        }


        this.checkDamage();

        if(this.modelScene){

            if(this.playerInstance.player.position.distanceTo( this.spiderObj3D.position ) > 10  && 
            this.playerInstance.player.position.distanceTo( this.spiderObj3D.position ) <  25 && !this.attackIsExecuted){

                this.attackIsExecuted = true;

                this.t = setInterval(this.shootAction, getRndInteger(500, 2000));

                if(!this.spiderAttackSoundEmitter.isPlaying && !app.player.dead){

                    this.spiderAttackSoundEmitter.play();

                }

                this.oncePlay("attack", 0.2);
                this.fadeToAction( this.states[2], 0.2 );
                this.isExecutedWalkLegsUp = false;
            }

            if(this.playerInstance.player.position.distanceTo( this.spiderObj3D.position ) >  25 && !this.isExecutedWalkLegsUp){

                clearInterval(this.t);
                this.attackIsExecuted = false;
                this.isExecutedWalkLegsUp = true;
                this.fadeToAction( this.states[1], 0.2 );

            }

            

            if(this.playerInstance.player.position.distanceTo( this.spiderObj3D.position ) > 9){

                if(!this.isExecutedWalk){

                    this.isExecutedWalk = true;
                    this.isExecutedIdle = false;
                    this.fadeToAction( this.states[1], 0.2 );

                }

            }
            else{

                if(!this.isExecutedIdle){

                    this.isExecutedWalk = false;
                    this.isExecutedIdle = true;
                    this.fadeToAction( this.states[0], 0.2 );

                }
                
            }

            
            if(this.playerInstance.player.position.distanceTo( this.spiderObj3D.position ) < 9 && !this.isStabExecuted){

                this.isStabExecuted = true;

                if(!this.spiderCrunchSoundEmitter.isPlaying && !app.player.dead){

                    this.spiderCrunchSoundEmitter.play();

                }
                
                this.oncePlay("stab", 0.2);
                app.player.decrementLife(2);

                setTimeout(() => {

                    this.isStabExecuted = false;

                }, 1200);

            }

        }

    }

}