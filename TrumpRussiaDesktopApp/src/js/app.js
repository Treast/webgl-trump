import './../style/index.scss';
import { onDomReady } from './utils/DomReady';
import { App } from './core/App.js';
import { Pages } from './utils/Pages';

const app = new App();

onDomReady(() => {
    Pages.init();
    app.init();
});

