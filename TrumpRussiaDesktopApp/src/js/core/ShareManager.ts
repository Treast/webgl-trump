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
