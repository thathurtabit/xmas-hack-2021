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
}: ICreateCovidParticles) => {
  const createCollisions = (particle: CovidParticle) => {
    scene.physics.add.collider(
      particle,
      itemsToCollideWith,
      null,
      onCollideCallback
    );
  };

  const covidParticles = new Array(numberOfParticles)
    .fill(0)
    .map((_, index) => {
      const particle = new CovidParticle({ scene, x, y, key, index });
      createCollisions(particle);
      return particle;
    });

  scene.physics.add.collider(covidParticles, covidParticles);
};
