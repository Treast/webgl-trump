import { AlertDialog } from '../utils/AlertDialog';
import { Timer } from './Timer';
import { FullScreen } from '../utils/FullScreen';
import { CamerasManager } from './CamerasManager';
import * as noUiSlider from "nouislider";
import { Socket } from "../utils/Socket";
import { EnvelopeManager } from "./EnvelopeManager";

export class App {

    constructor () {
        this.roomId = new URL(window.location).searchParams.get('roomId');
        if (this.roomId === null) {
            console.error('Le parametre GET "roomdId" est manquant');
        }
    }

    init () {
        //this.initFullScreen();
        this.joinRoom();
        this.initCameraManager();
        this.initEnvelopesManager();
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
        Socket.getInstance().emit('mobile:zoom', {
            zoom: value
        });
      });
    }

    initTimer() {
        const timer = new Timer(Socket.getInstance());
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

    initEnvelopesManager () {
        const envelopesManager = new EnvelopeManager();
        envelopesManager.init();
    }

    initCameraManager () {
        const cameraManager = new CamerasManager();
        cameraManager.init();
    }

    joinRoom () {
        Socket.getInstance().emit('room:join', this.roomId);
        //Socket.getInstance().on('experience:start', () => this.start());
    }

    start () {
        window.addEventListener('deviceorientation', this.onDeviceOrientation.bind(this));
    }

    onDeviceOrientation (e) {
        Socket.getInstance().emit('mobile:orientation', {
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        })
    }

}
