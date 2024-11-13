export class SlotEffect {
  #canvas;
  #ctx;
  #particles = [];
  #colors = ["#00a3ff", "#7fd6ff", "#e6f7ff"];
  #isActive = false;
  #animationId = null;

  constructor() {
    this.#canvas = document.createElement("canvas");
    this.#ctx = this.#canvas.getContext("2d");

    Object.assign(this.#canvas.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "1000",
    });

    this.#resize();
    window.addEventListener("resize", () => this.#resize());
    document.body.appendChild(this.#canvas);
  }

  #resize() {
    this.#canvas.width = window.innerWidth;
    this.#canvas.height = window.innerHeight;
  }

  start() {
    this.#isActive = true;
    this.#createParticles();
    this.#animate();
  }

  stop() {
    this.#isActive = false;
    this.#particles = [];
  }

  #createParticles() {
    const centerX = this.#canvas.width / 2;
    const centerY = this.#canvas.height / 2;

    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 15 + Math.random() * 5;

      this.#particles.push({
        x: centerX,
        y: centerY,
        size: 5 + Math.random() * 7,
        color: this.#colors[Math.floor(Math.random() * this.#colors.length)],
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        gravity: 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: -4 + Math.random() * 8,
        opacity: 1,
      });
    }
  }

  #animate() {
    if (!this.#isActive) return;

    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    let hasVisibleParticles = false;

    for (let i = this.#particles.length - 1; i >= 0; i--) {
      const particle = this.#particles[i];

      // 位置の更新
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.rotation += particle.rotationSpeed;
      particle.opacity -= 0.01;

      // パーティクルが画面内にあり、かつ不透明度が0より大きい場合のみ描画
      if (particle.y < this.#canvas.height && particle.opacity > 0) {
        hasVisibleParticles = true;
        this.#ctx.save();
        this.#ctx.translate(particle.x, particle.y);
        this.#ctx.rotate((particle.rotation * Math.PI) / 180);
        this.#ctx.globalAlpha = particle.opacity;
        this.#ctx.fillStyle = particle.color;
        this.#ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
        this.#ctx.restore();
      } else {
        this.#particles.splice(i, 1);
      }
    }

    if (hasVisibleParticles) {
      this.#animationId = requestAnimationFrame(() => this.#animate());
    } else {
      this.#cleanup();
    }
  }

  #cleanup() {
    if (this.#animationId) {
      cancelAnimationFrame(this.#animationId);
      this.#animationId = null;
    }
    this.#isActive = false;
    this.#particles = [];

    if (this.#canvas && this.#canvas.parentNode) {
      this.#canvas.parentNode.removeChild(this.#canvas);
    }
  }

  stop() {
    this.#isActive = false;
    this.#cleanup();
  }
}
