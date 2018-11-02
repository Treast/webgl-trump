/**
 * Le TimerManager gère le temps de l'événement. L'affichage du timer est mis à jour toutes les secondes, est affiché
 * en haut du desktop et du smartphone. Une fois le timer dépassé, un événément est envoyé et l'écran de défaite est affichée.
 */

import Socket from '../utils/Socket';

class Timer {
  private remainingTime: number;
  private interval: any;
  private isRunning: boolean = true;

  constructor() {
    this.remainingTime = 300; // 300;
    this.interval = null;
  }

  /**
   * On stoppe le timer.
   */
  stop() {
    this.isRunning = false;
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
    this.interval = setInterval(() => {
      if (this.isRunning) {
        this.remainingTime -= 1;
        const converted = this.convertToMinutes(this.remainingTime);
        document.querySelector('#timer').innerHTML = `${converted.minutes}:${converted.seconds}`;
        Socket.emit('timer:change', converted);
        if (this.remainingTime === 0) {
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

export default new Timer();
