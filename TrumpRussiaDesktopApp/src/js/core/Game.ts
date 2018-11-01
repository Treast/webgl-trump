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
import { SOCKET } from './Socket';
import { DAT_GUI } from '../utils/DatGui';
import { CONFIG } from '../config';
import CamerasManager from './CamerasManager';
import EnvelopesManager from './EnvelopesManager';
import EffectManager from './EffectManager';
import TimerManager from "./TimerManager";

class Game {
  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private clock: Clock;
  private timer: any;
  private shaderTime: number = 0;

  init (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.shadowMap.enabled = true;
    this.clock = new Clock();
    EnvelopesManager.setScene(this.scene);
    EffectManager.initStatus(this.scene, this.camera, this.renderer, this.width, this.height);
    TimerManager.init();
    this.initModels(() => this.onInitDone());
    this.initSocketListeners();
  }

  initSocketListeners () {
    SOCKET.getInstance().on('game:win', this.onGameFinish.bind(this, true));
    SOCKET.getInstance().on('game:lose', this.onGameFinish.bind(this, false));
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
    this.shaderTime += 0.1;
    requestAnimationFrame(this.animate.bind(this, callback));
    EnvelopesManager.checkCibling(this.camera);
    if (CONFIG.DEBUG_MODE) DAT_GUI.render();
    if (EffectManager.getEnableBadTVPass()) EffectManager.getBadTVPass().uniforms['time'].value = this.shaderTime;
    EffectManager.getFilmPass().uniforms['time'].value = this.shaderTime;
    EffectManager.getComposer().render(0.1);
  }

  onGameFinish (isWinning: boolean) {
    if (isWinning) {
      PAGES.show('game-result');
    } else {
      EffectManager.setBreakScreen(true);
      (document.getElementById('experience')).classList.add('experience-finish');
    }
  }
}

export default new Game();
