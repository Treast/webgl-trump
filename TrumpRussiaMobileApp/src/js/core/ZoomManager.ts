// @ts-ignore
import * as noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.min.css';
import Socket from '../utils/Socket';

class ZoomManager {
  private readonly element: any;
  private zoomValue: HTMLElement;

  constructor() {
    this.element = document.querySelector('.zoom-slider .range');
    this.zoomValue = document.querySelector('.zoom-value');
  }

  init() {
    this.createSlider();
    this.setupSlider();
  }

  createSlider() {
    noUiSlider.create(this.element, {
      start: 0,
      range: {
        min: [0],
        max: [100],
      },
      pips: {
        mode: 'values',
        values: [],
        density: 4,
      },
      orientation: 'vertical',
      direction: 'rtl',
    });
  }

  setupSlider() {
    this.element.noUiSlider.on('update', () => {
      const pipes = document.querySelectorAll('.noUi-marker.noUi-marker-vertical');
      const value = this.element.noUiSlider.get();

      for (const pipe of pipes) {
        const top = parseInt((pipe as HTMLElement).style.bottom, 10);
        if (top <= value) {
          pipe.classList.add('selected');
        } else {
          pipe.classList.remove('selected');
        }
      }

      this.zoomValue.innerText = `${parseInt(value, 10).toFixed(0)} %`;

      Socket.emit('camera:zoom', {
        zoom: value,
      });
    });
  }
}

export default new ZoomManager();
