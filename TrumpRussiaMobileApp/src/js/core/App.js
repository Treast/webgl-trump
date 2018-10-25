import { AlertDialog } from '../utils/AlertDialog';
import { Timer } from './Timer';
import { FullScreen } from '../utils/FullScreen';
import { CONFIG } from '../config';
import io from 'socket.io-client';
import {CamerasManager} from './CamerasManager';

export class App {

    constructor () {
        this.socket = io(`http://${CONFIG.SERVER.HOST}:${CONFIG.SERVER.PORT}`);
        this.roomId = new URL(window.location).searchParams.get('roomId');
        if (this.roomId === null) {
            console.error('Le parametre GET "roomdId" est manquant');
        }
    }

    init () {
        //this.initFullScreen();
        this.joinRoom();
        this.initCameraManager();
        this.initTimer();
    }

    initTimer() {
        const timer = new Timer(this.socket);
        timer.init();
        timer.start();
    }

    initFullScreen () {
        const alert = new AlertDialog({
            name: 'ad-fullscreen',
            onAccept: () => {
                FullScreen.applyOnElement(document.body);
                this.joinRoom();
            },
            onRefuse: () => {
                this.joinRoom();
            }
        });
        alert.show();
    }

    initCameraManager () {
        const cameraManager = new CamerasManager(this.socket);
        cameraManager.init();
    }

    joinRoom () {
        this.socket.emit('room:join', this.roomId);
        this.socket.on('experience:start', () => this.start());
    }

    start () {
        window.addEventListener('deviceorientation', this.onDeviceOrientation.bind(this));
    }

    onDeviceOrientation (e) {
        this.socket.emit('mobile:orientation', {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        })
    }

}