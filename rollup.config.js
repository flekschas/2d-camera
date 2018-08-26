import { terser } from 'rollup-plugin-terser';
import buble from 'rollup-plugin-buble';

const config = (file, format, plugins) => ({
  input: 'src/index.js',
  output: {
    name: 'createCamera2d',
    format,
    file,
    globals: {
      'gl-matrix': 'glMatrix',
    },
  },
  plugins,
  external: ['gl-matrix'],
});

export default [
  config('dist/camera-2d.js', 'umd', [buble()]),
  config('dist/camera-2d.min.js', 'umd', [buble(), terser()]),
];
