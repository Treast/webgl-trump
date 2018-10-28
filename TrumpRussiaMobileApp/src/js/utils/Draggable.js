export class Draggable {

    constructor (el, targetEl, onDragged) {
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

    onTouchStartEl (e) {
        e.preventDefault();
        this.start(e.touches[0].clientX, e.touches[0].clientY);
    }

    onTouchMoveEl (e) {
        e.preventDefault();
        this.move(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }

    onTouchEndEl () {
        this.end();
    }

    start (x, y) {
        this.startX = x;
        this.startY = y;
    }

    move (x, y) {
        if (!this.enable) return;
        const diffX = x - this.startX;
        const diffY = y - this.startY;
        if (this.el.getBoundingClientRect().top > this.targetEl.getBoundingClientRect().top) {
            this.isInTarget = true;
        } else {
            this.isInTarget = false;
        }
        this.moveAt(diffX, diffY);
    }

    end () {
        if (this.isInTarget) this.onDragged();
        this.moveAt(0, 0);
    }

    moveAt (x, y) {
        this.el.style.transform = `translate(${x}px, ${y}px)`;
    }

}