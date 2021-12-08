import { createCovidParticles } from "./../utils/createCovidParticle";
import "phaser";
import {
  EAssetKeys,
  EAudioKeys,
  EParticlesCount,
  EScenes,
} from "../settings/enums";
import Mask from "../gameObjects/mask";
import GameStatusUI from "../gameObjects/gameStatusUI";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import { colors } from "../settings/constants";
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
  timerEvent: Phaser.Time.TimerEvent;
  gameStatusUI: GameStatusUI;

  availableMasks = 4;
  maxAvailableMasks = 4;
  timerIncrementMS = 100;
  survivalTime = 0;

  constructor() {
    super(EScenes.GAME);
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
    this.cameras.main.setBackgroundColor(colors.primary);

    // Each 100ms call onEvent
    this.timerEvent = this.time.addEvent({
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
    });

    this.add.existing(this.gameStatusUI);
  }

  private incrementGameTimer(): void {
    this.survivalTime += this.timerIncrementMS;
    this.gameStatusUI.setSurvivalTime(this.survivalTime / 1000);
  }

  private newInfections() {
    this.faces.children.each((human: Human) => {
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
      numberOfParticles: EParticlesCount.ONE,
      onCollideCallback: this.onCovidParticleCollideCallback,
      group: this.particles,
      destroyable: false,
    });
  }

  private onCovidParticleCollideCallback(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject
  ) {
    if (object2 instanceof Human && !object2.isMasked) {
      object2.infect();
      if (object1 instanceof CovidParticle && object1.destroyable) {
        object1.destroy();
      }
    }

    // console.log("COVID PARTICLE COLLISION", {
    //   object1: object1.name,
    //   object2: object2.name,
    // });
  }

  private setCollision(collidingLayers: Array<TilemapLayer>) {
    collidingLayers.forEach((layer) => {
      layer.setCollisionByProperty({ collides: true });
    });
  }

  private createHumanoid({
    assetKey,
    x,
    y,
    isInfected,
    scale,
    animationKey
  }: ICreateHumanoid): Phaser.GameObjects.Sprite {
    this.anims.createFromAseprite(assetKey);

    const human = new Human({
      scene: this,
      x: x,
      y: y,
      texture: assetKey,
      scale: scale,
      isInfected: isInfected,
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
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_1, x: 200, y: 200, isInfected: true, scale: 4, animationKey: EAudioKeys.COUGH_1 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_2, x: 400, y: 200, isInfected: false, scale: 2, animationKey: EAudioKeys.COUGH_2 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_1, x: 600, y: 200, isInfected: false, scale: 4, animationKey: EAudioKeys.COUGH_1 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_2, x: 200, y: 400, isInfected: false, scale: 2, animationKey: EAudioKeys.COUGH_2 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_1, x: 400, y: 400, isInfected: false, scale: 4, animationKey: EAudioKeys.COUGH_1 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_2, x: 600, y: 400, isInfected: false, scale: 2, animationKey: EAudioKeys.COUGH_2 });
  }

  private addMaskOnClick(human: Human) {
    human.setInteractive().on("pointerdown", () => {
      if (this.availableMasks > 0 && !human.isMasked) {
        this.availableMasks--;
        this.addMask(human);
        this.gameStatusUI.setAvailableMasks(this.availableMasks);
      } else if (this.availableMasks > 0 && human.isMasked) {
        this.removeMask(human);
      }
    });
  }

  private addMask(human: Human) {
    const currentMask = new Mask({
      scene: this,
      x: human.x - 5,
      y: human.y + 6,
      texture: EAssetKeys.MASK,
    });

    this.masks.add(currentMask);

    human.giveMask(currentMask);
    this.addDestroyMaskTimer(human);
  }

  private removeMask(human: Human) {
    if (human.isMasked) {
      human.currentMask.destroy();
      human.takeMask();

      this.availableMasks++;
      this.masks.remove(human.currentMask);
      this.gameStatusUI.setAvailableMasks(this.availableMasks);

    }
  }

  private addDestroyMaskTimer(human: Human) {
    this.time.addEvent({
      delay: 5000,
      callback: () => this.removeMask(human),
      callbackScope: this,
      loop: false,
    });
  }

  private addDisinfectTimer(human: Human) {
    this.time.addEvent({
      delay: 10000,
      callback: () => human.disinfect(),
      callbackScope: this,
      loop: false,
    });
  }
}
