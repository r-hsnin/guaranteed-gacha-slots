export class IntroAnimation {
  #timeline;

  constructor() {
    this.#timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });
  }

  start() {
    // タイトル画面の作成とアニメーション
    this.#createTitleScreen();

    // クリックイベントの追加
    const titleScreen = document.querySelector(".title-screen");
    titleScreen.addEventListener("click", () => {
      // タイトル画面からスロットへの切り替えアニメーション
      const tl = gsap
        .timeline()
        .to(titleScreen, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => titleScreen.remove(),
        })
        .from(
          ".slot-machine",
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .add(this.#startMainAnimation());
    });
  }

  #createTitleScreen() {
    const titleScreen = document.createElement("div");
    titleScreen.className = "title-screen";

    gsap.set(titleScreen, {
      position: "fixed",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(145deg, #1e3a5f, #0a1929)",
      opacity: 0,
      zIndex: 1000,
    });

    const titleText = document.createElement("h1");
    titleText.className = "title-text";
    titleText.textContent = "SLOT GAME";
    gsap.set(titleText, {
      color: "#e6f7ff",
      fontSize: "48px",
      fontWeight: "bold",
      textShadow: "0 0 10px rgba(0, 163, 255, 0.5)",
      marginBottom: "20px",
      opacity: 0,
      y: -30,
    });

    const subTitle = document.createElement("p");
    subTitle.textContent = "Click to Start";
    gsap.set(subTitle, {
      color: "#7fd6ff",
      fontSize: "24px",
      opacity: 0,
      y: 30,
    });

    titleScreen.appendChild(titleText);
    titleScreen.appendChild(subTitle);
    document.body.appendChild(titleScreen);

    // タイトル画面のアニメーション
    gsap
      .timeline()
      .to(titleScreen, {
        opacity: 1,
        duration: 1,
      })
      .to(
        titleText,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.5"
      )
      .to(
        subTitle,
        {
          opacity: 0.8,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.6"
      );
  }

  #startMainAnimation() {
    // スロットマシンの初期状態を設定
    gsap.set(".slot-machine", {
      opacity: 0,
      scale: 0.8,
      filter: "blur(10px)",
      y: 30,
    });

    gsap.set(".slot-frame", {
      opacity: 0,
      scale: 0.95,
      boxShadow: "0 0 0px rgba(0, 163, 255, 0)",
    });

    gsap.set(".slot-window", {
      opacity: 0,
      y: 20,
    });

    gsap.set(".result-display", {
      opacity: 0,
      y: -20,
    });

    gsap.set(".spin-button", {
      opacity: 0,
      scale: 0.8,
      y: 20,
    });

    // メインのアニメーションシーケンス
    return gsap
      .timeline()
      .to(".slot-machine", {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.8)",
      })
      .to(
        ".slot-frame",
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          boxShadow: "0 0 15px rgba(0, 163, 255, 0.5)",
        },
        "-=0.6"
      )
      .to(
        ".slot-window",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .to(
        ".result-display",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.4"
      )
      .to(
        ".spin-button",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(2)",
        },
        "-=0.3"
      )
      .to(
        ".slot-frame",
        {
          boxShadow: "0 0 25px rgba(0, 163, 255, 0.7)",
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "-=0.2"
      )
      .to(
        ".spin-button",
        {
          boxShadow: "0 0 15px rgba(0, 163, 255, 0.5)",
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        },
        "-=1.5"
      );
  }
}
