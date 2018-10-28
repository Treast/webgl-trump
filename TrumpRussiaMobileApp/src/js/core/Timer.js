export class Timer {
  constructor(socket) {
    this.socket = socket;
    this.remainingTime = 300;
    this.interval = null;
  }

  init() {

  }

  start() {
    this.interval = setInterval(() => {
      if (this.remainingTime < 0) {
        this.socket.emit('timer:end');
        clearInterval(this.interval);
      } else {
        this.remainingTime--;
        const converted = this.convertToMinutes(this.remainingTime);
        document.querySelector('#timer').innerHTML = converted.minutes + ":" + converted.seconds;
      }
    }, 1000);
  }

  convertToMinutes(number) {
    const minutes = parseInt(number / 60);
    const seconds = ('0' + (number % 60)).slice(-2);
    return {
      minutes,
      seconds
    };
  }
}