/**
 * CamerasManager va gérer le changement de caméras. Au clic sur un bouton, l'information est envoyée au serveur
 * pour avoir un changement de caméra sur le desktop.
 */

import Socket from '../utils/Socket';

class CamerasManager {
  private readonly cameras: NodeListOf<HTMLElement>;
  private currentCamera: HTMLElement;

  constructor() {
    this.cameras = document.querySelectorAll('[data-camera]');
    this.currentCamera = null;
  }

  /**
   * On initialise les boutons en écoutant l'événement "click"
   */
  init() {
    this.cameras.forEach(camera =>
      camera.addEventListener('click', () => this.setCamera(camera)),
    );
  }

  /**
   * On refraichit l'affichage et on envoie l'id de la caméra sélectionnée au serveur.
   * @param camera
   */
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
