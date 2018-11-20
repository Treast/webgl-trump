/**
 * La classe App gère toute l'application côté mobile.
 * Elle initialise les différents managers (CamerasManager, EnvelopesManager, ZoomManager et PauseManager), ainsi
 * que toutes les pages de l'application, et envoie régulièrement des informations sur l'orientation du mobile au serveur.
 */

import TimerManager from './TimerManager';
import { FullScreen } from '../utils/FullScreen';
import CamerasManager from './CamerasManager';
import Socket from '../utils/Socket';
import EnvelopesManager from './EnvelopesManager';
import ZoomManager from './ZoomManager';
import PauseManager from './PauseManager';
import PhoneManager from './PhoneManager';
import AudioManager from './AudioManager';
import MenuManager from './MenuManager';
import { PAGES } from '../utils/Pages';
import GameManager from './GameManager';

const Gyronorm = require('gyronorm/dist/gyronorm.complete.min');

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
    PAGES.show('credits');
    this.joinRoom();
    this.initCamerasManager();
    this.initEnvelopesManager();
    this.initPauseManager();
    this.initMenuManager();
    this.initAudioManager();
    this.initTimerManager();
    this.initSlider();
    this.initPhone();
    this.initGameManager();
    this.start();
  }

  setWinState(hasWin: boolean, remainingTime: number = 0) {
    if (hasWin) {
      const converted = TimerManager.convertToMinutes(TimerManager.getTime() - remainingTime);
      document.querySelector('.app-result h1').innerHTML = `${converted.minutes}:${converted.seconds}`;
      document.querySelector('.app-result h2').innerHTML = 'Bravo';
    } else {
      document.querySelector('.app-result h1').innerHTML = '00:00';
      document.querySelector('.app-result h2').innerHTML = 'Temps écoulé !';
    }
  }

  /**
   * Initialisation du PauseManager
   */
  private initPauseManager() {
    PauseManager.init();
  }

  /**
   * Initialisation du AudioManager
   */
  private initAudioManager() {
    AudioManager.init();
  }

  /**
   * Initialisation du MenuManager
   */
  private initMenuManager() {
    MenuManager.init();
  }

  /**
   * Initialisation du Phone
   */
  private initPhone() {
    PhoneManager.init();
  }

  /**
   * Initialisation du ZoomManager
   */
  private initSlider() {
    ZoomManager.init();
  }

  /**
   * Initialisation du TimerManager
   */
  private initTimerManager() {
    TimerManager.start();
  }

  /**
   * Initialisation de l'EnvelopesManager
   */
  private initEnvelopesManager() {
    EnvelopesManager.init();
  }

  /**
   * Initialisation du CamerasManager
   */
  private initCamerasManager() {
    CamerasManager.init();
  }

  /**
   * Initialisation du NavigationBarManager
   */
  private initGameManager() {
    GameManager.init();
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
  async start() {
    const gyroscope = new Gyronorm();
    try {
      await gyroscope.init({
        frequency: 10,
      });
      gyroscope.start(this.onDeviceOrientation.bind(this));
    } catch (e) {
      alert(e.message);
    }
  }

  /**
   * Envoie les informations de rotation au serveur.
   * @param data
   */
  onDeviceOrientation(data: any) {
    Socket.emit('camera:orientation', {
      alpha: data.do.alpha,
      beta: data.do.beta,
      gamma: data.do.gamma,
    });
  }
}

export default new App();
