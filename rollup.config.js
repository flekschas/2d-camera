import buble from "@rollup/plugin-buble";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";
import visualizer from "rollup-plugin-visualizer";

const config = (file, format, plugins = []) => ({
  input: "src/index.js",
  output: {
    name: "createCamera2d",
    format,
    file,
    globals: {
      "gl-matrix": "glMatrix"
    }
  },
  plugins,
  external: ["gl-matrix"]
});

export default [
  config("dist/camera-2d.js", "umd", [buble(), filesize(), visualizer()]),
  config("dist/camera-2d.min.js", "umd", [buble(), terser()]),
  config("dist/camera-2d.esm.js", "esm")
];
