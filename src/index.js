import {
  mat3, mat4, vec3,
} from 'gl-matrix';

const createCamera = ({
  initTarget = [0, 0],
  initDistance = 1.0,
} = {}) => {
  // Scratch variables
  const scratch0 = new Float32Array(16);
  const scratch1 = new Float32Array(16);

  let target = initTarget;
  let distance = initDistance;

  let center = vec3.create();

  const getDistance = () => distance;
  const setDistance = (d) => {
    distance = d;
    if (distance < 0.0) distance = 0.0;
  };

  const getPosition = () => [center[0], center[1], distance];

  const getTarget = () => center.slice(0, 2);

  const transformation = () => {
    const out = mat3.create();
    const [x, y] = getTarget();
    mat3.fromTranslation(out, [-1 * x, -1 * y]);
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
    return out;
  };

  const lookAt = ([x = 0, y = 0], newDistance = 1) => {
    target = [+x >= 0 ? +x : 0, +y >= 0 ? +y : 0];
    distance = +newDistance >= 0 ? newDistance : 1;

    const eye = [target[0], target[1], -1 * distance];
    center = [target[0], target[1], 0];

    mat4.lookAt(scratch0, eye, center, [0, 1, 0]);
    mat3.fromMat4(scratch0, scratch0);
    vec3.copy(center, center);
    distance = vec3.distance(eye, center);
  };

  const pan = (dpan) => {
    scratch0[0] = (dpan[0] || 0) * -distance;
    scratch0[1] = (dpan[1] || 0) * distance;
    scratch0[2] = (dpan[2] || 0) * distance;
    vec3.sub(center, center, scratch0);
  };

  const zoom = d => setDistance(distance * d);

  return {
    get target() { return getTarget(); },
    get distance() { return getDistance(); },
    set distance(d) { setDistance(d); },
    get position() { return getPosition(); },
    get transformation() { return transformation(); },
    view,
    lookAt,
    pan,
    zoom,
  };
};

export default createCamera;
