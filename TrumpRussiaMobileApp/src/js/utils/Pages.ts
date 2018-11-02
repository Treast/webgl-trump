/**
 * Système de pages qui nous permet d'afficher des écrans prédéfinis tout au long de l'expérience.
 */

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
  },

  /**
   * On affiche la page dont le nom est passé en paramètre.
   * @param name
   */
  show (name: string) {
    this.items.forEach((item: any) => {
      item.style.display = item.getAttribute('data-page') === name ? 'block' : 'none';
    });
  },

};
