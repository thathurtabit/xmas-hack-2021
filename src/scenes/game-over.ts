import "phaser";
import { EScenes } from "../settings/enums";
import {
  colors,
  fontFamily,
  localStorageKey,
  transition,
} from "../settings/constants";
import {NO_SCORE_ID, submitScore} from "../service/ScoreBoardService";
import {formatScore} from "../utils/formatScore";

export default class GameOver extends Phaser.Scene {
  survivalTime: number;
  personalBest: number;
  scoreId = NO_SCORE_ID;

  constructor() {
    super(EScenes.GAME_OVER);
  }

  init({ survivalTime }): void {
    this.survivalTime = survivalTime;

    const previousPersonalBest = Number(
      window.localStorage.getItem(localStorageKey) || 0
    );
    if (this.survivalTime > previousPersonalBest) {
      window.localStorage.setItem(
        localStorageKey,
        this.survivalTime.toString()
      );
      this.personalBest = this.survivalTime;
    } else {
      this.personalBest = previousPersonalBest;
    }
  }

  preload() {
    this.load.html('nameform', 'assets/nameform.html');
  }

  create(): void {
    this.cameras.main.setBackgroundColor(colors.primary);
    this.cameras.main.fadeIn(transition.scene, 0, 0, 0);

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.add
      .text(screenCenterX, screenCenterY - 200, `GAME OVER`, {
        font: `30px ${fontFamily}`,
      })
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(
        screenCenterX,
        screenCenterY + 30,
        `You kept the infections at bay for ${formatScore(this.survivalTime)}`,
        {
          font: `22px ${fontFamily}`,
        }
      )
      .setOrigin(0.5)
      .setAlign("center");

    this.add
      .text(
        screenCenterX,
        screenCenterY -30,
        `Your personal best time is: ${formatScore(this.personalBest)}`,
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
        this.scene.start(EScenes.HIGH_SCORES, { scoreID: this.scoreId });
      });

    const text = this.add.text(screenCenterX, screenCenterY + 100, '', { color: 'white', fontSize: '20px '}).setOrigin(0.5, 0);

    const element = this.add.dom(screenCenterX, screenCenterY + 100).createFromCache('nameform').setOrigin(0.5, 0);

    element.addListener('click');

    element.on('click', (event) => {

      if (event.target.name === 'submitButton')
      {
        const inputText = element.getChildByName('nameField') as HTMLInputElement;

        if (inputText.value !== '')
        {
          element.removeListener('click');
          element.setVisible(false);
          text.setText('Recording for all of time...');

          // TODO: Animations on all this text / removals etc.
          submitScore(this.survivalTime, inputText.value)
            .then(scoreId => {
              text.setText('Done!')
              this.scoreId = scoreId
            })
        }
      }
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
