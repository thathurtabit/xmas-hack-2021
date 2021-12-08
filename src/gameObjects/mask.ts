export default class Mask extends Phaser.GameObjects.Image {
  private delay: number;
  destroyMaskTimer: Phaser.Time.TimerEvent
  
  constructor(params) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.x = params.x;
    this.y = params.y;
    this.texture = params.texture;
    this.scale = 0.9;
    this.delay = params.delay;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  setDestroyMaskTimer(maskTimer: Phaser.Time.TimerEvent) {
    this.destroyMaskTimer = maskTimer;
  }
}
