/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 */

import {
    CascadedShadowGenerator,
    Color3,
    CreateBox,
    DirectionalLight,
    Engine,
    FreeCamera,
    MeshBuilder,
    Scene,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import "@babylonjs/loaders/glTF";

import main from "../lib.mjs";

async function createScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    const camera = new FreeCamera("mainCamera", Vector3.One(), scene);
    camera.position = new Vector3(5, 5, 5);
    camera.setTarget(new Vector3(0, 0, 0));
    camera.attachControl(true);
    const light = new DirectionalLight("mainLight", new Vector3(-0.7, -2.2, 1.78), scene);
    light.autoCalcShadowZBounds = true;

    const shadow = new CascadedShadowGenerator(1024, light);
    shadow.autoCalcDepthBounds = true;

    createSky(scene);

    const baseBox = CreateBox("BaseBox", {
        size: 1,
    }, scene);
    const grassTex = new Texture("https://assets.babylonjs.com/textures/grass.jpg", scene);
    const grassMat = new StandardMaterial("GrassMat", scene);
    grassMat.diffuseTexture = grassTex;
    grassMat.specularColor = Color3.Black();
    baseBox.material = grassMat;

    for (let x = 0; x < 9; x++) {
        for (let z = 0; z < 9; z++) {
            const b = baseBox.createInstance(`Box${x}_${z}`);
            b.position.x = x;
            b.position.z = z;
        }
    }
    return scene;
}

function createSky(scene: Scene): void {
    const mat = new SkyMaterial("sky", scene);
    mat.azimuth = 0.25;
    mat.inclination = 0.15;
    mat.luminance = 0.8;
    mat.mieCoefficient = 0.015;
    mat.mieDirectionalG = 0.9;
    mat.rayleigh = 1.2;
    mat.turbidity = 7;
    mat.cullBackFaces = false;

    const mesh = MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
    mesh.infiniteDistance = true;
    mesh.material = mat;
}

main(createScene);
