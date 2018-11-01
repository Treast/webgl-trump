import { Group, PerspectiveCamera, Scene } from 'three';
import { CONFIG } from '../config';
import { Orientation } from '../typing';
import { SOCKET } from "./Socket";

class CamerasManager {

  private cameraParent: Group;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private numberElement: any;

  constructor () {
    this.numberElement = document.getElementById('camera_number');
  }

  init (scene: Scene, camera: PerspectiveCamera) {
    this.camera = camera;
    this.scene = scene;
    this.cameraParent = new Group();
    this.cameraParent.add(this.camera);
    this.scene.add(this.cameraParent);
    this.initSocketListeners();
  }

  initSocketListeners () {
    SOCKET.getInstance().on('camera:orientation', this.changeOrientation.bind(this));
    SOCKET.getInstance().on('camera:set', this.setCamera.bind(this));
    SOCKET.getInstance().on('camera:zoom', this.changeZoom.bind(this));
  }

  setCamera (id: any) {
    const idn = parseInt(id);
    this.cameraParent.position.set(
      CONFIG.GAME.CAMERAS[idn].POSITION.x,
      CONFIG.GAME.CAMERAS[idn].POSITION.y,
      CONFIG.GAME.CAMERAS[idn].POSITION.z,
    );
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.numberElement.innerText = (1 + idn).toString();
  }

  changeOrientation (data: Orientation) {
    this.cameraParent.rotation.z = -((data.beta - 5) / 2 * Math.PI / 180) * Math.sign(this.cameraParent.position.z);
    this.cameraParent.rotation.y = (data.alpha - 90) / 2 * Math.PI / 180;
  }

  changeZoom({ zoom }: any) {
    const originalFOV = 75;
    const difference = originalFOV * (zoom / 100);
    this.camera.fov = originalFOV - difference;
    this.camera.updateProjectionMatrix();
  }
}

export default new CamerasManager();
