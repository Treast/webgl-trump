import { PAGES } from '../utils/Pages';

class MenuManager {
  private menuElement: HTMLElement;
  private readonly menuButtons: NodeListOf<HTMLElement>;

  constructor() {
    this.menuElement = document.querySelector('#menu');
    this.menuButtons = this.menuElement.querySelectorAll('.menu_item span');
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
      PAGES.fade(page);
    }
  }
}

export default new MenuManager();
