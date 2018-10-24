import {
  LoadingManager,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { ModelsLoader } from './ModelsLoader';
import { MODELS_DATA } from '../data/models';
import { PAGES } from '../utils/Pages';
import { CamerasManager } from "./CamerasManager";
import { EnvelopesManager } from "./EnvelopesManager";

export class Game {

  private socket: SocketIOClient.Socket;
  private width: number;
  private height: number;
  private readonly camera: PerspectiveCamera;
  private readonly scene: Scene;
  private loaderManager: LoadingManager;
  public renderer: WebGLRenderer;
  private camerasManager: CamerasManager;
  private envelopesManager: EnvelopesManager;

  constructor (socket: SocketIOClient.Socket, width: number, height: number) {
    this.socket = socket;
    this.width = width;
    this.height = height;
    this.camera = new PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.camerasManager = new CamerasManager(this.scene, this.camera);
    this.envelopesManager = new EnvelopesManager();
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
    this.renderer.render(this.scene, this.camera);
  }

  init () {
    this.initModels(() => this.onInitDone());
    this.initSocketListeners();
  }

  initSocketListeners () {
    this.socket.on('mobile:orientation', (data: any) => this.camerasManager.changeOrientation(data));
    this.socket.on('camera:set', (id: number) => this.camerasManager.setCamera(id));
    this.socket.on('timer:end', this.setTimerEnd.bind(this));
  }

  setTimerEnd () {
    PAGES.show('timer-end');
  }

  onInitDone () {
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
}
