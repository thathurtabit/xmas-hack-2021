import "phaser";
import { EScenes } from "../settings/enums";
import { colors, fontFamily, transition } from "../settings/constants";

export default class GameOver extends Phaser.Scene {
  survivalTime: number;

  constructor() {
    super(EScenes.GAME_OVER);
  }

  init({ survivalTime }): void {
    this.survivalTime = survivalTime;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(colors.primary);
    this.cameras.main.fadeIn(transition.scene, 0, 0, 0);

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.add
      .text(screenCenterX, screenCenterY - 100, `GAME OVER`, {
        font: `30px ${fontFamily}`,
      })
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(
        screenCenterX,
        screenCenterY + 30,
        `You kept the infections at bay for ${this.survivalTime}s`,
        {
          font: `22px ${fontFamily}`,
        }
      )
      .setOrigin(0.5)
      .setAlign("center");
    
      this.add
        .text(screenCenterX, 500, `High Scores`, {
          font: `30px ${fontFamily}`,
          padding: { x: 20, y: 10 },
          backgroundColor: colors.white,
          color: colors.primary,
        })
        .setOrigin(0.5)
        .setAlign("center")
        .setInteractive()
        .on("pointerdown", () => {
          this.scene.start(EScenes.HIGH_SCORES);
        });
      

        // Todo, find a way to reset the game without annoying errors...
      // this.add
      //   .text(screenCenterX - 200, 500, `Play Again`, {
      //     font: `30px ${fontFamily}`,
      //     padding: { x: 20, y: 10 },
      //     backgroundColor: colors.white,
      //     color: colors.primary,
      //   })
      //   .setOrigin(0.5)
      //   .setAlign("center")
      //   .setInteractive()
      //   .on("pointerdown", () => {
      //     this.scene.start(EScenes.SPLASH);
      //   });
  }
}
