/**
 * EnvelopesManager gère les enveloppes présentes dans la scène.
 * On récupère les objets présents dans la scène selon leur noms, on ajoute une BoundingBox autour de l'objet
 * pour faciliter la sélection, on détecte si la caméra vise une BoundingBox, on génère dans ce cas une Outline autour
 * de l'enveloppe en question, on peut alors la sélectionner via le smartphone
 */

import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Scene,
} from 'three';
import { CONFIG } from '../config';
import { Envelope } from '../typing';
import Socket from './Socket';
import effectManager from './EffectManager';
import CamerasManager from "./CamerasManager";

class EnvelopesManager {

  private scene: Scene;
  private envelopes: Envelope[] = [];
  private raycaster: Raycaster = new Raycaster();
  private currEnvelopeSelected: Envelope = null;

  setScene(scene: Scene) {
    this.scene = scene;
  }

  /**
   * On initialise les enveloppes et on écoute l'événement de sélection d'enveloppes.
   */
  init () {
    this.initEnvelopes();
    Socket.on('envelope:pickup', this.onPickupEnvelope.bind(this));
  }

  /**
   * On récupère le nom des objets des enveloppes définies dans la scène selon le fichier de configuration.
   */
  private initEnvelopes() {
    CONFIG.GAME.ENVELOPES_NAMES.forEach((name: string) => {
      const object = this.scene.getObjectByName(name);
      if (object) {
        const boundingBox = this.createBoundingBox(object);
        this.envelopes.push({ object, boundingBox, name });
      }
    });
  }

  /**
   * On crée une BoundingBox autour de chaque enveloppe pour faciliter la sélection.
   * @param envelope
   */
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

  /**
   * Si l'enveloppe a été sélectionnée, on l'enlève de la scène.
   * @param name
   */
  private onPickupEnvelope ({ name }: any) {
    const envelope = this.envelopes.filter(envelope => envelope.name === name)[0];
    this.removeEnvelope(envelope);
  }

  /**
   * On supprime l'enveloppe de la scène et on vérifie s'il reste encore des enveloppes à chercher.
   * @param envelope
   */
  private removeEnvelope (envelope: Envelope) {
    envelope.object.children.forEach((children: Object3D) => {
      envelope.object.remove(children);
    });
    this.scene.remove(envelope.object);
    this.scene.remove(envelope.boundingBox);
    this.envelopes.splice(this.envelopes.indexOf(envelope), 1);
    if (this.envelopes.length === 0) {
      Socket.emit('game:win');
    }
  }

  /**
   * On vérifie si la caméra cible une BoundingBox d'une enveloppe.
   * @param camera
   */
  checkCibling (camera: PerspectiveCamera) {
    const selectedEnvelope = this.getIntersectedEnvelope(camera);
    if (selectedEnvelope !== null) {
      effectManager.getOutlinePass().selectedObjects = [selectedEnvelope.object];
      CamerasManager.setCurstorActive(true);
    } else {
      effectManager.getOutlinePass().selectedObjects = [];
      CamerasManager.setCurstorActive(false);
    }
    if (this.currEnvelopeSelected !== selectedEnvelope) {
      Socket.emit('envelope:hover', !selectedEnvelope ? null : {
        name: selectedEnvelope.name,
      });
      this.currEnvelopeSelected = selectedEnvelope;
    }
  }

  /**
   * On lance un Raycaster partant de la caméra et on vérifie si le raycast traverse une BoundingBox.
   * @param camera
   */
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
