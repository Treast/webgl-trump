import '../style/index.scss';
import { onDomReady  } from './utils/DomReady';
import { App } from './core/App';
import 'nouislider/distribute/nouislider.min.css';
import * as noUiSlider from 'nouislider';

const app = new App();
onDomReady(() => {
  const slider = document.querySelector('.zoom-slider .range');
  noUiSlider.create(slider, {
    start: 0,
    range: {
      'min': [0],
      'max': [100]
    },
    pips: {
      mode: 'values',
      values: [],
      density: 4
    },
    orientation: 'vertical',
    direction: 'rtl',
  });

  slider.noUiSlider.on('update', () => {
    const pipes = document.querySelectorAll('.noUi-marker.noUi-marker-vertical');
    const value = slider.noUiSlider.get();

    for(const pipe of pipes) {
      const top = parseInt(pipe.style.bottom);
      if(top <= value) {
        pipe.classList.add('selected');
      } else {
        pipe.classList.remove('selected');
      }
    }
  });

  app.init()
});
