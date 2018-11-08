/**
 * EnvelopesManager gère le bouton de sélection d'enveloppes. Lorsque la caméra vise une enveloppe sur le desktop,
 * un événement est reçu. On change alors l'opacité du bouton pour signaler que l'action est disponible et on autorise
 * le drag sur l'élément.
 */

import Socket from '../utils/Socket';
import { Draggable } from '../utils/Draggable';
import { PAGES } from '../utils/Pages';

class EnvelopesManager {

  private static INACTIVE_OPACITY = '0.4';

  private readonly draggableEnvelope: HTMLImageElement;
  private readonly inventory: HTMLElement;
  private envelopes: NodeListOf<HTMLElement>;
  private readonly envelopesActives: NodeListOf<HTMLElement>;
  private readonly goBack: HTMLElement;
  private readonly goNext: HTMLElement;
  private draggable: Draggable;
  private currentHover: any;

  constructor() {
    this.draggableEnvelope = (document.getElementById('envelope-draggable') as HTMLImageElement);
    this.inventory = document.getElementById('inventory');
    this.envelopes = this.inventory.querySelectorAll('.inventory_item');
    this.envelopesActives = document.querySelectorAll('.over .inventory_item-active span');
    this.goBack = document.querySelector('.over .go-back');
    this.goNext = document.querySelector('.over .next-step');
    this.draggable = new Draggable(
      this.draggableEnvelope,
      this.inventory,
      this.onDraggedEnvelope.bind(this),
    );
    this.currentHover = null;

    this.draggableEnvelope.style.opacity = EnvelopesManager.INACTIVE_OPACITY;
  }

  onClickActive() {
    document.querySelector('.over .envelope').classList.add('active');
  }

  onClickGoBack() {
    document.querySelector('.over .envelope').classList.remove('active');
  }

  onClickGoNext() {
    PAGES.show('phone');
  }

  /**
   * On écoute l'événement "hover" reçu par le serveur.
   */
  init() {
    Socket.on('envelope:hover', this.onHoverEnvelope.bind(this));
    for (const envelope of this.envelopesActives) {
      envelope.addEventListener('click', this.onClickActive.bind(this));
    }
    this.goBack.addEventListener('click', this.onClickGoBack.bind(this));
    this.goNext.addEventListener('click', this.onClickGoNext.bind(this));
  }

  /**
   * On met à jour l'affichage.
   * @param envelope
   */
  onHoverEnvelope(envelope: HTMLElement) {
    this.currentHover = envelope;
    this.draggable.enable = envelope !== null;
    this.draggableEnvelope.style.opacity = this.draggable.enable ? '1' : EnvelopesManager.INACTIVE_OPACITY;
  }

  /**
   * On "illumine" la case Enveloppe dans l'inventaire.
   */
  onDraggedEnvelope() {
    const actives = this.inventory.querySelectorAll('.inventory_item-active');
    this.envelopes[actives.length].classList.add('inventory_item-active');
    Socket.emit('envelope:dragged', this.currentHover);
  }
}

export default new EnvelopesManager();
