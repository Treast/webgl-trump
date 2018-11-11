import { GameState } from './GameManager';

/**
 * Classe qui permet de gerer la barre de navigation en bas de l'écran
 */
class NavigationBarManager {
  private btnController: HTMLElement;
  private btnInventory: HTMLElement;
  private btnPhone: HTMLElement;

  private static BTN_ENABLE_OPACITY: string = '1';
  private static BTN_DISABLE_OPACITY: string = '0.3';

  init() {
    this.btnController = document.querySelector('.menu_app');
    this.btnInventory = document.querySelector('.menu_envelope');
    this.btnPhone = document.querySelector('.menu_phone');
  }

  handleGameState(gameState: GameState) {
    switch (gameState) {
      case GameState.Wining: {
        this.enable(this.btnController);
        this.enable(this.btnInventory);
        this.enable(this.btnPhone);
        break;
      }
      default: {
        this.enable(this.btnController);
        this.disable(this.btnInventory);
        this.disable(this.btnPhone);
        break;
      }
    }
  }

  enable(btn: HTMLElement) {
    btn.style.opacity = NavigationBarManager.BTN_ENABLE_OPACITY;
  }

  disable(btn: HTMLElement) {
    btn.style.opacity = NavigationBarManager.BTN_DISABLE_OPACITY;
  }
}

export default new NavigationBarManager();
