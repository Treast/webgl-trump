import './../style/index.scss';
import { onDomReady } from './utils/DomReady';
import { App } from './core/App';
import { PAGES } from './utils/Pages';
import { Pagination} from './core/Pagination';

const app = new App();

onDomReady(() => {
  PAGES.init();

  const inner = document.querySelector('section[data-page="introduction"] .inner') as HTMLElement;
  new Pagination(inner);

  app.init();
});
