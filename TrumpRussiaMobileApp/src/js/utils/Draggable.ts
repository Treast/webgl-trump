/**
 * Permet de déplacer un élément (ici le bouton enveloppe) lorsqu'on vise une enveloppe sur le desktop, dans une zone
 * de drop définie. Si on lâche l'élément dans la zone, un callback est lancé, rien sinon.
 */

export class Draggable {
  private el: HTMLElement;
  private targetEl: HTMLElement;
  private readonly onDragged: () => void;
  private startX: number;
  private startY: number;
  public enable: boolean;
  private isInTarget: boolean;

  constructor(el: HTMLElement, targetEl: HTMLElement, onDragged: () => void) {
    this.el = el;
    this.targetEl = targetEl;
    this.onDragged = onDragged;
    this.startX = 0;
    this.startY = 0;
    this.enable = true;
    this.isInTarget = false;

    this.el.addEventListener('touchstart', this.onTouchStartEl.bind(this));
    this.el.addEventListener('touchmove', this.onTouchMoveEl.bind(this));
    this.el.addEventListener('touchend', this.onTouchEndEl.bind(this));
  }

  /**
   * Lorsqu'on commence à drag.
   * @param e
   */
  onTouchStartEl(e: TouchEvent) {
    e.preventDefault();
    this.start(e.touches[0].clientX, e.touches[0].clientY);
  }

  /**
   * Lorsqu'on drag.
   * @param e
   */
  onTouchMoveEl(e: TouchEvent) {
    e.preventDefault();
    this.move(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  /**
   * Lorsqu'on finit de drag.
   */
  onTouchEndEl() {
    this.end();
  }

  /**
   * On stock les valeurs de départ.
   * @param x
   * @param y
   */
  start(x: number, y: number) {
    this.startX = x;
    this.startY = y;
  }

  /**
   * On calcule la différence avec les valeurs de départ et on bouge l'élément.
   * @param x
   * @param y
   */
  move(x: number, y: number) {
    if (!this.enable) return;
    const diffX = x - this.startX;
    const diffY = y - this.startY;
    this.isInTarget = this.el.getBoundingClientRect().top > this.targetEl.getBoundingClientRect().top;
    this.moveAt(diffX, diffY);
  }

  /**
   * Si l'on lâche l'élément dans le zone de drop, on lance le callback.
   */
  end() {
    if (this.isInTarget && this.enable) this.onDragged();
    this.moveAt(0, 0);
  }

  /**
   * On calcule la translation de l'élément.
   * @param x
   * @param y
   */
  moveAt(x: number, y: number) {
    this.el.style.transform = `translate(${x}px, ${y}px)`;
  }
}
