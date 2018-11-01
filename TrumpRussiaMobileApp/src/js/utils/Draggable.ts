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

  onTouchStartEl(e: TouchEvent) {
    e.preventDefault();
    this.start(e.touches[0].clientX, e.touches[0].clientY);
  }

  onTouchMoveEl(e: TouchEvent) {
    e.preventDefault();
    this.move(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }

  onTouchEndEl() {
    this.end();
  }

  start(x: number, y: number) {
    this.startX = x;
    this.startY = y;
  }

  move(x: number, y: number) {
    if (!this.enable) return;
    const diffX = x - this.startX;
    const diffY = y - this.startY;
    this.isInTarget = this.el.getBoundingClientRect().top > this.targetEl.getBoundingClientRect().top;
    this.moveAt(diffX, diffY);
  }

  end() {
    if (this.isInTarget && this.enable) this.onDragged();
    this.moveAt(0, 0);
  }

  moveAt(x: number, y: number) {
    this.el.style.transform = `translate(${x}px, ${y}px)`;
  }
}
