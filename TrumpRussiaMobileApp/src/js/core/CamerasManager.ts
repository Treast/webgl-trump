import { Socket } from '../utils/Socket';

export class CamerasManager {
  private cameras: NodeListOf<HTMLElement>;
  private currentCamera: HTMLElement;

  constructor() {
    this.cameras = document.querySelectorAll('[data-camera]');
    this.currentCamera = null;
  }

  init() {
    this.cameras.forEach(camera =>
      camera.addEventListener('click', () => this.setCamera(camera)),
    );
  }

  setCamera(camera: HTMLElement) {
    if (this.currentCamera === camera) return;
    this.currentCamera = camera;
    const id = camera.getAttribute('data-camera');
    Socket.getInstance().emit('camera:set', id);
  }
}
