import Socket from '../utils/Socket';

class CamerasManager {
  private readonly cameras: NodeListOf<HTMLElement>;
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
    for (const cam of this.cameras) {
      cam.parentElement.classList.remove('selected');
    }
    camera.parentElement.classList.add('selected');
    if (this.currentCamera === camera) return;
    this.currentCamera = camera;
    const id = camera.getAttribute('data-camera');
    (document.querySelector('.camera_number') as HTMLElement).innerText = `CAM ${parseInt(id, 10) + 1}`;
    Socket.emit('camera:set', id);
  }
}

export default new CamerasManager();
