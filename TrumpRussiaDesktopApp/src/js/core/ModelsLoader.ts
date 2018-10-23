import * as path from 'path';
import 'three/examples/js/loaders/ColladaLoader';
import 'three/examples/js/loaders/LoaderSupport';
import 'three/examples/js/loaders/MTLLoader';
import 'three/examples/js/loaders/OBJLoader';
import { LoadingManager, MTLLoader, ColladaLoader, OBJLoader, Object3D, MaterialCreator } from 'three';

export class ModelsLoader {

  private readonly loadingManager: LoadingManager;
  private readonly onSceneLoaded: (scene: Object3D) => void;

  static MODELS_EXTENSION = {
    COLLADA: '.dae',
    OBJ: '.obj',
  };

  constructor(loadingManager: LoadingManager, onSceneLoaded: (scene: Object3D) => void) {
    this.loadingManager = loadingManager;
    this.onSceneLoaded = onSceneLoaded;
  }

  load (modelsData: any) {
    Object.keys(modelsData).forEach((key: string) => {
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

  loadCollada (modelData: any) {
    // @ts-ignore
    const loader = new ColladaLoader(this.loadingManager);
    loader.load(`./../models/${modelData.filename}`, (collada: any) => {
      this.onSceneLoaded(collada.scene);
    });
  }

  loadOBJ (modelData: any) {
    const mltLoader = new MTLLoader(this.loadingManager);
    mltLoader.load(`./models/${modelData.filename.replace('.obj', '.mtl')}`, (materials: MaterialCreator) => {
      materials.preload();
      const objLoader = new OBJLoader(this.loadingManager);
      objLoader.setMaterials(materials);
      objLoader.load(`./models/${modelData.filename}`, (obj: Object3D) => {
        this.onSceneLoaded(obj);
      });
    });
  }

}
