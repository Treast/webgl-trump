/**
 * Le PauseManager permet de mettre en pause le jeu en affichant une page d'attente et en arrêtant temporairement le timer.
 */

import Socket from '../utils/Socket';
import Timer from './TimerManager';

class PauseManager {
  private elements: NodeListOf<HTMLElement>;

  /**
   * Initialisation
   */
  init() {
    this.elements = document.querySelectorAll('.pause_icon_container');
    this.setupListener();
    Socket.on('pause:on', this.on.bind(this));
    Socket.on('pause:off', this.off.bind(this));
  }

  /**
   * Si l'utilisateur clique sur le bouton "Pause", on stop le timer et on affiche la page de pause.
   * S'il clique sur "Reprendre", le timer reprend et l'écran de pause.
   */
  setupListener() {
    for (const element of this.elements) {
      element.addEventListener('click', () => {
        Socket.emit('pause:on');
        this.on();
      });
    }

    document.querySelector('.timer-run').addEventListener('click', () => {
      Socket.emit('pause:off');
      this.off();
    });

    document.querySelector('.play-again').addEventListener('click', () => {
      Socket.emit('restart');
    });
  }

  on() {
    Timer.stop();
    document.body.classList.add('paused');
  }

  off() {
    Timer.run();
    document.body.classList.remove('paused');
  }
}

export default new PauseManager();
