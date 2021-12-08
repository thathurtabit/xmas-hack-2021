import "phaser";
import { ICovidParticle } from "./../settings/interfaces";
import { covidParticle } from "./../settings/constants";
import { EAssetKeys } from "../settings/enums";

export default class CovidParticle extends Phaser.GameObjects.Sprite {
  private delay: number;
  body: Phaser.Physics.Arcade.Body;
  key: string;
  velocityX: number;
  velocityY: number;
  destroyable: boolean;

  constructor({ scene, x, y, key, index, group, destroyable }: ICovidParticle) {
    super(scene, x, y, key);
    this.key = key;

    this.velocityX = this.getRandomVelocity();
    this.velocityY = this.getRandomVelocity();

    this.delay = index;
    this.destroyable = destroyable

    group.add(this);

    // Actions
    this.init();
    this.start();
    this.addTween();
  }

  private getRandomVelocity(): number {
    const randomTrueOrFalse = () => (Math.random() < 0.5 ? false : true);
    const positiveOrNegativeDirection = (velocity: number) =>
      randomTrueOrFalse() ? velocity : 0 - velocity;
    return positiveOrNegativeDirection(Math.floor(Math.random() * 200) + 50);
  }

  private init(): void {
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.name = EAssetKeys.COVID_PARTICLE;
    this.body.setSize(covidParticle.width, covidParticle.height);
    this.start();
  }

  private start(): void {
    this.body.setVelocity(this.velocityX, this.velocityY);
    this.body.velocity.normalize().scale(covidParticle.speed);
    this.body.setBounce(1, 1);
    this.body.setCollideWorldBounds(true);
  }

  public addTween(): void {
    this.scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 1000,
      ease: "Sine.inOut",
      yoyo: false,
      repeat: -1,
      delay: this.delay * 200,
    });
  }

  public makeDestroyable() {
    this.destroyable = true
  }
}
