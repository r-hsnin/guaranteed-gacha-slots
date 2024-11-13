export class VirtualReel {
  #items;
  #totalRotations;
  #itemHeight;
  #cachedTotalHeight;

  constructor(items, itemHeight, totalRotations = 3) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Items must be a non-empty array');
    }
    if (typeof itemHeight !== 'number' || itemHeight <= 0) {
      throw new Error('Item height must be a positive number');
    }
    if (typeof totalRotations !== 'number' || totalRotations <= 0) {
      throw new Error('Total rotations must be a positive number');
    }

    this.#items = items;
    this.#itemHeight = itemHeight;
    this.#totalRotations = totalRotations;
  }

  getItemAtPosition(position) {
    const index = Math.floor(-position / this.#itemHeight) % this.#items.length;
    const normalizedIndex = (index + this.#items.length) % this.#items.length;
    return this.#items[normalizedIndex];
  }

  getVisibleItems(position, visibleCount) {
    if (visibleCount <= 0) {
      return [];
    }

    const items = [];
    const halfCount = Math.floor(visibleCount / 2);
    const startOffset = -halfCount * this.#itemHeight;
    const endOffset = (halfCount + (visibleCount % 2 === 0 ? 0 : 1)) * this.#itemHeight;

    for (let offset = startOffset; offset < endOffset; offset += this.#itemHeight) {
      items.push({
        item: this.getItemAtPosition(position + offset),
        offset: offset,
      });
    }

    return items;
  }

  get totalHeight() {
    if (this.#cachedTotalHeight === undefined) {
      this.#cachedTotalHeight = this.#items.length * this.#itemHeight * this.#totalRotations;
    }
    return this.#cachedTotalHeight;
  }

  get itemCount() {
    return this.#items.length;
  }

  get itemHeight() {
    return this.#itemHeight;
  }

  get items() {
    return [...this.#items];
  }
}