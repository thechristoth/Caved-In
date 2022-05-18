class App{
	
    init(){

		this.settings = getSettings("game_settings");
		
        //instances----------------------------------------------------

        this.composition = new Composition();
        this.world = new World();
		this.assetManager = new AssetManager();
		this.gameManager = new GameManager();
		this.popupMaker = new PopupMaker();
		this.terrain = new Terrain();
		this.player = new Player();
        this.keys = new Keys();
		this.modelLoader = new ModelLoader();
		this.textureLoader = new THREE.TextureLoader()
		this.enemyManager = new EnemyManager();
		this.chunkManager = new ChunkManager();
		this.missionManager = new MissionManager();

		this.assetManager.init();

    }

	initializeWhenAssetsLoaded(){

		this.delta = 0;
		this.ray = new THREE.Raycaster;
		this.movingCube = null;
		this.originPoint = null;
		this.usableItems = [];
		this.isStopLoop = false;
		this.canChangeVisibility = false;

		 //initialization--------------------------------------------------

		this.composition.init();
		this.world.init();
		this.gameManager.init();
		this.player.init();
		this.assetManager.createProps();
		this.chunkManager.init(this.assetManager.fullMineModel);
		this.popupMaker.init();
		this.keys.init();
		this.enemyManager.init();
		this.missionManager.init();
 
		this.chunkManager.makeChunksFromStructModel();
		 this.composition.renderer.compile(this.composition.scene, this.composition.camera);
		this.canChangeVisibility = true;
 
		this.movingCube = this.player.playerMesh;
		this.movingCubeVerticesLength = this.movingCube.geometry.vertices.length;
 
		this.stats = this.createStats();
		document.body.appendChild( this.stats.domElement );

		console.log(this.composition.renderer.info);
 
		this.animate();
		 

	}

	createStats() {

		var stats = new Stats();
		stats.setMode(0);
  
		stats.domElement.style.display = "none";
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0';
		stats.domElement.style.top = '0';
  
		return stats;
	}

	initTerrain(obj3d){

		this.terrain.init(obj3d);

	}

	stop(){

		this.isStopLoop = true;

	}

	start(){

		this.isStopLoop = false;

	}

	setAudioSettings(){

		createjs.Sound.volume = app.settings.audio.sound_fx_volume;

	}

	getSetting(value){

		if(value == "on"){

			return true;

		}
		
		return false;

	}

    animate(time){

		this.stats.begin();

		this.delta = this.composition.clock.getDelta();

        requestAnimationFrame( this.animate.bind(this));

		if(!this.isStopLoop){

			if(this.enemyManager){

				if(this.enemyManager.enemies.length > 0){

					for(let i=0; i<this.enemyManager.enemies.length; i++){

						this.enemyManager.enemies[i].update(this.delta);

					}

				}

			}

			TWEEN.update(time);

			this.chunkManager.update(this.delta);

			if(this.player.guns.length >0){

				for (let i = 0; i < this.player.guns.length; i++){
					this.player.guns[i].update();
				}

			}

			this.originPoint = this.player.player.position.clone();

			this.collidableMeshList = this.chunkManager.colliders;

			var objectCollisions = [];

			for (var vertexIndex = 0; vertexIndex < this.movingCubeVerticesLength; vertexIndex++){

				this.localVertex = this.movingCube.geometry.vertices[vertexIndex].clone();
				this.globalVertex = this.localVertex.applyMatrix4( this.movingCube.matrix );
				this.directionVector = this.globalVertex.sub( this.movingCube.position );
				
				this.ray.set( this.originPoint, this.directionVector.clone().normalize() );

				this.collisionResults = this.ray.intersectObjects( this.collidableMeshList );

				for(let i=0; i < this.collisionResults.length; i++){

					if (this.collisionResults[i].distance < this.directionVector.length()) {
						objectCollisions.push(this.collisionResults[i]);
					}

				}
			}

			if (this.keys.states.forward) {

				this.player.addVelocity('z', this.player.maxManualVelocity, true);
				
			}
			else if(this.keys.states.backward) {

				this.player.addVelocity('z', 0 - this.player.maxManualVelocity, true);

			}
			else if (this.keys.states.left) {

				this.player.addVelocity('x', this.player.maxManualVelocity, true);

			}
			else if (this.keys.states.right) {

				this.player.addVelocity('x', 0 - this.player.maxManualVelocity, true);

			}
	

			this.enemyManager.update();

			this.player.update(this.delta, objectCollisions);

		}

		this.composition.update();

		this.stats.end();

	}

}