export class Timer {
  private socket: SocketIOClient.Socket;
  private remainingTime: number;
  private interval: any;

  constructor(socket: SocketIOClient.Socket) {
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
        this.remainingTime -= 1;
        const converted = this.convertToMinutes(this.remainingTime);
        document.querySelector('#timer').innerHTML = `${converted.minutes}:${converted.seconds}`;
      }
    },                          1000);
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
