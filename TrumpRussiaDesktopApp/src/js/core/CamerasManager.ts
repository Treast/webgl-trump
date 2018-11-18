/**
 * CamerasManager gère le changement de caméras dans la scène, ainsi que l'orientation de celles-ci selon l'orientation
 * du mobile. On peut également changer de zoom.
 */

import { Group, PerspectiveCamera, Scene } from 'three';
import { CONFIG } from '../config';
import { Orientation } from '../typing';
import Socket from './Socket';
import AudioManager from './AudioManager';
import Game from './Game';

class CamerasManager {

  private cameraParent: Group;
  private camera: PerspectiveCamera;
  private scene: Scene;
  private numberElement: any;
  private enableMovement: boolean = true;
  private cursor: HTMLElement;

  constructor () {
    this.numberElement = document.getElementById('camera_number');
  }

  /**
   * Initialisation
   * @param scene
   * @param camera
   */
  init (scene: Scene, camera: PerspectiveCamera) {
    this.camera = camera;
    this.scene = scene;
    this.cameraParent = new Group();
    this.cameraParent.add(this.camera);
    this.scene.add(this.cameraParent);
    this.cursor = document.getElementById('camera-cursor');
    this.initSocketListeners();
  }

  /**
   * On écoute les événements Socket
   */
  initSocketListeners () {
    Socket.on('camera:orientation', this.changeOrientation.bind(this));
    Socket.on('camera:set', this.setCamera.bind(this));
    Socket.on('camera:zoom', this.changeZoom.bind(this));
  }

  /**
   * On change de caméra
   * @param id
   * @param playSound
   */
  setCamera (id: any, playSound: boolean = true) {
    const idn = parseInt(id, 10);
    const cameraObject = this.scene.getObjectByName(CONFIG.GAME.CAMERAS_NAMES[idn]);
    console.log(cameraObject.position);
    this.cameraParent.position.set(
      cameraObject.position.x / 100,
      cameraObject.position.y / 100,
      cameraObject.position.z / 100,
    );
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    if (playSound) AudioManager.play('ChangerCam.wav');
    this.numberElement.innerText = (1 + idn).toString();
  }

  /**
   * On change l'orientation de la caméra.
   * @param data
   */
  changeOrientation (data: Orientation) {
    if (!Game.isPauseOn) {
      this.cameraParent.rotation.z = -(data.beta * Math.PI / 180) * Math.sign(this.cameraParent.position.z);
      this.cameraParent.rotation.y = data.alpha * Math.PI / 180;
    }
  }

  /**
   * On change le zoom.
   * @param zoom
   */
  changeZoom({ zoom }: any) {
    const originalFOV = 75;
    const difference = originalFOV * (zoom / 200);
    this.camera.fov = originalFOV - difference;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Défini l'activation du mouvement de la caméra
   * @param {boolean} value
   */
  setEnableMovement(value: boolean) {
    this.enableMovement = value;
  }

  /**
   * Défini l'activation du curseur (au survol d'une enveloppe)
   * @param {boolean} active
   */
  setCurstorActive(active: boolean) {
    if (active) {
      this.cursor.classList.add('camera_center-active');
    } else {
      this.cursor.classList.remove('camera_center-active');
    }
  }
}

export default new CamerasManager();
