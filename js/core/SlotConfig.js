export class SlotConfig {
  static DEFAULT = {
    animation: {
      // 基準となる時間(sec)
      acceleration: 6,
      spinning: 5,
      deceleration: 6,
      // 変動範囲(± %)
      speedVariation: 0.4,
      // 回転数(Max,Min)
      minRotations: 6,
      maxRotations: 10,
      easing: {
        in: "power1.in",
        out: "power2.out",
      },
    },
    display: {
      itemHeight: 120,
      visibleItems: 5,
      font: "bold 48px Arial",
    },
    style: {
      colors: {
        primary: "0, 163, 255", // アクセントブルー
        highlight: "230, 247, 255", // ハイライト
        shadow: "0, 163, 255", // シャドウ
      },
    },
  };

  constructor(customConfig = {}) {
    return Object.freeze(this.#mergeConfig(SlotConfig.DEFAULT, customConfig));
  }

  #mergeConfig(defaultConfig, customConfig) {
    const merged = {};

    for (const [key, value] of Object.entries(defaultConfig)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        merged[key] = this.#mergeConfig(value, customConfig[key] || {});
      } else {
        merged[key] =
          customConfig[key] !== undefined ? customConfig[key] : value;
      }
    }

    return merged;
  }
}
