import { Socket } from '../utils/Socket';
import { Draggable } from '../utils/Draggable';

export class EnvelopesManager {
  private readonly draggableEnvelope: HTMLImageElement;
  private readonly inventory: HTMLElement;
  private envelopes: NodeListOf<HTMLElement>;
  private draggable: Draggable;
  private currentHover: any;

  constructor() {
    this.draggableEnvelope = (document.getElementById('envelope-draggable') as HTMLImageElement);
    this.inventory = document.getElementById('inventory');
    this.envelopes = this.inventory.querySelectorAll('.inventory_item');
    this.draggable = new Draggable(
      this.draggableEnvelope,
      this.inventory,
      this.onDraggedEnvelope.bind(this),
    );
    this.currentHover = null;
  }

  init() {
    Socket.getInstance().on('envelope:hover', this.onHoverEnvelope.bind(this));
  }

  onHoverEnvelope(envelope: HTMLElement) {
    this.currentHover = envelope;
    this.draggable.enable = envelope !== null;
    this.draggableEnvelope.src = this.draggable.enable ? './assets/envelop@2x-active.png' : './assets/envelop@2x.png';
  }

  onDraggedEnvelope() {
    const actives = this.inventory.querySelectorAll('.inventory_item-active');
    this.envelopes[actives.length].classList.add('inventory_item-active');
    Socket.getInstance().emit('envelope:dragged', this.currentHover);
  }

}
