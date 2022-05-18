class Composition{

    init() {

        this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.1, 3000 );
		this.camera.position.z = -70;
		this.camera.position.y = 300;
		this.camera.position.x += -150;
		this.firstSetCamera = true;
		this.camera.rotation.x = Math.PI / 4;
		this.clock = new THREE.Clock();
		this.activeCamera = this.camera;
		this.canRender = false;
		this.pixelRatio = window.devicePixelRatio;
		this.renderer = new THREE.WebGLRenderer({

			powerPreference: "high-performance",

		});
		this.renderer.autoClear = false;
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
		window.scene = this.scene; 

    }

	makeEffects(){

		this.composer = new THREE.EffectComposer( this.renderer );
		this.renderPass = new THREE.RenderPass(this.scene, this.activeCamera);
		this.composer.addPass( this.renderPass );
	
		if(this.isHaveEffect()){

			if(app.getSetting(app.settings.graphics.bloom)){

				this.makeBloomEffect();

			}
			if(app.getSetting(app.settings.graphics.filmeffect)){

				this.makeFilmEffect();

			}

			if(app.settings.graphics.antialiasing){

				this.makeAntiAliasing();

			}

		}

		this.canRender = true;

	}

	isHaveEffect(){

		if(app.getSetting(app.settings.graphics.bloom) || app.getSetting(app.settings.graphics.filmeffect)
			|| app.getSetting(app.settings.graphics.antialiasing)){

			return true;

		}
		else{

			return false;

		}
		
	}

	makeFilmEffect(){

		this.filmEffect = new THREE.FilmPass(

			0.4,   // noise intensity
			0.025,  // scanline intensity
			648,    // scanline count
			false,  // grayscale
		);

		this.composer.addPass( this.filmEffect );

	}

	makeAntiAliasing(){

		this.pixelRatio = this.renderer.getPixelRatio();

		this.fxaaPass = new THREE.ShaderPass( THREE.FXAAShader );
		
		this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * this.pixelRatio );
		this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * this.pixelRatio );

		this.fxaaPass.renderToScreen = true;
		this.composer.addPass(this.fxaaPass);

	}

	resizeAntialias(){


		this.pixelRatio = this.renderer.getPixelRatio();
		this.fxaaPass.material.uniforms[ 'resolution' ].value.x = 1 / ( window.innerWidth * this.pixelRatio );
		this.fxaaPass.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * this.pixelRatio );

	}

	makeBloomEffect(){

		this.bloomEffect = new THREE.UnrealBloomPass(

			new THREE.Vector2(window.innerWidth, window.innerHeight),
			1.5,
			0.4,
			0.85
		);

		this.bloomEffect.threshold = 0.15;
		this.bloomEffect.strength = 0.3;
		this.bloomEffect.radius = 0.9;

		this.composer.addPass( this.bloomEffect );

	}

    update() {

		if(app.player.firstPersonCamera){

			if(this.firstSetCamera){

				this.activeCamera = app.player.firstPersonCamera;
				this.makeEffects();
				this.firstSetCamera = false;

			}
			
		}

		if(this.canRender){

			this.composer.render();

		}

    }
}