import { createCovidParticles } from "./../utils/createCovidParticle";
import "phaser";
import {
  EAssetKeys,
  EAudioKeys,
  EHumanIDs,
  EParticlesCount,
  EScenes,
} from "../settings/enums";
import Mask from "../gameObjects/mask";
import GameStatusUI from "../gameObjects/gameStatusUI";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import { colors, transition } from "../settings/constants";
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
  maxAvailableMasks = 4;
  timerIncrementMS = 100;
  survivalTime = 0;
  numberOfInfected: number;
  maxNumberOfInfected: number;

  constructor() {
    super(EScenes.GAME);
    this.numberOfInfected = 1;
    this.maxNumberOfInfected = 5;
  }

  preload() {
    this.load.image(EAssetKeys.WHITE, "assets/map/white-square.png");
    this.load.image(EAssetKeys.BLACK, "assets/map/black-square.png");
    this.load.image(EAssetKeys.COVID_PARTICLE, "assets/covid-particle.png");
    this.load.tilemapTiledJSON(EAssetKeys.MAP, "assets/map/map-json.json");
    loadHumans(this);
    this.load.image(EAssetKeys.MASK, "assets/mask.png");
  }

  create() {
    this.cameras.main.setBackgroundColor(colors.white);
    this.cameras.main.fadeIn(transition.scene, 255, 255, 255);

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
      delay: 3000,
      callback: () => this.newInfections(),
      callbackScope: this,
      loop: true,
    });

    this.addGameUI();
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
    this.gameStatusUI.setSurvivalTime(this.survivalTime / 1000);
  }

  private newInfections() {
    this.faces.children.each((human: Human) => {
      this.addDisinfectTimer(human);

      if (human.isInfected && !human.isMasked) {
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
      this.incrementInfectedCount();
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
    this.survivalTimerEvent.paused = true;

    this.scene.transition({
      target: EScenes.GAME_OVER,
      duration: 2000,
      data: {
        survivalTime: this.survivalTime / 1000,
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
    });

    this.physics.world.enable(human);
    this.add.existing(human);

    (human.body as Phaser.Physics.Arcade.Body).setImmovable(true);

    this.addMaskOnClick(human);

    human.play({ key: animationKey, repeat: -1 });

    this.faces.add(human);

    return human;
  }

  private addHumanoids(): void {
    this.createHumanoid({
      id: EHumanIDs.HUMAN_1,
      assetKey: EAssetKeys.HUMAN_5,
      x: 200,
      y: 200,
      isInfected: true,
      scale: 2,
      animationKey: EAudioKeys.COUGH_5,
      isSuperSpreader: true,
      isAntiMasker: true,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_2,
      assetKey: EAssetKeys.HUMAN_2,
      x: 400,
      y: 200,
      isInfected: false,
      scale: 2,
      animationKey: EAudioKeys.COUGH_2,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_3,
      assetKey: EAssetKeys.HUMAN_3,
      x: 600,
      y: 200,
      isInfected: false,
      scale: 2,
      animationKey: EAudioKeys.COUGH_3,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_4,
      assetKey: EAssetKeys.HUMAN_1,
      x: 200,
      y: 400,
      isInfected: false,
      scale: 4,
      animationKey: EAudioKeys.COUGH_1,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_5,
      assetKey: EAssetKeys.HUMAN_4,
      x: 400,
      y: 400,
      isInfected: false,
      scale: 2,
      animationKey: EAudioKeys.COUGH_4,
    });
    this.createHumanoid({
      id: EHumanIDs.HUMAN_6,
      assetKey: EAssetKeys.HUMAN_6,
      x: 600,
      y: 400,
      isInfected: false,
      scale: 2,
      animationKey: EAudioKeys.COUGH_6,
    });
  }

  private addMaskOnClick(human: Human) {
    human.setInteractive().on("pointerdown", () => {
      if (human.isAntiMasker) {
        human.refuseMask();
      } else if (this.availableMasks > 0 && !human.isMasked) {
        this.availableMasks--;
        this.addMask(human);
        this.gameStatusUI.setAvailableMasks(this.availableMasks);
      } else if (this.availableMasks > 0 && human.isMasked) {
        this.removeMask(human);
      }
    });
  }

  private getMaskPosition(human: Human): { x: number; y: number } {
    switch (human.id) {
      // TODO: tweak each mask position below...
      case EHumanIDs.HUMAN_2:
        return { x: human.x, y: human.y + 10 };
      case EHumanIDs.HUMAN_3:
        return { x: human.x, y: human.y + 20 };
      case EHumanIDs.HUMAN_4:
        return { x: human.x - 5, y: human.y + 8 };
      case EHumanIDs.HUMAN_5:
        return { x: human.x, y: human.y + 15 };
      case EHumanIDs.HUMAN_6:
        return { x: human.x, y: human.y + 15 };
      default:
        return { x: human.x, y: human.y };
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

    human.giveMask(currentMask);
    this.addDestroyMaskTimer(human, currentMask);
  }

  private removeMask(human: Human) {
    if (human.isMasked) {
      human.currentMask.destroy();
      human.currentMask.destroyMaskTimer.remove();
      human.takeMask();

      this.availableMasks++;
      this.masks.remove(human.currentMask);
      this.gameStatusUI.setAvailableMasks(this.availableMasks);
    }
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
