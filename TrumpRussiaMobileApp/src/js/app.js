import '../style/index.scss';
import { onDomReady  } from './utils/DomReady';
import { App } from './core/App';

const app = new App();
onDomReady(() => app.init());
