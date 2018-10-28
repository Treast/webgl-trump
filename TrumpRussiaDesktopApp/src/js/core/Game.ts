import {
  LoadingManager,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { ModelsLoader } from './ModelsLoader';
import { MODELS_DATA } from '../data/models';
import { PAGES } from '../utils/Pages';
import { CamerasManager } from './CamerasManager';
import { EnvelopesManager } from './EnvelopesManager';
import { Orientation } from '../typing';
import { EffectManager } from './EffectManager';
import { SOCKET } from './Socket';

export class Game {

  private width: number;
  private height: number;
  private readonly camera: PerspectiveCamera;
  private readonly scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private camerasManager: CamerasManager;
  private envelopesManager: EnvelopesManager;
  private effectManager: EffectManager;

  constructor (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.camerasManager = new CamerasManager(this.scene, this.camera);
    this.envelopesManager = new EnvelopesManager(this.scene);
    this.effectManager = new EffectManager(this.scene, this.camera, this.renderer, this.width, this.height);
  }

  resize (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.effectManager.getComposer().setSize(window.innerWidth, window.innerHeight);
  }

  animate (callback: () => void = null) {
    requestAnimationFrame(this.animate.bind(this, callback));
    this.envelopesManager.checkCibling(
      this.camera,
      this.effectManager.getOutlinePass(),
    );
    this.effectManager.getComposer().render();
  }

  init () {
    this.initModels(() => this.onInitDone());
    this.initSocketListeners();
  }

  initSocketListeners () {
    SOCKET.getInstance().on('mobile:orientation', (data: Orientation) => this.camerasManager.changeOrientation(data));
    SOCKET.getInstance().on('camera:set', (id: number) => this.camerasManager.setCamera(id));
    SOCKET.getInstance().on('timer:end', this.setTimerEnd.bind(this));
    SOCKET.getInstance().on('mobile:zoom', this.changeZoom.bind(this));
  }

  changeZoom(data: any) {
    this.camerasManager.changeZoom(data.zoom);
  }

  onInitDone () {
    this.effectManager.init();
    this.envelopesManager.init();
    this.camerasManager.init();
    this.camerasManager.setCamera(0);
  }

  initModels (onLoaded: () => void) {
    this.loaderManager = new LoadingManager();
    // this.loaderManager.onProgress = this.onModelsLoadingProgress.bind(this);
    this.loaderManager.onLoad = onLoaded;
    const modelsLoader = new ModelsLoader(
      this.loaderManager,
      (scene: Scene) => {
        this.scene.add(scene);
      },
    );
    modelsLoader.load(MODELS_DATA);
  }

  setTimerEnd () {
    PAGES.show('timer-end');
  }
}
