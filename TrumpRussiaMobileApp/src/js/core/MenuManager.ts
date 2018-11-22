import { PAGES } from '../utils/Pages';
import { GameState } from './GameManager';
import Socket from '../utils/Socket';

class MenuManager {
  private menuElement: HTMLElement;
  private readonly menuButtons: NodeListOf<HTMLElement>;
  private btnController: HTMLElement;
  private btnInventory: HTMLElement;
  private btnPhone: HTMLElement;
  private currentPage: string = '';

  private static BTN_ENABLE_OPACITY: string = '1';
  private static BTN_DISABLE_OPACITY: string = '0.3';

  constructor() {
    this.menuElement = document.querySelector('#menu');
    this.menuButtons = this.menuElement.querySelectorAll('.menu_item span');
    this.btnController = document.querySelector('.menu_app');
    this.btnInventory = document.querySelector('.menu_envelope');
    this.btnPhone = document.querySelector('.menu_phone');
  }

  init() {
    for (const button of this.menuButtons) {
      button.addEventListener('click', this.onClick.bind(this));
    }
  }

  onClick(e: Event) {
    const button = e.target as HTMLElement;

    if (button.parentElement.classList.contains('menu_item-active')) {
      const page = button.getAttribute('data-click-page');
      if (page) {
        if (page === 'inventory') Socket.emit('run:helper');
        if (page !== this.currentPage) {
          for (const menuButton of this.menuButtons) {
            menuButton.parentElement.classList.remove('menu_item-on');
          }
          button.parentElement.classList.add('menu_item-on');
          PAGES.fade(page, true);
          this.currentPage = page;
        }
      } else {
        const clickClass = button.getAttribute('data-click-class');
        document.querySelector(clickClass).classList.add('show');
      }
    }
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
        this.enable(this.btnInventory);
        this.disable(this.btnPhone);
        break;
      }
    }
  }

  enable(btn: HTMLElement) {
    btn.parentElement.classList.add('menu_item-active');
  }

  disable(btn: HTMLElement) {
    btn.parentElement.classList.remove('menu_item-active');
  }
}

export default new MenuManager();
