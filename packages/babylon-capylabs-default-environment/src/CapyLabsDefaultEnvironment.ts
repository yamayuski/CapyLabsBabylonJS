/**
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @copyright 2022 Masaru Yamagishi
 * @license Apache-2.0
 */

import * as BABYLON from "@babylonjs/core/Legacy/legacy";
import { SkyMaterial } from "@babylonjs/materials/sky/skyMaterial";
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial";
import { CloudProceduralTexture } from "@babylonjs/procedural-textures/cloud/cloudProceduralTexture";

/**
 * Adds DirectionalLight
 */
type MainLightOpts = {
    direction?: BABYLON.Vector3,
};
/**
 * Adds procedural sky with SkyMaterial
 */
type SkyOpts = {
    size?: number,
    azimuth?: number,
    inclination?: number,
    luminance?: number,
    mieCoefficient?: number,
    mieDirectionalG?: number,
    rayleigh?: number,
    turbidity?: number,
    cloud?: {
        amplitude: number,
        numOctaves: number,
    } | false,
};
/**
 * Adds grid ground
 */
type GroundOpts = {
    textureType?: "grid",
    size?: number,
}
/**
 * Adds FPS shooter camera
 */
type CameraOpts = {
    initialPos?: BABYLON.Vector3,
    minZ?: number,
    maxZ?: number,
    attachControl?: boolean,
    enableCollisions?: boolean,
    usePointerLock?: boolean,
};
/**
 * Adds rendering
 */
type RenderingOpts = {
    useSSAO?: boolean,
    ssaoRatio?: number,
    useShadow?: boolean,
    useCascadedShadow?: boolean,
    shadowSize?: number,
};
/**
 * Default environment options
 * false means opt-out
 */
type CapyLabsDefaultEnvironmentOpts = {
    mainLight?: MainLightOpts | false,
    camera?: CameraOpts | false,
    sky?: SkyOpts | false,
    ground?: GroundOpts | false,
    rendering?: RenderingOpts | false,
};

/**
 * CapyLabs environment for playground
 * @link https://playground.babylonjs.com/#PPLK84#4
 *
 * @example default params
 * ```javascript
 * // create default params
 * const env = new CapyLabsDefaultEnvironment(scene);
 * env.camera.attachControl(canvas, true);
 * ```
 * @example opt-out some features
 * ```javascript
 * const env = new CapyLabsDefaultEnvironment(scene, { ground: false, rendering: false});
 * ```
 */
export class CapyLabsDefaultEnvironment {
    /** for dispose */
    private meshesRef: BABYLON.Mesh[] = [];

    public readonly mainLight?: BABYLON.DirectionalLight;
    public readonly camera?: CapyLabsCamera;
    public readonly shadow?: BABYLON.ShadowGenerator;

    public constructor(
        private readonly scene: BABYLON.Scene,
        opts: CapyLabsDefaultEnvironmentOpts = {},
    ) {
        if (opts.mainLight !== false) {
            this.mainLight = this.createMainLight(opts.mainLight ?? {});
        }
        if (opts.camera !== false) {
            this.camera = this.createCamera(opts.camera ?? {});
        }
        if (opts.sky !== false) {
            this.createSky(opts.sky ?? {});
        }
        if (opts.ground !== false) {
            this.createGround(opts.ground ?? {});
        }
        if (opts.rendering !== false) {
            this.shadow = this.createRendering(opts.rendering ?? {});
        }
    }

    public dispose(): void {
        this.meshesRef.forEach((mesh) => mesh.dispose());
        this.mainLight?.dispose();
        this.camera?.dispose();
        this.shadow?.dispose();
    }

    private createMainLight(opts: MainLightOpts): BABYLON.DirectionalLight {
        return new BABYLON.DirectionalLight("mainLight", opts.direction ?? new BABYLON.Vector3(0, -15, 12), this.scene);
    }

    private createCamera(opts: CameraOpts): CapyLabsCamera {
        return new CapyLabsCamera(this.scene, opts);
    }

    private createSky(opts: SkyOpts): void {
        const material = new SkyMaterial("skyMat", this.scene);
        material.azimuth = opts.azimuth ?? 0.25;
        material.inclination = opts.inclination ?? 0.15;
        material.luminance = opts.luminance ?? 0.8;
        material.mieCoefficient = opts.mieCoefficient ?? 0.015;
        material.mieDirectionalG = opts.mieDirectionalG ?? 0.9;
        material.rayleigh = opts.rayleigh ?? 1.2;
        material.turbidity = opts.turbidity ?? 7.0;
        material.cullBackFaces = false;

        const mesh = BABYLON.MeshBuilder.CreateBox("skybox", { size: opts.size ?? 1000, updatable: false }, this.scene);
        mesh.infiniteDistance = true;
        mesh.material = material;
        this.meshesRef.push(mesh);

        if (opts.cloud !== false) {
            const cloudTex = new CloudProceduralTexture("cloudTex", 512, this.scene);
            cloudTex.amplitude = opts.cloud?.amplitude ?? 0.6;
            cloudTex.numOctaves = opts.cloud?.numOctaves ?? 4;
            cloudTex.skyColor = new BABYLON.Color4(1.0, 1.0, 1.0, 0.0);
            cloudTex.cloudColor = new BABYLON.Color4(1.0, 1.0, 1.0, 0.2);
            cloudTex.hasAlpha = true;

            const cloudMat = new BABYLON.StandardMaterial("cloudMat", this.scene);
            cloudMat.opacityTexture = cloudTex;
            cloudMat.opacityTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            cloudMat.emissiveTexture = cloudTex;
            cloudMat.emissiveTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            cloudMat.backFaceCulling = false;
            cloudMat.disableLighting = true;

            const cloudMesh = BABYLON.MeshBuilder.CreateSphere("cloudMesh", { segments: 8 }, this.scene);
            const scale = 200;
            cloudMesh.scaling = new BABYLON.Vector3(scale, scale, scale);
            cloudMesh.material = cloudMat;
            cloudMesh.infiniteDistance = true;
        }
    }

