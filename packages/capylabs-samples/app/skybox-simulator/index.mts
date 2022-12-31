/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 * @link https://playground.babylonjs.com/#F3P4BS#6
 */

import {
    ArcRotateCamera,
    CubeTexture,
    DirectionalLight,
    Engine,
    MeshBuilder,
    PBRMaterial,
    ReflectionProbe,
    Scene,
    SceneLoader,
    StandardMaterial,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";

import "@babylonjs/loaders/glTF/2.0";
import "pepjs";

import main from "../lib.mjs";

async function createScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    const camera = new ArcRotateCamera("mainCamera", 0, Math.PI / 4, 10, Vector3.Zero(), scene);
    camera.attachControl(true);
    new DirectionalLight("mainLight", new Vector3(0.1, -1, 0.1), scene);

    // Environment reflection sphere
    const sphereMat = new PBRMaterial("sphere_mat", scene);
    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);
    sphere.material = sphereMat;
    sphere.position.y = 1;

    // BoomBox
    const result = await SceneLoader.ImportMeshAsync("", "https://playground.babylonjs.com/scenes/", "BoomBox.glb", scene);
    result.meshes[1].scaling = new Vector3(100, 100, 100);
    result.meshes[1].position = new Vector3(0, 1, 3);
    result.meshes[1].rotation = new Vector3(0, Math.PI / 2, 0);

    MeshBuilder.CreateBox("ground", { width: 3, height: 0.1, depth: 9 }, scene);

    // Skybox mesh
    const skybox = MeshBuilder.CreateBox("skybox", { size: 1000 }, scene);
    skybox.infiniteDistance = true;

    // ReflectionProbe
    const reflectionProbe = new ReflectionProbe("reflection_probe", 256, scene, false);
    reflectionProbe.renderList?.push(skybox);
    scene.environmentTexture = reflectionProbe.cubeTexture;

    const gui = AdvancedDynamicTexture.CreateFullscreenUI("gui", true, scene);

    // static textures
    const textures = [
        {
            name: "skybox",
            path: "https://assets.babylonjs.com/skyboxes/skybox/skybox_py.jpg",
        },
        {
            name: "skybox2",
            path: "https://assets.babylonjs.com/skyboxes/skybox2/skybox2_py.jpg",
        },
        {
            name: "skybox3",
            path: "https://assets.babylonjs.com/skyboxes/skybox3/skybox3_py.jpg",
        },
        {
            name: "skybox4",
            path: "https://assets.babylonjs.com/skyboxes/skybox4/skybox4_py.jpg",
        },
        {
            name: "toySky",
            path: "https://assets.babylonjs.com/skyboxes/toySky/toySky_py.jpg",
        },
        {
            name: "TropicalSunnyDay",
            path: "https://assets.babylonjs.com/skyboxes/TropicalSunnyDay/TropicalSunnyDay_py.jpg",
        },
    ];

    textures.forEach((t, index) => {
        const btn = Button.CreateImageButton(`skybox-${t.name}`, t.name, t.path);
        btn.width = 0.2;
        btn.height = "40px";
        btn.color = "white";
        btn.background = "black";
        btn.top = index * 40;
        btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        btn.onPointerClickObservable.add(() => {
            // apply the material
            skybox.material = createSkyboxMaterial(scene, t.path);
        });
        gui.addControl(btn);
    });

    return scene;
}

function createSkyboxMaterial(scene: Scene, pyJpg: string): StandardMaterial {
    const tex = CubeTexture.CreateFromImages([
        pyJpg.replace("_py.", "_px."),
        pyJpg.replace("_py.", "_py."),
        pyJpg.replace("_py.", "_pz."),
        pyJpg.replace("_py.", "_nx."),
        pyJpg.replace("_py.", "_ny."),
        pyJpg.replace("_py.", "_nz."),
    ], scene);
    const mat = new StandardMaterial(`skybox_mat_${pyJpg}`, scene);
    mat.reflectionTexture = tex;
    mat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    mat.disableLighting = true;
    mat.backFaceCulling = false;
    return mat;
}

main(createScene);
