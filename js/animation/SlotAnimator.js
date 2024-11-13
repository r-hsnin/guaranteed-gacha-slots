export class SlotAnimator {
  #timeline;
  #config;
  #state;
  #virtualReel;

  constructor(state, config) {
    if (!state || !config) {
      throw new Error('State and config are required');
    }
    this.#state = state;
    this.#config = config;
    this.#virtualReel = state.virtualReel;
    this.#timeline = gsap.timeline({ paused: true });
  }

  startSpin(targetIndex = null) {
    if (this.#state.isSpinning) {
      return Promise.reject(new Error('Spin already in progress'));
    }
    this.#state.startSpin();

    const itemHeight = this.#config.display.itemHeight;
    const totalItems = this.#virtualReel.itemCount;
    const totalHeight = itemHeight * totalItems;

    const rawTargetPosition =
      targetIndex !== null
        ? targetIndex * itemHeight
        : Math.floor(Math.random() * totalItems) * itemHeight;

    const rotations = Math.floor(this.#getRandomRotations());
    const additionalRotation = totalHeight * rotations;
    const targetPosition = -(rawTargetPosition + additionalRotation);

    return new Promise((resolve) => {
      this.#timeline
        .clear()
        .to(this.#state, {
          position: targetPosition * 0.3,
          duration: this.#config.animation.acceleration,
          ease: "power2.in",
          onUpdate: () => this.#state.onPositionChanged?.(this.#state.position),
        })
        .to(this.#state, {
          position: targetPosition * 0.8,
          duration: this.#config.animation.spinning,
          ease: "none",
          onUpdate: () => this.#state.onPositionChanged?.(this.#state.position),
        })
        .to(this.#state, {
          position: targetPosition,
          duration: this.#config.animation.deceleration,
          ease: "power2.out",
          onUpdate: () => this.#state.onPositionChanged?.(this.#state.position),
          onComplete: () => {
            this.#state.finishSpin();
            resolve();
          },
        })
        .play();
    });
  }

  stopSpin() {
    if (this.#timeline.isActive()) {
      this.#timeline.kill();
      this.#state.finishSpin();
    }
  }

  #getRandomRotations() {
    const min = this.#config.animation.minRotations;
    const max = this.#config.animation.maxRotations;
    return min + Math.random() * (max - min);
  }
}