import { terser } from "rollup-plugin-terser";
import buble from "@rollup/plugin-buble";

const config = (file, format, plugins = []) => ({
  input: "src/index.js",
  output: {
    name: "createCamera2d",
    format,
    file,
    globals: {
      "gl-matrix/mat4": "glMatrix.mat4",
      "gl-matrix/vec4": "glMatrix.vec4"
    }
  },
  plugins,
  external: ["gl-matrix/mat4", "gl-matrix/vec4"]
});

export default [
  config("dist/camera-2d.js", "umd", [buble()]),
  config("dist/camera-2d.min.js", "umd", [buble(), terser()]),
  config("dist/camera-2d.esm.js", "esm")
];
