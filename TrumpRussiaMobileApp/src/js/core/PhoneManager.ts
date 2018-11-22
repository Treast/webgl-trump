import { PAGES } from '../utils/Pages';
import AudioManager from './AudioManager';
import { TimelineLite } from 'gsap';
import Socket from '../utils/Socket';

class PhoneManager {
  private static TRUMP_PHONE_NUMBER: string = '06 54 78 17 35';

  private readonly numbers: NodeListOf<HTMLElement>;
  private readonly input: HTMLElement;
  private readonly deleteInput: HTMLElement;
  private readonly callInput: HTMLElement;
  private readonly goBack: HTMLElement;
  private readonly endCallButton: HTMLElement;

  constructor() {
    this.numbers = document.querySelectorAll('.phone .numbers .number span');
    this.deleteInput = document.querySelector('.phone .numbers .number.delete-action');
    this.callInput = document.querySelector('.phone .numbers .number.call-action');
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
    document.querySelector('.phone').classList.remove('show');
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
    (document.querySelector('.number-not-found') as HTMLElement).style.color = 'transparent';
    if (this.input.innerText === PhoneManager.TRUMP_PHONE_NUMBER) {
      (document.querySelector('.call') as HTMLElement).style.display = 'block';
      this.startCallAnimation();
    } else {
      (document.querySelector('.number-not-found') as HTMLElement).style.color = '#f00';
    }
  }

  endCall() {
    Socket.emit('call:end');
    PAGES.fade('');
  }

  startCallAnimation () {
    const el = document.createElement('div');
    const timeline = new TimelineLite();
    timeline.to(el, 1, {
      onComplete: () => {
        AudioManager.play('phone_ring.wav');
      },
    });
    timeline.to(el, 3.5, {
      onComplete: () => {
        AudioManager.play('phone_ring.wav');
      },
    });
    timeline.to(el, 3.5, {
      onComplete: () => {
        AudioManager.play('phone_ring.wav');
      },
    });
    timeline.to(el, 3.5, {
      onComplete: () => {
        AudioManager.play('phone_deccroche.wav');
      },
    });
    timeline.to(el, .5, {
      onComplete: () => {
        AudioManager.play('fake_news.wav');
      },
    });
    timeline.to(el, 2, {
      onComplete: () => {
        AudioManager.play('phone_raccroche.wav', 1, this.endCall.bind(this));
      },
    });
    timeline.play();
  }
}

export default new PhoneManager();
