
var transparentMaterial = new THREE.MeshBasicMaterial({

    color: 0xfcba03,
    opacity: 0,
    alphaTest : 0.5,
    transparent : true

});

function loadSound(src, soundID) {

    createjs.Sound.registerSound(src, soundID);

}

function getSettings(id){

    this.settings = JSON.parse(localStorage.getItem(id));

    if(this.settings == null){

        this.settings = DEFAULT_SETTINGS;

    }

    return this.settings;

}

async function destroyObject(mesh, scene){

    var obj = mesh.parent;

    const index = obj.children.indexOf(mesh);
    
    if (index > -1) {

        obj.children[index].geometry.dispose();
        obj.children[index].material.dispose(); 
        if(obj.children[index].material.map != undefined){
            obj.children[index].material.map.dispose(); 
        }
        obj.children.splice(index, 1);

    }

    app.composition.renderer.renderLists.dispose();

    scene.remove(mesh);
    scene.remove(obj);

}

function getRndInteger (min, max) {

    return Math.floor(Math.random() * (max - min)) + min;
    
}

function mapRange(value, low1, high1, low2, high2) {

    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);

}

function clamp(number, min, max) {

    return Math.max(min, Math.min(number, max));

}


function makeMeshInvisible(meshOrArray){

    if(Array.isArray(meshOrArray)){

        meshOrArray.forEach(element => {

            element.material = transparentMaterial;
    
        });
    }
    else if(meshOrArray instanceof THREE.Mesh){

        meshOrArray.material = transparentMaterial;

    }

}

function deleteFromArray(array, item){

    const index = array.indexOf(item);
    if (index > -1) {

        array.splice(index, 1);

    }

    return index;
		
}

class FollowPathEntity{

    init(entity, toObject, speed){

        this.speed = speed;
        this.targetQuaternion = new THREE.Quaternion();
        this.rotationMatrix = new THREE.Matrix4();
        this.playerQuaternion = new THREE.Quaternion();
        this.direction = new THREE.Vector3();
        this.entity = entity;
        this.point = new THREE.Vector3();
        this.once = true;
        this.toObject = toObject;
        this.onceResetPath = true;
        this.path = [];
        this.previousPositionX = null;
        this.previousPositionZ = null;
        this.nowPathIndex = 0;
        this.onceMakeTarget = true;
        this.onceStart = true;
        this.canFollowPath = false;
        this.makePoint(this.toObject);

    }

    makePoint(object){

        var point = new THREE.Vector3(object.position.x, this.entity.position.y, object.position.z);
        this.path.push(point);

        if(this.path.length == 100){

            this.pathLastPrevious = this.path[this.path.length-2]
            this.pathLast = this.path[this.path.length-1];
            this.path = [];
            this.path[0] = this.pathLastPrevious;
            this.path[1] = this.pathLast;
            this.once = true;
            this.nowPathIndex = 0;

        }

    }

    generateTarget(point){

        this.playerQuaternion.set(point.x, this.entity.position.y, point.z);
        this.entity.getWorldDirection(this.direction);
        this.rotationMatrix.lookAt(this.playerQuaternion, this.entity.position, this.entity.up );
		this.targetQuaternion.setFromRotationMatrix( this.rotationMatrix );

    }

    lookAt(time){

        this.entity.quaternion.slerp( this.targetQuaternion, time );

    }

    update(){

        if(this.path.length == 1 && this.toObject.position.distanceTo(this.entity.position) < 40){

            this.entity.translateZ(this.speed);

            if(this.onceStart){

                this.canFollowPath = true;
                this.onceStart = false;

            }
        
            this.generateTarget(this.toObject.position);  
            this.lookAt(0.065);
            
        }

        if(this.canFollowPath){

            if(this.toObject.position.distanceTo(this.entity.position) > 15){

                if(!this.onceResetPath){

                    this.onceResetPath = true;
                    this.makePoint(this.entity);

                }

                if(this.path.length > 0){

                
                    if(this.path[this.path.length-1].distanceTo(this.toObject.position) > 7){

                        this.makePoint(this.toObject);

                    }
        
                    if(this.previousPositionX != this.entity.position.x && this.previousPositionZ != this.entity.position.z){
        
                        this.previousPositionX = this.entity.position.x;
                        this.previousPositionZ = this.entity.position.z;
        
                    }
        
                    if(this.path[this.nowPathIndex+1] != undefined){

                        if(this.path.length > 1){
        
                            if(this.once){

                                this.previousPositionX = this.entity.position.x;
                                this.previousPositionZ = this.entity.position.z;
                                this.generateTarget(this.path[this.nowPathIndex+1]);
                                this.once = false;
            
                            }
        
                            if(Math.round(this.entity.position.distanceTo(this.path[this.nowPathIndex+1])) < 5 ){
        
                                this.onceMakeTarget = true;
                                this.nowPathIndex++;
                                if(this.path[this.nowPathIndex+1] != undefined){
        
                                    this.generateTarget(this.path[this.nowPathIndex+1]);
        
                                }
            
            
                            }
                            else{
        
                                if(this.path[this.nowPathIndex+1] != undefined){

                                    if(this.onceMakeTarget && this.previousPositionX == this.entity.position.x && 
                                        this.previousPositionZ == this.entity.position.z){

                                            if(this.onceMakeTarget){

                                                this.onceMakeTarget = false;
                                                this.generateTarget(this.path[this.nowPathIndex+1]);  

                                            }

                                        }

                                    }

                                    this.entity.translateZ(this.speed);
                                }
        
            
                            }
            
                            this.lookAt(0.05);
            
                        }
        
                    }
                    
            }
            else{

                if(this.onceResetPath){

                    this.path = [];
                    this.nowPathIndex = 0;
                    this.onceResetPath = false;

                }


                if(this.entity.position.distanceTo(this.toObject.position) > 9){

                    this.entity.translateZ(this.speed);

                }

                this.generateTarget(this.toObject.position);  
                this.lookAt(0.065);

            }
            
        }
            
    }

}

