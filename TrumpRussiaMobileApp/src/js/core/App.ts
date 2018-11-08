/**
 * La classe App gère toute l'application côté mobile.
 * Elle initialise les différents managers (CamerasManager, EnvelopesManager, ZoomManager et PauseManager), ainsi
 * que toutes les pages de l'application, et envoie régulièrement des informations sur l'orientation du mobile au serveur.
 */

import Timer from './Timer';
import { FullScreen } from '../utils/FullScreen';
import CamerasManager from './CamerasManager';
import Socket from '../utils/Socket';
import EnvelopesManager from './EnvelopesManager';
import ZoomManager from './ZoomManager';
import PauseManager from './PauseManager';
import PhoneManager from './PhoneManager';
import { PAGES } from '../utils/Pages';

class App {
  private readonly roomId: string;

  constructor() {
    this.roomId = new URL(window.location.toString()).searchParams.get('roomId');
    if (this.roomId === null) {
      console.error('Le parametre GET "roomdId" est manquant');
    }
  }

  /**
   * Initialisation
   */
  init() {
    PAGES.show('app');
    FullScreen.applyOnElement(document.body);
    this.joinRoom();
    this.initCamerasManager();
    this.initEnvelopesManager();
    this.initPauseManager();
    this.initSlider();
    this.initTimer();
    this.initPhone();
    this.start();
  }

    /**
     * Initialisation du PauseManager
     */
  initPauseManager() {
    PauseManager.init();
  }

    /**
     * Initialisation du Phone
     */
  initPhone() {
    PhoneManager.init();
  }

  /**
   * Initialisation du ZoomManager
   */
  initSlider() {
    ZoomManager.init();
  }

  /**
   * Initialisation du TimerManager
   */
  initTimer() {
    Timer.start();
  }

  /**
   * Initialisation de l'EnvelopesManager
   */
  initEnvelopesManager() {
    EnvelopesManager.init();
  }

  /**
   * Initialisation du CamerasManager
   */
  initCamerasManager() {
    CamerasManager.init();
  }

  /**
   * Rejoins la room Socket.IO crée depuis le desktop.
   */
  joinRoom() {
    Socket.emit('room:join', this.roomId);
  }

  /**
   * Ecoute l'orientation du smartphone.
   */
  start() {
    window.addEventListener('deviceorientation', this.onDeviceOrientation.bind(this));
  }

  /**
   * Envoie les informations de rotation au serveur.
   * @param e
   */
  onDeviceOrientation(e: DeviceOrientationEvent) {
    console.log(e);
    Socket.emit('camera:orientation', {
      alpha: e.alpha,
      beta: e.beta,
      gamma: e.gamma,
    });
  }
}

export default new App();
