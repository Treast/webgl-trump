import { TweenMax } from 'gsap';
import { CONFIG } from '../config';
import { PAGES } from '../utils/Pages';
import Pagination from './Pagination';

class LoaderManager {
  private readonly element: HTMLElement;
  private readonly elementMaxWidth: number;
  private currentLoading: number;
  private numberOfElementsToLoad: number;

  constructor() {
    this.element = document.querySelector('.loader-white');
    this.elementMaxWidth = window.innerWidth;
    this.currentLoading = 0;
    this.numberOfElementsToLoad = CONFIG.SOUNDS.length + 1;
  }

  init() {
  }

  public incrementLoading() {
    this.currentLoading += 1;
    this.updateLoading();
  }

  updateLoading() {
    const loading = this.currentLoading / this.numberOfElementsToLoad * 100;
    (document.querySelector('.loader_value') as HTMLElement).innerHTML = `${Math.round(loading)}%`;
    const width = loading * this.elementMaxWidth / 100;
    this.element.style.width = `${width}px`;
    if (this.currentLoading === this.numberOfElementsToLoad) {
      setTimeout(
        () => {
          Pagination.refreshPage();
          PAGES.fade('introduction');
        },
        500,
      );
    }
  }
}

export default new LoaderManager();
