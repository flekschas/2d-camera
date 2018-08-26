(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('gl-matrix')) :
  typeof define === 'function' && define.amd ? define(['gl-matrix'], factory) :
  (global.Camera2d = factory(global.glMatrix));
}(this, (function (glMatrix) { 'use strict';

  var createCamera = function (ref) {
    if ( ref === void 0 ) ref = {};
    var initTarget = ref.initTarget; if ( initTarget === void 0 ) initTarget = [0, 0];
    var initDistance = ref.initDistance; if ( initDistance === void 0 ) initDistance = 1.0;

    // Scratch variables
    var scratch0 = new Float32Array(16);
    var scratch1 = new Float32Array(16);

    var target = initTarget;
    var distance = initDistance;

    var center = glMatrix.vec3.create();

    var getDistance = function () { return distance; };
    var setDistance = function (d) {
      distance = d;
      if (distance < 0.0) { distance = 0.0; }
    };

    var getPosition = function () { return [center[0], center[1], distance]; };

    var getTarget = function () { return center.slice(0, 2); };

    var transformation = function () {
      var out = glMatrix.mat3.create();
      var ref = getTarget();
      var x = ref[0];
      var y = ref[1];
      glMatrix.mat3.fromTranslation(out, [-1 * x, -1 * y]);
      glMatrix.mat3.scale(out, out, [distance, distance]);
      return out;
    };

    var view = function (out) {
      if (!out) { out = glMatrix.mat4.create(); } // eslint-disable-line no-param-reassign

      scratch1[0] = 1 / distance;
      scratch1[1] = scratch1[0]; // eslint-disable-line prefer-destructuring
      scratch1[2] = 1.0;
      glMatrix.mat4.fromScaling(out, scratch1);
      glMatrix.mat4.translate(out, out, center);
      return out;
    };

    var lookAt = function (ref, newDistance) {
      var x = ref[0]; if ( x === void 0 ) x = 0;
      var y = ref[1]; if ( y === void 0 ) y = 0;
      if ( newDistance === void 0 ) newDistance = 1;

      target = [+x >= 0 ? +x : 0, +y >= 0 ? +y : 0];
      distance = +newDistance >= 0 ? newDistance : 1;

      var eye = [target[0], target[1], -1 * distance];
      center = [target[0], target[1], 0];

      glMatrix.mat4.lookAt(scratch0, eye, center, [0, 1, 0]);
      glMatrix.mat3.fromMat4(scratch0, scratch0);
      glMatrix.vec3.copy(center, center);
      distance = glMatrix.vec3.distance(eye, center);
    };

    var pan = function (dpan) {
      scratch0[0] = (dpan[0] || 0) * -distance;
      scratch0[1] = (dpan[1] || 0) * distance;
      scratch0[2] = (dpan[2] || 0) * distance;
      glMatrix.vec3.sub(center, center, scratch0);
    };

    var zoom = function (d) { return setDistance(distance * d); };

    return {
      get target() { return getTarget(); },
      get distance() { return getDistance(); },
      set distance(d) { setDistance(d); },
      get position() { return getPosition(); },
      get transformation() { return transformation(); },
      view: view,
      lookAt: lookAt,
      pan: pan,
      zoom: zoom,
    };
  };

  return createCamera;

})));
