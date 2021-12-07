import { EAssetKeys, EParticlesCount } from "./enums";
import TilemapLayer = Phaser.Tilemaps.TilemapLayer;
export interface ICovidParticle {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: EAssetKeys;
  index: number;
}

export interface ICreateCovidParticles {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: EAssetKeys;
  numberOfParticles: EParticlesCount;
  itemsToCollideWith: TilemapLayer[];
  onCollideCallback?: ArcadePhysicsCallback;
}
