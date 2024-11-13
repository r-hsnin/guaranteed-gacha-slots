import { SlotConfig } from "../core/SlotConfig.js";
import { SlotState } from "../core/SlotState.js";
import { SlotRenderer } from "../renderer/SlotRenderer.js";
import { SlotAnimator } from "../animation/SlotAnimator.js";
import { SlotEffect } from "../effects/SlotEffect.js";
import { VirtualReel } from "../core/VirtualReel.js";

export class SlotMachine {
  #renderer;
  #animator;
  #state;
  #config;
  #animationFrameId;
  #effect;
  #resultDisplay;
  #virtualReel;
  #resizeTimeout;
  #boundHandleResize;

  constructor(
    items = ["項目1", "項目2", "項目3", "項目4", "項目5"],
    config = {}
  ) {
    const canvas = document.getElementById("slotCanvas");
    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    this.#config = new SlotConfig(config);
    this.#virtualReel = new VirtualReel(
      items,
      this.#config.display.itemHeight,
      3
    );
    this.#state = new SlotState(this.#virtualReel);
    this.#renderer = new SlotRenderer(canvas, this.#virtualReel, this.#config);
    this.#animator = new SlotAnimator(this.#state, this.#config);
    this.#effect = new SlotEffect(canvas.parentElement);

    const slotFrame = canvas.closest(".slot-frame");
    this.#resultDisplay = slotFrame
      ? slotFrame.querySelector(".result-display")
      : null;

    if (!this.#resultDisplay) {
      throw new Error("Result display element not found");
    }

    this.#boundHandleResize = this.#handleResize.bind(this);
    this.#initialize();
  }

  #clearResult() {
    if (this.#resultDisplay) {
      this.#resultDisplay.textContent = "";
    }
  }

  #displayResult() {
    if (this.#resultDisplay) {
      const currentItem = this.#virtualReel.getItemAtPosition(
        this.#state.position
      );
      this.#resultDisplay.textContent = `結果: ${currentItem}`;

      gsap.from(this.#resultDisplay, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }

  async spin(targetIndex = null) {
    if (this.#state.isSpinning) return;

    this.#clearResult();

    await this.#animator.startSpin(targetIndex);

    const rect = this.#renderer.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.#effect.start();
    this.#displayResult();
  }

  #initialize() {
    this.#state.position = 0;
    this.#setupEventListeners();
    this.#startRenderLoop();
  }

  #handleResize = () => {
    if (this.#resizeTimeout) {
      clearTimeout(this.#resizeTimeout);
    }
    this.#resizeTimeout = setTimeout(() => {
      this.#renderer.resize();
    }, 150);
  };
  
  #setupEventListeners() {
    window.addEventListener("resize", this.#boundHandleResize);
  }

  #startRenderLoop() {
    const animate = () => {
      this.#renderer.render(this.#state);
      this.#animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  destroy() {
    if (this.#animationFrameId) {
      cancelAnimationFrame(this.#animationFrameId);
    }
    if (this.#resizeTimeout) {
      clearTimeout(this.#resizeTimeout);
    }
    window.removeEventListener("resize", this.#boundHandleResize);
    this.#effect.clear();
    this.#renderer.destroy?.();
    this.#animator.destroy?.();
    this.#state.reset?.();
  }
}
