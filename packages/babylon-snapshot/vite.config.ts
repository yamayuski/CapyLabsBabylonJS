import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/babylon-snapshot.mts"),
      name: "BABYLONSnapshot",
      fileName: "babylon-snapshot",
    },
    rollupOptions: {
      external: [/@babylonjs\/core.*/],
      output: {
        globals: {
          "@babylonjs/core": "BABYLON",
        },
      },
    },
  },
});
