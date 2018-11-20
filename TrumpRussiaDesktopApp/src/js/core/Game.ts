/**
 * Coeur de notre jeu.
 * La classe Game gère toute la partie THREE.JS, ainsi que les différents managers (CamerasManager, EnvelopesManager, EffectManager ...).
 */

import {
  Clock,
  LoadingManager, Object3D,
  PerspectiveCamera,
  Scene, Vector3,
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
import Flag from './Flag';
import LoaderManager from './LoaderManager';

interface FlagInformations {
  name: string;
  parent: string;
  windForce: number;
  texture: string;
}

class Game {
  private width: number;
  private height: number;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private clock: Clock;
  public flags: Flag[] = [];
  private shaderTime: number = 0;
  public isPauseOn: boolean = false;
  private fan: Object3D;

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
    Socket.on('pause:on', this.onGamePauseOn.bind(this));
    Socket.on('pause:off', this.onGamePauseOff.bind(this));
  }

  onGamePauseOn() {
    this.isPauseOn = true;
    document.body.classList.add('paused');
  }

  onGamePauseOff() {
    this.isPauseOn = false;
    document.body.classList.remove('paused');
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
    CamerasManager.setCamera(0, false);
    this.initFlags();
    // VideoObject.apply('videoTrumpPoutine', this.scene.getObjectByName('ecran'));
  }

  initFlags() {
    const flags: FlagInformations[] = CONFIG.FLAGS;

    for (const flag of flags) {
      const object = this.scene.getObjectByName(flag.parent).getObjectByName(flag.name);
      const flagMesh = new Flag(new Vector3(object.position.x - Flag.OFFSETX,
                                            object.position.y - Flag.OFFSETY,
                                            object.position.z - Flag.OFFSETZ),
                                object.rotation.toVector3(),
                                new Vector3(0.3, 0.3, 0.3),
                                flag.windForce,
                                flag.texture);
      flagMesh.mesh.rotation.set(0, 0, Math.PI / 2);
      this.scene.getObjectByName(flag.parent).add(flagMesh.mesh);
      object.visible = false;
      this.flags.push(flagMesh);
    }
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
        LoaderManager.incrementLoading();
        this.scene.add(scene);
        this.fan = this.scene.getObjectByName('Helices');
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

    const time = Date.now();
    for (const flag of this.flags) {
      flag.simulate(time);
      flag.update();
    }

    if (this.fan) {
      this.fan.rotateY(this.fan.rotation.y + 2);
    }

    if (CONFIG.DEBUG_MODE) DAT_GUI.render();
    if (EffectManager.getEnableBadTVPass()) EffectManager.getBadTVPass().uniforms['time'].value = this.shaderTime;
    EffectManager.getFilmPass().uniforms['time'].value = this.shaderTime;
    EffectManager.getComposer().render(0.1);
  }

  /**
   * Une fois la partie finie, si l'utilisateur a trouvé toutes les enveloppes, on affiche la page de résultats,
   * sinon on lance l'effet d'écran cassé.
   * @param isWinning
   * @param data
   */
  onGameFinish(isWinning: boolean, data: any) {
    console.log(data);
    if (isWinning) {
      // PAGES.show('game-result');
      CamerasManager.setEnableMovement(false);
    } else {
      EffectManager.setBreakScreen(true);
      (document.getElementById('experience')).classList.add('experience-finish');
    }
  }
}

export default new Game();
