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
import ShareManager from './ShareManager';
import { TimelineMax, Power2 } from 'gsap';

export class App {

  /**
   * Initialisation
   */
  init () {
    document.body.style.display = 'block';
    PAGES.show('loader');
    this.initRoom();
    this.initPause();
    this.initGame();
    this.initMorale();
    AudioManager.playIntroSound();
    Socket.on('game:start', this.start.bind(this));
    Socket.on('page:show', PAGES.show.bind(PAGES));
    Socket.on('page:fade', PAGES.fade.bind(PAGES));
  }

  initMorale() {
    const element: HTMLElement = document.querySelector('.morale .inner .inner-content');
    const text = element.innerText;
    element.innerHTML = text.replace(/([^x00-x80]|\w)/g, '<span class="letter">$&</span>');
  }

  static runMoraleAnimation() {
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.morale .inner .inner-content .letter');
    const delay = elements.length * 0.15 + 2;
    const timeline = new TimelineMax();
    timeline.staggerTo(elements, 0.4, {
      opacity: 1,
      ease: Power2.easeInOut,
    },                 0.150);

    timeline.staggerTo(
      elements,
      0.4,
      {
        opacity: 0,
        ease: Power2.easeInOut,
        delay: delay,
      },
      0.150,
      0,
      () => {
        setTimeout(() => {
          PAGES.fade('end', true);
        },         300);
      });
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
    ShareManager.init();
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
    PAGES.fade('count');
    Socket.on('game:count', this.startCount.bind(this));
  }

  startCount() {
    TimerManager.runCount(() => {
      AudioManager.playBassSound();
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
