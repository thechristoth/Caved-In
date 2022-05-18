class Chunk{

    init(obj3d, name){

        this.material = new THREE.MeshLambertMaterial( {color: 0xfcba03} );

        this.obj3d = obj3d;
        this.name = name;

        this.wallObj3D = null;
        this.colliderObj3D = null;
        this.bounding_box = null;   //chunks bounding box to check
        this.colliders = [];        //chunks colliders
        this.items = [];            //chunks items
        this.visuals = [];          //chunks visuals (textures, rocks, woods)
        this.walls = [];
        this.machines = [];
        this.machineModels = [];

        this.barriers = [];

        this.arrangeModel(this.obj3d);
        this.setVisibility();
        this.makeChunkBoundingBox();

        this.setMaterials();

    }

    arrangeModel(obj3d){

        for(let i=0; i< obj3d.children.length; i++){

            if(obj3d.children[i].name.startsWith("walls") ){

                this.wallObj3D = obj3d.children[0];
                this.walls = this.wallObj3D.children;
                
            }
            else if(obj3d.children[i].name.startsWith("collide_elements") ){

                this.colliderObj3D = obj3d.children[i];
                this.colliders = this.colliderObj3D.children;

            }
            else if(obj3d.children[i].name.startsWith("pickable_items") ){

                this.items = this.items.concat( obj3d.children[i].children);

            }
            else if(obj3d.children[i].name.startsWith("visuals") ){

                this.visuals = this.obj3d.children[i].children;

            }
            else if(obj3d.children[i].name.startsWith("machines") ){

                this.machineModels = this.obj3d.children[i].children;
                this.makeMachines(this.machineModels);

            }

            else if(obj3d.children[i].name.startsWith("oil_lamp") ){

                this.makeOilLamp(obj3d.children[i], this.name);

            }
            else if(obj3d.children[i].name.startsWith("barrier") ){

               this.barrier = new Barrier();
               this.barrier.init(obj3d.children[i], this.name);
               this.barriers.push(this.barrier);

            }
            else if(obj3d.children[i].name.startsWith("door") ){
                
                this.mainDoor = new MainDoor();
                this.mainDoor.init(obj3d.children[i], this.name);
                
            }
   
        }    

    }

    setVisibility(){

        if(this.colliders.length > 0){

            makeMeshInvisible(this.colliders);

        }

        makeMeshInvisible(this.walls);

    }

    
	makeOilLamp(obj3d, name){

		this.oilLamp = new OilLamp();
		this.oilLamp.init(obj3d, name);

	}

    makeMachines(machineModels){

        machineModels.forEach(machineModel =>{

            if(machineModel.name == "rock_processing_machine"){
                
                this.rockProcessingMachine = new RockProcessingMachine();
                this.rockProcessingMachine.init(machineModel, this.name);
                this.items.push(this.rockProcessingMachine.switchSensor);
                this.machines.push(this.rockProcessingMachine);

            }
            else if(machineModel.name == "manufacturing_machine"){

                this.manufacturingMachine = new ManufacturingMachine()
                this.manufacturingMachine.init(machineModel, this.name);
                this.items.push(this.manufacturingMachine.switchSensorMesh);
                this.items.push(this.manufacturingMachine.downButtonSensorMesh);
                this.items.push(this.manufacturingMachine.upButtonSensorMesh);
                this.machines.push(this.manufacturingMachine);

            }
            else if(machineModel.name == "main_power_switch"){
                
                this.mainPowerSwitch = new MainPowerSwitch()
                this.mainPowerSwitch.init(machineModel);
                this.items.push(this.mainPowerSwitch.switchSensor);
                this.machines.push(this.mainPowerSwitch);

            }

        });

    }

    makeChunkBoundingBox(){

        this.walls.forEach(wall => {

            this.colliders.push(wall);
            
        });

        this.bounding_box = new THREE.Box3().setFromObject(this.obj3d);
        
    }

    setMaterials(){

        this.obj3d.traverse(function(mesh){

            if(mesh instanceof THREE.Mesh){

                if(mesh.material.hasOwnProperty("map") && mesh.material.map != null){

                    mesh.material.map.anisotropy = app.composition.maxAnisotropy;
                    mesh.material.map.minFilter = THREE.LinearMipmapLinearFilter;
                    mesh.material.encoding = THREE.sRGBEncoding;
                    mesh.material.metalness = 0;

     
                }
                else{

                    mesh.material.metalness = 0;
                    mesh.material.encoding = THREE.sRGBEncoding;

                }

            }

        });

        this.visuals.forEach(visual => {

            visual.matrixAutoUpdate = false;

            if(visual instanceof THREE.Mesh){

                if(visual.material.name == "wood_rod" || visual.material.name == "wood" || 
                visual.material.name == "big_wood" || visual.material.name == "small_wood" ){

                    visual.material.flatShading = true;

                }

            }
        });

        this.colliders.forEach(collider => {
            if(collider instanceof THREE.Mesh){
                collider.matrixAutoUpdate  = false;
            }

        });

        this.items.forEach(collider => {
            if(collider instanceof THREE.Mesh){
                collider.matrixAutoUpdate  = false;
            }

        });

    }

    computeBoundingBox(mesh){

        mesh.geometry.computeBoundingBox();

    }


}