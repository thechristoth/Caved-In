class World{

    init(){

        this.HemisphereLight = new THREE.HemisphereLight( 0xffffff, 0xffffff );
        this.HemisphereLight.position.set( 0, 300, 0 );
        this.dirLight = new THREE.DirectionalLight( 0xffffff );
        this.dirLight.position.set( 75, 300, -75 );
        this.scene = app.composition.scene;
        this.friction = .4;
        this.isHaveCurrent = true;

    }

}