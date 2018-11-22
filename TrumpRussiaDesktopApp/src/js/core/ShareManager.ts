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

  changeText() {
    switch (Game.state) {
      case GameState.Wining:
        const text = `J'ai piraté une salle secrète de Trump en ${TimerManager.timerMinutes}:${TimerManager.timerSeconds}.
        Peux-tu faire mieux ? #TrumpsSecret\n\nhttps://trump.vincentriva.fr`;
        this.twitterButton.parentElement.setAttribute('href', `https://twitter.com/intent/tweet?text=${text}`);
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
