import { Group, PerspectiveCamera, Scene } from "three";
import { CONFIG } from "../config";

interface Orientation {
  alpha: number;
  beta: number;
  gamma: number;
}

export class CamerasManager {

  private readonly cameraParent: Group;
  private camera: PerspectiveCamera;

  constructor (scene: Scene, camera: PerspectiveCamera) {
    this.cameraParent = new Group();
    this.cameraParent.add(camera);
    this.camera = camera;
    scene.add(this.cameraParent);
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
}