import { EAssetKeys, EParticlesCount } from "./enums";

export interface ICovidParticle {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: EAssetKeys;
  index: number;
  group: Phaser.GameObjects.Group;
}

export interface ICreateCovidParticles {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: EAssetKeys;
  numberOfParticles: EParticlesCount;
  itemsToCollideWith: Phaser.GameObjects.Group;
  onCollideCallback?: ArcadePhysicsCallback;
  group: Phaser.GameObjects.Group;
}

export interface ICreateCovidParticlesFromFace {
  xSpewPosition: number;
  ySpewPosition: number;
}

export interface ICreateHumanoid {
  assetKey: EAssetKeys;
  x: number;
  y: number;
}