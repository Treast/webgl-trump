/**
 * Le TimerManager gère le temps de l'événement. L'affichage du timer est mis à jour toutes les secondes, est affiché
 * en haut du desktop et du smartphone. Une fois le timer dépassé, un événément est envoyé et l'écran de défaite est affichée.
 */

import Socket from '../utils/Socket';
import { PAGES } from '../utils/Pages';
import App from './App';
import { TweenMax } from 'gsap';
import GameManager, { GameState } from './GameManager';

class TimerManager {

  public static TIME: number = 180; // 180
  public remainingTime: number;
  private interval: any;
  private isRunning: boolean = true;
  private countOuter: HTMLElement;
  private countInner: HTMLElement;

  constructor() {
    this.remainingTime = TimerManager.TIME;
    this.interval = null;
    this.countOuter = document.querySelector('[data-page="count"] .count .outer');
    this.countInner = document.querySelector('[data-page="count"] .count .inner');
  }

  /**
   * On stoppe le timer.
   */
  stop() {
    this.isRunning = false;
  }

  getTime() {
    return TimerManager.TIME;
  }

  public runCount() {
    Socket.emit('game:count');
    let count = 6;
    let started = false;
    const interval = setInterval(() => {
      TweenMax.fromTo(this.countOuter, 1, {
        y: 0,
        alpha: 1,
      },              {
        y: -77,
        alpha: 0,
        onStart: () => {
          count = count - 1;
          Socket.emit('counter:change', count);
          this.countInner.innerText = count.toString();
        },
        onComplete: () => {
          if (count <= 0) {
            clearInterval(interval);
            PAGES.fade('app');
            if (!started) {
              started = true;
              this.start();
            }
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
            PAGES.fade('app');
            if (!started) {
              started = true;
              this.start();
            }
          } else {
            this.countOuter.innerText = count.toString();
          }
        },
      });
    },                           1000);
  }

  /**
   * On reprend le timer.
   */
  run() {
    this.isRunning = true;
  }

  /**
   * On lance l'intervalle qui va calculer le temps restant chaque seconde et l'envoyer au desktop.
   */
  start() {
    GameManager.updateState(GameState.Running);
    this.interval = setInterval(() => {
      if (this.isRunning) {
        this.remainingTime -= 1;
        const converted = this.convertToMinutes(this.remainingTime);
        document.querySelector('#timer').innerHTML = `${converted.minutes}:${converted.seconds}`;
        Socket.emit('timer:change', converted);
        if (this.remainingTime === 0) {
          App.setWinState(false);
          GameManager.updateState(GameState.Losing);
          PAGES.fade('inventory', false);
          Socket.emit('timer:end');
          clearInterval(this.interval);
        }
      }
    },                          1000);
  }

  /**
   * On convertit le nombre de seconde en un truc un peu mieux :).
   * @param number
   */
  convertToMinutes(number: number) {
    const minutes = parseInt((number / 60).toString(), 10);
    const seconds = (`0${number % 60}`).slice(-2);
    return {
      minutes,
      seconds,
    };
  }
}

export default new TimerManager();
