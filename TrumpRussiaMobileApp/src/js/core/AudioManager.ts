import { CONFIG } from '../config';
import { Howl } from 'howler';

class AudioManager {
  private audios: any = {};
  private static SOUNDS_BASE_URL: string = './assets/sounds/';

  init() {
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

  play(sound: string) {
    this.audios[sound].play();
    // lowLag.play(`${AudioManager.SOUNDS_BASE_URL}${sound}`);
  }
}

export default new AudioManager();
