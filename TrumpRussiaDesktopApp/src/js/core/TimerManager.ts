/**
 * Gestion du timer.
 */

import Socket from './Socket';
import { TweenMax } from 'gsap';
import { TimerValue } from '../typing';
import AudioManager from './AudioManager';

class TimerManager {

  private timer: any;
  private interval: any;
  private count: HTMLElement;
  private countOuter: HTMLElement;
  private countInner: HTMLElement;
  public timerMinutes: string;
  public timerSeconds: string;

  /**
   * Initialisation
   */
  init () {
    this.count = document.querySelector('[data-page="count"] .count');
    this.countOuter = document.querySelector('[data-page="count"] .count .outer');
    this.countInner = document.querySelector('[data-page="count"] .count .inner');
    this.timer = document.getElementById('timer');
    this.initSocketListener();
  }

  runCount(onCountDone: () => void) {
    let count = 6;
    let started = false;
    const interval = setInterval(() => {
      AudioManager.play('TimmerDepart.wav');
      TweenMax.fromTo(this.countOuter, 1, {
        y: 0,
        alpha: 1,
      },              {
        y: -77,
        alpha: 0,
        onStart: () => {
          count = count - 1;
          this.countInner.innerText = count.toString();
        },
        onComplete: () => {
          if (count <= 0) {
            if (!started) onCountDone();
            clearInterval(interval);
            started = true;
          }
        },
      });
      TweenMax.fromTo(this.countInner, 1, {
        y: 77,
        alpha: 0,
      },              {
        y: 0,
        alpha: 1,
        onComplete: () => {
          if (count <= -1) {
            clearInterval(interval);
          } else {
            this.countOuter.innerText = count.toString();
          }
        },
      });
    },                           1000);
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
    this.timerMinutes = value.minutes;
    this.timerSeconds = value.seconds;
    this.timer.innerHTML = `${value.minutes}:${value.seconds}`;
  }
}

export default new TimerManager();
