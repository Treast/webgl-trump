import { CONFIG } from '../config';
import { Howl, Howler } from 'howler';
import Socket from '../utils/Socket';

class AudioManager {
  private audios: any = {};
  private static SOUNDS_BASE_URL: string = './assets/sounds/';
  public isMute: boolean = false;
  private soundElement: HTMLElement;

  init() {
    this.soundElement = document.querySelector('#pause .sound-controls');
    this.soundElement.addEventListener('click', this.toggleMute.bind(this));
    Socket.on('sound:toggle', this.toggleMuteSocket.bind(this));
    this.updateSoundDisplay();
    for (const configSound of CONFIG.SOUNDS) {
      const sound = configSound as any;
      if (typeof sound === 'string') {
        console.log('Loading sound', sound);
        this.audios[sound] = new Howl({ src: [`${AudioManager.SOUNDS_BASE_URL}${sound}`] });
      } else {
        console.log('Loading sound', sound.sound);
        this.audios[sound.sound] = new Howl({ src: [`${AudioManager.SOUNDS_BASE_URL}${sound.sound}`], volume: sound.volume });
      }
      // lowLag.load(`${AudioManager.SOUNDS_BASE_URL}${sound}`);
    }
  }

  toggleMute() {
    this.isMute = !this.isMute;
    Howler.mute(this.isMute);
    Socket.emit('sound:toggle');
    this.updateSoundDisplay();
  }

  toggleMuteSocket() {
    this.isMute = !this.isMute;
    Howler.mute(this.isMute);
    this.updateSoundDisplay();
  }

  updateSoundDisplay() {
    if (this.isMute) {
      (this.soundElement.querySelector('.sound-on') as HTMLElement).style.display = 'none';
      (this.soundElement.querySelector('.sound-off') as HTMLElement).style.display = 'flex';
    } else {
      (this.soundElement.querySelector('.sound-on') as HTMLElement).style.display = 'flex';
      (this.soundElement.querySelector('.sound-off') as HTMLElement).style.display = 'none';
    }
  }

  play(sound: string) {
    if (!this.isMute) {
      this.audios[sound].play();
    }
  }
}

export default new AudioManager();
