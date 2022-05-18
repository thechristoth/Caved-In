class Player{

    init() {

        this.player = new THREE.Object3D();
        this.life = 30;
		this.usableItems = ["hand"];

        this.dead = false;
		this.objectPickedUp = null;
		this.pointingToObject = null;
		this.isPointingToItem = false;
		this.isHaveKey = false;
		this.lampWorldPos = new THREE.Vector3();
		this.lampPos = new THREE.Object3D();
		this.canUseItem = false;
		this.hpBar = document.getElementById("lifeBar");
		this.collideBox = new THREE.Box3();
		this.maxInHand = 3;
		this.inventory = new Inventory();
		this.inventory.init();
		this.inventory.createInventoryVisuals();
		this.guns = [];
		this.usableItemPos = 0;
        this.playerMeshMaterial = new THREE.MeshBasicMaterial( { color: 0xff22aa } );
        this.playerGeometry = new THREE.BoxGeometry( 1, 1.7, 1 );
        this.playerMesh = new THREE.Mesh( this.playerGeometry, this.playerMeshMaterial );
		this.usedItems = [];
		this.onceDeath = true;
		this.colliderPlayerMeshMaterial = new THREE.MeshBasicMaterial( { color: 0xff22aa } );
        this.colliderplayerGeometry = new THREE.BoxGeometry( 1.2, 1.7, 1.2 );
        this.colliderplayerMesh = new THREE.Mesh( this.colliderplayerGeometry, this.colliderPlayerMeshMaterial );
		this.oncePickedUpGunPart = true;
		this.colliderplayerMesh.geometry.computeBoundingBox();
        this.velocity = new THREE.Vector3();
        this.maxManualVelocity = 70;
        this.firstPersonCamera = new THREE.PerspectiveCamera( app.settings.graphics.field_of_vision, window.innerWidth/window.innerHeight, 0.1, 1000 );
        this.firstPersonCamera.position.y += .5;
		this.firstPersonCamera.rotation.y -= Math.PI;
		this.pointers = document.getElementById("pointers");
		this.friction = app.world.friction;
		this.activeItemIndex = 0;
		this.axes = ['x', 'z'];

		this.ammoBoxQuantity = {
			shotgun_ammo: 6,
			magnum_ammo: 5
		};

		makeMeshInvisible(this.colliderplayerMesh);
		
       	this.player.add(this.colliderplayerMesh);

	   	this.raycaster = new THREE.Raycaster();

		//for velocity

		this.direction = new THREE.Vector3();
		this.angle = Math.PI / 2;
		this.dirAxis = new THREE.Vector3( 0, 1, 0 );

		//for collision

		this.normal = null;
		this.normalMatrix = null;
		this.globalNormal = null;
		this.collisionObjectPosition = new THREE.Vector3();
		this.playerObjectPosition = null;

		this.restrict = {

			x: {pos: false, neg: false},
			y: {pos: false, neg: false},
			z: {pos: false, neg: false}

		};

        this.player.add(this.playerMesh, this.firstPersonCamera);
		this.damageDiv = document.getElementById("damage_div");
        this.player.position.y += 5;
		this.player.position.x -= 20;
		this.colliderplayerMesh.position.y -= 4.5;
		this.player.rotation.y -= Math.PI/2;
		this.firstPersonCamera.rotation.x += 0.1;
        scene.add(this.player);

	}


	InteractionSignal(){

		if(!this.dead){

			this.raycaster.setFromCamera( new THREE.Vector2(), this.firstPersonCamera );

			if(app.chunkManager.nowChunk != undefined){

				var objects = this.raycaster.intersectObjects(app.chunkManager.pickableItems);
				if (objects.length>0) {

					this.ispointingToItem = true;

					for (var i in objects) {

						this.pointingToObject = objects[0].object;
								
					}

				} 
				else{

					this.ispointingToItem = false;
				}
				
				this.action();

			}
		}
		

	}

	action(){

		if(this.pointingToObject != null){

			if(this.pointingToObject.name == "switch_sensor" || this.pointingToObject.name == "switch_sensor_1" || 
			this.pointingToObject.name == "down_button_sensor" || this.pointingToObject.name == "up_button_sensor" || 
			 this.pointingToObject.name == "switch_sensor_5" || this.pointingToObject.name == "lock_sensor"){

				this.pointingObjectsMachine = this.pointingToObject.parent.parent;

				if(app.chunkManager.nowChunk.machines.length > 0){

					app.chunkManager.nowChunk.machines.forEach(machine => {

						if(machine.uuid == this.pointingObjectsMachine.uuid){

							if(this.pointingToObject.name.startsWith("switch_sensor")){

								if(!machine.isOn){

									this.pointingToObject = null;
									machine.turnMachineOn();

								}

							}

							else if(this.pointingToObject.name == "down_button_sensor"){

								createjs.Sound.play("arrowSound");

								if(app.world.isHaveCurrent){

									this.pointingToObject = null;
									machine.rotateCarousell(1);

								}
								else{

									app.gameManager.popupMaker.createPopup("There is no electricity in the mine!", "warning");

								}

							}

							else if(this.pointingToObject.name == "up_button_sensor"){

								createjs.Sound.play("arrowSound");

								if(app.world.isHaveCurrent){

									this.pointingToObject = null;
									machine.rotateCarousell(-1);

								}
								else{

									app.gameManager.popupMaker.createPopup("There is no electricity in the mine!", "warning");

								}

							}

						}

					});

				}

				else if(this.pointingToObject.name == "lock_sensor"){

					this.pointingToObject = null;

					if(app.chunkManager.nowChunk.hasOwnProperty("mainDoor")){

						app.chunkManager.nowChunk.mainDoor.unlock();

					}

				}
			}

			else{

				this.pickupOrDropItem();

			}

		}

	}

	pickupOrDropItem(){

		if(this.ispointingToItem && this.objectPickedUp == null){

			this.pickupItem();

		} else if(this.objectPickedUp != null){

			this.dropItem();

		}
	}

	pickupItem(){
		
		this.objectPickedUp = this.pointingToObject;
		this.itemPickedUpFromChunk = app.chunkManager.nowChunk;
		this.pickedObjectIndex = app.chunkManager.nowChunk.items.indexOf(this.objectPickedUp);
		this.realParent = this.objectPickedUp.parent;

		if(this.objectPickedUp!= null){

			if(this.usableItems.length >= 1 && (this.objectPickedUp.material.name == "magnum" ||
			this.objectPickedUp.material.name == "shotgun.003" || this.objectPickedUp.material.name == "medicine" 
			|| this.objectPickedUp.material.name == "grenade" || this.objectPickedUp.material.name == "shotgun_ammo" 
			|| this.objectPickedUp.material.name == "magnum_ammo")){

				createjs.Sound.play("itemSound");

				this.usableItemPos = 2.5;

				app.chunkManager.nowChunk.machines.forEach(machine => {

					if(machine.name == "manufacturing_machine"){

						machine.manufacturedItems.forEach(item => {

							if( this.objectPickedUp != null && (this.objectPickedUp.material.name == "shotgun_ammo" || this.objectPickedUp.material.name == "magnum_ammo")){

								this.pickupAmmo(this.objectPickedUp.parent.name, item, machine);

							} else{

								this.tempObjectPickedUp = this.objectPickedUp;

								if( this.objectPickedUp != null && this.objectPickedUp.material.name != "medicine" && this.objectPickedUp.material.name != "grenade" ){
	
									if(this.usableItems.length <= this.maxInHand ){
	
										item.visual = document.getElementById(item.name);

										this.pointers.childNodes[1].style.display = "inline-block";
										this.pointers.childNodes[3].style.display = "none";

										if(item.name == "magnum"){

											item.hideVisual = document.getElementById("shotgun");

										}else{

											item.hideVisual = document.getElementById("magnum");

										}

										item.displayVisual();
										item.bulletVisual = item.visual.children[1];
										item.ammoBoxVisual = item.visual.children[2].children[1];
										item.freshVisuals();
										this.usableItems.push(item);
										this.guns.push(item);
										this.pickUpAndPutInHand(item);
										deleteFromArray(machine.manufacturedItems, item );
	
									}
									else{

										this.objectPickedUp = null;
										app.gameManager.popupMaker.createPopup("You cant hold more thing in your hand!", "warning");

									}
								}
								else{
	
									if(this.inventory.isHaveSpace()){
	
										this.pickUpAndPutInHand(item);
										deleteFromArray(machine.manufacturedItems, item );
										this.putInInventory(item);
	
									}
									else{

										this.objectPickedUp = null;
										app.gameManager.popupMaker.createPopup("You not have enough space in inventory", "warning");

									}
	
	
								}
	
							}

						})

					}
					
				});

			}

			else{

				if(this.objectPickedUp.parent.name == "oil_lamp"){

					this.playerMesh.getWorldPosition(this.lampWorldPos);

					this.player.add(this.objectPickedUp.parent);

					this.objectPickedUp.parent.translateZ(-17.7);
					
					this.objectPickedUp.parent.translateX(12);
					this.objectPickedUp.parent.translateY(-3.6);

					app.missionManager.nextMission("grab_the_lamp_with_E_button");

					createjs.Sound.play("pickupOilLampSound");
					
					this.objectPickedUp = null;
					
				} 
				else{

					this.objectPickedUp.position.set(this.firstPersonCamera.position.x, this.firstPersonCamera.position.y-0.5, this.firstPersonCamera.position.z+4);
	
					if(this.objectPickedUp.material.name == "wood"){
						createjs.Sound.play("pickupThings");
						this.objectPickedUp.rotation.set(Math.PI/2,Math.PI/2,0);
						this.player.add(this.objectPickedUp);
					}

					else if(this.objectPickedUp.name == "main_door_key"){

						this.pickupKey(this.objectPickedUp);
						this.objectPickedUp = null;

					}
					else{

						if(this.objectPickedUp.material.name == "plant"){
							this.objectPickedUp.rotation.set(-Math.PI/2,0,0);
							this.objectPickedUp.position.y -= 1;
						}
						else{
							this.objectPickedUp.rotation.set(0,0,0);
						}

						createjs.Sound.play("pickupThings");
			
						this.player.add(this.objectPickedUp);
	
						if(this.objectPickedUp.material.name == "shotgun_part" && this.oncePickedUpGunPart){
							this.oncePickedUpGunPart = false;
							app.missionManager.nextMission("find_shotgun_part");
						}
						else if(this.objectPickedUp.material.name == "magnum_part" && !this.oncePickedUpGunPart ){
							this.oncePickedUpGunPart = true;
							app.missionManager.nextMission("find_magnum_part");
						}

					}

				}	

			}
	
		}

		if(this.objectPickedUp != null){

			this.objectPickedUp.updateMatrix();

		}

	}

	pickUpAndPutInHand(item){

		if(this.tempObjectPickedUp != null){

			this.objectPickedUp = item.mesh;
			this.tempObjectPickedUp.parent.rotation.set(0,0,0);
			this.tempObjectPickedUp.parent.position.set(this.firstPersonCamera.position.x+this.usableItemPos, this.firstPersonCamera.position.y-1.4, this.firstPersonCamera.position.z-3.8);
			this.firstPersonCamera.add(this.tempObjectPickedUp.parent);
			this.tempObjectPickedUp = null;
			
			this.activeItemIndex = this.usableItems.length-1;
			if(this.usableItems[this.activeItemIndex].hasOwnProperty("active")){
				this.usableItems[this.activeItemIndex].active = true;
			}

		}

	}

	pickupAmmo(ammoType, item, machine){

		this.objectPickedUp = null;

		if(this.ammoBoxQuantity[ammoType] < 10){

			if(ammoType == "magnum_ammo"){

				this.ammoBoxQuantity.magnum_ammo++;
	
			}
			else{
	
				this.ammoBoxQuantity.shotgun_ammo++;
	
			}

			this.guns.forEach(gun => {

				gun.freshVisuals();

			});

			destroyObject(item.mesh, scene);
			deleteFromArray(machine.manufacturedItems, item);
			deleteFromArray(machine.inChunk.items, item.mesh);

			app.chunkManager.margeCloseChunkItems();

		}
		else{

			app.gameManager.popupMaker.createPopup("You can't pickup more of this ammo box!", "warning");

		}
	}

	pickupKey(item){

		app.chunkManager.chunks.forEach((chunk)=> {

			chunk.items.forEach(keyItem => {
				if(keyItem == item){
					app.assetManager.keyLight.color.setHex(0x000000);
					createjs.Sound.play("pickupKeySound");
					deleteFromArray(chunk.items, keyItem);
					destroyObject(keyItem, scene);
				}
			})
		});

		app.gameManager.popupMaker.createPopup("You found the Main door Key!", "mission_completed");

		this.isHaveKey = true;

	}

	putInHand(index){

		if(this.usableItems.length <= this.maxInHand){

			if(this.inventory.items[index-1] != 0 && typeof(this.inventory.items[index-1]) == "object"){
	
				this.item = this.inventory.items[index-1];
				this.mesh = this.item.mesh;
				this.objectPickedUp = this.mesh;
				this.nowItem = this.usableItems[this.activeItemIndex];
				this.usableItems.push(this.item);
				this.inventory.deleteFromInventory(this.item, index);
				createjs.Sound.play("putInHandSound");

				this.pointers.childNodes[1].style.display = "none";
				this.pointers.childNodes[3].style.display = "inline-block";

				if(this.nowItem != "hand"){


					if(this.nowItem != undefined){
						this.nowItem.mesh.parent.position.x = 100;
					}

				}


				this.usableItemPos = 2.5;

				this.mesh.parent.position.x = this.firstPersonCamera.position.x+this.usableItemPos;


				this.activeItemIndex = this.usableItems.length-1;
				if(this.usableItems[this.activeItemIndex].hasOwnProperty("active")){
					this.usableItems[this.activeItemIndex].active = true;
				}

			}
			else{

				app.gameManager.popupMaker.createPopup("You have nothing in this place:" + index, "warning");

			}


		}

		else{

			app.gameManager.popupMaker.createPopup("You cant hold more thing in your hand!", "warning");
			
		}
		
	}

	checkDamage(){

        if(app.enemyManager.enemies.length > 0){
            app.enemyManager.enemies.forEach(enemy => {

                enemy.bullets.forEach(bullet =>{
                    if(this.collideBox.distanceToPoint ( bullet.position ) == 0){

                        this.decrementLife(1);
                        destroyObject(bullet, scene);
                        deleteFromArray(enemy.bullets, bullet);

                    }
                })
                
            });
        }
    }

	playDamageVisual(){

		this.damageDiv.style.display = "inline-block";

		setTimeout(()=>{
			this.damageDiv.style.display = "none";
		}, 200);

	}

	isInUsableItems(item, index){

		if(this.item.hasOwnProperty("name")){
			return item.name == this.usableItems[index-1].name;
		}

	}
	putInInventory(item){

		if(item != "hand" && (item.mesh.material.name == "medicine" || item.mesh.material.name == "grenade")){ 

			if(this.inventory.isHaveSpace()){
	
				this.usableItemPos = 100;
				this.objectPickedUp = null;
				deleteFromArray(this.usableItems, item);
				this.activeItemIndex = this.usableItems.length-1;
				item.mesh.parent.position.x = this.usableItemPos;
				this.inventory.putInside(item);

			}
			else{

				app.gameManager.popupMaker.createPopup("You not have enough space in inventory", "warning");

			}

		}
		else{

			app.gameManager.popupMaker.createPopup("Nothing to put in invenory", "warning");

		}
		
	}

	decrementLife(amount){

		if(this.life > 0){

			this.playDamageVisual();
			createjs.Sound.play("playerDamageSound");

			this.life -= amount;
			
			if(this.life < 0){

				this.life = 0;

			}
			else{

				this.width = mapRange(this.life, 0, 30, 0, 100);

				this.hpBar.style.width = this.width+"%";

			}

		}

	}

	incrementLife(){
		   
		this.life = 30;
		this.hpBar.style.width = "100%";

	}

	dropItem(){

		if(this.objectPickedUp != null && this.objectPickedUp.hasOwnProperty("material") && this.objectPickedUp.material.name != "magnum" 
		 && this.objectPickedUp.material.name != "shotgun.003" && this.objectPickedUp.material.name != "medicine" && this.objectPickedUp.material.name != "grenade"){

			createjs.Sound.play("putInGoundSound");

			this.objectPickedUp.position.y -= 8.5;
			this.objectPickedUp.updateMatrix();

			if(this.itemPickedUpFromChunk != app.chunkManager.nowChunk){

				app.chunkManager.nowChunk.items.push(this.objectPickedUp);

				deleteFromArray(this.itemPickedUpFromChunk.items, this.objectPickedUp);
				app.chunkManager.margeCloseChunkItems();

			}

			scene.attach(this.objectPickedUp);

			if(app.chunkManager.nowChunk.rockProcessingMachine != null){

				app.chunkManager.nowChunk.rockProcessingMachine.insideRockSensor();
				app.chunkManager.nowChunk.rockProcessingMachine.insideCoalSensor();

			}
			if(app.chunkManager.nowChunk.manufacturingMachine != null){

				app.chunkManager.nowChunk.manufacturingMachine.insideMaterialSensor();

			}

			this.objectPickedUp = null;

		}

	}

	changeUsableItems(direction){

		if(this.objectPickedUp == null || this.usableItems[this.activeItemIndex] != undefined && this.usableItems[this.activeItemIndex].hasOwnProperty("usableItem")){

			this.nowItem = this.usableItems[this.activeItemIndex];

			if(direction == -1){

				this.activeItemIndex++;
	
				if(this.activeItemIndex > this.usableItems.length-1){
	
					this.activeItemIndex = 0;
		
				}
			}
			else{
	
				this.activeItemIndex--;
	
				if(this.activeItemIndex < 0){
	
					this.activeItemIndex = this.usableItems.length-1;
	
				}	
	
			}

			if(this.usableItems.length > 1){

				createjs.Sound.play("changeItemInHandSound");

			}

			if(this.usableItems[this.activeItemIndex].__proto__.hasOwnProperty("shoot")){

				this.pointers.childNodes[1].style.display = "inline-block";
				this.pointers.childNodes[3].style.display = "none";

				this.usableItems[this.activeItemIndex].displayVisual();

			}else{

				this.pointers.childNodes[1].style.display = "none";
				this.pointers.childNodes[3].style.display = "inline-block";

				if(this.nowItem.__proto__.hasOwnProperty("shoot")){

					this.nowItem.hideVisuals();
					
				}

			}

			if(this.nowItem != "hand"){

				this.nowItem.mesh.parent.position.x = 100;

				if(this.nowItem.active){

					this.nowItem.active = false;

					if(this.usableItems[this.activeItemIndex].hasOwnProperty("active")){
						this.usableItems[this.activeItemIndex].mesh.parent.position.x = 2.5;
					}

				}

				
				else if(this.usableItems[this.activeItemIndex].hasOwnProperty("active") && !this.usableItems[this.activeItemIndex].active){

					this.usableItems[this.activeItemIndex].active = true;
					this.usableItems[this.activeItemIndex].mesh.parent.position.x = 2.5

				}

			}

			else if(this.nowItem == "hand" && this.usableItems[this.activeItemIndex].hasOwnProperty("active")){

				this.usableItems[this.activeItemIndex].mesh.parent.position.x = 2.5;
				this.usableItems[this.activeItemIndex].active = true;

			}

			
			if(this.usableItems[this.activeItemIndex] == "hand"){
				this.objectPickedUp = null;
			}
			else{
				this.objectPickedUp = this.usableItems[this.activeItemIndex];
			}
	
		}

	}
	
	death(){

		createjs.Sound.play("playerDiedSound");
		app.gameManager.gameOver();

	}

	restart(){

		this.dead = false;
		this.clearGunQuantities();
		this.clearHand();
		this.life = 30;
		this.hpBar.style.width = "300px";

	}

	clearHand(){

		if(this.usableItems.length > 1){

			this.usableItems.forEach(item => {

				if(!item.__proto__.hasOwnProperty("shoot") && item != "hand"){
	
					destroyObject(item.mesh, scene);
					deleteFromArray(this.usableItems, item);
	
				}
				
			});

		}

	}

	clearGunQuantities(){

		if(this.guns.length > 0){

			this.ammoBoxQuantity = {
				shotgun_ammo: 0,
				magnum_ammo: 0
			};
			
			this.guns.forEach(gun => {
	
				gun.bulletQuantity = 0;
				gun.freshVisuals();
	
			});
	

		}

	}

	makeListener(){

		this.listener = new THREE.AudioListener();
		this.firstPersonCamera.add( this.listener );

	}

	useItem(){

		if(this.usableItems[this.activeItemIndex] != undefined && this.usableItems[this.activeItemIndex].hasOwnProperty("canUse") ){


			if(this.usableItems[this.activeItemIndex].name == "grenade"){

				this.usedItems.push(this.usableItems[this.activeItemIndex]);
				this.canUseItem = true;
				this.index = this.usedItems.indexOf(this.usableItems[this.activeItemIndex]);
				this.usedItems[this.index].indexInUsedItems = this.index;

			}else if(this.usableItems[this.activeItemIndex].name == "medicine"){

				if(this.life == 30){

					app.gameManager.popupMaker.createPopup("You can't use medicine, your HP is on maximum!", "warning");

					this.canUseItem = false;
				}
				else{
					this.canUseItem = true;
				}
			}

			if(this.canUseItem){

				this.usableItems[this.activeItemIndex].use();
				deleteFromArray(this.usableItems, this.usableItems[this.activeItemIndex]);
				this.objectPickedUp = null;
				this.handIndex = this.usableItems.indexOf("hand");
				this.activeItemIndex = this.handIndex;

			}
			
		}
	}

	update(delta, objectCollisions){

		if(this.life <= 0){

			this.onceDeath = true;
			this.dead = true;

		}

		
		if(!this.dead){

			this.collideBox.copy( this.colliderplayerMesh.geometry.boundingBox ).applyMatrix4( this.colliderplayerMesh.matrixWorld );

			this.checkDamage();

			for(let i=0; i < this.axes.length; i++){

				this.axis = this.axes[i];

				if (this.velocity[this.axis] !== 0) {
					this.velocity[this.axis] /= (1 + this.friction);
				}
				if (
					(this.velocity[this.axis] < .2 && this.velocity[this.axis] > 0) ||
					(this.velocity[this.axis] > -.2 && this.velocity[this.axis] < 0)
				) {
					this.velocity[this.axis] = 0;
				}

			}

			this.restrict = {

				x: {pos: false, neg: false},
				y: {pos: false, neg: false},
				z: {pos: false, neg: false}
	
			};

			if (objectCollisions) {

				for(let i=0; i < objectCollisions.length; i++){

					this.collision = objectCollisions[i];

					this.normal = this.collision.face.normal;
					this.normalMatrix = new THREE.Matrix3().getNormalMatrix( this.collision.object.matrixWorld );
					this.globalNormal = this.normal.clone().applyMatrix3( this.normalMatrix ).normalize();
					this.collisionObjectPosition.setFromMatrixPosition( this.collision.object.matrixWorld );
					this.playerObjectPosition = this.player.position;

					for(let i=0; i < this.axes.length; i++){

						this.axis = this.axes[i];

						if (this.globalNormal[this.axis] == -1){

							this.restrict[this.axis].pos = true;

						} 
						if (this.globalNormal[this.axis] == 1){

							this.restrict[this.axis].neg = true;

						}

					}

				}

			}

			for(let i=0; i < this.axes.length; i++){

				this.axis = this.axes[i];

				if (
					(this.velocity[this.axis] > 0 && !this.restrict[this.axis].pos) ||
					(this.velocity[this.axis] <= 0 && !this.restrict[this.axis].neg)
				) {

					this.player.position[this.axis] += this.velocity[this.axis] * delta;

				} else {
		
					this.velocity[this.axis] = 0;
				}

			}

			if(this.usedItems.length > 0){

				this.usedItems.forEach(item => {

					item.update();

				});

			}

		} else {
			
			if(this.onceDeath){
				this.onceDeath = false;
				this.death();
			}
		}

    }

	addVelocity(dimensionKey, amount, relativeToCage = false){

		if (relativeToCage) {

			amount = amount / 10;
			this.player.getWorldDirection(this.direction);
			if (dimensionKey == 'x') {

				this.direction.applyAxisAngle( this.dirAxis, this.angle );

			}
			this.velocity.z += (amount * this.direction.z);
			this.velocity.x += (amount * this.direction.x);

		}

    }

}