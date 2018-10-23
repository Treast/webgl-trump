export class CamerasManager {

    constructor (socket) {
        this.cameras = document.querySelectorAll('[data-camera]');
        this.socket = socket;
        this.currentCamera = null;
    }

    init () {
        this.cameras.forEach(camera =>
            camera.addEventListener('click', () => this.setCamera(camera))
        );
    }

    setCamera (camera) {
        if (this.currentCamera === camera) return;
        this.currentCamera = camera;
        const id = camera.getAttribute('data-camera');
        this.socket.emit('camera:set', id);
    }
}