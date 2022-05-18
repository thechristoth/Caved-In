class ModelLoader{

    async loadModel(src){
        
        this.src = src;

        this.loader = app.assetManager.modelLoader;

        this.model = await this.loader.loadAsync(src);

        return this.model;

    }

}