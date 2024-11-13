import { SlotMachine } from "./core/SlotMachine.js";
import { IntroAnimation } from "./animation/IntroAnimation.js";

const items = ["🍎", "🍊", "🍇", "🍓", "🍉"];

document.addEventListener("DOMContentLoaded", () => {
  try {
    const slotMachine = new SlotMachine(items);

    const spinButton = document.getElementById("spinButton");
    if (!spinButton) {
      throw new Error("Spin button not found");
    }

    const updateButtonState = (isSpinning) => {
      spinButton.disabled = isSpinning;
      spinButton.classList.toggle("spinning", isSpinning);
    };

    // アニメーション開始
    const introAnimation = new IntroAnimation();
    introAnimation.start();

    spinButton.addEventListener("click", async () => {
      try {
        updateButtonState(true);

        await slotMachine.spin(1);
      } catch (error) {
        console.error("Slot machine spin failed:", error);
      } finally {
        updateButtonState(false);
      }
    });
  } catch (error) {
    console.error("Slot machine initialization failed:", error);
  }
});
