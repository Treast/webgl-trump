/**
 * Coeur de notre jeu.
 * La classe Game gère toute la partie THREE.JS, ainsi que les différents managers (CamerasManager, EnvelopesManager, EffectManager ...).
 */

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
import Socket from './Socket';
import { DAT_GUI } from '../utils/DatGui';
import { CONFIG } from '../config';
import CamerasManager from './CamerasManager';
import EnvelopesManager from './EnvelopesManager';
import EffectManager from './EffectManager';
import TimerManager from './TimerManager';
import { VideoObject } from '../utils/VideoObject';

class Game {
  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private clock: Clock;
  private shaderTime: number = 0;

  /**
   * Initialisation
   * @param width
   * @param height
   */
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

  /**
   * On écoute les événements Socket.
   */
  initSocketListeners () {
    Socket.on('game:win', this.onGameFinish.bind(this, true));
    Socket.on('game:lose', this.onGameFinish.bind(this, false));
  }

  /**
   * Lors d'un resize de la fenêtre, on met à jour la taille du WebGLRenderer ainsi que celle des effets.
   * @param width
   * @param height
   */
  resize (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    EffectManager.getComposer().setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Une fois la scène chargée et initialisée, on lance les différents managers.
   */
  onInitDone () {
    EffectManager.init();
    EnvelopesManager.init();
    CamerasManager.init(this.scene, this.camera);
    CamerasManager.setCamera(0);
    VideoObject.apply('videoTrumpPoutine', this.scene.getObjectByName('ecran'));
  }

  /**
   * On charge les différents models 3D définis dans le dossier src/js/data/models.ts et on les ajoute à la scène.
   * @param onLoaded
   */
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

  /**
   * RAF où l'on mets à jour les effets et on rend la scène THREE.JS.
   * @param callback
   */
  animate (callback: () => void = null) {
    this.shaderTime += 0.1;
    requestAnimationFrame(this.animate.bind(this, callback));
    EnvelopesManager.checkCibling(this.camera);
    if (CONFIG.DEBUG_MODE) DAT_GUI.render();
    if (EffectManager.getEnableBadTVPass()) EffectManager.getBadTVPass().uniforms['time'].value = this.shaderTime;
    EffectManager.getFilmPass().uniforms['time'].value = this.shaderTime;
    EffectManager.getComposer().render(0.1);
  }

  /**
   * Une fois la partie finie, si l'utilisateur a trouvé toutes les enveloppes, on affiche la page de résultats,
   * sinon on lance l'effet d'écran cassé.
   * @param isWinning
   */
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
