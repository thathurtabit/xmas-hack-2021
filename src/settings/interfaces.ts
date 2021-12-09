import {EAssetKeys, EAudioKeys, EHumanIDs, EParticlesCount, Gender} from "./enums";

export interface ICovidParticle {
  scene: Phaser.Scene;
  x: number;
  y: number;
  key: EAssetKeys;
  index: number;
  group: Phaser.GameObjects.Group;
  destroyable: boolean;
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
  destroyable: boolean;
}

export interface ICreateCovidParticlesFromFace {
  xSpewPosition: number;
  ySpewPosition: number;
}

export interface ICreateHumanoid {
  id: EHumanIDs;
  assetKey: EAssetKeys;
  x: number;
  y: number;
  isInfected: boolean;
  scale: number;
  animationKey: EAudioKeys;
  isAntiMasker?: boolean;
  isSuperSpreader?: boolean;
  gender: Gender;
}

export interface IGameStatusUI {
  gameScene: Phaser.Scene;
  availableMasks: number;
  survivalTime: number;
  numberOfInfected: number;
  maxNumberOfInfected: number;
}
