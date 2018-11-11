import NavigationBarManager from './NavigationBarManager';
import Socket from '../utils/Socket';

export enum GameState {
  Running,
  Losing,
  Wining,
}

class GameManager {
  private state: GameState;

  init() {
    this.updateState(GameState.Running);
    Socket.on('game:win', () => this.updateState(GameState.Wining));
  }

  updateState(state: GameState) {
    this.state = state;
    NavigationBarManager.handleGameState(this.state);
  }
}

export default new GameManager();
