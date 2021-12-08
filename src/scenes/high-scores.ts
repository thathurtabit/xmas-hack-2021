import "phaser";
import { EScenes } from "../settings/enums";
import { colors, fontFamily, transition } from "../settings/constants";
import {Scene} from "phaser";
import GameObject = Phaser.GameObjects.GameObject;
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

export default class HighScores extends Phaser.Scene {

  constructor() {
    super(EScenes.HIGH_SCORES);
  }

  create() {
    this.cameras.main.setBackgroundColor(colors.primary);
    this.cameras.main.fadeIn(transition.scene, 0, 0, 0);

    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2;

    this.add.existing(new ScoreBoardHeading(this))
    this.add
      .text(screenCenterX, 0, `HIGH SCORES`, {
        font: `30px ${fontFamily}`,
      })
      .setOrigin(0.5, 0)
      .setAlign("center");

    [
        { name: "Bob", timeElapsedMs: 10005, isPlayer: false },
        { name: "Bob", timeElapsedMs: 10004, isPlayer: false },
        { name: "Bob", timeElapsedMs: 10003, isPlayer: false },
        { name: "Bob", timeElapsedMs: 10002, isPlayer: false },
        { name: "Bob", timeElapsedMs: 10001, isPlayer: false },
    ].forEach((scoreBoardRow, index) =>
        this.add.existing(new ScoreBoardRow(this, index+1, scoreBoardRow))
    )

    // TODO: we can't seem to reset the game without errors... we need to refresh browser :(
    // this.add
    //   .text(screenCenterX, 500, `SPLASH`, {
    //     font: `40px ${fontFamily}`,
    //     padding: { x: 20, y: 10 },
    //     backgroundColor: "#fff",
    //     color: "#000",
    //   })
    //   .setOrigin(0.5)
    //   .setAlign("center");

    // this.input.on(
    //   "pointerdown",
    //   () => {
    //     this.scene.restart();
    //     this.scene.start(EScenes.SPLASH);
    //   },
    //   this
    // );
  }
}

const GRID_DIVISIONS = 20
const COL_RATIO_NAME = 4
const COL_RATIO_SCORE = 2
const COL_RATIO_BORDER = (GRID_DIVISIONS - COL_RATIO_NAME - COL_RATIO_SCORE) / 2
const ROW_HEIGHT = 28
const SCORE_BOARD_Y_OFFSET = 50

class TwoColumnLayout extends GameObject {

    constructor(
        public scene: Scene,
        private rowNum: number,
        private col1: string,
        private col2: string,
        private textStyle?: TextStyle,
    ) {
        super(scene, 'score-board-row')

        const { width, height } = scene.cameras.main

        const gridWidth = width / GRID_DIVISIONS
        const gridHeight = height / GRID_DIVISIONS

        const borderWidth = gridWidth * COL_RATIO_BORDER
        const nameWidth = gridWidth * COL_RATIO_NAME
        const scoreWidth = gridWidth * COL_RATIO_SCORE

        const rowY = rowNum * ROW_HEIGHT + SCORE_BOARD_Y_OFFSET

        const mergedTextStyle = {
            fixedHeight: ROW_HEIGHT,
            ...textStyle
        }

        this.scene.add
            .text(borderWidth, rowY, col1, mergedTextStyle)
            .setOrigin(0, 0)
        this.scene.add
            .text(borderWidth + nameWidth + scoreWidth, rowY, col2, mergedTextStyle)
            .setOrigin(1, 0)
    }
}

class ScoreBoardRow extends TwoColumnLayout {
    constructor(
        public scene: Scene,
        rowNum: number,
        scoreBoardData: IScoreBoardRow
    ) {
        super(scene, rowNum, scoreBoardData.name, scoreBoardData.timeElapsedMs.toString());
    }
}

class ScoreBoardHeading extends TwoColumnLayout {
    constructor(
        public scene: Scene
    ) {
        super(scene, 0, "NAME", "Score")
    }
}

interface IScoreBoardRow {
  name: string
  timeElapsedMs: number
  isPlayer: boolean
}
