import { resolve } from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";

export default defineConfig({
    plugins: [
        splitVendorChunkPlugin(),
    ],
    base: "/CapyLabsBabylonJS/samples/",
    build: {
        rollupOptions: {
            input: {
                "many-trees": resolve(__dirname, "app", "many-trees", "index.html"),
                "tic-tac-toe": resolve(__dirname, "app", "tic-tac-toe", "index.html"),
            },
        },
    },
});
