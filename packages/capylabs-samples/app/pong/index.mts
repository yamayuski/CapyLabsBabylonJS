/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 */

import {
    ArcRotateCamera,
    Color3,
    Color4,
    DirectionalLight,
    Engine,
    MeshBuilder,
    Ray,
    Scene,
    StandardMaterial,
    Vector3,
} from "@babylonjs/core";

import main from "../lib.mjs";

async function createScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    new ArcRotateCamera("mainCamera", 0, 0, 6, Vector3.Zero(), scene);
    new DirectionalLight("mainLight", new Vector3(0.0, -1, 0.0), scene);

    const stageMesh = MeshBuilder.CreateGround("stageMesh", {
        width: 5,
        height: 3,
    }, scene);
    const stageMat = new StandardMaterial("stageMat", scene);
    stageMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
    stageMat.specularColor = new Color3(0, 0, 0);
    stageMesh.material = stageMat;

    const player1Mesh = MeshBuilder.CreateBox("player1Mesh", {
        updatable: true,
    }, scene);
    player1Mesh.scaling = new Vector3(0.05, 0.05, 0.5);
    player1Mesh.position = new Vector3(-2, 0, 0);

    const DMesh = MeshBuilder.CreateBox("DMesh", {
        updatable: false,
    }, scene);
    DMesh.scaling = new Vector3(0.5, 0.5, 0.5);
    DMesh.position = new Vector3(-2, 0, 1.8);
    DMesh.isPickable = true;
    DMesh.material = new StandardMaterial("DMat");
    const AMesh = MeshBuilder.CreateBox("AMesh", {
        updatable: false,
    }, scene);
    AMesh.scaling = new Vector3(0.5, 0.5, 0.5);
    AMesh.position = new Vector3(-2, 0, -1.8);
    AMesh.isPickable = true;
    AMesh.material = new StandardMaterial("AMat");

    scene.registerBeforeRender(() => {
        (DMesh.material as StandardMaterial).diffuseColor = new Color3(1, 1, 1);
        (AMesh.material as StandardMaterial).diffuseColor = new Color3(1, 1, 1);
        const result = scene.pick(scene.pointerX, scene.pointerY);
        if (result.hit && result.pickedMesh) {
            switch (result.pickedMesh.name) {
                case "DMesh":
                    (DMesh.material as StandardMaterial).diffuseColor = new Color3(1, 0, 0);
                    player1Mesh.position.z += 0.015;
                    break;
                case "AMesh":
                    (AMesh.material as StandardMaterial).diffuseColor = new Color3(1, 0, 0);
                    player1Mesh.position.z -= 0.015;
                    break;
            }
            player1Mesh.position.z = Math.min(1.25, Math.max(-1.25, player1Mesh.position.z));
        }
    });

    return scene;
}

main(createScene);
