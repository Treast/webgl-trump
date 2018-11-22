import { TimelineMax } from 'gsap';
import Socket from '../core/Socket';
import Game, { GameState } from '../core/Game';

/**
 * Système de pages qui nous permet d'afficher des écrans prédéfinis tout au long de l'expérience.
 */

interface PagesManager {
  items: string[];
  init: () => void;
  show: (name: string, trigger?: boolean) => void;
  fade: (name: string, trigger?: boolean) => void;
  get: () => string;
}

export const PAGES: PagesManager = {

  items: [],

  /**
   * On stock toutes les pages et on les cache.
   */
  init () {
    this.items = document.querySelectorAll('[data-page]');
    this.items.forEach((item: any) => item.style.display = 'none');
  },

  /**
   * On affiche la page dont le nom est passé en paramètre.
   * @param name
   * @param trigger
   */
  show (name: string, trigger: boolean = false) {
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
    if (Game.state === GameState.Wining && name === 'app') {
      this.fade('game-result', trigger);
      return false;
    }
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
    if (trigger) Socket.emit('page:fade', name);
  },

  get () {
    for (const item of this.items) {
      if (item.style.display === 'block') {
        return item.getAttribute('data-page');
      }
    }
    return null;
  },

};
