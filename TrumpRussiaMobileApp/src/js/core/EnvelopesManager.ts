/**
 * EnvelopesManager gère le bouton de sélection d'enveloppes. Lorsque la caméra vise une enveloppe sur le desktop,
 * un événement est reçu. On change alors l'opacité du bouton pour signaler que l'action est disponible et on autorise
 * le drag sur l'élément.
 */

import Socket from '../utils/Socket';
import { Draggable } from '../utils/Draggable';
import { PAGES } from '../utils/Pages';
import { CONFIG } from '../config';
import App from './App';
import Timer from './TimerManager';

class EnvelopesManager {

  private static INACTIVE_OPACITY = '0.2';
  private static NUMBER_ENVELOPES: number = 5;

  private readonly btnEnvelope: HTMLImageElement;
  private readonly btnEnvelopeWrapper: HTMLImageElement;
  private readonly inventory: HTMLElement;
  private readonly envelopesActives: NodeListOf<HTMLElement>;
  private readonly goBack: HTMLElement;
  private currentHover: any;
  private envelopeCount: number = 0;

  constructor() {
    this.btnEnvelope = (document.getElementById('envelope-draggable') as HTMLImageElement);
    this.btnEnvelopeWrapper = (document.querySelector('#envelop .button-envelop') as HTMLImageElement);
    this.inventory = document.getElementById('inventory');
    // this.envelopes = this.inventory.querySelectorAll('.inventory_item');
    this.envelopesActives = document.querySelectorAll('.inventory .inventory_item-active span');
    this.goBack = document.querySelector('.envelope .go-back');
    this.currentHover = null;

    document.querySelectorAll('.credits .envelop-content a').forEach((element) => {
      const index = element.getAttribute('data-envelope');
      element.setAttribute('href', CONFIG.ENVELOPES[parseInt(index, 10)].url);
    });

    this.btnEnvelopeWrapper.style.opacity = EnvelopesManager.INACTIVE_OPACITY;
  }

  onClickActive(e: Event) {
    const element = e.target as HTMLElement;
    const id = parseInt(element.getAttribute('data-envelope'), 10);
    if (element.parentElement.classList.contains('inventory_item-active')) {
      const badge = document.querySelector('.menu_items .badge') as HTMLElement;
      badge.innerText = (parseInt(badge.innerText, 10) - 1).toString();
      element.parentElement.classList.remove('inventory_item-active');
    }
    document.querySelector('.envelope h1').innerHTML = CONFIG.ENVELOPES[id].id;
    document.querySelector('.envelope h2.title').innerHTML = CONFIG.ENVELOPES[id].title;
    document.querySelector('.envelope h2.source').innerHTML = CONFIG.ENVELOPES[id].source;
    document.querySelector('.envelope .content p').innerHTML = CONFIG.ENVELOPES[id].content;
    document.querySelector('.envelope').classList.add('active');
  }

  /**
   * On écoute l'événement "hover" reçu par le serveur.
   */
  init() {
    Socket.on('envelope:hover', this.onHoverEnvelope.bind(this));
    Socket.on('envelope:delete', this.onEnvelopeDelete.bind(this));
    this.goBack.addEventListener('click', this.onClickGoBack.bind(this));
    this.btnEnvelope.addEventListener('click', this.onClickedEnvelope.bind(this));
    for (const envelope of this.envelopesActives) {
      envelope.addEventListener('click', this.onClickActive.bind(this));
    }
    this.updateCountEnvelope();
  }

  onClickGoBack() {
    document.querySelector('.envelope').classList.remove('active');
  }

  /**
   * On met à jour l'affichage.
   * @param envelope
   */
  onHoverEnvelope(envelope?: HTMLElement) {
    this.currentHover = envelope;
    if (this.currentHover === null) {
      this.btnEnvelopeWrapper.classList.remove('active');
    } else {
      this.btnEnvelopeWrapper.classList.add('active');
    }
    this.btnEnvelopeWrapper.style.opacity = this.currentHover === null ? EnvelopesManager.INACTIVE_OPACITY : '1';
  }

  /**
   * On "illumine" la case Enveloppe dans l'inventaire.
   */
  onClickedEnvelope() {
    if (this.currentHover === null) return;
    Socket.emit('envelope:pickup', this.currentHover);
  }

  onEnvelopeDelete() {
    this.envelopeCount += 1;
    const disabledEnvelope = (document.querySelector('.inventory .inventory_item-disabled') as HTMLElement);
    disabledEnvelope.classList.remove('inventory_item-disabled');
    disabledEnvelope.classList.add('inventory_item-active');
    disabledEnvelope.querySelector('span').addEventListener('click', this.onClickActive.bind(this));
    this.updateCountEnvelope();
    if (this.envelopeCount >= EnvelopesManager.NUMBER_ENVELOPES) {
      // todo: implements win state
      App.setWinState(true, Timer.remainingTime);
    }
  }

  updateCountEnvelope () {
    (document.querySelectorAll('[data-envelope-count]')).forEach((el: HTMLElement) => {
      el.innerText = this.envelopeCount.toString();
    });
  }
}

export default new EnvelopesManager();
