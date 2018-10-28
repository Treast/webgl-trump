import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  OutlinePass,
  PerspectiveCamera,
  Raycaster,
  Scene,
} from 'three';
import { CONFIG } from '../config';
import { Envelope } from '../typing';
import { SOCKET } from './Socket';

export class EnvelopesManager {

  private scene: Scene;
  private envelopes: Envelope[] = [];
  private raycaster: Raycaster = new Raycaster();
  private currentObjectCibling: Envelope;

  constructor (scene: Scene) {
    this.scene = scene;
    this.currentObjectCibling = null;
  }

  init () {
    CONFIG.GAME.ENVELOPES_NAMES.forEach((name: string) => {
      this.createBoundingBox(this.scene.getObjectByName(name));
    });
    SOCKET.getInstance().on('envelope:dragged', this.onDragged.bind(this));
  }

  createBoundingBox (envelope: Object3D) {
    const geometry = new BoxGeometry(40, 40, 40);
    const material = new MeshBasicMaterial({ opacity: 0.3, color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    // @ts-ignore
    cube.material.transparent = true;
    // @ts-ignore
    cube.material.opacity = 0;
    this.scene.updateMatrixWorld(true);
    cube.applyMatrix(envelope.matrixWorld);
    this.scene.add(cube);
    this.envelopes.push({ object: envelope, boundingBox: cube });
  }

  checkCibling(camera: PerspectiveCamera, outlinePass: OutlinePass) {
    let objectCibling = null;
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const objs = this.envelopes.map(envelope => envelope.boundingBox);
    const intersects = this.raycaster.intersectObjects(objs);
    if (intersects.length > 0) {
      const outlineObjects = this.envelopes.filter(envelope => intersects[0].object.id === envelope.boundingBox.id);
      outlinePass.selectedObjects = outlineObjects.map(envelope => envelope.object);
      objectCibling = outlineObjects[0];
    }
    else {
      outlinePass.selectedObjects = [];
    }
    if (this.currentObjectCibling !== objectCibling) {
      SOCKET.getInstance().emit('envelope:hover', objectCibling);
      this.currentObjectCibling = objectCibling;
    }
  }

  onDragged () {
    this.removeEnvelope(this.currentObjectCibling);
  }

  removeEnvelope (envelope: Envelope) {
    for (let i = envelope.object.children.length - 1; i >= 0; i--) {
      envelope.object.remove(envelope.object.children[i]);
    }
    for (let i = envelope.boundingBox.children.length - 1; i >= 0; i--) {
      envelope.boundingBox.remove(envelope.boundingBox.children[i]);
    }
    this.scene.remove(envelope.object);
    this.scene.remove(envelope.boundingBox);
  }
}
