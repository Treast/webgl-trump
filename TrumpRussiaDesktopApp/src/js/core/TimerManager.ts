/**
 * Gestion du timer.
 */

import Socket from './Socket';
import { TimerValue } from '../typing';

class TimerManager {

  private timer: any;

  /**
   * Initialisation
   */
  init () {
    this.timer = document.getElementById('timer');
    this.initSocketListener();
  }

  /**
   * On écoute le changement du timer.
   */
  private initSocketListener() {
    Socket.on('timer:change', this.onTimerChange.bind(this));
  }

  /**
   * On met à jour le timer dans l'affichage.
   * @param value
   */
  private onTimerChange (value: TimerValue) {
    this.timer.innerHTML = `${value.minutes}:${value.seconds}`;
  }
}

export default new TimerManager();
