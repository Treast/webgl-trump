import Socket from '../utils/Socket';
import MenuManager from './MenuManager';
import TimerManager from './TimerManager';
import { PAGES } from '../utils/Pages';

export enum GameState {
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
    this.updateState(GameState.Running);
    Socket.on('game:win', () => this.updateState(GameState.Wining));
    this.buttonFullscreenYes.addEventListener('click', this.onClickFullscreenYes.bind(this));
    this.buttonFullscreenNo.addEventListener('click', this.onClickFullscreenNo.bind(this));
  }

  onClickFullscreenYes() {
    this.elementFullscreen.style.display = 'none';
    const docEl = window.document.documentElement;
    const requestFullscreen =
      // @ts-ignore
      docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    requestFullscreen.call(docEl);
    PAGES.show('count');
    TimerManager.runCount();
  }

  onClickFullscreenNo() {
    this.elementFullscreen.style.display = 'none';
    PAGES.show('count');
    TimerManager.runCount();
  }

  updateState(state: GameState) {
    this.state = state;
    MenuManager.handleGameState(this.state);
    this.elements.forEach((el: HTMLElement) => {
      const exists = el.getAttribute('data-game-state').split('|').indexOf(state) !== -1;
      el.style.display = exists ? 'block' : 'none';
    });
  }
}

export default new GameManager();
