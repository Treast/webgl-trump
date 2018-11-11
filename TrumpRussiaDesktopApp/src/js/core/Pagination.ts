/**
 * Pagination gère la pagination lors du début de l'expérience.
 */

// @ts-ignore
import { TweenMax } from 'gsap';

class Pagination {
  private readonly element: HTMLElement;
  private innerPages: NodeListOf<HTMLElement>;
  private innerPaginationPages: NodeListOf<HTMLElement>;
  private currentIndex: number;
  private maxIndex: number;

  constructor() {
    this.element = document.querySelector('section[data-page="introduction"] .inner');
    this.currentIndex = 1;
  }

  /**
   * On initialise les pages, les listeners et on met à jour l'affichage.
   */
  init() {
    this.initPages();
    this.initListeners();
    this.refreshPage();
    this.refreshClasses();
  }

  /**
   * On récupère toutes les pages et les points de paginations.
   */
  private initPages() {
    this.innerPages = this.element.querySelectorAll('.inner-page') as NodeListOf<HTMLElement>;
    this.innerPaginationPages = this.element.querySelectorAll('.pages .page') as NodeListOf<HTMLElement>;
    this.maxIndex = this.innerPages.length;
  }

  /**
   * On initialise les listeners sur les boutons précédent et suivant.
   */
  private initListeners() {
    this.element.querySelector('.arrow-left').addEventListener('click', () => { this.goPrev(); });
    this.element.querySelector('.arrow-right').addEventListener('click', () => { this.goNext(); });
    this.element.querySelector('.pagination-pass').addEventListener('click', () => { this.goToEnd(); });
  }

  /**
   * On regarde sur quelle page on se trouve et on met à jour l'affichage de la pagination et des boutons.
   */
  private refreshClasses() {
    if (this.currentIndex === this.maxIndex) {
      this.element.querySelector('.arrow-right').classList.add('disabled');
    } else {
      this.element.querySelector('.arrow-right').classList.remove('disabled');
    }

    if (this.currentIndex === 1) {
      this.element.querySelector('.arrow-left').classList.add('disabled');
    } else {
      this.element.querySelector('.arrow-left').classList.remove('disabled');
    }

    for (const page of this.innerPaginationPages) {
      if (parseInt(page.getAttribute('data-inner-page'), 10) <= this.currentIndex) {
        page.classList.add('selected');
      } else {
        page.classList.remove('selected');
      }
    }
  }

  /**
   * On change l'opacité de la page courante et de la page suivante.
   */
  private refreshPage() {
    for (const innerPage of this.innerPages) {
      if (innerPage.getAttribute('data-inner-page') === this.currentIndex.toString(10)) {
        TweenMax.to(innerPage, 0.2, {
          opacity: 1,
          delay: 0.2,
          onStart: () => {
            innerPage.style.display = 'block';
          },
        });
      } else {
        TweenMax.to(innerPage, 0.2, {
          opacity: 0,
          onComplete: () => {
            innerPage.style.display = 'none';
          },
        });
      }
    }
    this.refreshClasses();
  }

  /**
   * On passe à la page suivante et on met à jour l'affichage.
   */
  private goNext() {
    this.currentIndex += 1;

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }

    this.refreshPage();
  }

  /**
   * Aller à la dernière page.
   */
  private goToEnd() {
    this.currentIndex = this.maxIndex;
    this.refreshPage();
  }

  /**
   * On passe à la page précédente et on met à jour l'affichage.
   */
  private goPrev() {
    this.currentIndex -= 1;

    if (this.currentIndex < 1) {
      this.currentIndex = 1;
    }

    this.refreshPage();
  }
}

export default new Pagination();
