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
import CamerasManager from './CamerasManager';
import EnvelopesManager from './EnvelopesManager';
import { Orientation, TimerValue } from '../typing';
import EffectManager from './EffectManager';
import { SOCKET } from './Socket';
import { DAT_GUI } from '../utils/DatGui';
import { CONFIG } from '../config';

class Game {
  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private clock: Clock;
  private timer: any;

  init (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.clock = new Clock();
    this.timer = document.getElementById('timer');
    EnvelopesManager.setScene(this.scene);
    EffectManager.initStatus(this.scene, this.camera, this.renderer, this.width, this.height);
    this.initModels(() => this.onInitDone());
    this.initSocketListeners();
  }

  initSocketListeners () {
    SOCKET.getInstance().on('camera:orientation', (data: Orientation) => CamerasManager.changeOrientation(data));
    SOCKET.getInstance().on('camera:set', (id: number) => CamerasManager.setCamera(id));
    SOCKET.getInstance().on('timer:end', this.onTimerEnd.bind(this));
    SOCKET.getInstance().on('timer:change', this.onTimerChange.bind(this));
    SOCKET.getInstance().on('camera:zoom', this.changeZoom.bind(this));
  }

  resize (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    EffectManager.getComposer().setSize(window.innerWidth, window.innerHeight);
  }

  onInitDone () {
    EffectManager.init();
    EnvelopesManager.init();
    CamerasManager.init(this.scene, this.camera);
    CamerasManager.setCamera(0);
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
    EnvelopesManager.checkCibling(this.camera, EffectManager.getOutlinePass());
    if (CONFIG.DEBUG_MODE) DAT_GUI.render();
    EffectManager.getComposer().render(this.clock.getDelta());
  }

  changeZoom(data: any) {
    CamerasManager.changeZoom(data.zoom);
  }

  onTimerChange (value: TimerValue) {
    this.timer.innerHTML = `${value.minutes}:${value.seconds}`;
  }

  onTimerEnd () {
    PAGES.show('timer-end');
  }
}

export default new Game();
