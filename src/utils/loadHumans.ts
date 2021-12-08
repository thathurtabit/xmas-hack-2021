import { EAssetKeys } from "../settings/enums";

export const loadHumans = (scene: Phaser.Scene) => {
    scene.load.aseprite(
        EAssetKeys.HUMAN_1,
        "assets/human-0001.png",
        "assets/human-0001.json"
      );
      scene.load.aseprite(
        EAssetKeys.HUMAN_2,
        "assets/human-0002.png",
        "assets/human-0002.json"
      );
}