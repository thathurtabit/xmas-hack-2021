import { colors } from "../settings/constants";
import Mask from "./mask";

export default class Human extends Phaser.GameObjects.Sprite {
  isMasked: boolean;
  isInfected: boolean;
  currentMask: Mask;
  disinfectTimer: Phaser.Time.TimerEvent;

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

    if (this.isInfected) {
      this.tint = colors.infectedTint;
    }
  }

  giveMask(mask: Mask) {
    this.isMasked = true;
    this.currentMask = mask;
  }

  takeMask() {
    this.isMasked = false;
  }

  infect() {
    this.isInfected = true;
    this.infectedTween();
    this.tint = colors.infectedTint;
  }

  disinfect() {
    this.isInfected = false;
    this.tint = colors.disinfectedTint;
  }

  setDisinfectTimer(scene: Phaser.Scene) {
    if (this.disinfectTimer) {
      this.disinfectTimer.remove();
    }
    this.disinfectTimer = scene.time.addEvent({
      delay: 10000,
      callback: () => this.disinfect(),
      callbackScope: scene,
      loop: false,
    });
  }

  infectedTween(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 300,
      ease: "Sine.inOut",
      loop: 3,
      yoyo: true,
    });
  }
}
