import { mat4, vec4 } from "gl-matrix";

const VIEW_CENTER = [0, 0, 0, 1];

const createCamera = (
  initTarget = [0, 0],
  initDistance = 1,
  initRotation = 0
) => {
  // Scratch variables
  const scratch0 = new Float32Array(16);
  const scratch1 = new Float32Array(16);
  const scratch2 = new Float32Array(16);

  let view = mat4.create();

  const getRotation = () => Math.acos(view[0]);

  const getScaling = () => mat4.getScaling(scratch0, view)[0];

  const getDistance = () => 1 / getScaling();

  const getTranslation = () => mat4.getTranslation(scratch0, view).slice(0, 2);

  const getTarget = () =>
    vec4.transformMat4(scratch0, VIEW_CENTER, mat4.invert(scratch2, view));

  const getView = () => view;

  const lookAt = ([x = 0, y = 0] = [], newDistance = 1, newRotation = 0) => {
    // Reset the view
    view = mat4.create();

    translate([-x, -y]);
    rotate(newRotation);
    scale(1 / newDistance);
  };

  const translate = ([x = 0, y = 0] = []) => {
    scratch0[0] = x;
    scratch0[1] = y;
    scratch0[2] = 0;

    const t = mat4.fromTranslation(scratch1, scratch0);

    // Translate about the viewport center
    // This is identical to `i * t * i * view` where `i` is the identity matrix
    mat4.multiply(view, t, view);
  };

  const scale = (d, mousePos) => {
    if (d <= 0) return;

    scratch0[0] = d;
    scratch0[1] = d;
    scratch0[2] = 1;

    const s = mat4.fromScaling(scratch1, scratch0);

    const scaleCenter = mousePos ? [...mousePos, 0] : VIEW_CENTER;
    const a = mat4.fromTranslation(scratch0, scaleCenter);

    // Translate about the scale center
    // I.e., the mouse position or the view center
    mat4.multiply(
      view,
      a,
      mat4.multiply(
        view,
        s,
        mat4.multiply(view, mat4.invert(scratch2, a), view)
      )
    );
  };

  const rotate = rad => {
    const r = mat4.create();
    mat4.fromRotation(r, rad, [0, 0, 1]);

    // Rotate about the viewport center
    // This is identical to `i * r * i * view` where `i` is the identity matrix
    mat4.multiply(view, r, view);
  };

  const reset = () => {
    lookAt(initTarget, initDistance, initRotation);
  };

  // Init
  lookAt(initTarget, initDistance, initRotation);

  return {
    get translation() {
      return getTranslation();
    },
    get target() {
      return getTarget();
    },
    get scaling() {
      return getScaling();
    },
    get distance() {
      return getDistance();
    },
    get rotation() {
      return getRotation();
    },
    get view() {
      return getView();
    },
    lookAt,
    translate,
    pan: translate,
    rotate,
    scale,
    zoom: scale,
    reset
  };
};

export default createCamera;
