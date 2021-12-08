import Mask from "./mask";

export default class Human extends Phaser.GameObjects.Sprite {
  isMasked: boolean;
  isInfected: boolean;
  currentMask: Mask

  constructor(params) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.x = params.x;
    this.y = params.y;
    this.texture = params.texture;
    this.scale = params.scale;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.isMasked = false;
    this.isInfected = params.isInfected;
  }

  giveMask(mask: Mask) {
      this.isMasked = true;
      this.currentMask = mask
  } 

  takeMask() {
      this.isMasked = false;
  } 

  infect() {
      this.isInfected = true;
  }

  disinfect() {
    this.isInfected = false;
  }
}
