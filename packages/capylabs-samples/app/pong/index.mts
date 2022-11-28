/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @license Apache-2.0
 * @copyright 2022 Masaru Yamagishi
 */

import {
    ArcRotateCamera,
    Color3,
    Color4,
    DeepImmutable,
    DirectionalLight,
    Engine,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Quaternion,
    Scene,
    StandardMaterial,
    TmpVectors,
    Vector3,
    VirtualJoystick,
} from "@babylonjs/core";

import "pepjs";
import main from "../lib.mjs";

/**
 * @link https://github.com/BabylonJS/Babylon.js/pull/13281
 */
function reflectVector3(inDirection: DeepImmutable<Vector3>, normal: DeepImmutable<Vector3>, ref: Vector3): Vector3 {
    const tmp = TmpVectors.Vector3[0];
    tmp.copyFrom(normal).scaleInPlace(2 * Vector3.Dot(inDirection, normal));
    return ref.copyFrom(inDirection).subtractInPlace(tmp);
}

class Stage {
    public constructor(private readonly scene: Scene) {
        const groundMat = new StandardMaterial("stageGroundMat", scene);
        groundMat.diffuseColor = new Color3(0.2, 0.2, 0.2);

        // Ground
        const ground = MeshBuilder.CreateGround("stageGround", {
            width: 5.65,
            height: 8.6,
        }, scene);
        ground.position.y = -0.5;
        ground.material = groundMat;

        // Wall
        const xm = MeshBuilder.CreateGround("xm", {
            height: 8.6,
        }, scene);
        xm.position.x = -5.65 / 2;
        xm.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, 0, -Math.PI / 2);
        xm.material = groundMat;
        const xp = MeshBuilder.CreateGround("xp", {
            height: 8.6,
        }, scene);
        xp.position.x = 5.65 / 2;
        xp.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, 0, Math.PI / 2);
        xp.material = groundMat;

        const zp = MeshBuilder.CreateGround("zp", {
            width: 5.65,
        }, scene);
        zp.position.z = 8.6 / 2;
        zp.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, -Math.PI / 2, 0);
        zp.material = groundMat;
        const zm = MeshBuilder.CreateGround("zm", {
            width: 5.65,
        }, scene);
        zm.position.z = -8.6 / 2;
        zm.rotationQuaternion = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, 0);
        zm.material = groundMat;
    }
}

class Player {
    private readonly SPEED = 0.0025;
    private readonly joystick = new VirtualJoystick(false, { limitToContainer: false });
    public constructor(private readonly mesh: Mesh) {
    }

    public update(deltaTime: number): void {
        if (this.joystick.pressed) {
            this.mesh.position.x = Math.max(
                -2.33,
                Math.min(
                    2.33,
                    this.mesh.position.x - this.joystick.deltaPosition.y * deltaTime * this.SPEED,
                ),
            );
        }
    }
}

class Enemy {
    public constructor(private readonly mesh: Mesh) {
    }

    public update(deltaTime: number): void {
        // TODO
    }
}

class Ball {
    private readonly SPEED = 0.0025;

    private direction: Vector3;
    public constructor(private readonly mesh: Mesh) {
        this.direction = new Vector3(
            Math.random() * 2 * Math.PI - Math.PI,
            0,
            Math.random() * 2 * Math.PI - Math.PI,
        ).normalize();
    }

    public update(deltaTime: number): void {
        // move
        this.mesh.position.addInPlace(new Vector3(
            deltaTime * this.direction.x * this.SPEED,
            0,
            deltaTime * this.direction.z * this.SPEED,
        ));

        // Hit with bar

        // goal
        if (this.mesh.position.z > 3.9) {
            this.direction = reflectVector3(this.direction, new Vector3(0, 0, -1), new Vector3());
        } else if (this.mesh.position.z < -3.9) {
            this.direction = reflectVector3(this.direction, new Vector3(0, 0, 1), new Vector3());
        }

        // reflect upper/lower
        if (this.mesh.position.x > 2.4) {
            this.direction = reflectVector3(this.direction, new Vector3(-1, 0, 0), new Vector3());
        } else if (this.mesh.position.x < -2.4) {
            this.direction = reflectVector3(this.direction, new Vector3(1, 0, 0), new Vector3());
        }
    }
}

async function createScene(engine: Engine): Promise<Scene> {
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    const camera = new ArcRotateCamera("mainCamera", 0, 1, 8, Vector3.Zero(), scene);
    camera.useAutoRotationBehavior = true;
    const light =new HemisphericLight("mainLight", new Vector3(1, 1, 0), scene);
    light.groundColor = new Color3(0.5, 0.5, 0.5);

    new Stage(scene);

    const playerMesh = MeshBuilder.CreateBox("player1Mesh", {
        updatable: true,
    }, scene);
    playerMesh.scaling = new Vector3(1, 1, 0.05);
    playerMesh.position = new Vector3(0, 0, 3.5);
    const player = new Player(playerMesh);

    const enemyMesh = MeshBuilder.CreateBox("player1Mesh", {
        updatable: true,
    }, scene);
    enemyMesh.scaling = new Vector3(1, 1, 0.05);
    enemyMesh.position = new Vector3(0, 0, -3.5);
    const enemy = new Enemy(enemyMesh);

    const ballMesh = MeshBuilder.CreateBox("ballMesh", {
        updatable: true,
    }, scene);
    ballMesh.scaling = new Vector3(0.2, 0.2, 0.2);
    const ball = new Ball(ballMesh);

    scene.registerBeforeRender(() => {
        const deltaTime = engine.getDeltaTime();
        player.update(deltaTime);
        enemy.update(deltaTime);
        ball.update(deltaTime);
    });

    return scene;
}

main(createScene);
