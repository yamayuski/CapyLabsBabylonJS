/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 */

import {
    ArcRotateCamera,
    Color4,
    DirectionalLight,
    Engine,
    Scene,
    Vector3,
} from "@babylonjs/core";

import main from "../lib.mjs";

async function createScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(1, 1, 1, 1);
    new ArcRotateCamera("mainCamera", 0, 0, 6, Vector3.Zero(), scene);
    new DirectionalLight("mainLight", new Vector3(0.1, -1, 0.1), scene);

    return scene;
}

main(createScene);
