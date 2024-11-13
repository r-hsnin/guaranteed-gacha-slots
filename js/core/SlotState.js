export class SlotState {
  #position;
  #isSpinning = false;
  #virtualReel;

  constructor(virtualReel) {
    if (!virtualReel) {
      throw new Error('VirtualReel is required');
    }
    this.#virtualReel = virtualReel;
    this.#position = 0;
  }

  get position() {
    return this.#position;
  }

  set position(value) {
    if (typeof value !== 'number') {
      throw new TypeError('Position must be a number');
    }
    this.#position = value;
  }

  get virtualReel() {
    return this.#virtualReel;
  }

  get isSpinning() {
    return this.#isSpinning;
  }

  startSpin() {
    this.#isSpinning = true;
  }

  finishSpin() {
    this.#isSpinning = false;
    this.normalizePosition();
  }

  normalizePosition() {
    const itemHeight = this.#virtualReel.itemHeight;
    const totalItems = this.#virtualReel.itemCount;
    
    let index = Math.floor(-this.#position / itemHeight);
    index = ((index % totalItems) + totalItems) % totalItems;
    this.#position = -(index * itemHeight);
  }

  reset() {
    this.#position = 0;
    this.#isSpinning = false;
  }
}