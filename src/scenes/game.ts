import { createCovidParticles } from "./../utils/createCovidParticle";
import "phaser";
import {
  EAssetKeys,
  EAudioKeys,
  EHumanIDs,
  EParticlesCount,
  EScenes,
  Gender
} from "../settings/enums";
import Mask from "../gameObjects/mask";
import GameStatusUI from "../gameObjects/gameStatusUI";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import { colors, covidParticle, transition } from "../settings/constants";
import {
  ICreateCovidParticlesFromFace,
  ICreateHumanoid,
} from "../settings/interfaces";
import Human from "../gameObjects/human";
import { loadHumans } from "../utils/loadHumans";
import CovidParticle from "../gameObjects/covidParticle";

export default class Game extends Phaser.Scene {
  masks: Phaser.GameObjects.Group;
  faces: Phaser.GameObjects.Group;
  particles: Phaser.GameObjects.Group;
  survivalTimerEvent: Phaser.Time.TimerEvent;
  gameStatusUI: GameStatusUI;
  gameScene: Phaser.Scene;

  availableMasks = 4;
  timerIncrementMS = 100;
  survivalTime = 0;
  numberOfInfected: number;
  maxNumberOfInfected: number;

  constructor() {
    super(EScenes.GAME);
    this.maxNumberOfInfected = 5;
  }

