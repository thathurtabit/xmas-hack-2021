import { createCovidParticles } from "./../utils/createCovidParticle";
import "phaser";
import { EAssetKeys, EParticlesCount, EScenes } from "../settings/enums";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;

export default class Game extends Phaser.Scene {
  constructor() {
    super(EScenes.GAME);
  }

  preload() {
    this.load.image(EAssetKeys.WHITE, "assets/map/white-square.png");
    this.load.image(EAssetKeys.BLACK, "assets/map/black-square.png");
    this.load.image(EAssetKeys.COVID_PARTICLE, "assets/covid-particle.png");
    this.load.tilemapTiledJSON(EAssetKeys.MAP, "assets/map/map-json.json");
  }

  create() {
    const map = this.make.tilemap({ key: EAssetKeys.MAP });
    const whiteTileset = map.addTilesetImage(
      EAssetKeys.MAP_BG,
      EAssetKeys.WHITE,
      8,
      8
    );
    const blackTileset = map.addTilesetImage(
      EAssetKeys.FACES,
      EAssetKeys.BLACK,
      8,
      8
    );

    const backgroundLayer = map.createLayer(
      EAssetKeys.BACKGROUND,
      whiteTileset
    );

    const edgesLayer = map.createLayer(EAssetKeys.WALLS, whiteTileset);
    const facesLayer = map.createLayer(EAssetKeys.FACES, blackTileset);

    const collidingLayers: Array<TilemapLayer> = [edgesLayer, facesLayer];
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
  }

  private onCovidParticleCollideCallback() {
    //console.log("COVID PARTICLE COLLIDE");
  }

  private setCollision(collidingLayers: Array<TilemapLayer>) {
    collidingLayers.forEach((layer) => {
      layer.setCollisionByProperty({ collides: true });
    });
  }
}
