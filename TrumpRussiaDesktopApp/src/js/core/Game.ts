import {
  Clock,
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
import { DAT_GUI } from '../utils/DatGui';
import { CONFIG } from '../config';

export class Game {

  private static instance: Game = null;

  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private camerasManager: CamerasManager;
  private envelopesManager: EnvelopesManager;
  private effectManager: EffectManager;
  private clock: Clock;

  private constructor () {}

  static getInstance () {
    if (this.instance === null) this.instance = new Game();
    return this.instance;
  }

  public getEffectManager () {
    return this.effectManager;
  }

  init (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.camerasManager = new CamerasManager(this.scene, this.camera);
    this.envelopesManager = new EnvelopesManager(this.scene);
    this.effectManager = new EffectManager(this.scene, this.camera, this.renderer, this.width, this.height);
    this.initModels(() => this.onInitDone());
    this.initSocketListeners();
  }

  initSocketListeners () {
    SOCKET.getInstance().on('camera:orientation', (data: Orientation) => this.camerasManager.changeOrientation(data));
    SOCKET.getInstance().on('camera:set', (id: number) => this.camerasManager.setCamera(id));
    SOCKET.getInstance().on('timer:end', this.setTimerEnd.bind(this));
    SOCKET.getInstance().on('camera:zoom', this.changeZoom.bind(this));
  }

  resize (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.effectManager.getComposer().setSize(window.innerWidth, window.innerHeight);
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

  animate (callback: () => void = null) {
    requestAnimationFrame(this.animate.bind(this, callback));
    this.envelopesManager.checkCibling(this.camera, this.effectManager.getOutlinePass());
    if (CONFIG.DEBUG_MODE) DAT_GUI.render();
    this.effectManager.getComposer().render(this.clock.getDelta());
  }

  changeZoom(data: any) {
    this.camerasManager.changeZoom(data.zoom);
  }

  setTimerEnd () {
    PAGES.show('timer-end');
  }
}
