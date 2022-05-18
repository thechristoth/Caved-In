class ChunkManager{

    init(model){

        this.chunks = [];
        this.model = model;

        this.nowChunk = null;
        this.closeChunks = [];
        this.previousChunk = null;

        this.pickableItems = [];
        this.spiderNavMesh = null;
        this.enemyManager = null;

        this.colliders = [];

    }

    makeChunksFromStructModel(){

        this.modelScene = this.model.scene;

        this.mixer = new THREE.AnimationMixer(this.model.scene);
        this.arr = [];

        for(let i=0; i<this.modelScene.children.length; i++){

            if(this.modelScene.children[i].name.startsWith("walls_and_ground_visuals")){

                app.initTerrain(this.modelScene.children[i]);

            }
            else{

                this.arr.push(this.modelScene.children[i]);

            }

        }

        this.obj3dArray = this.arr;

        this.makeChunks();

    }

    makeChunks(){

        this.obj3dArray.forEach(obj3d => {

            this.chunk = new Chunk();
         
                this.chunk.init(obj3d, obj3d.name);
                this.chunks.push(this.chunk);
            
        });

    }

    isChanged(chunk){

        this.nowChunk = chunk;

        if(this.previousChunk != this.nowChunk){

            this.previousChunk = this.nowChunk;
            return true;

        }
        else{

            return false;

        }

    }

    margeCloseChunkItems(){

        this.pickableItems = [];
        this.closeChunks.forEach(chunk => {

            this.pickableItems.push(...chunk.items);
            
        });
    }

    deactivateChunk(chunk){

        scene.remove(chunk.obj3d);

    }

    activateChunk(chunk){

        scene.add(chunk.obj3d);

    }


    update(delta){ 

        if(this.nowChunk){

            if(this.nowChunk.machines.length != 0){
                if(this.nowChunk.machines[0].name == "rock_processing_machine"){
                    this.nowChunk.machines[0].update();
                }
            }

            if(this.nowChunk.mainDoor != null){

                this.nowChunk.mainDoor.update(delta);

            }

        }
        

        for(let i=0; i<this.chunks.length; i++){

            if(this.chunks[i].bounding_box != null){
            if(this.chunks[i].bounding_box.distanceToPoint(app.player.player.position) == 0){

                if(this.isChanged(this.chunks[i])){

                    this.colliders = this.chunks[i].colliders;
                    this.pickableItems = [];

                    for(let i=0; i<this.chunks.length; i++){
                        
                        if(this.chunks[i].bounding_box != null){

                        if(this.chunks[i].bounding_box.distanceToPoint(app.player.player.position) < 60){

                            this.activateChunk(this.chunks[i]);
                            this.closeChunks.push(this.chunks[i]);
                            this.margeCloseChunkItems();

                        }

                        else{

                            if(app.canChangeVisibility){

                                this.deactivateChunk(this.chunks[i]);

                            }

                        }

                    }

                    }

                }
            
            }
        }

        }

    }

}