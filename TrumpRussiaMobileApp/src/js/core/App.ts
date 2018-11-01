import Timer from './Timer';
import { FullScreen } from '../utils/FullScreen';
import CamerasManager from './CamerasManager';
import Socket from '../utils/Socket';
import EnvelopesManager from './EnvelopesManager';
import ZoomManager from './ZoomManager';

class App {

  private readonly roomId: string;

  constructor() {
    this.roomId = new URL(window.location.toString()).searchParams.get('roomId');
    if (this.roomId === null) {
      console.error('Le parametre GET "roomdId" est manquant');
    }
  }

  init() {
    FullScreen.applyOnElement(document.body);
    this.joinRoom();
    this.initCamerasManager();
    this.initEnvelopesManager();
    this.initSlider();
    this.initTimer();
    this.start();
  }

  initSlider() {
    ZoomManager.init();
  }

  initTimer() {
    Timer.init();
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
