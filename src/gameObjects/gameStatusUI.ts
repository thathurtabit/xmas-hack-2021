import "phaser";
import { colors, fontFamily } from "../settings/constants";
import { IGameStatusUI } from "./../settings/interfaces";

const uiStyles = {
  font: `12px ${fontFamily}`,
  padding: { x: 10, y: 3 },
  backgroundColor: colors.primary,
  color: colors.white,
};

export default class GameStatusUI extends Phaser.GameObjects.Container {
  private gameScene: Phaser.Scene;
  private availableMasks: number;
  private survivalTime: number;
  private availableMasksTextObject: Phaser.GameObjects.Text;
  private survivalTimeTextObject: Phaser.GameObjects.Text;
  private masksText = "MASKS: ";
  private survivalTexts: "TIME: ";

  constructor({ gameScene, availableMasks, survivalTime }: IGameStatusUI) {
    super(gameScene, 0, 0);

    this.availableMasks = availableMasks;
    this.survivalTime = survivalTime;
    this.y = -this.height;
    this.x = 0;
    this.width = gameScene.sys.canvas.width;
    this.gameScene = gameScene;

    this.init();
    this.addTween();
  }

  public setSurvivalTime(survivalTime: number): void {
    this.survivalTime = survivalTime;
    this.survivalTimeTextObject.setText(
      `${this.survivalTexts ?? "TIME: "} ${this.survivalTime}s`
    );
  }

  public setAvailableMasks(availableMasks: number): void {
    this.availableMasks = availableMasks;
    this.availableMasksTextObject.setText(
      `${this.masksText} ${this.availableMasks}`
    );
  }

  private init(): void {
    this.availableMasksTextObject = this.scene.add
      .text(10, 10, `${this.masksText}  ${this.availableMasks}`, {
        ...uiStyles,
      })
      .setOrigin(0)
      .setAlign("left");

    this.survivalTimeTextObject = this.scene.add
      .text(
        this.gameScene.cameras.main.width - 10,
        10,
        `${this.survivalTexts ?? "TIME: "} ${this.survivalTime}s`,
        {
          ...uiStyles,
        }
      )
      .setOrigin(1, 0)
      .setAlign("right");

    //this.gameScene.add.existing(this);
  }

  private addTween(): void {
    this.scene.tweens.add({
      targets: this,
      y: 100,
      duration: 100,
      ease: "Sine.inOut",
      yoyo: false,
      delay: 100,
    });
  }
}
