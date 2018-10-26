import { AlertDialog } from '../utils/AlertDialog';
import { Timer } from './Timer';
import { FullScreen } from '../utils/FullScreen';
import { CONFIG } from '../config';
import io from 'socket.io-client';
import {CamerasManager} from './CamerasManager';
import * as noUiSlider from "nouislider";

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
        this.initSlider();
        this.initTimer();
        this.start();
    }

    initSlider() {
      this.slider = document.querySelector('.zoom-slider .range');
      noUiSlider.create(this.slider, {
        start: 0,
        range: {
          'min': [0],
          'max': [100]
        },
        pips: {
          mode: 'values',
          values: [],
          density: 4
        },
        orientation: 'vertical',
        direction: 'rtl',
      });

      this.slider.noUiSlider.on('update', () => {
        const pipes = document.querySelectorAll('.noUi-marker.noUi-marker-vertical');
        const value = this.slider.noUiSlider.get();

        for(const pipe of pipes) {
          const top = parseInt(pipe.style.bottom);
          if(top <= value) {
            pipe.classList.add('selected');
          } else {
            pipe.classList.remove('selected');
          }
        }
        this.socket.emit('mobile:zoom', {
            zoom: value
        });
      });
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
        //this.socket.on('experience:start', () => this.start());
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
