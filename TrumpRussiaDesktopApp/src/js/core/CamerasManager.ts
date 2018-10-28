import { Group, PerspectiveCamera, Scene } from 'three';
import { CONFIG } from '../config';
import { Orientation } from '../typing';

export class CamerasManager {

  private cameraParent: Group;
  private readonly camera: PerspectiveCamera;
  private scene: Scene;

  constructor (scene: Scene, camera: PerspectiveCamera) {
    this.camera = camera;
    this.scene = scene;
  }

  init () {
    this.cameraParent = new Group();
    this.cameraParent.add(this.camera);
    this.scene.add(this.cameraParent);
  }

  setCamera (id: number) {
    this.cameraParent.position.set(
      CONFIG.GAME.CAMERAS[id].POSITION.x,
      CONFIG.GAME.CAMERAS[id].POSITION.y,
      CONFIG.GAME.CAMERAS[id].POSITION.z,
    );
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  changeOrientation (data: Orientation) {
    this.cameraParent.rotation.z = -((data.beta - 5) / 2 * Math.PI / 180) * Math.sign(this.cameraParent.position.z);
    this.cameraParent.rotation.y = (data.alpha - 90) / 2 * Math.PI / 180;
  }

  changeZoom(zoom: number) {
    const originalFOV = 75;
    const difference = originalFOV * (zoom / 100);
    this.camera.fov = originalFOV - difference;
    this.camera.updateProjectionMatrix();
  }
}
