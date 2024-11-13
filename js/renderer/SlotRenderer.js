export class SlotRenderer {
  #canvas;
  #ctx;
  #config;
  #virtualReel;
  #cachedDimensions = {
    width: 0,
    height: 0,
    centerY: 0
  };
  
  constructor(canvas, virtualReel, config) {  
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#config = config;
    this.#virtualReel = virtualReel; 
    this.#initializeCanvas();
  }
  
  get canvas() {
    return this.#canvas;
  }
  
  #initializeCanvas() {
    this.resize();
    this.#setupContext();
  }

  #setupContext() {
    this.#ctx.textAlign = "center";
    this.#ctx.textBaseline = "middle";
    this.#ctx.font = this.#config.display.font;
  }

  resize() {
    const container = this.#canvas.parentElement;
    const newWidth = container.offsetWidth;
    const newHeight = container.offsetHeight;
    
    if (this.#cachedDimensions.width !== newWidth || 
        this.#cachedDimensions.height !== newHeight) {
      this.#canvas.width = newWidth;
      this.#canvas.height = newHeight;
      this.#cachedDimensions = {
        width: newWidth,
        height: newHeight,
        centerY: newHeight / 2
      };
      this.#setupContext();
    }
  }

  render(state) {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#drawItems(state.position); 
  }

  #drawItems(position) {
    const { centerY } = this.#cachedDimensions;
    const { visibleItems } = this.#config.display;
    const items = this.#virtualReel.getVisibleItems(position, visibleItems * 2 + 1);
    
    items.forEach(({ item, offset }) => {
      const y = centerY + offset - (position % this.#virtualReel.itemHeight);
      if (this.#isItemVisible(y)) {
        const alpha = this.#calculateItemAlpha(y, centerY);
        this.#drawItem(item, y, alpha);
      }
    });
  }

  #isItemVisible(y) {
    return y >= -this.#config.display.itemHeight && 
           y <= this.#canvas.height + this.#config.display.itemHeight;
  }

  #calculateItemAlpha(y, centerY) {
    const distance = Math.abs(y - centerY);
    const maxDistance = this.#canvas.height / 2;
    return Math.max(0, 1 - distance / maxDistance);
  }

  #drawItem(text, y, alpha) {
    this.#ctx.save();

    const { colors } = this.#config.style;
    const gradient = this.#createGradient(y, alpha, colors);
    this.#setupShadow(alpha, colors);

    this.#ctx.fillStyle = gradient;
    this.#ctx.fillText(text, this.#canvas.width / 2, y);

    this.#ctx.restore();
  }

  #createGradient(y, alpha, colors) {
    const gradient = this.#ctx.createLinearGradient(0, y - 30, 0, y + 30);
    gradient.addColorStop(0, `rgba(${colors.primary}, ${alpha})`);
    gradient.addColorStop(0.5, `rgba(${colors.highlight}, ${alpha})`);
    gradient.addColorStop(1, `rgba(${colors.primary}, ${alpha})`);
    return gradient;
  }

  #setupShadow(alpha, colors) {
    this.#ctx.shadowColor = `rgba(${colors.shadow}, ${alpha * 0.5})`;
    this.#ctx.shadowBlur = 10;
  }

  destroy() {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#canvas.width = 1;
    this.#canvas.height = 1;
    this.#cachedDimensions = null;
  }
}