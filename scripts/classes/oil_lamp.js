class OilLamp{

    init(obj3d, chunkName){

        this.spriteTexture = app.assetManager.lampInnerLightTexture;

        this.obj3d = obj3d;
        this.body = null;
        this.glass = null;
        this.arrangeModel();
        this.materialSettings();

        this.glassPos = new THREE.Vector3();

        this.glass.getWorldPosition(this.glassPos);

        this.SpriteMaterial = new THREE.SpriteMaterial( { 

            map: this.spriteTexture,
            transparent : true ,
            opacity: 1,
            blending: THREE.AdditiveBlending

        });

        
        this.sprite = new THREE.Sprite( this.SpriteMaterial );

        this.sprite.position.set(this.glassPos.x-0.05, this.glassPos.y+0.1, this.glassPos.z-0.05);

        this.light = new THREE.PointLight( 0xf6f5bf, 2.7, 28);
        this.light.position.set( this.glassPos.x, this.glassPos.y, this.glassPos.z-0.3 );

        this.glass.attach(this.sprite);
        this.glass.attach(this.light);
        
        setTimeout(()=>{

            this.inChunk = app.chunkManager.chunks.find(chunk => chunk.name === chunkName);

            this.inChunk.items.push(this.body, this.glass);

            app.chunkManager.margeCloseChunkItems();

        },1);
    }

    arrangeModel(){

        this.glass = this.obj3d.children[0];
        this.body = this.obj3d.children[1];
        
    }

    materialSettings(){

        this.glass.material.depthWrite = false;
        this.glass.material.side = THREE.BackSide;
        this.glass.material.transparent = true;
        this.glass.material.opacity = 0.3;
    }

}