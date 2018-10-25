# 2D Camera

[![npm version](https://img.shields.io/npm/v/camera-2d-simple.svg)](https://www.npmjs.com/package/camera-2d-simple)
[![stability experimental](https://img.shields.io/badge/stability-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)
[![build status](https://travis-ci.org/flekschas/camera-2d.svg?branch=master)](https://travis-ci.org/flekschas/camera-2d)
[![gzipped size](https://img.shields.io/badge/gzipped%20size-0.8%20KB-6ae3c7.svg)](https://unpkg.com/camera-2d-simple)
[![code style prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![demo](https://img.shields.io/badge/demo-online-6ae3c7.svg)](https://flekschas.github.io/regl-scatterplot/)

> Simple camera built on top of gl-matrix for 2D scenes. Heavily inspired by [Mikola's Orbit Camera](https://github.com/mikolalysenko/orbit-camera).

Also see:

- [canvas-camera-2d](https://github.com/flekschas/canvas-camera-2d) for attaching the camera to a canvas object
- [webgl-scatterplot](https://github.com/flekschas/webgl-scatterplot) for an application

## Install

```
npm install camera-2d-simple
```

## API

```javascript
import createCamera from "camera-2d-simple";
```

### `const camera = createCamera(target = [0,0], distance = 1, rotation = 0)`

Creates a 2d camera looking at `target` from a certain `distance`.

- `target` is the 2d vector the camera is looking at.
- `distance` is the distance between the target and the camera.
- `rotation` is angle in radiance around the z axis with respect to the viewport center.

**Returns** A new 2d camera object

### `camera.lookAt(target = [0,0], distance = 1, rotation = 0)`

Move the camera to look at .

### `camera.pan([x,y])` or `camera.translate([x,y])`

Moves the center of the camera by `x` and `y` pixel.

### `camera.zoom(delta, scaleCenter)` or `camera.scale(delta, scaleCenter)`

Zooms in or out by `delta` with respect to `scaleCenter` in `[x,y]`. The new distance will be `distance * delta`.

### `camera.rotate(angle)`

Rotate the camera by `angle` (in radians) around the z axis with respect to the viewport center.

### `camera.reset()`

Reset the camera to the initial target, distance, and rotation.

### `camera.view`

The current view matrix (`mat4`) of the camera.

### `camera.translation`

The camera translation needed to look at the `target`.

### `camera.target`

The camera center in normalized device coordinates. This is a shorthand for inverseOf(`camera.view`) \* `[0,0,0,1]`.

### `camera.scaling`

The camera scaling. Larger scales are equivalent of a smaller `distance` to the target.

### `camera.distance`

Distance of the camera to the target. This is a shorthand for the inverse `scaling`, i.e., `1 / scaling`.

### `camera.rotation`

Rotation in radians around the z axis.
