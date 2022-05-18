class Terrain{

    init(obj3d){

        this.obj3d = obj3d;
        this.wall = this.obj3d.children[0];
        this.ground = this.obj3d.children[1];
        this.ground2 = this.obj3d.children[2];
        this.setupMaterials();
        scene.add(this.obj3d);
	
	}

    setupMaterials(){

        this.wallDiffuseTexture = app.assetManager.wallDiffuseTexture;
        this.wallNormalTexture = app.assetManager.wallNormalTexture;

        this.groundDiffuseTexture = app.assetManager.groundDiffuseTexture;
        this.groundNomalTexture = app.assetManager.groundNormalTexture;

        this.groundVignetteTexture = app.assetManager.groundVignetteTexture;

        this.wall.material.map = this.wallDiffuseTexture;
        this.wall.material.normalMap = this.wallNormalTexture;

        this.ground.material.map = this.groundDiffuseTexture;
        this.ground.material.normalMap = this.groundNomalTexture;

      

        this.terrainObjs = [this.wall, this.ground];

        this.ground2.material.depthWrite = false ;

        this.terrainObjs.forEach(obj =>{

            if(obj.material.normalMap != null){

                obj.material.map.encoding = THREE.sRGBEncoding;
                obj.material.dithering = true;
                obj.material.map.wrapS = THREE.RepeatWrapping;
                obj.material.map.wrapT = THREE.RepeatWrapping;

                obj.material.normalMap.wrapS = THREE.RepeatWrapping;
                obj.material.normalMap.wrapT = THREE.RepeatWrapping;
                obj.material.metalness = 0;

            } else{

                obj.material.map.encoding = THREE.sRGBEncoding;
                obj.material.dithering = true;
                obj.material.map.wrapS = THREE.RepeatWrapping;
                obj.material.map.wrapT = THREE.RepeatWrapping;
                
                obj.material.metalness = 0;

            }

        });

        this.groundDiffuseTexture.repeat.set(20,20);
        this.groundNomalTexture.repeat.set(20,20);

        this.wallDiffuseTexture.repeat.set(15,15);
        this.wallNormalTexture.repeat.set(15,15);

    }

}