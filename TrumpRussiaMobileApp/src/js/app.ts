import '../style/index.scss';
import { onDomReady } from './utils/DomReady';
import App from './core/App';

onDomReady(() => {
  App.init();
});
