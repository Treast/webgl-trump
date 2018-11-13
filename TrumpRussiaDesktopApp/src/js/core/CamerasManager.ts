/**
 * CamerasManager gère le changement de caméras dans la scène, ainsi que l'orientation de celles-ci selon l'orientation
 * du mobile. On peut également changer de zoom.
 */

import { Group, PerspectiveCamera, Scene } from 'three';
import { CONFIG } from '../config';
import { Orientation } from '../typing';
import Socket from './Socket';

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
   */
  setCamera (id: any) {
    const idn = parseInt(id, 10);
    this.cameraParent.position.set(
      CONFIG.GAME.CAMERAS[idn].POSITION.x,
      CONFIG.GAME.CAMERAS[idn].POSITION.y,
      CONFIG.GAME.CAMERAS[idn].POSITION.z,
    );
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
    this.numberElement.innerText = (1 + idn).toString();
  }

  /**
   * On change l'orientation de la caméra.
   * @param data
   */
  changeOrientation (data: Orientation) {
    this.cameraParent.rotation.z = -(data.beta * Math.PI / 180) * Math.sign(this.cameraParent.position.z);
    this.cameraParent.rotation.y = data.alpha * Math.PI / 180;
  }

  /**
   * On change le zoom.
   * @param zoom
   */
  changeZoom({ zoom }: any) {
    const originalFOV = 75;
    const difference = originalFOV * (zoom / 100);
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
