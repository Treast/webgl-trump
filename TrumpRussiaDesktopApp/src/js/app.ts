/**
 * Entrée de l'application
 *
 * On initiliase le système de pages, la pagination pour la première page et on lance l'application.
 */

import './../style/index.scss';
import { onDomReady } from './utils/DomReady';
import { App } from './core/App';
import { PAGES } from './utils/Pages';
import Pagination from './core/Pagination';
import AudioManager from './core/AudioManager';

const app = new App();

onDomReady(() => {
  AudioManager.init();
  PAGES.init();
  Pagination.init();
  app.init();
});
