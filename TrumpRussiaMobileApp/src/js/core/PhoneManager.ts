import { PAGES } from '../utils/Pages';
import AudioManager from './AudioManager';

class PhoneManager {
  private readonly numbers: NodeListOf<HTMLElement>;
  private readonly input: HTMLElement;
  private readonly deleteInput: HTMLElement;
  private readonly callInput: HTMLElement;
  private readonly goBack: HTMLElement;
  private readonly endCallButton: HTMLElement;

  constructor() {
    this.numbers = document.querySelectorAll('.phone .numbers .number span');
    this.deleteInput = document.querySelector('.phone .numbers .number.delete');
    this.callInput = document.querySelector('.phone .numbers .number.call');
    this.input = document.querySelector('.phone .phone-number');
    this.goBack = document.querySelector('.phone .go-back');
    this.endCallButton = document.querySelector('.call .end-call');
  }

  init() {
    this.setupListeners();
  }

  setupListeners() {
    for (const number of this.numbers) {
      number.addEventListener('click', (e) => {
        const element: HTMLElement = e.target as HTMLElement;
        const number: string = element.getAttribute('data-number');
        const sound: string = element.getAttribute('data-sound');
        if (number) this.addNumber(number);
        if (sound) {
          AudioManager.play(sound);
        }
      });
    }
    this.deleteInput.addEventListener('click', () => {
      this.deleteNumber();
    });
    this.callInput.addEventListener('click', () => {
      this.call();
    });
    this.goBack.addEventListener('click', this.onClickGoBack.bind(this));
    this.endCallButton.addEventListener('click', this.endCall.bind(this));
  }

  onClickGoBack() {
    PAGES.fade('over');
  }

  addNumber(number: string) {
    if (this.input.innerText.length < 14) {
      let newNumber: string = this.input.innerText + number;
      newNumber = newNumber.replace(/(\d{2})/g, '$1 ');
      this.input.innerText = newNumber;
    }
  }

  deleteNumber() {
    this.input.innerText = this.input.innerText.slice(0, -1);
  }

  call() {
    PAGES.fade('call');
  }

  endCall() {
    const audio = new Audio('./assets/sounds/fortnite-death-sound.mp3');
    audio.play();
  }
}

export default new PhoneManager();
