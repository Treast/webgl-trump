// @ts-ignore
import { TweenMax } from 'gsap';

export class Pagination {
  private readonly element: HTMLElement;
  private innerPages: NodeListOf<HTMLElement>;
  private innerPaginationPages: NodeListOf<HTMLElement>;
  private currentIndex: number;
  private maxIndex: number;

  constructor(element: HTMLElement) {
    this.element = element;
    this.currentIndex = 1;
    this.initPages();
    this.initListeners();
    this.refreshPage();
    this.refreshClasses();
  }

  private initPages() {
    this.innerPages = this.element.querySelectorAll('.inner-page') as NodeListOf<HTMLElement>;
    this.innerPaginationPages = this.element.querySelectorAll('.pages .page') as NodeListOf<HTMLElement>;
    this.maxIndex = this.innerPages.length;
  }

  private initListeners() {
    this.element.querySelector('.arrow-left').addEventListener('click', () => { this.goPrev(); });
    this.element.querySelector('.arrow-right').addEventListener('click', () => { this.goNext(); });
  }

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

  private goNext() {
    this.currentIndex += 1;

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }

    this.refreshPage();
  }

  private goPrev() {
    this.currentIndex -= 1;

    if (this.currentIndex < 1) {
      this.currentIndex = 1;
    }

    this.refreshPage();
  }
}
