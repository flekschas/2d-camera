import { mat3, mat4, vec3 } from "gl-matrix";

const createCamera = ({
  target: initTarget = [0, 0],
  distance: initDistance = 1.0,
  rotation: initRotation = 0
} = {}) => {
  // Scratch variables
  const scratch0 = new Float32Array(16);
  const scratch1 = new Float32Array(16);
  const scratch2 = new Float32Array(16);

  let target = initTarget;
  let distance = initDistance;
  let rotation = initRotation;

  let center = vec3.create();

  const getDistance = () => distance;
  const setDistance = d => {
    distance = d;
    if (distance < 0.0) distance = 0.0;
  };

  const getPosition = () => [center[0], center[1], distance];

  const getTarget = () => center.slice(0, 2).map(x => -1 * x);

  const transformation = () => {
    const out = mat3.create();
    mat3.fromTranslation(out, getTarget());
    mat3.scale(out, out, [distance, distance]);
    return out;
  };

  const view = v => {
    if (!v) v = mat4.create(); // eslint-disable-line no-param-reassign

    scratch0[0] = 1 / distance;
    scratch0[1] = scratch0[0]; // eslint-disable-line prefer-destructuring
    scratch0[2] = 1.0;

    // View matrix. First scale, then translate
    mat4.fromScaling(v, scratch0);
    mat4.translate(v, v, center);

    // Auxilliary frame around which we rotate
    // I.e., the center of the viewport
    const a = mat4.create();
    mat4.fromTranslation(a, vec3.negate(scratch1, center));

    // Rotation matrix
    const r = mat4.create();
    mat4.fromRotation(r, rotation, [0, 0, 1]);

    // Finally, we rotate `v` around `a` (the viewport center) by `r`
    return mat4.multiply(
      v,
      a,
      mat4.multiply(v, r, mat4.multiply(v, mat4.invert(scratch2, a), v))
    );
  };

  const lookAt = ([x, y] = [], newDistance, newRotation) => {
    if (+x && +y) {
      target = [+x * -1 || 0, +y * -1 || 0];
      center = [target[0], target[1], 0];
    }

    if (+newDistance >= 0) {
      distance = newDistance;
    }

    if (+newRotation) {
      rotation = newRotation;
    }
  };

  const pan = ([x = 0, y = 0] = []) => {
    center[0] += x * distance;
    center[1] -= y * distance;

    target[0] -= x * distance;
    target[1] += y * distance;
  };

  const zoom = d => {
    setDistance(distance * d);
  };

  const rotate = rad => {
    rotation += rad;
  };

  const reset = () => {
    lookAt(initTarget, initDistance);
  };

  // Init
  lookAt(target, distance);

  return {
    get target() {
      return getTarget();
    },
    get distance() {
      return getDistance();
    },
    set distance(d) {
      setDistance(d);
    },
    get position() {
      return getPosition();
    },
    get transformation() {
      return transformation();
    },
    view,
    lookAt,
    pan,
    rotate,
    zoom,
    reset
  };
};

export default createCamera;
