class Item{
    
    init(src, machinePosition, inChunk){

        this.src = src;
        this.usableItem = true;
        this.mesh = null;
        this.active = false;
        this.machinePosition = machinePosition;
        this.modelLoader = app.modelLoader;
        this.inChunk = inChunk;
        this.loadModel(this.src);


    }

    loadModel(src){

        this.model = app.assetManager[src];
        this.modelScene = this.model.scene.clone();
        this.modelScene.children[0].position.set(this.machinePosition.x-7.5, this.machinePosition.y-2, this.machinePosition.z);
        
        if(this.modelScene.children[0].name == "shotgun"){

            this.mesh = this.modelScene.children[0].children[1];
            this.bullet = this.modelScene.children[0].children[0];
            app.missionManager.nextMission("manufacture_shotgun");

        }
        else if(this.modelScene.children[0].name == "magnum"){

            this.mesh = this.modelScene.children[0].children[2];
            this.bullet = this.modelScene.children[0].children[1];
            app.missionManager.nextMission("manufacture_magnum");

        }

        else if(this.modelScene.children[0].name == "medicine" || this.modelScene.children[0].name == "shotgun_ammo" || 
        this.modelScene.children[0].name == "magnum_ammo" || this.modelScene.children[0].name == "grenade"){

            if(app.missionManager.onceShotgunAmmoMission && this.modelScene.children[0].name == "shotgun_ammo"){

                app.missionManager.onceShotgunAmmoMission = false;
          
                app.missionManager.nextMission("manufacture_ammo_for_shotgun");

            }
            else if(app.missionManager.onceMagnumAmmoMission && this.modelScene.children[0].name == "magnum_ammo"){

                app.missionManager.onceMagnumAmmoMission = false;
                app.missionManager.nextMission("manufacture_ammo_for_magnum");
                
            }
            

            this.mesh = this.modelScene.children[0].children[0];
        }
        
        this.mesh.material.map.encoding = THREE.sRGBEncoding;
        this.mesh.material.needsUpdate = true;
        this.mesh.material.dithering = true;
        this.mesh.material.metalness = 0;
        this.inChunk.items.push(this.mesh);
        app.chunkManager.margeCloseChunkItems();
        this.name = this.mesh.parent.name;

        scene.add(this.mesh.parent);

    }


}