import { BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Scene } from 'three';
import { CONFIG } from '../config';
import { Envelope } from '../typing';

export class EnvelopesManager {

  private scene: Scene;
  private envelopes: Envelope[] = [];

  constructor (scene: Scene) {
    this.scene = scene;
  }

  getEnvelopes (): Envelope[] {
    return this.envelopes;
  }

  init () {
    CONFIG.GAME.ENVELOPES_NAMES.forEach((name) => {
      this.createBoundingBox(this.scene.getObjectByName(name));
    });
  }

  createBoundingBox (envelope: Object3D) {
    const geometry = new BoxGeometry(50, 50, 50);
    const material = new MeshBasicMaterial({ opacity: 0.3, color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    // @ts-ignore
    cube.material.transparent = true;
    //cube.material.opacity = 0;
    envelope.add(cube);
    this.envelopes.push({ object: envelope, boundingBox: cube });
  }
}
