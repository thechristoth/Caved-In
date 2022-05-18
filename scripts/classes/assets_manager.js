class AssetManager{

    init(){

        this.fullMineModel = null;
        this.spiderModel = null;
        this.wallDiffuseTexture = null;
        this.wallNormalTexture = null;
        this.groundDiffuseTexture = null;
        this.groundNomalTexture = null;
        this.lampInnerLightTexture = null;
        this.gunFireTexture = null;
        this.grenadeFireTexture = null;
        this.wallDisplacementTexture = null;
        this.BossSpiderTexture = null;
        this.mainDoorKey = null;

        this.loadingBar = document.getElementById("loading_bar");
        this.percentText = document.getElementById("percent_text");

        this.loadingScreen = document.getElementById("loading_screen");

        this.groundVignetteTexture = null;

        this.manager = new THREE.LoadingManager();
        this.modelLoader = new THREE.GLTFLoader(this.manager);
        this.textureLoader = new THREE.TextureLoader( this.manager );
        this.audioLoader = new THREE.AudioLoader();
        this.itemCounter = 0;
        this.itemLength = null;

        this.makeAnimations();

        Object.keys(VISUAL_ASSETS).forEach(key =>{
            this.itemLength++;
        });

        Object.keys(VISUAL_ASSETS).forEach(key => {

            if(VISUAL_ASSETS[key].type == "model"){

                this.loadAsset(this.modelLoader,VISUAL_ASSETS[key].src, key)

            }
            else if(VISUAL_ASSETS[key].type == "texture"){

                this.loadAsset(this.textureLoader,VISUAL_ASSETS[key].src, key)

            }
            
          });
        
    }

    loadSounds(){

        Object.keys(SOUND_ASSETS).forEach(key => {

            if(SOUND_ASSETS[key].type == "sound"){

                loadSound(SOUND_ASSETS[key].src, key);

            }
            else if(SOUND_ASSETS[key].type == "positionalSound"){

                this.loadPosAudio(this.audioLoader,SOUND_ASSETS[key].src, key);

            }

        });

        app.setAudioSettings();

    }

    makeAnimations(){


        this.opacity = {value: 1};
        this.loadingScreenAnimation = new TWEEN.Tween(this.opacity)
        .to({value: 0}, 2000) 
        .easing(TWEEN.Easing.Quadratic.Out) 
        .onUpdate(() => {

            this.loadingScreen.style.setProperty('opacity', this.opacity.value);

        });
        
    }

    createProps(){

        this.grenadeLight = new THREE.PointLight( 0x000000, 10, 25 );

        scene.add(this.grenadeLight);

        this.keyLight = new THREE.PointLight( 0x000000, 5, 25 );

        scene.add(this.keyLight);

        this.grenadeFireMaterial = new THREE.SpriteMaterial( { 

            depthWrite: false ,
            map: this.grenadeFireTexture,
            transparent : true ,
            opacity: 0

        });

        this.grenadeSprite = new THREE.Sprite( this.grenadeFireMaterial );
        scene.add( this.grenadeSprite );


    }

    
    onProgress( xhr ) {

        if ( xhr.lengthComputable ) {

            const percentComplete = xhr.loaded / xhr.total * 100;
            console.log( 'asset ' + Math.round( percentComplete, 2 ) + '% downloaded' );

        }

    }

    onError() {
        
    }

    loadAsset(loader, asset, key){

        
        loader.load(asset, (obj) =>{

            this[key] = obj;
 
            this.itemCounter++;


            this.percent = mapRange(this.itemCounter, 0, this.itemLength, 0, 100);
            this.loadingBar.style.width = this.percent + "%";
            this.percentText.innerHTML = Math.round(this.percent) + " / 100";

            if(this.itemCounter == this.itemLength){
   
                    app.initializeWhenAssetsLoaded();
                    this.loadingScreenAnimation.start();

            }

        }, this.onProgress, this.onError);

    }

    loadPosAudio(loader, asset, key){

        loader.load(asset, (obj) => {

            this[key] = obj;

                app.chunkManager.chunks.forEach(chunk => {
				
                    if(chunk.hasOwnProperty("manufacturingMachine")){
    
                        chunk.manufacturingMachine.makeMachinePositionalSound();
                        chunk.manufacturingMachine.makePositionalSwitchSound();
    
                    }
                    else if(chunk.hasOwnProperty("rockProcessingMachine")){

                        chunk.rockProcessingMachine.makeMachinePositionalSound();
                        chunk.rockProcessingMachine.makePositionalSwitchSound();

                    }
                    else if(chunk.hasOwnProperty("mainPowerSwitch")){

                        chunk.mainPowerSwitch.makePositionalSwitchSound();

                    }


                });

        });

    }
}