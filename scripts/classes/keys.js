class Keys{

    init(){

		this.keyCode = null;
		this.body = app.gameManager.body;

		this.player = app.player;

		this.maxRotation = Math.PI/2;

		this.onceLoadSound = true;
		this.onceAddMouseMove = true;

        this.states = {

            forward: false,
            backward: false,
            left: false,
            right: false,
            i_pressed_info: false,
			h_pressed_info: false,
			escape_pressed: true,
			dot_pressed: false

        }

		document.addEventListener('keydown', this, false);
		document.addEventListener('keyup', this, false);
		window.addEventListener('resize', this, false);
		document.addEventListener("mousedown", this, false);
		document.addEventListener("click", this, false);
		document.addEventListener('wheel', this, false);
		document.addEventListener('pointerlockchange', this, false);

    }

	goToPage(href){

        window.location.href = href;
    
    }

	handleEvent(e) {

		this.keyCode = e.which || e.keyCode;
        this['on' + e.type](e);
    }

	onpointerlockchange(){

		if(this.states.escape_pressed){
			this.states.escape_pressed = false;
		}
		else{
			this.states.escape_pressed = true;
		}

		if(app.gameManager.infoIsShowing && this.states.escape_pressed){

			app.gameManager.hideInfo();

		}else if(!app.gameManager.infoIsShowing && this.states.escape_pressed){

			app.gameManager.pouseGame();

		}
		
	}

	onresize(){

		app.player.firstPersonCamera.aspect = window.innerWidth / window.innerHeight;
		app.player.firstPersonCamera.updateProjectionMatrix();

		app.composition.renderer.setSize(window.innerWidth, window.innerHeight);

		if(app.composition.hasOwnProperty("fxaaPass")){

			app.composition.resizeAntialias();

		}

	}

	
	onmousemove(e){

		if(document.pointerLockElement === this.body){

			this.playerCameraRotationX = app.player.firstPersonCamera.rotation.x;
			this.amtX = e.movementX;
			this.amtY = e.movementY;
			app.player.player.rotation.y -= 0.002*this.amtX;
			this.playerCameraRotationX += 0.002*this.amtY;
			app.player.firstPersonCamera.rotation.x = clamp(this.playerCameraRotationX, -this.maxRotation, this.maxRotation);

		}

	}

	onmousedown(e){

		if(e.button === 0){
			if(this.states.escape_pressed){

				if(this.onceAddMouseMove){

					document.addEventListener("mousemove", this, false);
					this.onceAddMouseMove = false;

				}

				this.body.requestPointerLock();
				if(!app.gameManager.infoIsShowing){
					app.gameManager.guiElements.style.display = "inline-block";
					app.gameManager.startGame();
				}

			}
		};
		
	}

	onclick(e){

		if(this.onceLoadSound){

			this.onceLoadSound = false;
			app.assetManager.loadSounds();
			app.player.makeListener();
			app.gameManager.createBackgroundMusic();	

		}

		if(e.which == 1){

			if(app.player.usableItems.length != 0){

				if(app.player.usableItems[app.player.activeItemIndex] != undefined && app.player.usableItems[app.player.activeItemIndex] != "hand" &&
				 app.player.usableItems[app.player.activeItemIndex].__proto__.hasOwnProperty("shoot")){

					app.player.usableItems[app.player.activeItemIndex].shoot();
	
				}
				else{

					app.player.useItem();

				}
	
			}

		}

	}

	

	onwheel(e){

		app.player.changeUsableItems(Math.sign(e.deltaY))

	}

	onkeydown() {

	 	if (this.keyCode == 87) {
			this.states.forward = true;

		} else if (this.keyCode == 83) {
			this.states.backward = true;

		}else if (this.keyCode == 65) {
			this.states.left = true;

		}else if (this.keyCode == 69) {

			app.player.InteractionSignal();

		}else if (this.keyCode == 66) {

			this.goToPage("/screens/menu.html");

		}else if (this.keyCode == 27) {
			
			if(app.gameManager.pouseScreenIsShowing){

				this.goToPage("/screens/menu.html");

			}else if(!app.gameManager.pouseScreenIsShowing && !app.gameManager.infoIsShowing && this.states.escape_pressed){

				app.gameManager.pouseGame();

			}else if(app.gameManager.infoIsShowing){
				app.gameManager.guiElements.style.display = "inline-block";
				app.gameManager.hideInfo();
				app.gameManager.startGame();
			}

		}else if (this.keyCode == 68) {

			this.states.right = true;

		}else if (this.keyCode == 190) {

			if(this.states.dot_pressed){

				app.gameManager.hideStats();
				this.states.dot_pressed = false;
				
			}
			else{
				
				app.gameManager.showStats();
				this.states.dot_pressed = true;

			}

		}
		else if (this.keyCode == 73) {

			app.gameManager.showControlsInfo();
			
		}else if (this.keyCode == 81) {

			app.player.putInInventory(app.player.usableItems[app.player.activeItemIndex])
			
		}else if (this.keyCode == 72) {

			app.gameManager.showMaterialInfo();
			
		}else if (this.keyCode == 82) {

			if(app.player.dead){

				app.gameManager.restart();

			}

			if(app.player.usableItems.length != 0){

				if(app.player.usableItems[app.player.activeItemIndex] != undefined && app.player.usableItems[app.player.activeItemIndex] != "hand" &&
				 app.player.usableItems[app.player.activeItemIndex].__proto__.hasOwnProperty("shoot")){
	
					app.player.usableItems[app.player.activeItemIndex].reLoad();
	
				}
	
			}
			
		}	
			

    }
	onkeyup() {

		if (this.keyCode == 87) {
			this.states.forward = false;

		} else if (this.keyCode == 83) {
			this.states.backward = false;

		} else if (this.keyCode == 65) {
			this.states.left = false;

		} else if (this.keyCode == 68) {
			this.states.right = false;

		} else if (this.keyCode == 69) {
			this.states.e_pressed_info = false;
			
		} else if (this.keyCode >= 49 && this.keyCode < 54) {

			app.player.putInHand(String.fromCharCode(this.keyCode));

		} 

    }

}