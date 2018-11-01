import Socket from '../utils/Socket';

class Timer {
  private remainingTime: number;
  private interval: any;
  private isRunning: boolean = true;

  constructor() {
    this.remainingTime = 30; // 300;
    this.interval = null;
  }

  stop() {
    this.isRunning = false;
  }

  run() {
    this.isRunning = true;
  }

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
    }, 1000);
  }

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
