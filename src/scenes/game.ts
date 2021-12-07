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

export default class Game extends Phaser.Scene {
  masks: Phaser.GameObjects.Group;
  availableMasks = 10;

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

    createCovidParticles({
      scene: this,
      x: 275,
      y: 275,
      itemsToCollideWith: collidingLayers,
      key: EAssetKeys.COVID_PARTICLE,
      numberOfParticles: EParticlesCount.THREE,
      onCollideCallback: this.onCovidParticleCollideCallback,
    });

    this.masks = this.add.group();

    this.addHumanoids(this);
    // this.spawnFaces(map);
  }

  private onCovidParticleCollideCallback() {
    //console.log("COVID PARTICLE COLLIDE");
  }

  private setCollision(collidingLayers: Array<TilemapLayer>) {
    collidingLayers.forEach((layer) => {
      layer.setCollisionByProperty({ collides: true });
    });
  }

  private addHumanoids(game: Game): void {
    game.anims.createFromAseprite(EAssetKeys.HUMAN_1);
    const human1 = this.add.sprite(200, 200, EAssetKeys.HUMAN_1).setScale(6);
    this.addMaskOnClick(human1);
    human1.play({ key: EAudioKeys.COUGH, repeat: -1 });
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
        x: human.x,
        y: human.y * 1.2,
        texture: EAssetKeys.MASK,
      })
    );
    console.log("added mask");
  }
}
