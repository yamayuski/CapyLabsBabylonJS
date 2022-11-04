/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 */

import {
    Engine,
    Scene,
} from "@babylonjs/core";

export default async function main(createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>): Promise<void> {
    const $canvas = document.getElementById("app") as HTMLCanvasElement | null;
    if (!$canvas) {
        throw new Error('canvas#app not found');
    }
    const engine = new Engine($canvas);
    const scene = await createScene(engine, $canvas);

    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener("resize", () => engine.resize());
}
