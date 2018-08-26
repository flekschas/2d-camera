2D Camera
============
Simple camera built on top of gl-matrix for 2D scenes. Heavily inspired by [Mikola's Orbit Camera](https://github.com/mikolalysenko/orbit-camera).

## Example (Outdated)

```javascript
var shell = require("gl-now")()
var createMesh = require("gl-mesh")
var glm = require("gl-matrix")
var mat4 = glm.mat4
var simple3DShader = require("simple-3d-shader")
var createOrbitCamera = require("orbit-camera")

var camera = createOrbitCamera([0, 10, 20],
                               [0, 3, 0],
                               [0, 1, 0])

var shader, mesh

shell.on("gl-init", function() {
  shader = simple3DShader(shell.gl)
  mesh = createMesh(shell.gl, require("bunny"))
})

shell.on("gl-render", function(t) {
  shader.bind()

  var scratch = mat4.create()
  shader.uniforms.model = scratch
  shader.uniforms.projection = mat4.perspective(scratch, Math.PI/4.0, shell.width/shell.height, 0.1, 1000.0)
  shader.uniforms.view = camera.view(scratch)

  mesh.bind(shader)
  mesh.draw()
  mesh.unbind()
})

shell.on("tick", function() {
  if(shell.wasDown("mouse-left")) {
    camera.rotate([shell.mouseX/shell.width-0.5, shell.mouseY/shell.height-0.5],
                  [shell.prevMouseX/shell.width-0.5, shell.prevMouseY/shell.height-0.5])
  }
  if(shell.wasDown("mouse-right")) {
    camera.pan([10*(shell.mouseX-shell.prevMouseX)/shell.width,
                10*(shell.mouseY - shell.prevMouseY)/shell.height])
  }
  if(shell.scroll[1]) {
    camera.zoom(shell.scroll[1] * 0.1)
  }
})
```

## Install

```
npm install orbit-camera
```

## API

```javascript
import createCamera from 'camera-2d';
```

### `const camera = createCamera(target = [0, 0], distance = 1)`
Creates a 2d camera looking at `target` from a certain `distance`.

* `target` is the 2d vector the camera is looking at.
* `distance` is the distance between the target and the camera.

**Returns** A new 2d camera object

### `camera.lookAt(target = [0, 0], distance = 1)`
Move the camera to look at the new position.

### `camera.pan(translation)`
Moves the center of the camera by `translation`.  Note that translation must be an array of length 2.

### `camera.zoom(delta)`
Zooms in or out by some amount. I.e., the new distance is defined as `distance * delta`.

### `camera.view([out])`
Returns the current view matrix associated to the camera.

### `camera.position`
Is an array of length 3 comprised of the target (x, y) and distance (z) of the camera.

### `camera.transformation`
Is the current transformation `mat3` associated to the camera.
