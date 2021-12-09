import { EAssetKeys } from "./../settings/enums";
import "phaser";
import { EScenes } from "../settings/enums";
import { colors, fontFamily, transition } from "../settings/constants";
import { NO_SCORE_ID } from "../service/ScoreBoardService";

export default class Splash extends Phaser.Scene {
  constructor() {
    super(EScenes.SPLASH);
  }

  preload() {
    this.load.image(EAssetKeys.MASK, "assets/mask.png");
  }

  create() {
    this.cameras.main.setBackgroundColor(colors.primary);
    this.cameras.main.fadeIn(transition.scene, 255, 255, 255);

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const mask = this.add.image(
      screenCenterX,
      screenCenterY - 120,
      EAssetKeys.MASK
    );

    this.add
      .text(
        screenCenterX,
        screenCenterY + 30,
        `Keep everyone masked up to stop the spread of Covid!`,
        {
          font: `27px ${fontFamily}`,
        }
      )
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(screenCenterX, screenCenterY + 80, `Stay Covid Free.`, {
        font: `40px ${fontFamily}`,
      })
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(screenCenterX + 100, 500, `Play`, {
        font: `30px ${fontFamily}`,
        padding: { x: 20, y: 10 },
        backgroundColor: colors.white,
        color: colors.primary,
      })
      .setOrigin(0.5)
      .setAlign("center")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start(EScenes.GAME);
      });

    this.add
      .text(screenCenterX - 100, 500, `High Scores`, {
        font: `30px ${fontFamily}`,
        padding: { x: 20, y: 10 },
        backgroundColor: colors.white,
        color: colors.primary,
      })
      .setOrigin(0.5)
      .setAlign("center")
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start(EScenes.HIGH_SCORES, {
          fromSplashScene: true,
          scoreID: NO_SCORE_ID,
        });
      });

    this.tweens.add({
      targets: mask,
      scale: 1.2,
      duration: 1000,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
}
