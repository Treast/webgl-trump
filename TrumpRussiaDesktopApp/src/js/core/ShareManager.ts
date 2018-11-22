import Game, { GameState } from './Game';
import TimerManager from './TimerManager';

class ShareManager {
  private twitterButton: HTMLElement;
  private facebookButton: HTMLElement;

  init() {
    this.twitterButton = document.querySelector('.twitter-share img');
    this.facebookButton = document.querySelector('.facebook-share img');
    this.setupListeners();
  }

  setupListeners() {
    this.twitterButton.addEventListener('click', this.onClickTwitter.bind(this));
    this.facebookButton.addEventListener('click', this.onClickFacebook.bind(this));
  }

  changeText(minutes: any, seconds: any) {
    document.querySelector('.page_end .timer-minutes').innerHTML = minutes;
    document.querySelector('.page_end .timer-seconds').innerHTML = seconds;
    switch (Game.state) {
      case GameState.Wining:
        const text = `J'ai piraté Donald Trump en ${parseInt(minutes, 10)}m${parseInt(seconds, 10)}s.
Peux-tu faire mieux ? #TrumpsSecrets

https://trump.vincentriva.fr`;
        this.twitterButton.parentElement.setAttribute('href', `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
        break;
      case GameState.Losing:
        break;
    }
  }

  onClickTwitter() {

  }

  onClickFacebook() {
    // @ts-ignore
    FB.ui({
      method: 'share',
      href: 'https://developers.facebook.com/docs/',
    },    (response: any) => {});
  }
}

export default new ShareManager();
