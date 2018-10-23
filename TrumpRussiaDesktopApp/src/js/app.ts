import './../style/index.scss';
import { onDomReady } from './utils/DomReady';
import { App } from './core/App';
import { PAGES } from './utils/Pages';

const app = new App();

onDomReady(() => {
  PAGES.init();
  app.init();
});
