/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @copyright 2022 Masaru Yamagishi
 * @license Apache-2.0
 */

import { Engine, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { CapyLabsFPSCamera } from "../src/capyLabsFPSCamera.mjs";

async function main(): Promise<void> {
    const $canvas = document.getElementById("game") as HTMLCanvasElement|null;
    if (!$canvas) {
        throw new Error();
    }

    const engine = new Engine($canvas, true, {}, true);
    const scene = new Scene(engine);
    const camera = new CapyLabsFPSCamera("MainCamera", new Vector3(0, 2, 5), scene, true);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true);

    MeshBuilder.CreateGround("Ground", { width: 10, height: 10 }, scene);

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => engine.resize());
}

main();