  init() {
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.time.removeAllEvents()
    })
  }

  preload() {
    this.load.image(EAssetKeys.WHITE, "assets/map/white-square.png");
    this.load.image(EAssetKeys.BLACK, "assets/map/black-square.png");
    this.load.image(EAssetKeys.COVID_PARTICLE, "assets/covid-particle.png");
    this.load.tilemapTiledJSON(EAssetKeys.MAP, "assets/map/map-json.json");
    loadHumans(this);
    this.load.image(EAssetKeys.MASK, "assets/mask.png");
    this.load.audio(
      EAudioKeys.GAME_MUSIC,
      "assets/Loyalty_Freak_Music_-_04_-_Cant_Stop_My_Feet_.mp3"
    );
    this.load.audio(EAudioKeys.COUGHING_MAN, "assets/man_coughing.mp3")
    this.load.audio(EAudioKeys.COUGHING_WOMAN, "assets/woman_coughing.mp3")
  }

  create() {
    this.initGameState();

    this.cameras.main.setBackgroundColor(colors.white);
    this.cameras.main.fadeIn(transition.scene, 255, 255, 255);

    this.sound.add(EAudioKeys.GAME_MUSIC).play();

    // Each 100ms call onEvent
    this.survivalTimerEvent = this.time.addEvent({
      delay: this.timerIncrementMS,
      callback: this.incrementGameTimer,
      callbackScope: this,
      loop: true,
    });

    const map = this.make.tilemap({ key: EAssetKeys.MAP });
    const whiteTileset = map.addTilesetImage(
      EAssetKeys.MAP_BG,
      EAssetKeys.WHITE,
      8,
      8
    );

    map.createLayer(EAssetKeys.BACKGROUND, whiteTileset);

    const edgesLayer = map.createLayer(EAssetKeys.WALLS, whiteTileset);

    const collidingLayers: Array<TilemapLayer> = [edgesLayer];
    this.setCollision(collidingLayers);

    // Game Object Groups
    this.masks = this.add.group();
    this.faces = this.add.group();
    this.particles = this.add.group();

    this.addHumanoids();

    this.time.addEvent({
      delay: covidParticle.delayBetweenSpawns,
      callback: () => this.newInfections(),
      callbackScope: this,
      loop: true,
    });

    this.addGameUI();
  }

  private initGameState() {
    this.availableMasks = 4;
    this.survivalTime = 0;
    this.numberOfInfected = 1;
  }

  private addGameUI(): void {
    this.gameStatusUI = new GameStatusUI({
      gameScene: this,
      availableMasks: this.availableMasks,
      survivalTime: this.survivalTime,
      numberOfInfected: this.numberOfInfected,
      maxNumberOfInfected: this.maxNumberOfInfected,
    });

    this.add.existing(this.gameStatusUI);
  }

  private incrementGameTimer(): void {
    this.survivalTime += this.timerIncrementMS;
    this.gameStatusUI.setSurvivalTime(this.survivalTime);
  }

  private newInfections() {
    this.faces.children.each((human: Human) => {
      this.addDisinfectTimer(human);

      if (human.isInfected && !human.isMasked) {

        this.anims.play(human.animationKey, human);

        if (human.gender == Gender.MALE) {
          this.sound.play(EAudioKeys.COUGHING_MAN);
        } else {
          this.sound.play(EAudioKeys.COUGHING_WOMAN);
        }

        this.createCovidParticlesFromFace({
          xSpewPosition: human.x,
          ySpewPosition: human.y,
        });
      }
    });
  }

  private createCovidParticlesFromFace({
    xSpewPosition,
    ySpewPosition,
  }: ICreateCovidParticlesFromFace): void {
    createCovidParticles({
      scene: this,
      x: xSpewPosition,
      y: ySpewPosition,
      itemsToCollideWith: this.faces,
      key: EAssetKeys.COVID_PARTICLE,
      numberOfParticles: EParticlesCount.TWO,
      onCollideCallback: this.onCovidParticleCollideCallback.bind(this),
      group: this.particles,
      destroyable: false,
    });
  }

  private onCovidParticleCollideCallback(
    covidParticle: Phaser.GameObjects.GameObject,
    human: Phaser.GameObjects.GameObject
  ) {
    const isHumanAbleToBeInfected = human instanceof Human && !human.isMasked;

    if (isHumanAbleToBeInfected && !human.isInfected) {
      human.infect();
      // human.play({ key: human.texture.toString(), repeat: 1 });
      this.incrementInfectedCount();
      
      this.availableMasks--;
      this.gameStatusUI.setAvailableMasks(this.availableMasks);
    }

    if (
      covidParticle instanceof CovidParticle &&
      covidParticle.destroyable &&
      isHumanAbleToBeInfected
    ) {
      covidParticle.destroy();
    }
  }

  private incrementInfectedCount(): void {
    this.numberOfInfected++;
    this.gameStatusUI.setNumberOfInfected(this.numberOfInfected);
    this.checkForGameOver();
  }

  private checkForGameOver(): void {
    if (this.numberOfInfected >= this.maxNumberOfInfected) {
      this.handleGameOver();
    }
  }

  private handleGameOver(): void {
    this.scene.transition({
      target: EScenes.GAME_OVER,
      duration: 2000,
      data: {
        survivalTime: this.survivalTime,
      },
    });
  }

  private setCollision(collidingLayers: Array<TilemapLayer>) {
    collidingLayers.forEach((layer) => {
      layer.setCollisionByProperty({ collides: true });
    });
  }

  private createHumanoid({
    id,
    assetKey,
    x,
    y,
    isInfected,
    scale,
    animationKey,
    isSuperSpreader = false,
    isAntiMasker = false,
    gender
  }: ICreateHumanoid): Phaser.GameObjects.Sprite {
    this.anims.createFromAseprite(assetKey);

    const human = new Human({
      id,
      scene: this,
      x,
      y,
      texture: assetKey,
      scale,
      isInfected,
      isSuperSpreader,
      isAntiMasker,
      gender,
      animationKey
    });

    this.physics.world.enable(human);
    this.add.existing(human);

    (human.body as Phaser.Physics.Arcade.Body).setImmovable(true);

    this.addMaskOnClick(human);

    this.faces.add(human);

    return human;
  }

  private addHumanoids(): void {
    this.createHumanoid({
      id: EHumanIDs.HUMAN_5,
      assetKey: EAssetKeys.HUMAN_5,
      x: 200,
      y: 200,
      isInfected: true,
      scale: 1.75,
      animationKey: EAudioKeys.COUGH_5,
      isSuperSpreader: true,
      isAntiMasker: true,
      gender: Gender.FEMALE,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_2,
      assetKey: EAssetKeys.HUMAN_2,
      x: 400,
      y: 200,
      isInfected: false,
      scale: 1.75,
      animationKey: EAudioKeys.COUGH_2,
      gender: Gender.FEMALE,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_3,
      assetKey: EAssetKeys.HUMAN_3,
      x: 600,
      y: 200,
      isInfected: false,
      scale: 1.75,
      animationKey: EAudioKeys.COUGH_3,
      gender: Gender.MALE,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_4,
      assetKey: EAssetKeys.HUMAN_1,
      x: 200,
      y: 400,
      isInfected: false,
      scale: 3.5,
      animationKey: EAudioKeys.COUGH_1,
      gender: Gender.MALE,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_5,
      assetKey: EAssetKeys.HUMAN_4,
      x: 400,
      y: 400,
      isInfected: false,
      scale: 1.75,
      animationKey: EAudioKeys.COUGH_4,
      gender: Gender.MALE,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_6,
      assetKey: EAssetKeys.HUMAN_6,
      x: 600,
      y: 400,
      isInfected: false,
      scale: 1.75,
      animationKey: EAudioKeys.COUGH_6,
      gender: Gender.MALE,
    });
  }

  private addMaskOnClick(clickedHuman: Human) {
    clickedHuman.setInteractive().on("pointerdown", () => {
      if (clickedHuman.isAntiMasker) {
        clickedHuman.refuseMask();
      } else if (this.numberOfInfected === 4) {
        this.faces.children.each((otherHuman: Human) => {
          if (!clickedHuman.isMasked && otherHuman.isMasked) {
            this.removeMask(otherHuman);
            this.addMask(clickedHuman);
          } else if (this.availableMasks > 0 && !clickedHuman.isMasked) {
            this.addMask(clickedHuman);
            this.gameStatusUI.setAvailableMasks(this.availableMasks);
          }
        })
      } else if (this.availableMasks > 0 && !clickedHuman.isMasked) {
        this.addMask(clickedHuman);
        this.gameStatusUI.setAvailableMasks(this.availableMasks);
      } else if (clickedHuman.isMasked) {
        this.removeMask(clickedHuman);
      }
    });
  }

  private getMaskPosition(human: Human): {
    x: number;
    y: number;
    scale: number;
  } {
    switch (human.id) {
      // TODO: tweak each mask position below...
      case EHumanIDs.HUMAN_2:
        return { x: human.x - 3, y: human.y + 17, scale: 0.7 };
      case EHumanIDs.HUMAN_3:
        return { x: human.x - 2, y: human.y + 25, scale: 0.7 };
      case EHumanIDs.HUMAN_4:
        return { x: human.x - 5, y: human.y + 12, scale: 0.8 };
      case EHumanIDs.HUMAN_5:
        return { x: human.x, y: human.y + 20, scale: 0.7 };
      case EHumanIDs.HUMAN_6:
        return { x: human.x, y: human.y + 22, scale: 0.65 };
      default:
        return { x: human.x, y: human.y, scale: 1 };
    }
  }

  private addMask(human: Human) {
    const maskPosition = this.getMaskPosition(human);

    const currentMask = new Mask({
      scene: this,
      texture: EAssetKeys.MASK,
      ...maskPosition,
    });

    this.masks.add(currentMask);
    this.availableMasks--;

    human.giveMask(currentMask);
    this.addDestroyMaskTimer(human, currentMask);
  }

  private removeMask(human: Human) {
    human.currentMask.destroy();
    human.currentMask.destroyMaskTimer.remove();
    human.takeMask();

    this.availableMasks++;
    this.masks.remove(human.currentMask);
    this.gameStatusUI.setAvailableMasks(this.availableMasks);
  }

  private addDestroyMaskTimer(human: Human, mask: Mask) {
    if (mask.destroyMaskTimer) {
      mask.destroyMaskTimer.remove();
    }

    const delayBeforeMaskDestroy = 5000;

    const maskTimer = this.time.addEvent({
      delay: delayBeforeMaskDestroy,
      callback: () => this.removeMask(human),
      callbackScope: this,
      loop: false,
    });
    this.time.addEvent({
      delay: delayBeforeMaskDestroy - 1500,
      callback: () => this.tweenMaskIsTimingOut(mask),
      callbackScope: this,
      loop: false,
    });
    mask.setDestroyMaskTimer(maskTimer);
  }

  private tweenMaskIsTimingOut = (mask: Mask) => {
    this.tweens.add({
      targets: mask,
      alpha: 0.8,
      y: mask.y + 10,
      duration: 300,
      repeat: -1,
    });
  };

  private addDisinfectTimer(human: Human) {
    human.setDisinfectTimer(this);
  }
}
