import '../style/index.scss';
import { onDomReady  } from './utils/DomReady';
import { App } from './core/App';
import 'nouislider/distribute/nouislider.min.css';

const app = new App();
onDomReady(() => {
  app.init()
});
