import "phaser";
import { EScenes } from "../settings/enums";
import { fontFamily } from "../settings/constants";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;

export default class Game extends Phaser.Scene {
  constructor() {
    super(EScenes.GAME);
  }

  preload() {
    this.load.image('white', 'assets/map/white-square.png');
    this.load.image('black', 'assets/map/black-square.png');
    this.load.tilemapTiledJSON('map', 'assets/map/map-json.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'map' });
    const whiteTileset = map.addTilesetImage('map-background', 'white', 8, 8);
    const blackTileset = map.addTilesetImage('faces', 'black', 8, 8);

    const backgroundLayer = map.createLayer('background', whiteTileset);
    
    const edgesLayer = map.createLayer('walls', whiteTileset);
    const facesLayer = map.createLayer('faces', blackTileset);
    

    const collidingLayers: Array<TilemapLayer> = [edgesLayer, facesLayer]
    this.setCollision(collidingLayers)



    // const screenCenterX =
    //   this.cameras.main.worldView.x + this.cameras.main.width / 2;
    // const screenCenterY =
    //   this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // this.add
    //   .text(screenCenterX, screenCenterY + 30, `GAME STUFF`, {
    //     font: `30px ${fontFamily}`,
    //   })
    //   .setOrigin(0.5)
    //   .setAlign("center");

    // this.add
    //   .text(screenCenterX, 500, `Game Over`, {
    //     font: `40px ${fontFamily}`,
    //     padding: { x: 20, y: 10 },
    //     backgroundColor: "#fff",
    //     color: "#000",
    //   })
    //   .setOrigin(0.5)
    //   .setAlign("center");

    // this.input.on(
    //   "pointerup",
    //   () => {
    //     this.scene.start(EScenes.GAME_OVER);
    //   },
    //   this
    // );
  }

  private setCollision(collidingLayers: Array<TilemapLayer>) {
    collidingLayers.forEach((layer) => {
      layer.setCollisionByProperty({ collides: true });
    });
  }
}
