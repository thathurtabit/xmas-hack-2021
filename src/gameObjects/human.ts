export default class Human extends Phaser.GameObjects.Sprite {
  isMasked: boolean;
  isInfected: boolean;

  constructor(params) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.x = params.x;
    this.y = params.y;
    this.texture = params.texture;
    this.scale = params.scale;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.isMasked = false;
    this.isInfected = false;
  }

  addMask() {
      this.isMasked = true;
  } 

  infect() {
      this.isInfected = true;
  }
}
