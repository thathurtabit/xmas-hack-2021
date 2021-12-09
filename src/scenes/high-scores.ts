import "phaser"
import {EAudioKeys, EScenes} from "../settings/enums"
import {colors, fontFamily, transition} from "../settings/constants"
import {Scene} from "phaser"
import {fetchScoreBoard, Score} from "../service/ScoreBoardService"
import TextStyle = Phaser.Types.GameObjects.Text.TextStyle
import Container = Phaser.GameObjects.Container
import {formatScore} from "../utils/formatScore";

export default class HighScores extends Phaser.Scene {
  constructor() {
    super(EScenes.HIGH_SCORES)
  }

  preload() {
    this.load.audio(EAudioKeys.ENDING_MUSIC, "assets/Komiku_-_70_-_Ending.mp3")
  }

  create(data) {
    this.cameras.main.setBackgroundColor(colors.primary)
    this.cameras.main.fadeIn(transition.scene, 0, 0, 0)
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2

    this.sound.stopAll();
    this.sound.play(EAudioKeys.ENDING_MUSIC);
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.sound.stopByKey(EAudioKeys.ENDING_MUSIC)
    })

    fetchScoreBoard(data.scoreID).then(scoreBoard => {
      this.add.existing(new ScoreBoardHeading(this))
      scoreBoard.highScores.forEach((scoreBoardRow, index) =>
        this.add.existing(new ScoreBoardRow(this, index + 1, scoreBoardRow))
      )
    })

    this.add
      .text(screenCenterX, 20, `HIGH SCORES`, {
        font: `30px ${fontFamily}`,
      })
      .setOrigin(0.5, 0)
      .setAlign("center")
      .setOrigin(0.5, 0)
      .setAlign("center")

    // TODO: we can't seem to reset the game without errors... we need to refresh browser :(
    this.add
      .text(screenCenterX, 500, `SPLASH`, {
        font: `40px ${fontFamily}`,
        padding: { x: 20, y: 10 },
        backgroundColor: "#fff",
        color: "#000",
      })
      .setOrigin(0.5)
      .setAlign("center")

    this.input.on(
      "pointerdown",
      () => {
        this.scene.start(EScenes.SPLASH)
      },
      this
    )
  }
}

const GRID_DIVISIONS = 20
const COL_RATIO_NAME = 4
const COL_RATIO_SCORE = 2
const COL_RATIO_BORDER = (GRID_DIVISIONS - COL_RATIO_NAME - COL_RATIO_SCORE) / 2
const ROW_HEIGHT = 35
const SCORE_BOARD_Y_OFFSET = 75

class TwoColumnLayout extends Container {

  constructor(
    public scene: Scene,
    private rowNum: number,
    private col1: string,
    private col2: string,
    private textStyle?: TextStyle,
  ) {
    super(scene)

    const {width} = scene.cameras.main

    const gridWidth = width / GRID_DIVISIONS

    const borderWidth = gridWidth * COL_RATIO_BORDER
    const nameWidth = gridWidth * COL_RATIO_NAME
    const scoreWidth = gridWidth * COL_RATIO_SCORE

    this.setX(borderWidth)

    this.add(
      this.scene.add
        .text(0, 0, col1, textStyle)
        .setOrigin(0, 0)
    )
    this.add(
      this.scene.add
        .text(nameWidth + scoreWidth, 0, col2, textStyle)
        .setOrigin(1, 0)
    )
  }
}

class ScoreBoardRow extends TwoColumnLayout {
  constructor(
    public scene: Scene,
    rowNum: number,
    score: Score
  ) {
    super(scene, rowNum, score.name, `${formatScore(score.timeElapsedMs)}`, {fixedHeight: ROW_HEIGHT})
    this.setAlpha(0)
    this.setY(rowNum * ROW_HEIGHT + SCORE_BOARD_Y_OFFSET)
    this.addEnterTween(rowNum);
    if (score.isPlayer) {
      this.addPlayerScoreTween();
    }
  }

  private addEnterTween(rowNum: number) {
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      delay: 100 * rowNum,
      ease: 'Power2',
    })
  }

  private addPlayerScoreTween() {
    this.scene.tweens.add({
      targets: this.list,
      scale: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Power2',
      delay: 6 * 100
    })
  }
}

class ScoreBoardHeading extends TwoColumnLayout {
  constructor(
    public scene: Scene
  ) {
    super(scene, 0, "NAME", "SCORE", {fixedHeight: ROW_HEIGHT, fontStyle: "bold",})
    this.setY(SCORE_BOARD_Y_OFFSET)
  }
}
