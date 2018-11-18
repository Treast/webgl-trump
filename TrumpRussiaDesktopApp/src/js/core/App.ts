/**
 * Coeur de notre application.
 *
 * On instancie les différents composantes qui n'appartiennent pas au "jeu".
 * On écoute également les différents événements principaux sur le socket ("game:start", "room:create").
 * On lance le jeu.
 */

import { CONFIG } from '../config';
import { Room } from './Room';
import { PAGES } from '../utils/Pages';
import Game from './Game';
import { DAT_GUI } from '../utils/DatGui';
import Socket from './Socket';
import TimerManager from './TimerManager';
import AudioManager from './AudioManager';

export class App {

  /**
   * Initialisation
   */
  init () {
    PAGES.show('end');
    this.initRoom();
    this.initPause();
    this.initGame();
    AudioManager.play('Musique_IntroFin.mp3');
    Socket.on('game:start', this.start.bind(this));
  }

  /**
   * On demande au server de créer une room, et on génère le QRCode associé.
   */
  initRoom () {
    Socket.emit('room:create', (id: number) => {
      const room = new Room(id);
      room.setQRcode(document.getElementById('qrcode'));
      room.setLink(document.getElementById('address'));
    });
  }

  /**
   * On lance le jeu.
   */
  initGame () {
    if (CONFIG.DEBUG_MODE) DAT_GUI.init();
    Game.init(window.innerWidth, window.innerHeight);

    const container = document.getElementById('experience');
    container.appendChild(Game.renderer.domElement);

    window.addEventListener('resize', () => {
      Game.resize(window.innerWidth, window.innerHeight);
    });
  }

  /**
   * On affiche le canvas et on rend la scène THREE.JS
   */
  start () {
    PAGES.show('count');
    Socket.on('game:count', this.startCount.bind(this));
  }

  startCount() {
    TimerManager.runCount(() => {
      PAGES.show('app');
      Game.animate();
    });
  }

  private initPause () {
    // todo: change app state
    document.querySelectorAll('[data-pause="button-on"]')
    .forEach((el: HTMLElement) => {
      el.addEventListener('click', () => {
        document.body.classList.add('paused');
        Socket.emit('pause:on');
        Game.isPauseOn = true;
      });
    });
    document.querySelectorAll('[data-pause="button-off"]')
    .forEach((el: HTMLElement) => {
      el.addEventListener('click', () => {
        document.body.classList.remove('paused');
        Socket.emit('pause:off');
        Game.isPauseOn = false;
      });
    });
  }
}
