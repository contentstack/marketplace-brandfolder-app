import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
  server: { port: 4000 },
  build: {
    outDir: "build",
    sourcemap: false,
    // venus-components 3.0.6 ships a require("void-elements") inside ES modules; convert it, or the field throws on load.
    commonjsOptions: { transformMixedEsModules: true },
  },
  envPrefix: "VITE_",
});
