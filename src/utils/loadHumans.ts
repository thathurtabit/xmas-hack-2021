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
    scene.load.aseprite(
        EAssetKeys.HUMAN_3,
        "assets/human-0003.png",
        "assets/human-0003.json"
    );
    scene.load.aseprite(
        EAssetKeys.HUMAN_4,
        "assets/human-0004.png",
        "assets/human-0004.json"
    );
    scene.load.aseprite(
        EAssetKeys.HUMAN_5,
        "assets/human-0005.png",
        "assets/human-0005.json"
    );
    scene.load.aseprite(
        EAssetKeys.HUMAN_6,
        "assets/human-0006.png",
        "assets/human-0006.json"
    );
}