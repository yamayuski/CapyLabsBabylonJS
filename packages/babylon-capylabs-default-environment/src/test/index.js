const $style = document.createElement('style');
$style.innerHTML = `
html,
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

canvas {
  width: 100vw;
  height: 100vh;
  touch-action: none;
}
`;
document.head.appendChild($style);

async function loadScript(url) {
    const $script = document.createElement('script');
    $script.src = url;
    document.body.appendChild($script);
    return new Promise((resolve) => $script.addEventListener('load', resolve));
}

window.addEventListener('load', async () => {
    await loadScript('https://code.jquery.com/pep/0.4.3/pep.js');
    await loadScript('https://cdn.babylonjs.com/babylon.js');
    await loadScript('https://cdn.babylonjs.com/materialsLibrary/babylonjs.materials.min.js');
    await loadScript('https://cdn.babylonjs.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js');

    const $canvas = document.createElement('canvas');
    $canvas.setAttribute('touch-action', 'none');
    document.body.appendChild($canvas);

    const createScene = (engine, canvas) => {
        const scene = new BABYLON.Scene(engine);
        const env = new BabylonCapyLabs.CapyLabsDefaultEnvironment(scene);
        env.camera.attachControl(canvas, true);
        return scene;
    };
    const engine = new BABYLON.Engine($canvas);
    const scene = createScene(engine, $canvas);
    console.log('scene has created');
    engine.runRenderLoop(() => {
        scene.render();
    });
    window.addEventListener('resize', () => {
        engine.resize();
    });
});
