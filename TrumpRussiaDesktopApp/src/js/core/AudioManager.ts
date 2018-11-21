import { CONFIG } from '../config';
import { Howl, Howler } from 'howler';
import Socket from './Socket';
import LoaderManager from './LoaderManager';

class AudioManager {
  private audios: any = {};
  private static SOUNDS_BASE_URL: string = './assets/sounds/';
  public isMute: boolean = false;
  private soundElement: HTMLElement;
  private introductionSound: Howl;
  private bassSound: Howl;
  private currentVoice: string;
  private voicePlayed: string[] = [];

  init() {
    this.soundElement = document.querySelector('#pause .sound-controls');
    this.soundElement.addEventListener('click', this.toggleMute.bind(this));
    Socket.on('sound:toggle', this.toggleMuteSocket.bind(this));
    this.updateSoundDisplay();
    for (const configSound of CONFIG.SOUNDS) {
      const sound = configSound as any;
      if (typeof sound === 'string') {
        console.log('Loading sound', sound);
        this.audios[sound] = new Howl({
          src: [`${AudioManager.SOUNDS_BASE_URL}${sound}`],
          preload: true,
          onload: () => {
            LoaderManager.incrementLoading();
          },
        });
      } else {
        console.log('Loading sound', sound.sound);
        this.audios[sound.sound] = new Howl({
          src: [`${AudioManager.SOUNDS_BASE_URL}${sound.sound}`],
          volume: sound.volume, loop: sound.loop || false,
          preload: true,
          onload: () => {
            LoaderManager.incrementLoading();
          },
        });
      }
      // lowLag.load(`${AudioManager.SOUNDS_BASE_URL}${sound}`);
    }
  }

  playVoice(voice: string) {
    if (this.voicePlayed.indexOf(voice) === -1) {
      if (this.currentVoice) {
        this.audios[`voices/${this.currentVoice}`].fade(1, 0, 500);
      }
      this.currentVoice = voice;
      setTimeout(() => { this.audios[`voices/${voice}`].play(); }, 1000);
      this.voicePlayed.push(voice);
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

  playIntroSound() {
    this.introductionSound = this.audios['Musique_IntroFin.mp3'].play();
  }

  playBassSound() {
    this.bassSound = this.audios['AmbianceEnveloppes.wav'].play();
    this.audios['AmbianceEnveloppes.wav'].fade(0, 1, 1500);
    this.audios['Musique_IntroFin.mp3'].fade(0.1, 0, 1500);
  }

  play(sound: string) {
    if (!this.isMute) {
      this.audios[sound].play();
    }
  }
}

export default new AudioManager();
