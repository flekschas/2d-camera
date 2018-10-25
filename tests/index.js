import { mat4 } from "gl-matrix";
import test from "tape";

import createCamera from "../src";

test("creates camera with default target, distance, and rotation", t => {
  t.plan(4);

  const camera = createCamera();

  t.ok(camera.target[0] === 0);
  t.ok(camera.target[1] === 0);
  t.ok(camera.distance === 1);
  t.ok(camera.rotation === 0);
});

test("creates camera with custom target, distance, and rotation", t => {
  t.plan(4);

  const target = [1, 1];
  const distance = 2;
  const rotation = Math.PI / 2;
  const camera = createCamera(target, distance, rotation);

  t.ok(camera.target[0] === target[0]);
  t.ok(camera.target[1] === target[1]);
  t.ok(camera.distance === distance);
  t.ok(camera.rotation === rotation);
});

test("camera should look at target, distance, and rotation", t => {
  t.plan(4);

  const target = [1, 1];
  const distance = 2;
  const rotation = Math.PI / 2;
  const camera = createCamera();

  camera.lookAt(target, distance, rotation);

  // Since we rotate by 90 degree the target is now
  t.ok(camera.target[0] === target[0]);
  t.ok(camera.target[1] === target[1]);
  t.ok(camera.distance === distance);
  t.ok(camera.rotation === rotation);
});

test("camera should pan / translate", t => {
  t.plan(4);

  const translation = [1, 1];
  const camera = createCamera();
  camera.pan(translation);

  t.ok(camera.translation[0] === translation[0]);
  t.ok(camera.translation[1] === translation[1]);

  camera.translate(translation);

  t.ok(camera.translation[0] === 2 * translation[0]);
  t.ok(camera.translation[1] === 2 * translation[1]);
});

test("camera should zoom / scale", t => {
  t.plan(2);

  const scaling = 0.5;
  const camera = createCamera();
  camera.zoom(scaling);

  t.ok(camera.scaling === scaling);

  camera.scale(scaling);

  t.ok(camera.scaling === scaling ** 2);
});

test("camera should rotate", t => {
  t.plan(2);

  const radians = Math.PI;
  const camera = createCamera();
  camera.rotate(radians);

  t.ok(camera.rotation === radians);

  camera.rotate(radians);

  t.ok(camera.rotation === 0);
});

test("camera should reset to initial target, distance, and rotation", t => {
  t.plan(4);

  const camera = createCamera();
  camera.lookAt([1, 1], 2, Math.PI / 2);
  camera.reset();

  t.ok(camera.translation[0] === 0);
  t.ok(camera.translation[1] === 0);
  t.ok(camera.scaling === 1);
  t.ok(camera.rotation === 0);
});

test("camera target should be the inverse translation", t => {
  t.plan(2);

  const translation = [2, 3];
  const scaling = 2;
  const camera = createCamera();

  camera.translate(translation);
  camera.scale(scaling);

  t.ok(camera.target[0] === -translation[0]);
  t.ok(camera.target[1] === -translation[1]);
});

test("camera distance should be the inverse scaling", t => {
  t.plan(1);

  const scaling = 4;
  const camera = createCamera();

  camera.scale(scaling);

  t.ok(camera.distance === 1 / scaling);
});

test("camera should maintain a view transformation matrix", t => {
  t.plan(1);

  const distance = 2;
  const scaling = [1 / distance, 1 / distance, 1];
  const target = [1, 1];
  const translation = [target[0], -target[1], 0];
  const rotation = Math.PI / 2;
  const camera = createCamera(target, distance, rotation);
  const view = mat4.create();
  mat4.fromScaling(view, scaling);
  mat4.translate(view, view, translation);
  mat4.rotateZ(view, view, rotation);

  t.ok(view.every((x, i) => x === camera.view[i]));
});
