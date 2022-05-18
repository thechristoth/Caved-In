class Barrier {
    init(obj3d, chunkName){

        this.obj3d = obj3d;
        this.chunkName = chunkName;
        this.collider = null;
        this.visuals = [];

        setTimeout(()=>{

            this.inChunk = app.chunkManager.chunks.find(chunk => chunk.name === this.chunkName);

            this.arrangeModel();
            this.inChunk.setVisibility();

        },1);

    }

    arrangeModel(){

        this.obj3d.children.forEach(barrierElement => {

            if(barrierElement.name.startsWith("collider")){
                this.collider = barrierElement;
                this.inChunk.colliders.push(this.collider);
            }
            else{
                this.visuals.push(barrierElement);
            }
            
        });

    }

    destroy(){

        this.visuals.forEach(element => {
            destroyObject(element,scene);
        });

        deleteFromArray(this.inChunk.colliders, this.collider);
        app.chunkManager.margeCloseChunkItems();

        
    }
}