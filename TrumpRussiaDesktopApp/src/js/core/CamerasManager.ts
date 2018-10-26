import { Group, OutlinePass, PerspectiveCamera, Raycaster, Scene } from 'three';
import { CONFIG } from '../config';
import { Envelope, Orientation } from '../typing';

export class CamerasManager {

  private cameraParent: Group;
  private readonly camera: PerspectiveCamera;
  private scene: Scene;
  private raycaster: Raycaster = new Raycaster();

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

  checkEnvelopeCibling(envelopes: Envelope[], outlinePass: OutlinePass) {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, this.camera);
    const objs = envelopes.map(envelope => envelope.boundingBox);
    const intersects = this.raycaster.intersectObjects(objs);
    if (intersects.length > 0) {
      const outlineObjects = envelopes.filter(envelope => intersects[0].object.id === envelope.boundingBox.id);
      outlinePass.selectedObjects = outlineObjects.map(envelope => envelope.object);
    }
    else outlinePass.selectedObjects = [];
  }
}
