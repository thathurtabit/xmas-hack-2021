import { EAssetKeys } from "../settings/enums";

export const loadHumans = (scene: Phaser.Scene) => {
    scene.load.aseprite(
        EAssetKeys.HUMAN_1,
        "assets/Human-0001.png",
        "assets/Human-0001.json"
      );
      scene.load.aseprite(
        EAssetKeys.HUMAN_2,
        "assets/Human-0001.png",
        "assets/Human-0001.json"
      );
      scene.load.aseprite(
        EAssetKeys.HUMAN_3,
        "assets/Human-0001.png",
        "assets/Human-0001.json"
      );
      scene.load.aseprite(
        EAssetKeys.HUMAN_4,
        "assets/Human-0001.png",
        "assets/Human-0001.json"
      );
      scene.load.aseprite(
        EAssetKeys.HUMAN_5,
        "assets/Human-0001.png",
        "assets/Human-0001.json"
      );
      scene.load.aseprite(
        EAssetKeys.HUMAN_6,
        "assets/Human-0001.png",
        "assets/Human-0001.json"
      );
}