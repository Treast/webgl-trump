import {
  LoadingManager,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
} from 'three';
import { ModelsLoader } from './ModelsLoader';
import { MODELS_DATA } from '../data/models';
import { CONFIG } from '../config';
import { DAT_GUI } from '../utils/DatGui';
import { PAGES } from '../utils/Pages';

export class Game {

  private socket: SocketIOClient.Socket;
  private width: number;
  private height: number;
  private readonly camera: PerspectiveCamera;
  private readonly scene: Scene;
  private loaderManager: LoadingManager;
  private initialRotation: Vector3;
  public renderer: WebGLRenderer;

  constructor (socket: SocketIOClient.Socket, width: number, height: number) {
    this.socket = socket;
    this.width = width;
    this.height = height;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
  }

  resize (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate (callback: () => void = null) {
    requestAnimationFrame(this.animate.bind(this, callback));
    if (CONFIG.DEBUG_MODE) {
      this.camera.position.set(
        DAT_GUI.params.positionX,
        DAT_GUI.params.positionY,
        DAT_GUI.params.positionZ,
      );
      this.camera.lookAt(0, 0, 0);
      this.camera.updateProjectionMatrix();
    }
    this.renderer.render(this.scene, this.camera);
  }

  init () {
    this.initModels();

    this.socket.on('mobile:orientation', this.onChangeOrientation.bind(this));
    this.socket.on('camera:set', this.setCamera.bind(this));
    this.socket.on('timer:end', this.setTimerEnd.bind(this));
  }

  setTimerEnd() {
    PAGES.show('timer-end');
  }

  onInitDone () {
    this.setCamera(0);
  }

  initModels () {
    this.loaderManager = new LoadingManager();
    // this.loaderManager.onProgress = this.onModelsLoadingProgress.bind(this);
    this.loaderManager.onLoad = this.onModelsLoadingFinish.bind(this);
    const modelsLoader = new ModelsLoader(
      this.loaderManager,
      (scene: Scene) => {
        this.scene.add(scene);
      },
    );
    modelsLoader.load(MODELS_DATA);
  }

  // onModelsLoadingProgress (count: number, length: number) {}

  onModelsLoadingFinish () {
    this.onInitDone();
  }

  setCamera (id: number) {
    this.camera.position.set(
      CONFIG.GAME.CAMERAS[id].POSITION.x,
      CONFIG.GAME.CAMERAS[id].POSITION.y,
      CONFIG.GAME.CAMERAS[id].POSITION.z,
    );
    this.camera.lookAt(0, 0, 0);
    this.initialRotation = new Vector3(
      this.camera.rotation.x,
      this.camera.rotation.y,
      this.camera.rotation.z,
    );
    this.camera.updateProjectionMatrix();
  }

  onChangeOrientation (data: any) {
    this.camera.rotation.x = this.initialRotation.x + (data.beta / 2 * Math.PI / 180);
    this.camera.rotation.y = this.initialRotation.y + ((data.alpha - 90) / 2 * Math.PI / 180);
    this.camera.updateProjectionMatrix();
  }
}
