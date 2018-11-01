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

class EnvelopesManager {

  private scene: Scene;
  private envelopes: Envelope[] = [];
  private raycaster: Raycaster = new Raycaster();
  private currEnvelopeSelected: Envelope = null;

  setScene(scene: Scene) {
    this.scene = scene;
  }

  init () {
    this.initEnvelopes();
    SOCKET.getInstance().on('envelope:dragged', this.onDraggedEnvelope.bind(this));
  }

  private initEnvelopes() {
    CONFIG.GAME.ENVELOPES_NAMES.forEach((name: string) => {
      const object = this.scene.getObjectByName(name);
      if (object) {
        const boundingBox = this.createBoundingBox(object);
        this.envelopes.push({ object, boundingBox, name });
      }
    });
  }

  private createBoundingBox (envelope: Object3D) {
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
    return cube;
  }

  private onDraggedEnvelope ({ name }: any) {
    const envelope = this.envelopes.filter(envelope => envelope.name === name)[0];
    this.removeEnvelope(envelope);
  }

  private removeEnvelope (envelope: Envelope) {
    envelope.object.children.forEach((children: Object3D) => {
      envelope.object.remove(children);
    });
    this.scene.remove(envelope.object);
    this.scene.remove(envelope.boundingBox);
    this.envelopes.splice(this.envelopes.indexOf(envelope), 1);
  }

  checkCibling (camera: PerspectiveCamera, outlinePass: OutlinePass) {
    const selectedEnvelope = this.getIntersectedEnvelope(camera);
    if (selectedEnvelope !== null) {
      outlinePass.selectedObjects = [selectedEnvelope.object];
    } else {
      outlinePass.selectedObjects = [];
    }
    if (this.currEnvelopeSelected !== selectedEnvelope) {
      SOCKET.getInstance().emit('envelope:hover', !selectedEnvelope ? null : {
        name: selectedEnvelope.name,
      });
      this.currEnvelopeSelected = selectedEnvelope;
    }
  }

  getIntersectedEnvelope (camera: PerspectiveCamera): Envelope {
    let selectedEnvelopes = null;
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const boundingBoxes = this.envelopes.map(envelope => envelope.boundingBox);
    const intersects = this.raycaster.intersectObjects(boundingBoxes);
    if (intersects.length > 0) {
      selectedEnvelopes = this.envelopes.filter(envelope => intersects[0].object.id === envelope.boundingBox.id)[0];
    }
    return selectedEnvelopes;
  }
}

export default new EnvelopesManager();
