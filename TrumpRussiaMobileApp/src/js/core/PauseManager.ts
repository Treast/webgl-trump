import Socket from '../utils/Socket';
import Timer from './Timer';
import { PAGES } from '../utils/Pages';

class PauseManager {
  private element: HTMLElement;

  init() {
    this.element = document.querySelector('#pause');
    this.setupListener();
  }

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
