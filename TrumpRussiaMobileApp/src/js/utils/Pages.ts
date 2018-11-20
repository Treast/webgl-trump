import { TimelineMax } from 'gsap';
import Socket from './Socket';

/**
 * Système de pages qui nous permet d'afficher des écrans prédéfinis tout au long de l'expérience.
 */

interface PagesManager {
  items: string[];
  init: () => void;
  show: (name: string, trigger?: boolean) => void;
  fade: (name: string, trigger?: boolean) => void;
  handleDependencies: (name: string) => void;
  get: () => string;
}

export const PAGES: PagesManager = {

  items: [],

  /**
   * On stock toutes les pages et on les cache.
   */
  init () {
    this.items = document.querySelectorAll('[data-page]');
    this.dependencies = document.querySelectorAll('[data-show-onpage]');
    this.items.forEach((item: any) => item.style.display = 'none');
    this.dependencies.forEach((item: any) => item.style.display = 'none');
  },

  /**
   * On affiche la page dont le nom est passé en paramètre.
   * @param name
   * @param trigger
   */
  show (name: string, trigger: boolean = false) {
    this.handleDependencies(name);
    this.items.forEach((item: any) => {
      item.style.display = item.getAttribute('data-page') === name ? 'block' : 'none';
    });
    if (trigger) Socket.emit('page:show', name);
  },

  /**
   * On affiche la page dont le nom est passé en paramètre.
   * @param name
   * @param trigger
   */
  fade (name: string, trigger: boolean = false) {
    this.handleDependencies(name);
    const currentPage = document.querySelector(`[data-page="${this.get()}"]`) as HTMLElement;
    const nextPage = document.querySelector(`[data-page="${name}"]`) as HTMLElement;
    const timeline = new TimelineMax();
    timeline.to(currentPage, 0.2, {
      alpha: 0,
      onComplete: () => {
        currentPage.style.display = 'none';
        currentPage.style.opacity = '1';
      },
    });
    timeline.fromTo(nextPage, 0.2, {
      alpha: 0,
    },              {
      alpha: 1,
      onStart: () => {
        nextPage.style.display = 'block';
      },
    });
    timeline.play();
    if (trigger) Socket.emit('page:show', name);
  },

  get () {
    for (const item of this.items) {
      if (item.style.display === 'block') {
        return item.getAttribute('data-page');
      }
    }
    return null;
  },

  handleDependencies (name: string) {
    this.dependencies.forEach((el: HTMLElement) => {
      el.style.display = el.getAttribute('data-show-onpage').split('|').indexOf(name) !== -1 ? 'block' : 'none';
    });
  },

};