    private createGround(opts: GroundOpts): void {
        // TODO other material support
        const material = new GridMaterial("groundMat", this.scene);
        material.mainColor = new BABYLON.Color3(1.0, 1.0, 1.0);
        material.lineColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        const mesh = BABYLON.MeshBuilder.CreateGround("ground", {
            width: opts.size ?? 500,
            height: opts.size ?? 500,
            updatable: false,
        }, this.scene);
        mesh.material = material;
        mesh.receiveShadows = true;
        mesh.checkCollisions = true;
        this.meshesRef.push(mesh);
    }

    private createRendering(opts: RenderingOpts): BABYLON.ShadowGenerator | undefined {
        if (opts.useSSAO !== false) {
            if (!this.camera) {
                throw new Error(`SSAO needs camera`);
            }
            new BABYLON.SSAO2RenderingPipeline("ssao2", this.scene, opts.ssaoRatio ?? 1.0, [this.camera]);
        }

        if (opts.useCascadedShadow !== false) {
            if (!this.mainLight) {
                throw new Error(`CascadedShadowGenerator needs mainLight`);
            }
            return new BABYLON.CascadedShadowGenerator(opts.shadowSize ?? 1024, this.mainLight);
        } else if (opts.useShadow !== false) {
            if (!this.mainLight) {
                throw new Error(`ShadowGenerator needs mainLight`);
            }
            return new BABYLON.ShadowGenerator(opts.shadowSize ?? 1024, this.mainLight);
        }
    }
}

/**
 * CapyLabs Default Shooter camera
 * @author Masaru Yamagishi <akai_inu@live.jp>
 * @copyright 2022 Masaru Yamagishi
 * @license Apache-2.0
 */
export class CapyLabsCamera extends BABYLON.FreeCamera {
    public constructor(scene: BABYLON.Scene, opts?: CameraOpts) {
        super("CapyLabsCamera", opts?.initialPos ?? new BABYLON.Vector3(0, 3.3, 0), scene, true);
        this.setTarget(new BABYLON.Vector3(this.position.x, this.position.y, this.position.z + 1));
        this.inputs.add(new ShooterCameraDashInput(this, opts?.usePointerLock ?? false));
        this.minZ = opts?.minZ ?? 1;
        this.maxZ = opts?.maxZ ?? 1000;

        if (opts?.enableCollisions !== false) {
            this.checkCollisions = true;
            this.ellipsoid = new BABYLON.Vector3(1, 1.7, 1);
            this.applyGravity = true;
        }
    }
}

/**
 * Input with dash
 * @todo divide by root 2 when moved diagonal
 */
export class ShooterCameraDashInput implements BABYLON.ICameraInput<BABYLON.FreeCamera> {
    /**
     * Dash speed
     */
    public readonly dashSpeed = 0.8;
    /**
     * Walk speed(default)
     */
    public readonly walkSpeed = 0.5;

    private onKeyboardObservable: BABYLON.Nullable<BABYLON.Observer<BABYLON.KeyboardInfo>> = null;
    private onPointerDownObservable: BABYLON.Nullable<BABYLON.Observer<BABYLON.PointerInfo>> = null;

    /**
     * {@inheritdoc}
     */
    public constructor(
        public readonly camera: BABYLON.FreeCamera,
        public usePointerLock = false,
    ) {
        // Use WASD to move
        camera.keysUp.push("W".charCodeAt(0));
        camera.keysDown.push("S".charCodeAt(0));
        camera.keysLeft.push("A".charCodeAt(0));
        camera.keysRight.push("D".charCodeAt(0));
    }

    /**
     * {@inheritdoc}
     */
    public attachControl(noPreventDefault?: boolean): void {
        // eslint-disable-next-line prefer-rest-params
        noPreventDefault = BABYLON.Tools.BackCompatCameraNoPreventDefault(arguments);
        this.camera.angularSensibility = 5000.0;
        this.camera.getScene().gravity = new BABYLON.Vector3(0, -0.1, 0);

        this.onKeyboardObservable = this.camera.getScene().onKeyboardObservable.add((info) => {
            if (info.type === 1 && info.event.code === "ShiftLeft") {
                this.camera.speed = this.dashSpeed;
            } else {
                this.camera.speed = this.walkSpeed;
            }
            if (info.type === 1 && info.event.code === "Space") {
                if (this.camera.position.y <= 2.5) {
                    this.camera.cameraDirection.y += 0.5;
                }
            }
            if (!noPreventDefault) {
                info.event.preventDefault();
            }
        });
        if (this.usePointerLock) {
            this.onPointerDownObservable = this.camera.getScene().onPointerObservable.add(() => {
                if (!this.camera.getScene().getEngine().isPointerLock) {
                    this.camera.getScene().getEngine().enterPointerlock();
                }
            });
        }
    }

    /**
     * {@inheritdoc}
     */
    public detachControl(): void {
        if (this.onKeyboardObservable) {
            this.camera.getScene().onKeyboardObservable.remove(this.onKeyboardObservable);
            this.onKeyboardObservable = null;
        }
        if (this.onPointerDownObservable) {
            this.camera.getScene().onPointerObservable.remove(this.onPointerDownObservable);
            this.onPointerDownObservable = null;
        }
    }

    /**
     * {@inheritdoc}
     */
    public getClassName(): string {
        return "ShooterCameraDashInput";
    }

    /**
     * {@inheritdoc}
     */
    public getSimpleName(): string {
        return "dash";
    }
}
