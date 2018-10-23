import path from 'path'
import 'three/examples/js/loaders/ColladaLoader'
import 'three/examples/js/loaders/LoaderSupport'
import 'three/examples/js/loaders/MTLLoader'
import 'three/examples/js/loaders/OBJLoader'

export class ModelsLoader {

    static MODELS_EXTENSION = {
        COLLADA: '.dae',
        OBJ: '.obj'
    };

    constructor (loadingManager, onSceneLoaded) {
        this.loadingManager = loadingManager;
        this.onSceneLoaded = onSceneLoaded;
    }

    load (modelsData) {
        Object.keys(modelsData).forEach(key => {
            const modelData = modelsData[key];
            if (!modelData.hasOwnProperty('name')) modelData.name = key;
            const extention = path.extname(modelData.filename);
            switch (extention) {
                case ModelsLoader.MODELS_EXTENSION.COLLADA: {
                    this.loadCollada(modelData);
                    break;
                }
                case ModelsLoader.MODELS_EXTENSION.OBJ: {
                    this.loadOBJ(modelData);
                    break;
                }
                default: {
                    throw  `Aucun loader n'a été défini pour l'extension ${extention}`;
                }
            }
        });
    }

    loadCollada (modelData) {
        const loader = new THREE.ColladaLoader(this.loadingManager);
        loader.load(`./../models/${modelData.filename}`, collada => {
            this.onSceneLoaded(collada.scene);
        });
    }

    loadOBJ (modelData) {
        const mltLoader = new THREE.MTLLoader(this.loadingManager);
        mltLoader.load(`./models/${modelData.filename.replace('.obj', '.mtl')}`, materials => {
            materials.preload();
            const objLoader = new THREE.OBJLoader(this.loadingManager);
            objLoader.setMaterials(materials).load(`./models/${modelData.filename}`, obj => {
                this.onSceneLoaded(obj);
            });
        });
    }

}