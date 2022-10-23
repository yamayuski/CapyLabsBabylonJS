/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 */

import {
    Engine,
    Scene,
    FreeCamera,
    Vector3,
    DirectionalLight,
    MeshBuilder,
} from "@babylonjs/core";

import "../lib.css";
import main from "../lib.mjs";

function createScene(engine: Engine): Scene {
    const scene = new Scene(engine);
    const camera = new FreeCamera("mainCamera", Vector3.One(), scene);
    camera.position = new Vector3(2, 2, 2);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(true);
    const light = new DirectionalLight("mainLight", new Vector3(1.0, -1.0, 0.0), scene);
    MeshBuilder.CreateBox("box", {}, scene);
    return scene;
}

main(createScene);
