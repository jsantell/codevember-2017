uniform float time;
uniform float size;
uniform float dpr;
uniform float noiseMod;
uniform float posDampen;
uniform float maxDistance;
varying vec3 vPosition;
varying float vNoise;
varying float vHue;
#pragma glslify: snoise3 = require(glsl-noise/classic/3d)
#pragma glslify: ease = require(glsl-easings/quadratic-out) 

const float MIN_POINTSIZE = 1.0;
const float MAX_DISTANCE = 5.0;
const float IDEAL_DISTANCE = 7.0;
void main() {
  float t = time + 20.0;
  vNoise = snoise3(noiseMod * t * vec3(position.x, position.y, 3.0 * position.z+100.0) * 0.5 + 0.5);
  vPosition = position + (vec3(-position.x, -position.y, 0.0) * vNoise * posDampen);
  if (vPosition.z > 0.2) {
    vPosition.z = 0.0;
  }

  float cameraDist = distance(vPosition, cameraPosition);
  float d = length(vPosition);
  if (d < IDEAL_DISTANCE) {
    gl_PointSize = size - (3.0 * d);
  } else {
    gl_PointSize = size * (1.0 / (d - IDEAL_DISTANCE));
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}
