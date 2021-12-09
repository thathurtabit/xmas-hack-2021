import Game from "./scenes/game";
import GameOver from "./scenes/game-over";
import HighScores from "./scenes/high-scores";
import Splash from "./scenes/splash";

export const config = {
  type: Phaser.AUTO,
  backgroundColor: "#000",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      //debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  parent: "phaser-game",
  scene: [Splash, Game, GameOver, HighScores],
};
