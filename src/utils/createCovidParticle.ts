import CovidParticle from "../gameObjects/covidParticle";
import { ICreateCovidParticles } from "./../settings/interfaces";

export const createCovidParticles = ({
  scene,
  x,
  y,
  key,
  numberOfParticles,
  itemsToCollideWith,
  onCollideCallback,
  group,
  destroyable
}: ICreateCovidParticles) => {
  const createCollisions = (particle: CovidParticle) => {
    itemsToCollideWith.getChildren().forEach((itemToCollideWith) => {
      scene.physics.add.collider(
        particle,
        itemToCollideWith,
        null,
        () => onCollideCallback(particle, itemToCollideWith as any),
        scene
      );
    }, scene);
  };

  const covidParticles = new Array(numberOfParticles)
    .fill(0)
    .map((_, index) => {
      const particle = new CovidParticle({ scene, x, y, key, index, group, destroyable });
      createCollisions(particle);
      scene.time.addEvent({
        delay: 1000,
        callback: () => particle.makeDestroyable(),
        callbackScope: scene,
        loop: false
      })
      return particle;
    });

  scene.physics.add.collider(covidParticles, covidParticles);
};

