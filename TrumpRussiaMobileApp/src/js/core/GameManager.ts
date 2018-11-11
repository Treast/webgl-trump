import Socket from '../utils/Socket';
import MenuManager from './MenuManager';

export enum GameState {
  Running = 'Running',
  Losing = 'Losing',
  Wining = 'Wining',
}

class GameManager {
  private state: GameState;
  private elements: NodeListOf<HTMLElement>;

  init() {
    this.elements = document.querySelectorAll('[data-game-state]');
    this.updateState(GameState.Running);
    Socket.on('game:win', () => this.updateState(GameState.Wining));
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
