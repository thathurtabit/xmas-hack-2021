import "phaser";
import { EAssetKeys, EScenes } from "../settings/enums";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;

export default class Game extends Phaser.Scene {
  constructor() {
    super(EScenes.GAME);
  }

  preload() {
    this.load.image(EAssetKeys.WHITE, 'assets/map/white-square.png');
    this.load.image(EAssetKeys.BLACK, 'assets/map/black-square.png');
    this.load.tilemapTiledJSON(EAssetKeys.MAP, 'assets/map/map-json.json');
    this.load.image(EAssetKeys.COVID_PARTICLE, "assets/covid_particle.png");
  }

  create() {
    const map = this.make.tilemap({ key: EAssetKeys.MAP });
    const whiteTileset = map.addTilesetImage(EAssetKeys.MAP_BG, EAssetKeys.WHITE, 8, 8);
    const blackTileset = map.addTilesetImage(EAssetKeys.FACES, EAssetKeys.BLACK, 8, 8);

    const backgroundLayer = map.createLayer(EAssetKeys.BACKGROUND, whiteTileset);
    
    const edgesLayer = map.createLayer(EAssetKeys.WALLS, whiteTileset);
    const facesLayer = map.createLayer(EAssetKeys.FACES, blackTileset);
    

    const collidingLayers: Array<TilemapLayer> = [edgesLayer, facesLayer]
    this.setCollision(collidingLayers)

  }

  private setCollision(collidingLayers: Array<TilemapLayer>) {
    collidingLayers.forEach((layer) => {
      layer.setCollisionByProperty({ collides: true });
    });
  }
}