function cloneGltf(gltf) {

    const clone = {
      animations: gltf.animations,
      scene: gltf.scene.clone(true)
    };
  
    const skinnedMeshes = {};
  
    gltf.scene.traverse(node => {
      if (node.isSkinnedMesh) {
        skinnedMeshes[node.name] = node;
      }
    });
  
    const cloneBones = {};
    const cloneSkinnedMeshes = {};
  
    clone.scene.traverse(node => {
      if (node.isBone) {
        cloneBones[node.name] = node;
      }
  
      if (node.isSkinnedMesh) {
        cloneSkinnedMeshes[node.name] = node;
      }
    });
  
    for (let name in skinnedMeshes) {
      const skinnedMesh = skinnedMeshes[name];
      const skeleton = skinnedMesh.skeleton;
      const cloneSkinnedMesh = cloneSkinnedMeshes[name];
  
      const orderedCloneBones = [];
  
      for (let i = 0; i < skeleton.bones.length; ++i) {
        const cloneBone = cloneBones[skeleton.bones[i].name];
        orderedCloneBones.push(cloneBone);
      }
  
      cloneSkinnedMesh.bind(
          new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
          cloneSkinnedMesh.matrixWorld);
    }
  
    return clone;

}

class PopupMaker{

    init(){

        this.popups = document.getElementById("popups");
        this.popupsArray = null;
        this.bgColor = null;
        this.fontColor = null;
        this.time = 3000;
    }

    createPopup(text, type){


        if(type == "warning"){

            this.imgSrc = "../assets/images/warning.png";
            this.bgColor = "rgba(224, 208, 159, 0.7)";
            this.fontColor = "#38362f";


        }
        else if(type == "mission_completed"){

            this.time = 6000;

            this.imgSrc = "../assets/images/mission_completed.png";
            this.bgColor = "rgba(55, 115, 84, 0.7)";
            this.fontColor = "#56d195";

        }
        else if(type == "new_mission"){

            this.time = 15000;

            this.imgSrc = "../assets/images/new_mission.png";
            this.bgColor = "rgba(36, 56, 56, 0.7)";
            this.fontColor = "#598f8f";

        }
        else if(type == "info"){

            this.imgSrc = "../assets/images/info.png";
            this.bgColor = "rgba(235, 235, 235, 0.7)";
            this.fontColor = "#38362f";

        }

        this.textDiv = document.createElement("div");
        this.popup = document.createElement("div");
        this.popup.id = "popup";
        this.textDiv.id = "textDiv";

        this.popup.style.background = this.bgColor;
        this.popup.style.color = this.fontColor;

        this.popups.appendChild(this.popup);
        this.createImage(this.imgSrc);
        this.textDiv.innerHTML = text;
        this.popup.appendChild(this.textDiv);

        this.popupsArray = document.querySelectorAll("div[id='popup']");

        this.popupsArray.forEach(popup => {

            setTimeout(()=>{
                try{
                    this.deletePopup(popup);
                } catch(error){


                }
            }, this.time);

        });

    }

    deletePopup(popup){

        this.popups.removeChild(popup);

    }

    createImage(imgSrc){

        this.imgDiv = document.createElement("div");
        this.img = document.createElement("img");
        this.imgDiv.id = "imgDiv";
        this.img.src = imgSrc;
        this.img.id = "popUpImage";
        this.imgDiv.appendChild(this.img);
        this.popup.appendChild(this.imgDiv)


    }
    

}