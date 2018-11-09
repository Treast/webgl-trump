import { CONFIG } from '../config';

class AudioManager {
  private audios: any = {};
  private static SOUNDS_BASE_URL: string = './assets/sounds/';

  init() {
    for (const sound of CONFIG.SOUNDS) {
      this.audios[sound] = new Audio(`${AudioManager.SOUNDS_BASE_URL}${sound}`);
    }
  }

  play(uri: string) {
    this.audios[uri].play();
  }
}

export default new AudioManager();
