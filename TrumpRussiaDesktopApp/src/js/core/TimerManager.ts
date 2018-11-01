import { SOCKET } from './Socket';
import { TimerValue } from '../typing';

class TimerManager {

  private timer: any;

  init () {
    this.timer = document.getElementById('timer');
    this.initSocketListener();
  }

  private initSocketListener() {
    SOCKET.getInstance().on('timer:change', this.onTimerChange.bind(this));
  }

  private onTimerChange (value: TimerValue) {
    this.timer.innerHTML = `${value.minutes}:${value.seconds}`;
  }
}

export default new TimerManager();
