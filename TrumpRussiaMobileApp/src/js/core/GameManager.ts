import Socket from '../utils/Socket';
import MenuManager from './MenuManager';
import TimerManager from './TimerManager';
import { PAGES } from '../utils/Pages';
import App from './App';
import ShareManager from '../../../../TrumpRussiaDesktopApp/src/js/core/ShareManager';

export enum GameState {
  Starting = 'Starting',
  Running = 'Running',
  Losing = 'Losing',
  Wining = 'Wining',
}

class GameManager {
  private state: GameState;
  private elements: NodeListOf<HTMLElement>;
  private elementFullscreen: HTMLElement;
  private buttonFullscreenYes: HTMLElement;
  private buttonFullscreenNo: HTMLElement;

  init() {
    this.elementFullscreen = document.querySelector('#fullscreen');
    this.buttonFullscreenYes = document.querySelector('#fullscreen .choices .choice-yes');
    this.buttonFullscreenNo = document.querySelector('#fullscreen .choices .choice-no');
    this.elements = document.querySelectorAll('[data-game-state]');
    this.updateState(GameState.Starting);
    Socket.on('game:win', () => {
      this.updateState(GameState.Wining);
      PAGES.fade('inventory', true);
      App.setWinState(true, TimerManager.remainingTime);
    });
    this.buttonFullscreenYes.addEventListener('click', this.onClickFullscreen.bind(this, true));
    this.buttonFullscreenNo.addEventListener('click', this.onClickFullscreen.bind(this, false));
  }

  onClickFullscreen(enable: boolean) {
    this.elementFullscreen.style.display = 'none';
    if (enable) {
      const docEl = window.document.documentElement;
      const requestFullscreen =
        // @ts-ignore
        docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen
        // @ts-ignore
        || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
      if (requestFullscreen) {
        requestFullscreen.call(docEl);
      }
    }
    PAGES.show('count');
    TimerManager.runCount();
  }

  updateState(state: GameState) {
    this.state = state;
    MenuManager.handleGameState(this.state);
    if (state === GameState.Wining || state === GameState.Losing) {
      TimerManager.stop();
    }

    for (const k in GameState) {
      document.body.classList.remove(`experience-${GameState[k].toLowerCase()}`);
    }
    document.body.classList.add(`experience-${this.state.toLowerCase()}`);
    this.elements.forEach((el: HTMLElement) => {
      const exists = el.getAttribute('data-game-state').split('|').indexOf(state) !== -1;
      el.style.display = exists ? 'block' : 'none';
    });
  }

  getState() {
    return this.state;
  }
}

export default new GameManager();
