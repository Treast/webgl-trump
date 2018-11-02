/**
 * Le PauseManager permet de mettre en pause le jeu en affichant une page d'attente et en arrêtant temporairement le timer.
 */

import Socket from '../utils/Socket';
import Timer from './Timer';
import { PAGES } from '../utils/Pages';

class PauseManager {
  private element: HTMLElement;

  /**
   * Initialisation
   */
  init() {
    this.element = document.querySelector('#pause');
    this.setupListener();
  }

  /**
   * Si l'utilisateur clique sur le bouton "Pause", on stop le timer et on affiche la page de pause.
   * S'il clique sur "Reprendre", le timer reprend et l'écran de pause.
   */
  setupListener() {
    this.element.addEventListener('click', () => {
      Socket.emit('pause:on');
      Timer.stop();
      PAGES.show('pause');
    });

    document.querySelector('.timer-run').addEventListener('click', () => {
      Socket.emit('pause:off');
      Timer.run();
      PAGES.show('app');
    });
  }
}

export default new PauseManager();
