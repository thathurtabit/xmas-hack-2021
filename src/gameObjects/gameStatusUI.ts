import "phaser";
import { colors, fontFamily, localStorageKey } from "../settings/constants";
import { IGameStatusUI } from "./../settings/interfaces";
import {formatScore} from "../utils/formatScore";

const uiStyles = {
  font: `14px ${fontFamily}`,
  padding: { x: 10, y: 3 },
  backgroundColor: colors.primary,
  color: colors.white,
};

export default class GameStatusUI extends Phaser.GameObjects.Container {
  private gameScene: Phaser.Scene;
  private availableMasks: number;
  private survivalTime: number;
  private personalBest: number;
  private numberOfInfected: number;
  private maxNumberOfInfected: number;
  private availableMasksTextObject: Phaser.GameObjects.Text;
  private survivalTimeTextObject: Phaser.GameObjects.Text;
  private numberOfInfectedTextObject: Phaser.GameObjects.Text;
  private personalBestTextObject: Phaser.GameObjects.Text;
  private masksText = "AVAILABLE MASKS: ";
  private survivalText: "TIME: ";
  private infectedText: "INFECTED: ";
  private personalBestText: "BEST TIME: ";

  constructor({
    gameScene,
    availableMasks,
    survivalTime,
    numberOfInfected,
    maxNumberOfInfected,
  }: IGameStatusUI) {
    super(gameScene, 0, 0);

    this.availableMasks = availableMasks;
    this.survivalTime = survivalTime;
    this.numberOfInfected = numberOfInfected;
    this.maxNumberOfInfected = maxNumberOfInfected;
    this.y = -this.height;
    this.x = 0;
    this.width = gameScene.sys.canvas.width;
    this.gameScene = gameScene;

    this.personalBest = Number(
      window.localStorage.getItem(localStorageKey) || 0
    );

    this.init();
    this.addTween();
  }

  public setSurvivalTime(survivalTime: number): void {
    this.survivalTime = survivalTime;
    this.survivalTimeTextObject.setText(
      `${this.survivalText ?? "TIME: "} ${formatScore(this.survivalTime)}`
    );
  }

  public setNumberOfInfected(numberOfInfected: number): void {
    this.numberOfInfected = numberOfInfected;
    this.numberOfInfectedTextObject.setText(
      `${this.infectedText ?? "INFECTED: "} ${this.numberOfInfected} / ${
        this.maxNumberOfInfected
      }`
    );
  }

  public setAvailableMasks(availableMasks: number): void {
    this.availableMasks = availableMasks;
    this.availableMasksTextObject.setText(
      `${this.masksText ?? "AVAILABLE MASKS: "} ${
        this.availableMasks < 0 ? 0 : this.availableMasks
      }`
    );
  }

  private init(): void {
    this.availableMasksTextObject = this.scene.add
      .text(10, 10, `${this.masksText}  ${this.availableMasks}`, {
        ...uiStyles,
      })
      .setOrigin(0)
      .setAlign("left");

    this.numberOfInfectedTextObject = this.scene.add
      .text(
        this.gameScene.cameras.main.width / 2,
        20,
        `${this.infectedText ?? "INFECTED: "} ${this.numberOfInfected} / ${
          this.maxNumberOfInfected
        }`,
        {
          ...uiStyles,
        }
      )
      .setOrigin(0.5)
      .setAlign("center");

    this.survivalTimeTextObject = this.scene.add
      .text(
        this.gameScene.cameras.main.width - 10,
        10,
        `${this.survivalText ?? "TIME: "} ${this.survivalTime}s`,
        {
          ...uiStyles,
        }
      )
      .setOrigin(1, 0)
      .setAlign("right");

    this.personalBestTextObject = this.scene.add
      .text(
        this.gameScene.cameras.main.width - 10,
        this.gameScene.cameras.main.height - 10,
        `${this.personalBestText ?? "BEST TIME: "} ${formatScore(this.personalBest)}`,
        {
          ...uiStyles,
        }
      )
      .setOrigin(1, 1)
      .setAlign("right");
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
