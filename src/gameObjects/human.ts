import { colors, fontFamily } from "../settings/constants";
import Mask from "./mask";
import {Gender} from "../settings/enums";

export default class Human extends Phaser.GameObjects.Sprite {
  id: string;
  isMasked: boolean;
  isInfected: boolean;
  isSuperSpreader: boolean;
  isAntiMasker: boolean;
  currentMask: Mask;
  disinfectTimer: Phaser.Time.TimerEvent;
  gender: Gender;

  constructor(params) {
    super(params.scene, params.x, params.y, params.texture, params.frame);
    this.id = params.id;
    this.x = params.x;
    this.y = params.y;
    this.texture = params.texture;
    this.scale = params.scale;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.isMasked = false;
    this.isInfected = params.isInfected;
    this.isSuperSpreader = params.isSuperSpreader;
    this.isAntiMasker = params.isAntiMasker;
    this.gender = params.gender;

    if (this.isInfected) {
      this.tint = colors.infectedTint;
    }

    if (this.isSuperSpreader) {
      this.setSuperSpreader();
    }
  }

  private setSuperSpreader(): void {
    this.scene.add
      .text(this.x, this.y - 80, `SUPER-SPREADER`, {
        font: `10px ${fontFamily}`,
        color: colors.primary,
      })
      .setOrigin(0.5, 0)
      .setAlign("center");
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

  refuseMask(): void {
    this.scene.tweens.add({
      targets: this,
      x: this.x - 10,
      duration: 200,
      ease: "Sine.inOut",
      loop: 3,
      yoyo: true,
    });
  }
}
