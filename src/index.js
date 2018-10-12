import {
  mat3, mat4, vec3,
} from 'gl-matrix';

// const ang2Rad = angle => angle * (Math.PI / 180);

const createCamera = ({
  target: initTarget = [0, 0],
  distance: initDistance = 1.0,
  rotation: initRotation = 0,
} = {}) => {
  // Scratch variables
  const scratch0 = new Float32Array(16);
  const scratch1 = new Float32Array(16);

  let target = initTarget;
  let distance = initDistance;
  let rotation = initRotation;

  let center = vec3.create();

  const getDistance = () => distance;
  const setDistance = (d) => {
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

  const view = (out) => {
    if (!out) out = mat4.create(); // eslint-disable-line no-param-reassign

    scratch1[0] = 1 / distance;
    scratch1[1] = scratch1[0]; // eslint-disable-line prefer-destructuring
    scratch1[2] = 1.0;

    mat4.fromScaling(out, scratch1);
    mat4.translate(out, out, center);
    mat4.rotateZ(out, out, rotation);

    return out;
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
    scratch0[0] = x * -distance;
    scratch0[1] = y * distance;
    scratch0[2] = 0;
    vec3.sub(center, center, scratch0);
  };

  const zoom = (d) => {
    setDistance(distance * d);
  };

  const rotate = (rad) => {
    rotation += rad * distance;
  };

  const reset = () => {
    lookAt(initTarget, initDistance);
  };

  // Init
  lookAt(target, distance);

  return {
    get target() { return getTarget(); },
    get distance() { return getDistance(); },
    set distance(d) { setDistance(d); },
    get position() { return getPosition(); },
    get transformation() { return transformation(); },
    view,
    lookAt,
    pan,
    rotate,
    zoom,
    reset,
  };
};

export default createCamera;
