import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/babylon-capylabs-fps-camera.mts'),
      name: 'CapyLabsFPSCamera',
      fileName: 'babylon-capylabs-fps-camera',
    },
    rollupOptions: {
      external: [/\@babylonjs\/core.*/],
      output: {
        globals: {
          '@babylonjs/core': 'BABYLON',
        },
      },
    },
  },
});
