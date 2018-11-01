import Timer from './Timer';
import { FullScreen } from '../utils/FullScreen';
import CamerasManager from './CamerasManager';
import Socket from '../utils/Socket';
import EnvelopesManager from './EnvelopesManager';
import ZoomManager from './ZoomManager';
import PauseManager from './PauseManager';
import { PAGES } from '../utils/Pages';

class App {

  private readonly roomId: string;

  constructor() {
    this.roomId = new URL(window.location.toString()).searchParams.get('roomId');
    if (this.roomId === null) {
      console.error('Le parametre GET "roomdId" est manquant');
    }
  }

  init() {
    PAGES.show('app');
    FullScreen.applyOnElement(document.body);
    this.joinRoom();
    this.initCamerasManager();
    this.initEnvelopesManager();
    this.initPauseManager();
    this.initSlider();
    this.initTimer();
    this.start();
  }

  initPauseManager() {
    PauseManager.init();
  }

  initSlider() {
    ZoomManager.init();
  }

  initTimer() {
    Timer.start();
  }

  initEnvelopesManager() {
    EnvelopesManager.init();
  }

  initCamerasManager() {
    CamerasManager.init();
  }

  joinRoom() {
    Socket.emit('room:join', this.roomId);
  }

  start() {
    window.addEventListener('deviceorientation', this.onDeviceOrientation.bind(this));
  }

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
