import { createCovidParticles } from "./../utils/createCovidParticle";
import "phaser";
import {
  EAssetKeys,
  EAudioKeys,
  EParticlesCount,
  EScenes,
} from "../settings/enums";
import Mask from "../gameObjects/mask";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
import { colors } from "../settings/constants";
import {
  ICreateCovidParticlesFromFace,
  ICreateHumanoid,
} from "../settings/interfaces";

export default class Game extends Phaser.Scene {
  masks: Phaser.GameObjects.Group;
  faces: Phaser.GameObjects.Group;
  particles: Phaser.GameObjects.Group;

  availableMasks = 5;

  constructor() {
    super(EScenes.GAME);
  }

  preload() {
    this.load.image(EAssetKeys.WHITE, "assets/map/white-square.png");
    this.load.image(EAssetKeys.BLACK, "assets/map/black-square.png");
    this.load.image(EAssetKeys.COVID_PARTICLE, "assets/covid-particle.png");
    this.load.tilemapTiledJSON(EAssetKeys.MAP, "assets/map/map-json.json");
    this.load.aseprite(
      EAssetKeys.HUMAN_1,
      "assets/Human-0001.png",
      "assets/Human-0001.json"
    );
    this.load.image(EAssetKeys.MASK, "assets/mask.png");
  }

  create() {
    this.cameras.main.setBackgroundColor(colors.primary);

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

    this.masks = this.add.group();
    this.faces = this.add.group(); //this.physics.add.staticGroup();
    this.particles = this.add.group();

    this.addHumanoids(this);
    // this.spawnFaces(map);
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
    });
  }

  private onCovidParticleCollideCallback(
    object1: Phaser.GameObjects.GameObject,
    object2: Phaser.GameObjects.GameObject
  ) {
    console.log("COVID PARTICLE COLLISION", {
      object1: object1.name,
      object2: object2.name,
    });
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
  }: ICreateHumanoid): Phaser.GameObjects.Sprite {
    this.anims.createFromAseprite(assetKey);
    const human = this.add.sprite(x, y, assetKey).setScale(4);

    this.physics.world.enable(human);
    this.add.existing(human);

    (human.body as Phaser.Physics.Arcade.Body).setImmovable(true);

    this.addMaskOnClick(human);

    human.name = assetKey;
    human.play({ key: EAudioKeys.COUGH, repeat: -1 });

    this.faces.add(human);

    // NOTE: this relies on the this.faces group, make sure to include this last
    this.createCovidParticlesFromFace({
      xSpewPosition: human.x,
      ySpewPosition: human.y,
    });

    return human;
  }

  private addHumanoids(game: Game): void {
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_1, x: 200, y: 200 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_2, x: 400, y: 200 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_3, x: 600, y: 200 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_4, x: 200, y: 400 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_5, x: 400, y: 400 });
    this.createHumanoid({ assetKey: EAssetKeys.HUMAN_6, x: 600, y: 400 });
  }

  private addMaskOnClick(human: Phaser.GameObjects.Sprite) {
    human.setInteractive().on("pointerdown", () => {
      if (this.availableMasks > 0) {
        this.addMask(human);
        this.availableMasks--;
        console.log(this.availableMasks);
      }
    });
  }

  private addMask(human: Phaser.GameObjects.Sprite) {
    this.masks.add(
      new Mask({
        scene: this,
        x: human.x - 5,
        y: human.y + 6,
        texture: EAssetKeys.MASK,
      })
    );
    console.log("added mask");
  }
}
