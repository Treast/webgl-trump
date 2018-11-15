import { CONFIG } from '../config';
import lowLag from '../libs/lowLag';

class AudioManager {
  private static SOUNDS_BASE_URL: string = './assets/sounds/';

  init() {
    lowLag.init();
    for (const sound of CONFIG.SOUNDS) {
      lowLag.load(`${AudioManager.SOUNDS_BASE_URL}${sound}`);
    }
  }

  play(sound: string) {
    lowLag.play(`${AudioManager.SOUNDS_BASE_URL}${sound}`);
  }
}

export default new AudioManager();
