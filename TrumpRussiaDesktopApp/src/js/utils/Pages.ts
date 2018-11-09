/**
 * Système de pages qui nous permet d'afficher des écrans prédéfinis tout au long de l'expérience.
 */
import Socket from '../core/Socket';

interface PagesManager {
  items: string[];
  init: () => void;
  show: (name: string) => void;
}

export const PAGES: PagesManager = {
  items: [],

  /**
   * On stock toutes les pages et on les cache.
   */
  init () {
    this.items = document.querySelectorAll('[data-page]');
    this.items.forEach((item: any) => item.style.display = 'none');
    document.body.style.display = 'block';

    Socket.on('page:show', this.show.bind(this));
  },

  /**
   * On affiche la page dont le nom est passé en paramètre.
   * @param name
   */
  show (name: string) {
    this.items.forEach((item: any) => {
      if (item.getAttribute('data-page') === name) {
        item.style.display = 'block';
        item.classList.add('page-active');
      } else {
        item.style.display = 'none';
        item.classList.remove('page-active');
      }
    });
  },

};
