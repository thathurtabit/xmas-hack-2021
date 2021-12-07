import "phaser";
import { EScenes } from "../settings/enums";
import { fontFamily } from "../settings/constants";

export default class Splash extends Phaser.Scene {
  constructor() {
    super(EScenes.SPLASH);
  }

  preload() {
    // this.load.image("logo", "assets/phaser3-logo.png");
    // this.load.image("libs", "assets/libs.png");
  }

  create() {
    this.cameras.main.setBackgroundColor("#313c53");
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.add
      .text(
        screenCenterX,
        screenCenterY + 30,
        `Keep everyone masked up to stop the spread of Covid!`,
        {
          font: `30px ${fontFamily}`,
        }
      )
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(screenCenterX, screenCenterY + 80, `Stay Covid-Free.`, {
        font: `40px ${fontFamily}`,
      })
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(screenCenterX, 500, `Play`, {
        font: `40px ${fontFamily}`,
        padding: { x: 20, y: 10 },
        backgroundColor: "#fff",
        color: "#000",
      })
      .setOrigin(0.5)
      .setAlign("center");

    this.input.on(
      "pointerup",
      () => {
        this.scene.start(EScenes.GAME);
      },
      this
    );
  }
}
